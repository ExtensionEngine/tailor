const calculatePosition = require('../shared/util/calculatePosition');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const { Model } = require('sequelize');
const pick = require('lodash/pick');
const Promise = require('bluebird');

class Activity extends Model {
  static fields(DataTypes) {
    const { STRING, DOUBLE, JSON, BOOLEAN, DATE } = DataTypes;
    return {
      type: {
        type: STRING
      },
      position: {
        type: DOUBLE,
        allowNull: false,
        validate: { min: 0 }
      },
      data: {
        type: JSON
      },
      refs: {
        type: JSON,
        defaultValue: {}
      },
      detached: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ Course, TeachingElement }) {
    Activity.hasMany(TeachingElement, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    Activity.belongsTo(Course, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
    Activity.belongsTo(Activity, {
      as: 'parent',
      foreignKey: { name: 'parentId', field: 'parent_id' }
    });
    Activity.hasMany(Activity, {
      as: 'children',
      foreignKey: { name: 'parentId', field: 'parent_id' }
    });
  }

  static options() {
    return {
      modelName: 'activity',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  siblings() {
    return Activity.findAll({
      where: {
        $and: [{ parentId: this.parentId }, { courseId: this.courseId }]
      },
      order: 'position ASC'
    });
  }

  descendants(options = {}, nodes = [], leaves = []) {
    const { attributes = [] } = options;
    const node = !isEmpty(attributes) ? pick(this, attributes) : this;
    nodes.push(node);
    return Promise.resolve(this.getChildren({ attributes }))
      .map(it => it.descendants(options, nodes, leaves))
      .then(children => {
        if (!isEmpty(children)) return { nodes, leaves };
        const leaf = !isEmpty(attributes) ? pick(this, attributes) : this;
        leaves.push(leaf);
        return { nodes, leaves };
      });
  }

  remove(options = {}) {
    if (!options.recursive) return this.destroy(options);
    const { transaction, model } = this.sequelize;
    return transaction(t => {
      return this.descendants({ attributes: ['id'] })
        .then(descendants => {
          descendants.all = [...descendants.nodes, ...descendants.leaves];
          return descendants;
        })
        .then(descendants => {
          const TeachingElement = model('TeachingElement');
          const activities = map(descendants.all, 'id');
          const where = { activityId: [...activities, this.id] };
          return removeAll(TeachingElement, where, options.soft)
            .then(() => descendants);
        })
        .then(descendants => {
          const activities = map(descendants.nodes, 'id');
          const where = { parentId: [...activities, this.id] };
          return removeAll(Activity, where, options.soft);
        })
        .then(() => this.destroy(options))
        .then(() => this);
    });
  }

  reorder(index) {
    const { transaction } = this.sequelize;
    return transaction(t => {
      return this.siblings().then(siblings => {
        this.position = calculatePosition(this.id, index, siblings);
        return this.save({ transaction: t });
      });
    });
  }
}

function removeAll(Model, where = {}, soft = false) {
  if (!soft) return Model.destroy({ where });
  return Model.update({ detached: true }, { where });
}

module.exports = Activity;
