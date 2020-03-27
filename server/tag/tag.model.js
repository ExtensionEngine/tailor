'use strict';

const { Model } = require('sequelize');

class Tag extends Model {
  static fields({ STRING }) {
    return {
      name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [2, 20] }
      }
    };
  }

  static associate({ Repository, RepositoryTag }) {
    this.belongsToMany(Repository, {
      through: RepositoryTag,
      foreignKey: { name: 'tagId', field: 'tag_id' }
    });
  }

  static getAssociated(user) {
    const Repository = this.sequelize.model('Repository');
    const User = this.sequelize.model('User');
    const Tag = this.sequelize.model('Tag');
    const includeRepository = {
      model: Repository,
      as: 'repositories',
      attributes: ['id'],
      required: true
    };
    if (user && !user.isAdmin()) {
      includeRepository.include = [{ model: User, attributes: ['id'], where: { id: user.id } }];
    }
    return Tag.findAll({ include: [includeRepository] });
  }

  static options() {
    return {
      modelName: 'tag',
      underscored: true,
      freezeTableName: true,
      timestamps: false
    };
  }
}

module.exports = Tag;
