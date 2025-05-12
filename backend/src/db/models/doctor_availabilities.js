const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const doctor_availabilities = sequelize.define(
    'doctor_availabilities',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      weekday: {
        type: DataTypes.TEXT,
      },

      morning_start_time: {
        type: DataTypes.DATE,
      },

      morning_end_time: {
        type: DataTypes.DATE,
      },

      evening_start_time: {
        type: DataTypes.DATE,
      },

      evening_end_time: {
        type: DataTypes.DATE,
      },

      slot_duration_minutes: {
        type: DataTypes.INTEGER,
      },

      is_active: {
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

  doctor_availabilities.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.doctor_availabilities.belongsTo(db.users, {
      as: 'doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.doctor_availabilities.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.doctor_availabilities.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.doctor_availabilities.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return doctor_availabilities;
};
