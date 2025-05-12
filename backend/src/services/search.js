const db = require('../db/models');
const ValidationError = require('./notifications/errors/validation');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

/**
 * @param {string} permission
 * @param {object} currentUser
 */
async function checkPermissions(permission, currentUser) {
  if (!currentUser) {
    throw new ValidationError('auth.unauthorized');
  }

  const userPermission = currentUser.custom_permissions.find(
    (cp) => cp.name === permission,
  );

  if (userPermission) {
    return true;
  }

  try {
    if (!currentUser.app_role) {
      throw new ValidationError('auth.forbidden');
    }

    const permissions = await currentUser.app_role.getPermissions();

    return !!permissions.find((p) => p.name === permission);
  } catch (e) {
    throw e;
  }
}

module.exports = class SearchService {
  static async search(searchQuery, currentUser, organizationId, globalAccess) {
    try {
      if (!searchQuery) {
        throw new ValidationError('iam.errors.searchQueryRequired');
      }
      const tableColumns = {
        users: ['firstName', 'lastName', 'phoneNumber', 'email'],

        departments: ['name', 'description'],

        doctor_availabilities: ['weekday'],

        holidays: ['notes'],

        imaging_investigations: ['name', 'description'],

        insurances: ['provider_name', 'policy_number', 'plan_details'],

        invoice_items: ['description'],

        lab_tests: ['name', 'description'],

        medications: ['name', 'description'],

        patient_documents: ['document_type', 'document_url'],

        patients: [
          'full_name_en',

          'full_name_ar',

          'nationality',

          'identifier',

          'address',

          'emergency_contact_name',

          'emergency_contact_phone',

          'medical_history',

          'allergies',

          'current_medications',

          'family_history',
        ],

        sick_leaves: ['diagnosis', 'instructions', 'document_url'],

        visits: ['symptoms', 'diagnosis', 'notes'],

        organizations: ['name'],
      };
      const columnsInt = {
        appointment_rules: [
          'min_hours_before_booking',

          'max_days_advance_booking',
        ],

        doctor_availabilities: ['slot_duration_minutes'],

        imaging_investigations: ['price'],

        imaging_orders: ['total_amount'],

        invoice_items: ['amount'],

        invoices: ['total_amount', 'vat_amount'],

        lab_orders: ['total_amount'],

        lab_tests: ['price'],

        medications: ['price'],

        pharmacy_order_items: ['quantity'],

        pharmacy_orders: ['total_amount'],
      };

      let allFoundRecords = [];

      for (const tableName in tableColumns) {
        if (tableColumns.hasOwnProperty(tableName)) {
          const attributesToSearch = tableColumns[tableName];
          const attributesIntToSearch = columnsInt[tableName] || [];
          const whereCondition = {
            [Op.or]: [
              ...attributesToSearch.map((attribute) => ({
                [attribute]: {
                  [Op.iLike]: `%${searchQuery}%`,
                },
              })),
              ...attributesIntToSearch.map((attribute) =>
                Sequelize.where(
                  Sequelize.cast(
                    Sequelize.col(`${tableName}.${attribute}`),
                    'varchar',
                  ),
                  { [Op.iLike]: `%${searchQuery}%` },
                ),
              ),
            ],
          };

          if (
            !globalAccess &&
            tableName !== 'organizations' &&
            organizationId
          ) {
            whereCondition.organizationId = organizationId;
          }

          const hasPermission = await checkPermissions(
            `READ_${tableName.toUpperCase()}`,
            currentUser,
          );
          if (!hasPermission) {
            continue;
          }

          const foundRecords = await db[tableName].findAll({
            where: whereCondition,
            attributes: [
              ...tableColumns[tableName],
              'id',
              ...attributesIntToSearch,
            ],
          });

          const modifiedRecords = foundRecords.map((record) => {
            const matchAttribute = [];

            for (const attribute of attributesToSearch) {
              if (
                record[attribute]
                  ?.toLowerCase()
                  ?.includes(searchQuery.toLowerCase())
              ) {
                matchAttribute.push(attribute);
              }
            }

            for (const attribute of attributesIntToSearch) {
              const castedValue = String(record[attribute]);
              if (
                castedValue &&
                castedValue.toLowerCase().includes(searchQuery.toLowerCase())
              ) {
                matchAttribute.push(attribute);
              }
            }

            return {
              ...record.get(),
              matchAttribute,
              tableName,
            };
          });

          allFoundRecords = allFoundRecords.concat(modifiedRecords);
        }
      }

      return allFoundRecords;
    } catch (error) {
      throw error;
    }
  }
};
