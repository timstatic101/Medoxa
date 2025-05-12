const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class VisitsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const visits = await db.visits.create(
      {
        id: data.id || undefined,

        visit_datetime: data.visit_datetime || null,
        symptoms: data.symptoms || null,
        diagnosis: data.diagnosis || null,
        notes: data.notes || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await visits.setPatient(data.patient || null, {
      transaction,
    });

    await visits.setDoctor(data.doctor || null, {
      transaction,
    });

    await visits.setDepartment(data.department || null, {
      transaction,
    });

    await visits.setAppointment(data.appointment || null, {
      transaction,
    });

    await visits.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await visits.setOrganizations(data.organizations || null, {
      transaction,
    });

    return visits;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const visitsData = data.map((item, index) => ({
      id: item.id || undefined,

      visit_datetime: item.visit_datetime || null,
      symptoms: item.symptoms || null,
      diagnosis: item.diagnosis || null,
      notes: item.notes || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const visits = await db.visits.bulkCreate(visitsData, { transaction });

    // For each item created, replace relation files

    return visits;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const visits = await db.visits.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.visit_datetime !== undefined)
      updatePayload.visit_datetime = data.visit_datetime;

    if (data.symptoms !== undefined) updatePayload.symptoms = data.symptoms;

    if (data.diagnosis !== undefined) updatePayload.diagnosis = data.diagnosis;

    if (data.notes !== undefined) updatePayload.notes = data.notes;

    updatePayload.updatedById = currentUser.id;

    await visits.update(updatePayload, { transaction });

    if (data.patient !== undefined) {
      await visits.setPatient(
        data.patient,

        { transaction },
      );
    }

    if (data.doctor !== undefined) {
      await visits.setDoctor(
        data.doctor,

        { transaction },
      );
    }

    if (data.department !== undefined) {
      await visits.setDepartment(
        data.department,

        { transaction },
      );
    }

    if (data.appointment !== undefined) {
      await visits.setAppointment(
        data.appointment,

        { transaction },
      );
    }

    if (data.organization !== undefined) {
      await visits.setOrganization(
        globalAccess ? data.organization : currentUser.organization.id,
        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await visits.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return visits;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const visits = await db.visits.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of visits) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of visits) {
        await record.destroy({ transaction });
      }
    });

    return visits;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const visits = await db.visits.findByPk(id, options);

    await visits.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await visits.destroy({
      transaction,
    });

    return visits;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const visits = await db.visits.findOne({ where }, { transaction });

    if (!visits) {
      return visits;
    }

    const output = visits.get({ plain: true });

    output.imaging_orders_visit = await visits.getImaging_orders_visit({
      transaction,
    });

    output.invoices_visit = await visits.getInvoices_visit({
      transaction,
    });

    output.lab_orders_visit = await visits.getLab_orders_visit({
      transaction,
    });

    output.pharmacy_orders_visit = await visits.getPharmacy_orders_visit({
      transaction,
    });

    output.sick_leaves_visit = await visits.getSick_leaves_visit({
      transaction,
    });

    output.patient = await visits.getPatient({
      transaction,
    });

    output.doctor = await visits.getDoctor({
      transaction,
    });

    output.department = await visits.getDepartment({
      transaction,
    });

    output.appointment = await visits.getAppointment({
      transaction,
    });

    output.organization = await visits.getOrganization({
      transaction,
    });

    output.organizations = await visits.getOrganizations({
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
        model: db.appointments,
        as: 'appointment',

        where: filter.appointment
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.appointment
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  type: {
                    [Op.or]: filter.appointment
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

      if (filter.symptoms) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('visits', 'symptoms', filter.symptoms),
        };
      }

      if (filter.diagnosis) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('visits', 'diagnosis', filter.diagnosis),
        };
      }

      if (filter.notes) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('visits', 'notes', filter.notes),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              visit_datetime: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              visit_datetime: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.visit_datetimeRange) {
        const [start, end] = filter.visit_datetimeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            visit_datetime: {
              ...where.visit_datetime,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            visit_datetime: {
              ...where.visit_datetime,
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
      const { rows, count } = await db.visits.findAndCountAll(queryOptions);

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
          Utils.ilike('visits', 'symptoms', query),
        ],
      };
    }

    const records = await db.visits.findAll({
      attributes: ['id', 'symptoms'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['symptoms', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.symptoms,
    }));
  }
};
