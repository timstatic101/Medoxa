const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const imaging_investigations = sequelize.define(
    'imaging_investigations',
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

  imaging_investigations.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.imaging_investigations.hasMany(db.imaging_order_items, {
      as: 'imaging_order_items_imaging_investigation',
      foreignKey: {
        name: 'imaging_investigationId',
      },
      constraints: false,
    });

    //end loop

    db.imaging_investigations.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.imaging_investigations.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.imaging_investigations.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return imaging_investigations;
};
