const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const pharmacy_order_items = sequelize.define(
    'pharmacy_order_items',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      quantity: {
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

  pharmacy_order_items.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.pharmacy_order_items.belongsTo(db.pharmacy_orders, {
      as: 'pharmacy_order',
      foreignKey: {
        name: 'pharmacy_orderId',
      },
      constraints: false,
    });

    db.pharmacy_order_items.belongsTo(db.medications, {
      as: 'medication',
      foreignKey: {
        name: 'medicationId',
      },
      constraints: false,
    });

    db.pharmacy_order_items.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.pharmacy_order_items.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.pharmacy_order_items.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return pharmacy_order_items;
};
