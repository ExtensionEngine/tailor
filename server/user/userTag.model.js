import { Model } from 'sequelize';

class UserTag extends Model {
  static fields({ INTEGER }) {
    return {
      userId: {
        type: INTEGER,
        field: 'user_id',
        primaryKey: true,
        unique: 'user_tag_pkey'
      },
      tagId: {
        type: INTEGER,
        field: 'tag_id',
        primaryKey: true,
        unique: 'user_tag_pkey'
      }
    };
  }

  static associate({ User, Tag }) {
    this.belongsTo(User, {
      foreignKey: { name: 'userId', field: 'user_id' }
    });
    this.belongsTo(Tag, {
      foreignKey: { name: 'tagId', field: 'tag_id' }
    });
  }

  static options() {
    return {
      modelName: 'UserTag',
      tableName: 'user_tag',
      underscored: true,
      timestamps: false
    };
  }
}

export default UserTag;
