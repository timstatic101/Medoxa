const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const imaging_orders = sequelize.define(
    'imaging_orders',
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

  imaging_orders.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.imaging_orders.hasMany(db.imaging_order_items, {
      as: 'imaging_order_items_imaging_order',
      foreignKey: {
        name: 'imaging_orderId',
      },
      constraints: false,
    });

    //end loop

    db.imaging_orders.belongsTo(db.visits, {
      as: 'visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    db.imaging_orders.belongsTo(db.users, {
      as: 'imaging_technician',
      foreignKey: {
        name: 'imaging_technicianId',
      },
      constraints: false,
    });

    db.imaging_orders.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.imaging_orders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.imaging_orders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return imaging_orders;
};
