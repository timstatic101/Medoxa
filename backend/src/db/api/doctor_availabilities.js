const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Doctor_availabilitiesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const doctor_availabilities = await db.doctor_availabilities.create(
      {
        id: data.id || undefined,

        weekday: data.weekday || null,
        morning_start_time: data.morning_start_time || null,
        morning_end_time: data.morning_end_time || null,
        evening_start_time: data.evening_start_time || null,
        evening_end_time: data.evening_end_time || null,
        slot_duration_minutes: data.slot_duration_minutes || null,
        is_active: data.is_active || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await doctor_availabilities.setDoctor(data.doctor || null, {
      transaction,
    });

    await doctor_availabilities.setOrganizations(data.organizations || null, {
      transaction,
    });

    return doctor_availabilities;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const doctor_availabilitiesData = data.map((item, index) => ({
      id: item.id || undefined,

      weekday: item.weekday || null,
      morning_start_time: item.morning_start_time || null,
      morning_end_time: item.morning_end_time || null,
      evening_start_time: item.evening_start_time || null,
      evening_end_time: item.evening_end_time || null,
      slot_duration_minutes: item.slot_duration_minutes || null,
      is_active: item.is_active || false,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const doctor_availabilities = await db.doctor_availabilities.bulkCreate(
      doctor_availabilitiesData,
      { transaction },
    );

    // For each item created, replace relation files

    return doctor_availabilities;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const doctor_availabilities = await db.doctor_availabilities.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.weekday !== undefined) updatePayload.weekday = data.weekday;

    if (data.morning_start_time !== undefined)
      updatePayload.morning_start_time = data.morning_start_time;

    if (data.morning_end_time !== undefined)
      updatePayload.morning_end_time = data.morning_end_time;

    if (data.evening_start_time !== undefined)
      updatePayload.evening_start_time = data.evening_start_time;

    if (data.evening_end_time !== undefined)
      updatePayload.evening_end_time = data.evening_end_time;

    if (data.slot_duration_minutes !== undefined)
      updatePayload.slot_duration_minutes = data.slot_duration_minutes;

    if (data.is_active !== undefined) updatePayload.is_active = data.is_active;

    updatePayload.updatedById = currentUser.id;

    await doctor_availabilities.update(updatePayload, { transaction });

    if (data.doctor !== undefined) {
      await doctor_availabilities.setDoctor(
        data.doctor,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await doctor_availabilities.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return doctor_availabilities;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const doctor_availabilities = await db.doctor_availabilities.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of doctor_availabilities) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of doctor_availabilities) {
        await record.destroy({ transaction });
      }
    });

    return doctor_availabilities;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const doctor_availabilities = await db.doctor_availabilities.findByPk(
      id,
      options,
    );

    await doctor_availabilities.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await doctor_availabilities.destroy({
      transaction,
    });

    return doctor_availabilities;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const doctor_availabilities = await db.doctor_availabilities.findOne(
      { where },
      { transaction },
    );

    if (!doctor_availabilities) {
      return doctor_availabilities;
    }

    const output = doctor_availabilities.get({ plain: true });

    output.doctor = await doctor_availabilities.getDoctor({
      transaction,
    });

    output.organizations = await doctor_availabilities.getOrganizations({
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

      if (filter.weekday) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'doctor_availabilities',
            'weekday',
            filter.weekday,
          ),
        };
      }

      if (filter.morning_start_timeRange) {
        const [start, end] = filter.morning_start_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            morning_start_time: {
              ...where.morning_start_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            morning_start_time: {
              ...where.morning_start_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.morning_end_timeRange) {
        const [start, end] = filter.morning_end_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            morning_end_time: {
              ...where.morning_end_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            morning_end_time: {
              ...where.morning_end_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.evening_start_timeRange) {
        const [start, end] = filter.evening_start_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            evening_start_time: {
              ...where.evening_start_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            evening_start_time: {
              ...where.evening_start_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.evening_end_timeRange) {
        const [start, end] = filter.evening_end_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            evening_end_time: {
              ...where.evening_end_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            evening_end_time: {
              ...where.evening_end_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.slot_duration_minutesRange) {
        const [start, end] = filter.slot_duration_minutesRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            slot_duration_minutes: {
              ...where.slot_duration_minutes,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            slot_duration_minutes: {
              ...where.slot_duration_minutes,
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

      if (filter.is_active) {
        where = {
          ...where,
          is_active: filter.is_active,
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
      const { rows, count } = await db.doctor_availabilities.findAndCountAll(
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
          Utils.ilike('doctor_availabilities', 'weekday', query),
        ],
      };
    }

    const records = await db.doctor_availabilities.findAll({
      attributes: ['id', 'weekday'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['weekday', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.weekday,
    }));
  }
};
