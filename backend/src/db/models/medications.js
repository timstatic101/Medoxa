const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const medications = sequelize.define(
    'medications',
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

  medications.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.medications.hasMany(db.pharmacy_order_items, {
      as: 'pharmacy_order_items_medication',
      foreignKey: {
        name: 'medicationId',
      },
      constraints: false,
    });

    //end loop

    db.medications.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.medications.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.medications.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return medications;
};
