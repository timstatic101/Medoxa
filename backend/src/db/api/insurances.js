const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InsurancesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const insurances = await db.insurances.create(
      {
        id: data.id || undefined,

        provider_name: data.provider_name || null,
        policy_number: data.policy_number || null,
        coverage_start: data.coverage_start || null,
        coverage_end: data.coverage_end || null,
        plan_details: data.plan_details || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await insurances.setPatient(data.patient || null, {
      transaction,
    });

    await insurances.setOrganizations(data.organizations || null, {
      transaction,
    });

    return insurances;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const insurancesData = data.map((item, index) => ({
      id: item.id || undefined,

      provider_name: item.provider_name || null,
      policy_number: item.policy_number || null,
      coverage_start: item.coverage_start || null,
      coverage_end: item.coverage_end || null,
      plan_details: item.plan_details || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const insurances = await db.insurances.bulkCreate(insurancesData, {
      transaction,
    });

    // For each item created, replace relation files

    return insurances;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const insurances = await db.insurances.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.provider_name !== undefined)
      updatePayload.provider_name = data.provider_name;

    if (data.policy_number !== undefined)
      updatePayload.policy_number = data.policy_number;

    if (data.coverage_start !== undefined)
      updatePayload.coverage_start = data.coverage_start;

    if (data.coverage_end !== undefined)
      updatePayload.coverage_end = data.coverage_end;

    if (data.plan_details !== undefined)
      updatePayload.plan_details = data.plan_details;

    updatePayload.updatedById = currentUser.id;

    await insurances.update(updatePayload, { transaction });

    if (data.patient !== undefined) {
      await insurances.setPatient(
        data.patient,

        { transaction },
      );
    }

    if (data.organizations !== undefined) {
      await insurances.setOrganizations(
        data.organizations,

        { transaction },
      );
    }

    return insurances;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const insurances = await db.insurances.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of insurances) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of insurances) {
        await record.destroy({ transaction });
      }
    });

    return insurances;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const insurances = await db.insurances.findByPk(id, options);

    await insurances.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await insurances.destroy({
      transaction,
    });

    return insurances;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const insurances = await db.insurances.findOne({ where }, { transaction });

    if (!insurances) {
      return insurances;
    }

    const output = insurances.get({ plain: true });

    output.patient = await insurances.getPatient({
      transaction,
    });

    output.organizations = await insurances.getOrganizations({
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

      if (filter.provider_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'insurances',
            'provider_name',
            filter.provider_name,
          ),
        };
      }

      if (filter.policy_number) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'insurances',
            'policy_number',
            filter.policy_number,
          ),
        };
      }

      if (filter.plan_details) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'insurances',
            'plan_details',
            filter.plan_details,
          ),
        };
      }

      if (filter.coverage_startRange) {
        const [start, end] = filter.coverage_startRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            coverage_start: {
              ...where.coverage_start,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            coverage_start: {
              ...where.coverage_start,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.coverage_endRange) {
        const [start, end] = filter.coverage_endRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            coverage_end: {
              ...where.coverage_end,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            coverage_end: {
              ...where.coverage_end,
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
      const { rows, count } = await db.insurances.findAndCountAll(queryOptions);

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
          Utils.ilike('insurances', 'provider_name', query),
        ],
      };
    }

    const records = await db.insurances.findAll({
      attributes: ['id', 'provider_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['provider_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.provider_name,
    }));
  }
};
