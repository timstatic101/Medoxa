const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const lab_orders = sequelize.define(
    'lab_orders',
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

  lab_orders.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.lab_orders.hasMany(db.lab_order_items, {
      as: 'lab_order_items_lab_order',
      foreignKey: {
        name: 'lab_orderId',
      },
      constraints: false,
    });

    //end loop

    db.lab_orders.belongsTo(db.visits, {
      as: 'visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    db.lab_orders.belongsTo(db.users, {
      as: 'lab_technician',
      foreignKey: {
        name: 'lab_technicianId',
      },
      constraints: false,
    });

    db.lab_orders.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.lab_orders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.lab_orders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return lab_orders;
};
