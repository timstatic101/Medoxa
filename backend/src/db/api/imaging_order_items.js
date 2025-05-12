const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Imaging_order_itemsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const imaging_order_items = await db.imaging_order_items.create(
      {
        id: data.id || undefined,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await imaging_order_items.setImaging_order(data.imaging_order || null, {
      transaction,
    });

    await imaging_order_items.setImaging_investigation(
      data.imaging_investigation || null,
      {
        transaction,
      },
    );

    await imaging_order_items.setOrganizations(data.organizations || null, {
      transaction,
    });

    return imaging_order_items;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const imaging_order_itemsData = data.map((item, index) => ({
      id: item.id || undefined,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const imaging_order_items = await db.imaging_order_items.bulkCreate(
      imaging_order_itemsData,
      { transaction },
    );

    // For each item created, replace relation files

    return imaging_order_items;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const imaging_order_items = await db.imaging_order_items.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    updatePayload.updatedById = currentUser.id;

    await imaging_order_items.update(updatePayload, { transaction });

    if (data.imaging_order !== undefined) {
      await imaging_order_items.setImaging_order(
        data.imaging_order,

        { transaction },
      );
    }

    if (data.imaging_investigation !== undefined) {
      await imaging_order_items.setImaging_investigation(
        data.imaging_investigation,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await imaging_order_items.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return imaging_order_items;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const imaging_order_items = await db.imaging_order_items.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of imaging_order_items) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of imaging_order_items) {
        await record.destroy({ transaction });
      }
    });

    return imaging_order_items;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const imaging_order_items = await db.imaging_order_items.findByPk(
      id,
      options,
    );

    await imaging_order_items.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await imaging_order_items.destroy({
      transaction,
    });

    return imaging_order_items;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const imaging_order_items = await db.imaging_order_items.findOne(
      { where },
      { transaction },
    );

    if (!imaging_order_items) {
      return imaging_order_items;
    }

    const output = imaging_order_items.get({ plain: true });

    output.imaging_order = await imaging_order_items.getImaging_order({
      transaction,
    });

    output.imaging_investigation =
      await imaging_order_items.getImaging_investigation({
        transaction,
      });

    output.organizations = await imaging_order_items.getOrganizations({
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
        model: db.imaging_orders,
        as: 'imaging_order',

        where: filter.imaging_order
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.imaging_order
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  status: {
                    [Op.or]: filter.imaging_order
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.imaging_investigations,
        as: 'imaging_investigation',

        where: filter.imaging_investigation
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.imaging_investigation
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  name: {
                    [Op.or]: filter.imaging_investigation
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
      const { rows, count } = await db.imaging_order_items.findAndCountAll(
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
          Utils.ilike('imaging_order_items', 'imaging_investigation', query),
        ],
      };
    }

    const records = await db.imaging_order_items.findAll({
      attributes: ['id', 'imaging_investigation'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['imaging_investigation', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.imaging_investigation,
    }));
  }
};
