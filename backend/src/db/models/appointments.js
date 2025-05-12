const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const appointments = sequelize.define(
    'appointments',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      appointment_date: {
        type: DataTypes.DATE,
      },

      start_time: {
        type: DataTypes.DATE,
      },

      end_time: {
        type: DataTypes.DATE,
      },

      type: {
        type: DataTypes.ENUM,

        values: ['New', 'FollowUp'],
      },

      status: {
        type: DataTypes.ENUM,

        values: [
          'Scheduled',

          'CheckedIn',

          'Completed',

          'Canceled',

          'Rescheduled',
        ],
      },

      reminder_sent: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
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

  appointments.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.appointments.hasMany(db.visits, {
      as: 'visits_appointment',
      foreignKey: {
        name: 'appointmentId',
      },
      constraints: false,
    });

    //end loop

    db.appointments.belongsTo(db.patients, {
      as: 'patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    db.appointments.belongsTo(db.users, {
      as: 'doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.appointments.belongsTo(db.departments, {
      as: 'department',
      foreignKey: {
        name: 'departmentId',
      },
      constraints: false,
    });

    db.appointments.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.appointments.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.appointments.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.appointments.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return appointments;
};
