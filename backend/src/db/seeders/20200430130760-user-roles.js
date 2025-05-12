const { v4: uuid } = require('uuid');

module.exports = {
  /**
   * @param{import("sequelize").QueryInterface} queryInterface
   * @return {Promise<void>}
   */
  async up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = new Date();

    /** @type {Map<string, string>} */
    const idMap = new Map();

    /**
     * @param {string} key
     * @return {string}
     */
    function getId(key) {
      if (idMap.has(key)) {
        return idMap.get(key);
      }
      const id = uuid();
      idMap.set(key, id);
      return id;
    }

    await queryInterface.bulkInsert('roles', [
      {
        id: getId('SuperAdmin'),
        name: 'Super Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('Administrator'),
        name: 'Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('ChiefMedicalOfficer'),
        name: 'Chief Medical Officer',
        createdAt,
        updatedAt,
      },

      {
        id: getId('ClinicalDirector'),
        name: 'Clinical Director',
        createdAt,
        updatedAt,
      },

      {
        id: getId('SeniorConsultant'),
        name: 'Senior Consultant',
        createdAt,
        updatedAt,
      },

      {
        id: getId('JuniorDoctor'),
        name: 'Junior Doctor',
        createdAt,
        updatedAt,
      },

      {
        id: getId('MedicalIntern'),
        name: 'Medical Intern',
        createdAt,
        updatedAt,
      },
    ]);

    /**
     * @param {string} name
     */
    function createPermissions(name) {
      return [
        {
          id: getId(`CREATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `CREATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`READ_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `READ_${name.toUpperCase()}`,
        },
        {
          id: getId(`UPDATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `UPDATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`DELETE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `DELETE_${name.toUpperCase()}`,
        },
      ];
    }

    const entities = [
      'users',
      'appointment_rules',
      'appointments',
      'departments',
      'doctor_availabilities',
      'holidays',
      'imaging_investigations',
      'imaging_order_items',
      'imaging_orders',
      'insurances',
      'invoice_items',
      'invoices',
      'lab_order_items',
      'lab_orders',
      'lab_tests',
      'medications',
      'patient_documents',
      'patients',
      'pharmacy_order_items',
      'pharmacy_orders',
      'sick_leaves',
      'visits',
      'roles',
      'permissions',
      'organizations',
      ,
    ];
    await queryInterface.bulkInsert(
      'permissions',
      entities.flatMap(createPermissions),
    );
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`READ_API_DOCS`),
        createdAt,
        updatedAt,
        name: `READ_API_DOCS`,
      },
    ]);
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`CREATE_SEARCH`),
        createdAt,
        updatedAt,
        name: `CREATE_SEARCH`,
      },
    ]);

    await queryInterface.bulkUpdate(
      'roles',
      { globalAccess: true },
      { id: getId('SuperAdmin') },
    );

    await queryInterface.sequelize
      .query(`create table "rolesPermissionsPermissions"
(
"createdAt"           timestamp with time zone not null,
"updatedAt"           timestamp with time zone not null,
"roles_permissionsId" uuid                     not null,
"permissionId"        uuid                     not null,
primary key ("roles_permissionsId", "permissionId")
);`);

    await queryInterface.bulkInsert('rolesPermissionsPermissions', [
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('READ_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('UPDATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('DELETE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('READ_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('UPDATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('DELETE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('READ_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('UPDATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('DELETE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('READ_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('UPDATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('DELETE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('READ_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('UPDATE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ChiefMedicalOfficer'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ClinicalDirector'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SeniorConsultant'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('JuniorDoctor'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('MedicalIntern'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_APPOINTMENT_RULES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_APPOINTMENT_RULES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_APPOINTMENT_RULES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_APPOINTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_APPOINTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_APPOINTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_DEPARTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_DEPARTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_DEPARTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_DOCTOR_AVAILABILITIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_DOCTOR_AVAILABILITIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_DOCTOR_AVAILABILITIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_HOLIDAYS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_HOLIDAYS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_HOLIDAYS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_IMAGING_INVESTIGATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_IMAGING_INVESTIGATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_IMAGING_INVESTIGATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_IMAGING_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_IMAGING_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_IMAGING_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_IMAGING_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_IMAGING_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_IMAGING_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_INSURANCES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_INSURANCES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_INSURANCES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_INVOICE_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_INVOICE_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_INVOICE_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_INVOICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_INVOICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_INVOICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_LAB_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_LAB_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_LAB_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_LAB_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_LAB_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_LAB_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_LAB_TESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_LAB_TESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_LAB_TESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_MEDICATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_MEDICATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_MEDICATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PATIENT_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PATIENT_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PATIENT_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PATIENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PATIENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PATIENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PHARMACY_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PHARMACY_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PHARMACY_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PHARMACY_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PHARMACY_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PHARMACY_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SICK_LEAVES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_SICK_LEAVES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_SICK_LEAVES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_VISITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_VISITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_VISITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_APPOINTMENT_RULES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_APPOINTMENT_RULES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_APPOINTMENT_RULES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_APPOINTMENT_RULES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_APPOINTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_APPOINTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_APPOINTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_APPOINTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_DEPARTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_DEPARTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_DEPARTMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_DEPARTMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_DOCTOR_AVAILABILITIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_DOCTOR_AVAILABILITIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_DOCTOR_AVAILABILITIES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_DOCTOR_AVAILABILITIES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_HOLIDAYS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_HOLIDAYS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_HOLIDAYS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_HOLIDAYS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_IMAGING_INVESTIGATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_IMAGING_INVESTIGATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_IMAGING_INVESTIGATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_IMAGING_INVESTIGATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_IMAGING_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_IMAGING_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_IMAGING_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_IMAGING_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_IMAGING_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_IMAGING_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_IMAGING_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_IMAGING_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_INSURANCES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_INSURANCES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_INSURANCES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_INSURANCES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_INVOICE_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_INVOICE_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_INVOICE_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_INVOICE_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_INVOICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_INVOICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_INVOICES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_INVOICES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_LAB_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_LAB_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_LAB_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_LAB_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_LAB_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_LAB_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_LAB_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_LAB_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_LAB_TESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_LAB_TESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_LAB_TESTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_LAB_TESTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_MEDICATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_MEDICATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_MEDICATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_MEDICATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PATIENT_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PATIENT_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PATIENT_DOCUMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PATIENT_DOCUMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PATIENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PATIENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PATIENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PATIENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PHARMACY_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PHARMACY_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PHARMACY_ORDER_ITEMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PHARMACY_ORDER_ITEMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PHARMACY_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PHARMACY_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PHARMACY_ORDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PHARMACY_ORDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_SICK_LEAVES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_SICK_LEAVES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_SICK_LEAVES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_SICK_LEAVES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_VISITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_VISITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_VISITS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_VISITS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_ROLES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PERMISSIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_ORGANIZATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_ORGANIZATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_ORGANIZATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_ORGANIZATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SEARCH'),
      },
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'SuperAdmin',
      )}' WHERE "email"='super_admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'Administrator',
      )}' WHERE "email"='admin@flatlogic.com'`,
    );

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'ChiefMedicalOfficer',
      )}' WHERE "email"='client@hello.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'ClinicalDirector',
      )}' WHERE "email"='john@doe.com'`,
    );
  },
};
