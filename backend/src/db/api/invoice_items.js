const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Invoice_itemsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const invoice_items = await db.invoice_items.create(
      {
        id: data.id || undefined,

        description: data.description || null,
        amount: data.amount || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await invoice_items.setInvoice(data.invoice || null, {
      transaction,
    });

    await invoice_items.setOrganizations(data.organizations || null, {
      transaction,
    });

    return invoice_items;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const invoice_itemsData = data.map((item, index) => ({
      id: item.id || undefined,

      description: item.description || null,
      amount: item.amount || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const invoice_items = await db.invoice_items.bulkCreate(invoice_itemsData, {
      transaction,
    });

    // For each item created, replace relation files

    return invoice_items;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const invoice_items = await db.invoice_items.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.description !== undefined)
      updatePayload.description = data.description;

    if (data.amount !== undefined) updatePayload.amount = data.amount;

    updatePayload.updatedById = currentUser.id;

    await invoice_items.update(updatePayload, { transaction });

    if (data.invoice !== undefined) {
      await invoice_items.setInvoice(
        data.invoice,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await invoice_items.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return invoice_items;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const invoice_items = await db.invoice_items.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of invoice_items) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of invoice_items) {
        await record.destroy({ transaction });
      }
    });

    return invoice_items;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const invoice_items = await db.invoice_items.findByPk(id, options);

    await invoice_items.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await invoice_items.destroy({
      transaction,
    });

    return invoice_items;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const invoice_items = await db.invoice_items.findOne(
      { where },
      { transaction },
    );

    if (!invoice_items) {
      return invoice_items;
    }

    const output = invoice_items.get({ plain: true });

    output.invoice = await invoice_items.getInvoice({
      transaction,
    });

    output.organizations = await invoice_items.getOrganizations({
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
        model: db.invoices,
        as: 'invoice',

        where: filter.invoice
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.invoice
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  total_amount: {
                    [Op.or]: filter.invoice
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

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'invoice_items',
            'description',
            filter.description,
          ),
        };
      }

      if (filter.amountRange) {
        const [start, end] = filter.amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
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
      const { rows, count } = await db.invoice_items.findAndCountAll(
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
          Utils.ilike('invoice_items', 'description', query),
        ],
      };
    }

    const records = await db.invoice_items.findAll({
      attributes: ['id', 'description'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['description', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.description,
    }));
  }
};
