const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const sick_leaves = sequelize.define(
    'sick_leaves',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      start_date: {
        type: DataTypes.DATE,
      },

      end_date: {
        type: DataTypes.DATE,
      },

      diagnosis: {
        type: DataTypes.TEXT,
      },

      instructions: {
        type: DataTypes.TEXT,
      },

      document_url: {
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

  sick_leaves.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.sick_leaves.belongsTo(db.visits, {
      as: 'visit',
      foreignKey: {
        name: 'visitId',
      },
      constraints: false,
    });

    db.sick_leaves.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.sick_leaves.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.sick_leaves.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return sick_leaves;
};
