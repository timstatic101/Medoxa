const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Imaging_ordersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const imaging_orders = await db.imaging_orders.create(
      {
        id: data.id || undefined,

        total_amount: data.total_amount || null,
        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await imaging_orders.setVisit(data.visit || null, {
      transaction,
    });

    await imaging_orders.setImaging_technician(
      data.imaging_technician || null,
      {
        transaction,
      },
    );

    await imaging_orders.setOrganizations(data.organizations || null, {
      transaction,
    });

    return imaging_orders;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const imaging_ordersData = data.map((item, index) => ({
      id: item.id || undefined,

      total_amount: item.total_amount || null,
      status: item.status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const imaging_orders = await db.imaging_orders.bulkCreate(
      imaging_ordersData,
      { transaction },
    );

    // For each item created, replace relation files

    return imaging_orders;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const imaging_orders = await db.imaging_orders.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.total_amount !== undefined)
      updatePayload.total_amount = data.total_amount;

    if (data.status !== undefined) updatePayload.status = data.status;

    updatePayload.updatedById = currentUser.id;

    await imaging_orders.update(updatePayload, { transaction });

    if (data.visit !== undefined) {
      await imaging_orders.setVisit(
        data.visit,

        { transaction },
      );
    }

    if (data.imaging_technician !== undefined) {
      await imaging_orders.setImaging_technician(
        data.imaging_technician,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await imaging_orders.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return imaging_orders;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const imaging_orders = await db.imaging_orders.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of imaging_orders) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of imaging_orders) {
        await record.destroy({ transaction });
      }
    });

    return imaging_orders;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const imaging_orders = await db.imaging_orders.findByPk(id, options);

    await imaging_orders.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await imaging_orders.destroy({
      transaction,
    });

    return imaging_orders;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const imaging_orders = await db.imaging_orders.findOne(
      { where },
      { transaction },
    );

    if (!imaging_orders) {
      return imaging_orders;
    }

    const output = imaging_orders.get({ plain: true });

    output.imaging_order_items_imaging_order =
      await imaging_orders.getImaging_order_items_imaging_order({
        transaction,
      });

    output.visit = await imaging_orders.getVisit({
      transaction,
    });

    output.imaging_technician = await imaging_orders.getImaging_technician({
      transaction,
    });

    output.organizations = await imaging_orders.getOrganizations({
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
        model: db.visits,
        as: 'visit',

        where: filter.visit
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.visit
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  symptoms: {
                    [Op.or]: filter.visit
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
        as: 'imaging_technician',

        where: filter.imaging_technician
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.imaging_technician
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  firstName: {
                    [Op.or]: filter.imaging_technician
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

      if (filter.total_amountRange) {
        const [start, end] = filter.total_amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            total_amount: {
              ...where.total_amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            total_amount: {
              ...where.total_amount,
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

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
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
      const { rows, count } = await db.imaging_orders.findAndCountAll(
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
          Utils.ilike('imaging_orders', 'status', query),
        ],
      };
    }

    const records = await db.imaging_orders.findAll({
      attributes: ['id', 'status'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['status', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.status,
    }));
  }
};
