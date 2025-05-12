const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class HolidaysDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const holidays = await db.holidays.create(
      {
        id: data.id || undefined,

        start_date: data.start_date || null,
        end_date: data.end_date || null,
        notes: data.notes || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await holidays.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await holidays.setDoctor(data.doctor || null, {
      transaction,
    });

    await holidays.setDepartment(data.department || null, {
      transaction,
    });

    await holidays.setOrganizations(data.organizations || null, {
      transaction,
    });

    return holidays;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const holidaysData = data.map((item, index) => ({
      id: item.id || undefined,

      start_date: item.start_date || null,
      end_date: item.end_date || null,
      notes: item.notes || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const holidays = await db.holidays.bulkCreate(holidaysData, {
      transaction,
    });

    // For each item created, replace relation files

    return holidays;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const holidays = await db.holidays.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.start_date !== undefined)
      updatePayload.start_date = data.start_date;

    if (data.end_date !== undefined) updatePayload.end_date = data.end_date;

    if (data.notes !== undefined) updatePayload.notes = data.notes;

    updatePayload.updatedById = currentUser.id;

    await holidays.update(updatePayload, { transaction });

    if (data.organization !== undefined) {
      await holidays.setOrganization(
        globalAccess ? data.organization : currentUser.organization.id,
        { transaction },
      );
    }

    if (data.doctor !== undefined) {
      await holidays.setDoctor(
        data.doctor,

        { transaction },
      );
    }

    if (data.department !== undefined) {
      await holidays.setDepartment(
        data.department,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await holidays.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return holidays;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const holidays = await db.holidays.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of holidays) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of holidays) {
        await record.destroy({ transaction });
      }
    });

    return holidays;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const holidays = await db.holidays.findByPk(id, options);

    await holidays.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await holidays.destroy({
      transaction,
    });

    return holidays;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const holidays = await db.holidays.findOne({ where }, { transaction });

    if (!holidays) {
      return holidays;
    }

    const output = holidays.get({ plain: true });

    output.organization = await holidays.getOrganization({
      transaction,
    });

    output.doctor = await holidays.getDoctor({
      transaction,
    });

    output.department = await holidays.getDepartment({
      transaction,
    });

    output.organizations = await holidays.getOrganizations({
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
        model: db.organizations,
        as: 'organization',
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

      if (filter.notes) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('holidays', 'notes', filter.notes),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              start_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              end_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.start_dateRange) {
        const [start, end] = filter.start_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            start_date: {
              ...where.start_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            start_date: {
              ...where.start_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.end_dateRange) {
        const [start, end] = filter.end_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
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
      const { rows, count } = await db.holidays.findAndCountAll(queryOptions);

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
          Utils.ilike('holidays', 'notes', query),
        ],
      };
    }

    const records = await db.holidays.findAll({
      attributes: ['id', 'notes'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['notes', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.notes,
    }));
  }
};
