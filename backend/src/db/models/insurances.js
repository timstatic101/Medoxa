const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const insurances = sequelize.define(
    'insurances',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      provider_name: {
        type: DataTypes.TEXT,
      },

      policy_number: {
        type: DataTypes.TEXT,
      },

      coverage_start: {
        type: DataTypes.DATE,
      },

      coverage_end: {
        type: DataTypes.DATE,
      },

      plan_details: {
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

  insurances.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.insurances.belongsTo(db.patients, {
      as: 'patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    db.insurances.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.insurances.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.insurances.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return insurances;
};
