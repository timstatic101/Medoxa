const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const lab_tests = sequelize.define(
    'lab_tests',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
      },

      price: {
        type: DataTypes.DECIMAL,
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

  lab_tests.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.lab_tests.hasMany(db.lab_order_items, {
      as: 'lab_order_items_lab_test',
      foreignKey: {
        name: 'lab_testId',
      },
      constraints: false,
    });

    //end loop

    db.lab_tests.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.lab_tests.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.lab_tests.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return lab_tests;
};
