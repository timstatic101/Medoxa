const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const appointment_rules = sequelize.define(
    'appointment_rules',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      min_hours_before_booking: {
        type: DataTypes.INTEGER,
      },

      max_days_advance_booking: {
        type: DataTypes.INTEGER,
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

  appointment_rules.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.appointment_rules.belongsTo(db.departments, {
      as: 'department',
      foreignKey: {
        name: 'departmentId',
      },
      constraints: false,
    });

    db.appointment_rules.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.appointment_rules.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.appointment_rules.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return appointment_rules;
};
