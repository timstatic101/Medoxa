const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const pharmacy_orders = sequelize.define(
    'pharmacy_orders',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      total_amount: {
        type: DataTypes.DECIMAL,
      },

      status: {
        type: DataTypes.ENUM,

        values: ['Pending', 'Completed'],
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

  pharmacy_orders.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.pharmacy_orders.hasMany(db.pharmacy_order_items, {
      as: 'pharmacy_order_items_pharmacy_order',
      foreignKey: {
        name: 'pharmacy_orderId',
      },
      constraints: false,
    });

    //end loop

    db.pharmacy_orders.belongsTo(db.visits, {
      as: 'visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    db.pharmacy_orders.belongsTo(db.users, {
      as: 'pharmacist',
      foreignKey: {
        name: 'pharmacistId',
      },
      constraints: false,
    });

    db.pharmacy_orders.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.pharmacy_orders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.pharmacy_orders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return pharmacy_orders;
};
