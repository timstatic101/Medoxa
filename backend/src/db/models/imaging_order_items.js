const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const imaging_order_items = sequelize.define(
    'imaging_order_items',
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

  imaging_order_items.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.imaging_order_items.belongsTo(db.imaging_orders, {
      as: 'imaging_order',
      foreignKey: {
        name: 'imaging_orderId',
      },
      constraints: false,
    });

    db.imaging_order_items.belongsTo(db.imaging_investigations, {
      as: 'imaging_investigation',
      foreignKey: {
        name: 'imaging_investigationId',
      },
      constraints: false,
    });

    db.imaging_order_items.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.imaging_order_items.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.imaging_order_items.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return imaging_order_items;
};
