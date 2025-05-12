const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const visits = sequelize.define(
    'visits',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      visit_datetime: {
        type: DataTypes.DATE,
      },

      symptoms: {
        type: DataTypes.TEXT,
      },

      diagnosis: {
        type: DataTypes.TEXT,
      },

      notes: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  visits.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.visits.hasMany(db.imaging_orders, {
      as: 'imaging_orders_visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    db.visits.hasMany(db.invoices, {
      as: 'invoices_visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    db.visits.hasMany(db.lab_orders, {
      as: 'lab_orders_visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    db.visits.hasMany(db.pharmacy_orders, {
      as: 'pharmacy_orders_visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    db.visits.hasMany(db.sick_leaves, {
      as: 'sick_leaves_visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    //end loop

    db.visits.belongsTo(db.patients, {
      as: 'patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    db.visits.belongsTo(db.users, {
      as: 'doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.visits.belongsTo(db.departments, {
      as: 'department',
      foreignKey: {
        name: 'departmentId',
      },
      constraints: false,
    });

    db.visits.belongsTo(db.appointments, {
      as: 'appointment',
      foreignKey: {
        name: 'appointmentId',
      },
      constraints: false,
    });

    db.visits.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.visits.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.visits.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.visits.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return visits;
};
