'use strict';

const calculatePosition = require('../shared/util/calculatePosition');
const isNumber = require('lodash/isNumber');
const { processAsset, resolveAsset } = require('../shared/storage/helpers');

module.exports = function (sequelize, DataTypes) {
  const Tel = sequelize.define('tel', {
    type: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.JSON
    },
    position: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 1000000 }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    classMethods: {
      associate(models) {
        Tel.belongsTo(models.Activity, {
          foreignKey: { name: 'activityId', field: 'activity_id' }
        });
        Tel.belongsTo(models.Course, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
      },
      initialize() {
        const opts = { type: sequelize.QueryTypes.SELECT };
        return sequelize.query('SELECT NEXTVAL(\'tel_id_seq\')', opts)
          .then(result => Tel.build({ id: result[0].nextval }));
      },
      fetch(opt) {
        return isNumber(opt)
          ? Tel.findById(opt).then(it => it && resolveAsset(it))
          : Tel.findAll(opt).then(arr => Promise.all(arr.map(it => resolveAsset(it))));
      }
    },
    instanceMethods: {
      siblings() {
        return Tel.findAll({
          where: { activityId: this.activityId },
          order: 'position ASC'
        });
      },
      reorder(index) {
        return sequelize.transaction(t => {
          return this.siblings().then(siblings => {
            this.position = calculatePosition(this.id, index, siblings);
            return this.save({ transaction: t });
          });
        });
      }
    },
    hooks: {
      beforeCreate(tel) {
        return processAsset(tel);
      },
      beforeUpdate(tel) {
        const changed = tel.changed('data');
        return changed ? processAsset(tel) : Promise.resolve();
      }
    },
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return Tel;
};
