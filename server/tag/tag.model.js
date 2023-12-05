import { Model } from 'sequelize';

class Tag extends Model {
  static fields({ BOOLEAN, STRING, UUID, UUIDV4 }) {
    return {
      uid: {
        type: UUID,
        unique: true,
        allowNull: false,
        defaultValue: UUIDV4
      },
      name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [2, 20] }
      },
      isAccessTag: {
        type: BOOLEAN,
        field: 'is_access_tag',
        defaultValue: false
      }
    };
  }

  static associate({ Repository, RepositoryTag, User, UserTag }) {
    this.belongsToMany(Repository, {
      through: RepositoryTag,
      foreignKey: { name: 'tagId', field: 'tag_id' }
    });
    this.belongsToMany(User, {
      through: UserTag,
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
      includeRepository.include = [{
        model: User,
        attributes: ['id'],
        where: { id: user.id }
      }];
    }
    return Tag.findAll({
      include: [includeRepository]
    });
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

export default Tag;
