const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const lab_order_items = sequelize.define(
    'lab_order_items',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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

  lab_order_items.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.lab_order_items.belongsTo(db.lab_orders, {
      as: 'lab_order',
      foreignKey: {
        name: 'lab_orderId',
      },
      constraints: false,
    });

    db.lab_order_items.belongsTo(db.lab_tests, {
      as: 'lab_test',
      foreignKey: {
        name: 'lab_testId',
      },
      constraints: false,
    });

    db.lab_order_items.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.lab_order_items.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.lab_order_items.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return lab_order_items;
};
