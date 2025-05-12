const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const holidays = sequelize.define(
    'holidays',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      start_date: {
        type: DataTypes.DATE,
      },

      end_date: {
        type: DataTypes.DATE,
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

  holidays.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.holidays.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.holidays.belongsTo(db.users, {
      as: 'doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.holidays.belongsTo(db.departments, {
      as: 'department',
      foreignKey: {
        name: 'departmentId',
      },
      constraints: false,
    });

    db.holidays.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.holidays.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.holidays.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return holidays;
};
