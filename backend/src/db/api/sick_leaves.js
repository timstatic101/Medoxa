const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Sick_leavesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const sick_leaves = await db.sick_leaves.create(
      {
        id: data.id || undefined,

        start_date: data.start_date || null,
        end_date: data.end_date || null,
        diagnosis: data.diagnosis || null,
        instructions: data.instructions || null,
        document_url: data.document_url || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await sick_leaves.setVisit(data.visit || null, {
      transaction,
    });

    await sick_leaves.setOrganizations(data.organizations || null, {
      transaction,
    });

    return sick_leaves;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const sick_leavesData = data.map((item, index) => ({
      id: item.id || undefined,

      start_date: item.start_date || null,
      end_date: item.end_date || null,
      diagnosis: item.diagnosis || null,
      instructions: item.instructions || null,
      document_url: item.document_url || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const sick_leaves = await db.sick_leaves.bulkCreate(sick_leavesData, {
      transaction,
    });

    // For each item created, replace relation files

    return sick_leaves;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const sick_leaves = await db.sick_leaves.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.start_date !== undefined)
      updatePayload.start_date = data.start_date;

    if (data.end_date !== undefined) updatePayload.end_date = data.end_date;

    if (data.diagnosis !== undefined) updatePayload.diagnosis = data.diagnosis;

    if (data.instructions !== undefined)
      updatePayload.instructions = data.instructions;

    if (data.document_url !== undefined)
      updatePayload.document_url = data.document_url;

    updatePayload.updatedById = currentUser.id;

    await sick_leaves.update(updatePayload, { transaction });

    if (data.visit !== undefined) {
      await sick_leaves.setVisit(
        data.visit,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await sick_leaves.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return sick_leaves;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const sick_leaves = await db.sick_leaves.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of sick_leaves) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of sick_leaves) {
        await record.destroy({ transaction });
      }
    });

    return sick_leaves;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const sick_leaves = await db.sick_leaves.findByPk(id, options);

    await sick_leaves.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await sick_leaves.destroy({
      transaction,
    });

    return sick_leaves;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const sick_leaves = await db.sick_leaves.findOne(
      { where },
      { transaction },
    );

    if (!sick_leaves) {
      return sick_leaves;
    }

    const output = sick_leaves.get({ plain: true });

    output.visit = await sick_leaves.getVisit({
      transaction,
    });

    output.organizations = await sick_leaves.getOrganizations({
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

      if (filter.diagnosis) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('sick_leaves', 'diagnosis', filter.diagnosis),
        };
      }

      if (filter.instructions) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'sick_leaves',
            'instructions',
            filter.instructions,
          ),
        };
      }

      if (filter.document_url) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'sick_leaves',
            'document_url',
            filter.document_url,
          ),
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
      const { rows, count } = await db.sick_leaves.findAndCountAll(
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
          Utils.ilike('sick_leaves', 'diagnosis', query),
        ],
      };
    }

    const records = await db.sick_leaves.findAll({
      attributes: ['id', 'diagnosis'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['diagnosis', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.diagnosis,
    }));
  }
};
