const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AppointmentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointments = await db.appointments.create(
      {
        id: data.id || undefined,

        appointment_date: data.appointment_date || null,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        type: data.type || null,
        status: data.status || null,
        reminder_sent: data.reminder_sent || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await appointments.setPatient(data.patient || null, {
      transaction,
    });

    await appointments.setDoctor(data.doctor || null, {
      transaction,
    });

    await appointments.setDepartment(data.department || null, {
      transaction,
    });

    await appointments.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await appointments.setOrganizations(data.organizations || null, {
      transaction,
    });

    return appointments;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const appointmentsData = data.map((item, index) => ({
      id: item.id || undefined,

      appointment_date: item.appointment_date || null,
      start_time: item.start_time || null,
      end_time: item.end_time || null,
      type: item.type || null,
      status: item.status || null,
      reminder_sent: item.reminder_sent || false,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const appointments = await db.appointments.bulkCreate(appointmentsData, {
      transaction,
    });

    // For each item created, replace relation files

    return appointments;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const appointments = await db.appointments.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.appointment_date !== undefined)
      updatePayload.appointment_date = data.appointment_date;

    if (data.start_time !== undefined)
      updatePayload.start_time = data.start_time;

    if (data.end_time !== undefined) updatePayload.end_time = data.end_time;

    if (data.type !== undefined) updatePayload.type = data.type;

    if (data.status !== undefined) updatePayload.status = data.status;

    if (data.reminder_sent !== undefined)
      updatePayload.reminder_sent = data.reminder_sent;

    updatePayload.updatedById = currentUser.id;

    await appointments.update(updatePayload, { transaction });

    if (data.patient !== undefined) {
      await appointments.setPatient(
        data.patient,

        { transaction },
      );
    }

    if (data.doctor !== undefined) {
      await appointments.setDoctor(
        data.doctor,

        { transaction },
      );
    }

    if (data.department !== undefined) {
      await appointments.setDepartment(
        data.department,

        { transaction },
      );
    }

    if (data.organization !== undefined) {
      await appointments.setOrganization(
        globalAccess ? data.organization : currentUser.organization.id,
        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await appointments.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return appointments;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointments = await db.appointments.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of appointments) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of appointments) {
        await record.destroy({ transaction });
      }
    });

    return appointments;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointments = await db.appointments.findByPk(id, options);

    await appointments.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await appointments.destroy({
      transaction,
    });

    return appointments;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const appointments = await db.appointments.findOne(
      { where },
      { transaction },
    );

    if (!appointments) {
      return appointments;
    }

    const output = appointments.get({ plain: true });

    output.visits_appointment = await appointments.getVisits_appointment({
      transaction,
    });

    output.patient = await appointments.getPatient({
      transaction,
    });

    output.doctor = await appointments.getDoctor({
      transaction,
    });

    output.department = await appointments.getDepartment({
      transaction,
    });

    output.organization = await appointments.getOrganization({
      transaction,
    });

    output.organizations = await appointments.getOrganizations({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    const user = (options && options.currentUser) || null;
    const userOrganizations = (user && user.organizations?.id) || null;

    if (userOrganizations) {
      if (options?.currentUser?.organizationsId) {
        where.organizationsId = options.currentUser.organizationsId;
      }
    }

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.patients,
        as: 'patient',

        where: filter.patient
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.patient
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  full_name_en: {
                    [Op.or]: filter.patient
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.users,
        as: 'doctor',

        where: filter.doctor
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.doctor
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.doctor
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.departments,
        as: 'department',

        where: filter.department
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.department
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  name: {
                    [Op.or]: filter.department
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.organizations,
        as: 'organization',
      },

      {
        model: db.organizations,
        as: 'organizations',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              appointment_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              end_time: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.appointment_dateRange) {
        const [start, end] = filter.appointment_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            appointment_date: {
              ...where.appointment_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            appointment_date: {
              ...where.appointment_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.start_timeRange) {
        const [start, end] = filter.start_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            start_time: {
              ...where.start_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            start_time: {
              ...where.start_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.end_timeRange) {
        const [start, end] = filter.end_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            end_time: {
              ...where.end_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            end_time: {
              ...where.end_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.type) {
        where = {
          ...where,
          type: filter.type,
        };
      }

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
        };
      }

      if (filter.reminder_sent) {
        where = {
          ...where,
          reminder_sent: filter.reminder_sent,
        };
      }

      if (filter.organization) {
        const listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.organizations) {
        const listItems = filter.organizations.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationsId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    if (globalAccess) {
      delete where.organizationsId;
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.appointments.findAndCountAll(
        queryOptions,
      );

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(
    query,
    limit,
    offset,
    globalAccess,
    organizationId,
  ) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('appointments', 'type', query),
        ],
      };
    }

    const records = await db.appointments.findAll({
      attributes: ['id', 'type'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['type', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.type,
    }));
  }
};
