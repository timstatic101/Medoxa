const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Appointment_rulesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointment_rules = await db.appointment_rules.create(
      {
        id: data.id || undefined,

        min_hours_before_booking: data.min_hours_before_booking || null,
        max_days_advance_booking: data.max_days_advance_booking || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await appointment_rules.setDepartment(data.department || null, {
      transaction,
    });

    await appointment_rules.setOrganizations(data.organizations || null, {
      transaction,
    });

    return appointment_rules;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const appointment_rulesData = data.map((item, index) => ({
      id: item.id || undefined,

      min_hours_before_booking: item.min_hours_before_booking || null,
      max_days_advance_booking: item.max_days_advance_booking || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const appointment_rules = await db.appointment_rules.bulkCreate(
      appointment_rulesData,
      { transaction },
    );

    // For each item created, replace relation files

    return appointment_rules;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const appointment_rules = await db.appointment_rules.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.min_hours_before_booking !== undefined)
      updatePayload.min_hours_before_booking = data.min_hours_before_booking;

    if (data.max_days_advance_booking !== undefined)
      updatePayload.max_days_advance_booking = data.max_days_advance_booking;

    updatePayload.updatedById = currentUser.id;

    await appointment_rules.update(updatePayload, { transaction });

    if (data.department !== undefined) {
      await appointment_rules.setDepartment(
        data.department,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await appointment_rules.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return appointment_rules;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointment_rules = await db.appointment_rules.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of appointment_rules) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of appointment_rules) {
        await record.destroy({ transaction });
      }
    });

    return appointment_rules;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const appointment_rules = await db.appointment_rules.findByPk(id, options);

    await appointment_rules.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await appointment_rules.destroy({
      transaction,
    });

    return appointment_rules;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const appointment_rules = await db.appointment_rules.findOne(
      { where },
      { transaction },
    );

    if (!appointment_rules) {
      return appointment_rules;
    }

    const output = appointment_rules.get({ plain: true });

    output.department = await appointment_rules.getDepartment({
      transaction,
    });

    output.organizations = await appointment_rules.getOrganizations({
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

      if (filter.min_hours_before_bookingRange) {
        const [start, end] = filter.min_hours_before_bookingRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            min_hours_before_booking: {
              ...where.min_hours_before_booking,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            min_hours_before_booking: {
              ...where.min_hours_before_booking,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.max_days_advance_bookingRange) {
        const [start, end] = filter.max_days_advance_bookingRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            max_days_advance_booking: {
              ...where.max_days_advance_booking,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            max_days_advance_booking: {
              ...where.max_days_advance_booking,
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
      const { rows, count } = await db.appointment_rules.findAndCountAll(
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
          Utils.ilike('appointment_rules', 'department', query),
        ],
      };
    }

    const records = await db.appointment_rules.findAll({
      attributes: ['id', 'department'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['department', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.department,
    }));
  }
};
