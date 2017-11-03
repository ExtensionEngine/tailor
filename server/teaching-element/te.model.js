const { processStatics, resolveStatics } = require('../shared/storage/helpers');
const calculatePosition = require('../shared/util/calculatePosition');
const isNumber = require('lodash/isNumber');
const { Model } = require('sequelize');

class TeachingElement extends Model {
  static fields(DataTypes) {
    const { BOOLEAN, DATE, FLOAT, JSON, STRING } = DataTypes;
    return {
      type: {
        type: STRING
      },
      data: {
        type: JSON
      },
      position: {
        type: FLOAT,
        validate: { min: 0, max: 1000000 }
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

  static associate({ Activity, Course }) {
    TeachingElement.belongsTo(Activity, {
      foreignKey: { name: 'activityId', field: 'activity_id' }
    });
    TeachingElement.belongsTo(Course, {
      foreignKey: { name: 'courseId', field: 'course_id' }
    });
  }

  static hooks() {
    return {
      beforeCreate(te) {
        return processStatics(te);
      },
      beforeUpdate(te) {
        const changed = te.changed('data');
        return changed ? processStatics(te) : Promise.resolve();
      }
    };
  }

  static options() {
    return {
      tableName: 'teaching_element',
      underscored: true,
      timestamps: true,
      paranoid: true
    };
  }

  static initialize() {
    const { QueryTypes, query } = this.sequelize;
    const opts = { type: QueryTypes.SELECT };
    return query('SELECT NEXTVAL(\'teaching_element_id_seq\')', opts)
      .then(result => TeachingElement.build({ id: result[0].nextval }));
  }

  static fetch(opt) {
    return isNumber(opt)
      ? TeachingElement.findById(opt).then(it => it && resolveStatics(it))
      : TeachingElement.findAll(opt)
          .then(arr => Promise.all(arr.map(it => resolveStatics(it))));
  }

  siblings(filter = {}) {
    const where = Object.assign({}, filter, { activityId: this.activityId });
    return TeachingElement.findAll({ where, order: 'position ASC' });
  }

  reorder(index) {
    const { transaction } = this.sequelize;
    return transaction(t => {
      return this.getReorderFilter()
        .then(filter => this.siblings(filter))
        .then(siblings => {
          this.position = calculatePosition(this.id, index, siblings);
          return this.save({ transaction: t });
        });
    });
  }

  getReorderFilter() {
    return this.getActivity().then(parent => {
      if (parent.type !== 'ASSESSMENT_GROUP') return {};
      if (this.type === 'ASSESSMENT') return { type: 'ASSESSMENT' };
      return { type: { $not: this.type } };
    });
  }
}

module.exports = TeachingElement;
