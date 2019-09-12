const every = require('lodash/every');
const isEmpty = require('lodash/isEmpty');
const isEqual = require('lodash/isEqual');
const map = require('lodash/map');
const omitBy = require('lodash/omitBy');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const TeachingElement = require('../teaching-element/te.model');
const uniqWith = require('lodash/uniqWith');

module.exports = Model => class extends Model {
  /**
   * Maps references for cloned activity.
   * @param {Object} mappings Dict where keys represent old and values new ids.
   * @param {SequelizeTransaction} [transaction]
   * @returns {Promise.<Activity>} Updated instance.
   */
  mapClonedReferences(mappings, relationships, transaction) {
    const refs = this.refs || {};
    relationships.forEach(type => {
      if (refs[type]) refs[type] = refs[type].map(it => mappings[it]);
    });
    return this.update({ refs }, { transaction });
  }

  /**
   * @param {Object} options
   * @param {Object} options.filter
   * @param {SequelizeTransaction} options.transaction
   * @returns {Promise.<Activity>}
   */
  siblings({ filter = {}, transaction }) {
    const Activity = this.sequelize.model('Activity');
    const { parentId, courseId } = this;
    const where = { ...filter, parentId, courseId };
    const options = { where, order: [['position', 'ASC']], transaction };
    return Activity.findAll(options);
  }

  predecessors() {
    if (!this.parentId) return Promise.resolve([]);
    return this.getParent().then(parent => {
      return parent.predecessors().then(acc => acc.concat(parent));
    });
  }

  /**
   * @param {Object} options
   * @param {Array} nodes
   * @param {Array} leaves
   * @returns {Promise}
   */
  descendants(options = {}, nodes = [], leaves = []) {
    const { attributes } = options;
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

  /**
   * @param {Activity} activity
   * @param {Object} options
   * @returns {Promise}
   */
  static async removeActivity(activity, options) {
    const Activity = this.sequelize.model('Activity');
    const descendants = await activity.descendants();
    const regularNodes = descendants.nodes.filter(d => !d.isLink);
    descendants.all = [
      ...regularNodes,
      ...descendants.leaves.filter(d => !d.isLink)
    ];
    descendants.links = descendants.nodes.filter(d => d.isLink);
    let where = { activityId: [...map(descendants.all, 'id'), activity.id] };
    await removeAll(TeachingElement, where, options);
    where = { parentId: [...map(regularNodes, 'id'), activity.id] };
    await removeAll(Activity, where, options);
    await activity.destroy(options);
    if (!descendants.links.length) return { ids: [activity.id] };
    let result = { ids: [activity.id], originIds: [], updatedActivities: [] };
    return Activity.removeLinks(descendants.links, result, options);
  }

  /**
   * @param {Array<Activity>} descendants
   * @param {Object} result
   * @param {Array<Number>} result.ids
   * @param {Array<Number>} result.originIds
   * @param {Array<Activity>} result.updatedActivities
   * @param {Object} options
   * @returns {Object}
   */
  static async removeLinks(activities, result, options) {
    const Activity = this.sequelize.model('Activity');
    await Promise.each(activities, async activity => {
      const {
        ids = [],
        originIds = [],
        updatedActivities = []
      } = await Activity.removeLinkedActivity(activity, options);
      result.ids = [...ids, ...result.ids];
      result.originIds = [...originIds, ...result.originIds];
      result.updatedActivities = [...updatedActivities, ...result.updatedActivities];
    });
    return result;
  }

  /**
   * @param {Activity} activity
   * @param {Object} options
   * @returns {Object}
   */
  static async removeLinkedActivity(activity, options = {}) {
    const Activity = this.sequelize.model('Activity');
    if (activity.isOrigin) return Activity.removeOrigin(activity, options);
    let result = { ids: [], originIds: [], updatedActivities: [] };
    await activity.destroy(options);
    result.ids.push(activity.id);
    result = await Activity.removeLinkedChildren(activity, result, { ...options, recursion: true });
    result = await Activity.resolveOriginLinks(activity, result, options);
    return result;
  }

  /**
   * @param {Activity} activity
   * @param {Object} result
   * @param {Object} options
   * @returns {Promise}
   */
  static async removeLinkedChildren(activity, result, options) {
    const Activity = this.sequelize.model('Activity');
    let children = await activity.getChildren(options);
    if (!children.length) return result;
    return Activity.removeLinks(children, result, options);
  }

  /**
   * @param {Activity} activity
   * @param {Array<Activity>} links
   * @param {Object} result
   * @param {Object} options
   * @returns {Object}
   */
  static async removeLinksFromAllParentOriginLinks(activity, links, result, options) {
    const Activity = this.sequelize.model('Activity');
    const parent = await activity.getParent(options);
    if (!parent || !parent.isLink) return { result, links };
    const parentOriginLinks = await parent.origin.getLinks(options);
    let parentIds = parentOriginLinks.map(it => it.id);
    const shouldRemoveLink = ({ parentId }) => {
      return parentIds.includes(parentId) && parentId !== activity.parentId;
    };
    const ids = [];
    await Promise.each(links, link => {
      if (!shouldRemoveLink(link)) return;
      parentIds = parentIds.filter(it => it !== link.parentId);
      links = links.filter(it => it.id !== link.id);
      ids.push(link.id);
    });
    await Activity.destroy({ where: { id: ids }, ...options });
    result.ids = [...result.ids, ...ids];
    return { result, links };
  }

  /**
   * @param {Activity} activity
   * @param {Object} options
   */
  static async removeOrigin(activity, options = {}) {
    const Activity = this.sequelize.model('Activity');
    const ids = [activity.id];
    activity.links.forEach(link => ids.push(link.id));
    await Activity.destroy({ where: { id: ids }, ...options });
    return { ids };
  }

  /**
   * @param {Activity} activity
   * @param {Object} result
   * @param {Object} options
   * @param {Number} options.parentId
   * @param {Boolean} options.recursion
   * @param {SequelizeTransaction} options.transaction
   * @returns {Object}
  */
  static async resolveOriginLinks(activity, result, options) {
    const Activity = this.sequelize.model('Activity');
    const { origin, parentId } = activity;
    let links = await origin.getLinks(options);
    if (parentId && !options.recursion) {
      ({ result, links } = await Activity.removeLinksFromAllParentOriginLinks(
        activity, links, result, options
      ));
    }
    if (links && links.length === 1) {
      return Activity.restoreOrigin(links[0], origin, result, options);
    }
    if (links && links.length > 1) return result;
    await origin.destroy(options);
    result.ids.push(origin.id);
    return result;
  }

  /**
   * @param {Activity} link
   * @param {Activity} origin
   * @param {Object} result
   * @param {Array<Number>} result.ids
   * @param {Array<Number>} result.originIds
   * @param {Array<Activity>} result.updatedActivities
   * @param {Object} options
   * @param {Number} options.parentId
   * @param {Boolean} options.recursion
   * @param {SequelizeTransaction} options.transaction
   * @returns {Object}
  */
  static async restoreOrigin(link, origin, result, options) {
    const { ids = [], originIds = [], updatedActivities = [] } = result;
    ids.push(link.id);
    await link.destroy(options);
    origin.parentId = link.parentId;
    await origin.save(options);
    originIds.push(origin.id);
    updatedActivities.push(origin);
    const children = await link.getChildren(options);
    if (!children.length) return { ids, originIds, updatedActivities };
    await Promise.each(
      children,
      async child => {
        if (originIds.includes(child.originId)) {
          ids.push(child.id);
          await child.destroy(options);
        }
        child.parentId = link.originId;
        await child.save(options);
        updatedActivities.push(child);
      }
    );
    return { ids, originIds, updatedActivities };
  }

  /**
   * @param {Activity} source
   * @param {Object} options
   * @param {Number} options.courseId
   * @param {Number} options.parentId
   * @param {Object} options.idMap
   * @param {SequelizeTransaction} options.transaction
   * @param {Boolean} options.shouldCloneOrigins
   * @param {Boolean} options.isLinkingEnabled
   * @returns {Object}
   */
  static async cloneActivities(source, options) {
    const Activity = this.sequelize.model('Activity');
    if (options.originId) return Activity.cloneIntoLink(source, options);
    let { idMap = {}, isLinkingEnabled } = options;
    idMap = await Activity.cloneOrigins(source, { ...options, idMap });
    const fnc = ({ isOrigin, id }) => !isOrigin && !idMap[id];
    const filteredSource = source.filter(fnc);
    const clonedActivitiesMap = getClonedActivitiesMap(
      filteredSource, { ...options, idMap }
    );
    const clonedActivities = await Activity.bulkCreate(
      clonedActivitiesMap,
      { returning: true, ...options }
    );
    idMap = await Promise.reduce(filteredSource, async (acc, activity, index) => {
      const { id } = clonedActivities[index];
      const children = await activity.getChildren({ where: { detached: false } });
      await cloneTeachingElements({ activityId: activity.id, id, ...options });
      acc[activity.id] = id;
      if (!children.length) return acc;
      return Activity.cloneActivities(
        children,
        { ...options, idMap: acc, parentId: id }
      );
    }, idMap);
    if (isLinkingEnabled) {
      idMap = await Activity.resolveClonedOrigins({ ...options, idMap });
    }
    return idMap;
  }

  /**
   * @param {Activity} source
   * @param {Object} options
   * @param {Number} options.courseId
   * @param {Number} options.parentId
   * @param {Boolean} options.isLinkingEnabled
   * @param {Boolean} options.shouldCloneOrigins
   * @param {Object} options.idMap
   * @returns {Promise}
   */
  static async cloneIntoLink(source, options) {
    const Activity = this.sequelize.model('Activity');
    const { originId } = options;
    options.originId = null;
    let idMap = await Activity.cloneActivities(source, options);
    const id = idMap[source[0].originId] || idMap[source[0].id];
    let activity = await Activity.findByPk(id, options);
    return Activity.linkActivities(activity, {
      ...options,
      position: activity.position,
      parentId: activity.parentId,
      originParentId: originId
    });
  }

  /**
   * @param {Activity} source
   * @param {Object} options
   * @param {Number} options.courseId
   * @param {Number} options.parentId
   * @param {Boolean} options.isLinkingEnabled
   * @param {Boolean} options.shouldCloneOrigins
   * @param {Object} options.idMap
   * @param {SequelizeTransaction} options.transaction
   * @returns {Promise}
   */
  static async cloneOrigins(source, options) {
    const Activity = this.sequelize.model('Activity');
    const { isLinkingEnabled, shouldCloneOrigins, idMap } = options;
    if (!shouldCloneOrigins && !isLinkingEnabled) return idMap;
    const { courseId, transaction, parentId } = options;
    return Promise.reduce(source, async (acc, { isLink, origin }) => {
      if (!isLink || acc[origin.id]) return acc;
      const clonedOrigin = await Activity.create({
        courseId,
        parentId: parentId || acc[origin.parentId] || null,
        ...pick(origin, ['type', 'data', 'refs', 'position'])
      }, { transaction });
      acc[origin.id] = clonedOrigin.id;
      await cloneTeachingElements({
        activityId: origin.id,
        id: clonedOrigin.id,
        courseId,
        transaction
      });
      return acc;
    }, idMap);
  }

  /**
   * If there is one link in the cloned tree, remove it and leave only the origin
   * @param {Object} options
   * @param {Number} options.courseId
   * @param {Object} options.idMap
   * @param {Boolean} options.isLinkingEnabled
   * @param {SequelizeTransaction} options.transaction
   * @returns {Object}
   */
  static async resolveClonedOrigins(options) {
    const Activity = this.sequelize.model('Activity');
    let { idMap } = options;
    const activities = await Activity.findAll({
      where: { id: Object.values(idMap) },
      ...options
    });
    const origins = activities.filter(({ isOrigin }) => isOrigin);
    if (!origins.length) return idMap;
    let originIds = [];
    let ids = [];
    await Promise.each(origins, async origin => {
      if (origin.links.length !== 1) return;
      const [link] = origin.links;
      ({ ids, originIds } = await Activity.restoreOrigin(
        link, origin, { ids, originIds }, options
      ));
      idMap = omitBy(idMap, id => id === link.id);
    });
    await Activity.destroy({ where: { id: ids }, ...options });
    return idMap;
  }

  /**
   * @param {Activity} source
   * @param {Object} options
   * @param {Number} options.parentId
   * @param {Boolean} options.recursion
   * @param {SequelizeTransaction} options.transaction
   * @returns {Promise}
   */
  static async linkActivities(source, options) {
    const Activity = this.sequelize.model('Activity');
    const { transaction, originParentId } = options;
    const linksMap = await Activity.createLinksMap(source, options);
    const links = await Activity.bulkCreate(
      linksMap,
      { returning: true, transaction }
    );
    let activities = links.map(link => link.id);
    if (!source.isLink) activities.push(source.id);
    if (originParentId && !source.isLink) await source.update({ parentId: originParentId });
    let children = await source.getChildren({
      where: { detached: false },
      transaction
    });
    if (!children.length) return activities;
    children = children.filter(child => !child.isOrigin);
    return Promise.reduce(links, async (acc, { id, originId }) => ([
      ...acc,
      ...await Activity.linkChildren(children, { ...options, parentId: id, originParentId: originId })
    ]), activities);
  }

  /**
   * @param {Array<Activity>} children
   * @param {Object} options`
   */
  static async linkChildren(children, options) {
    const Activity = this.sequelize.model('Activity');
    return Promise.reduce(children, async (acc, child) => ([
      ...acc,
      ...await Activity.linkActivities(child, { ...options, recursion: true })
    ]), []);
  }

  /**
   * @param {Activity} activity
   * @param {Object} options
   * @param {Number} options.parentId
   * @param {Number} options.position
   * @param {Boolean} options.recursion
   * @param {SequelizeTransaction} options.transaction
   * @returns {Array<Object>}
   */
  static async createLinksMap(activity, options) {
    const Activity = this.sequelize.model('Activity');
    const { parentId = null, position, recursion = false } = options;
    const data = pick(activity, ['data', 'type', 'courseId', 'parentId', 'position']);
    const originId = activity.originId || activity.id;
    let linksMap = [{ ...data, originId, parentId, position }];
    if (addSourceLink(activity, parentId) && !recursion) linksMap.push({ ...data, originId });
    if (!every(linksMap, ['parentId', parentId])) {
      linksMap = uniqWith(linksMap, isEqual);
    }
    if (recursion) return linksMap;
    const parentLinks = await Activity.addLinksForAllParents(
      { ...data, position, originId },
      options
    );
    linksMap = [...linksMap, ...parentLinks];
    if (!every(linksMap, ['parentId', parentId])) return uniqWith(linksMap, isEqual);
    return linksMap;
  }

  /**
   * @param {Object} data
   * @param {Object} options
   * @param {Object} options.parentId
   * @param {SequelizeTransaction} options.transaction
   * @returns {Array<Object>}
   */
  static async addLinksForAllParents(data, { parentId, transaction }) {
    if (!parentId) return [];
    const Activity = this.sequelize.model('Activity');
    const parent = await Activity.findOne({ where: { id: parentId }, transaction });
    if (!parent || !parent.isLink) return [];
    const parentLinks = await parent.origin.getLinks({ transaction });
    return parentLinks.reduce((acc, { id }) => {
      if (id !== parentId) acc.push({ ...data, parentId: id });
      return acc;
    }, []);
  }
};

/**
* @param {Activity} activity
* @param {Number} parentId
* @returns {Boolean}
*/
function addSourceLink(activity, parentId) {
  if (!activity.isLink && !activity.isOrigin) return true;
  if (!parentId && activity.isLink) return false;
  return !parentId;
}

/**
 * Gets the map of activity data for bulkCreate
 * @param {Array<Activity>} activities
 * @param {Object} options
 * @param {Number} options.courseId
 * @param {Number} options.parentId
 * @param {Object} options.idMap
 * @param {Boolean} options.shouldCloneOrigins
 * @returns {Array}
 */
function getClonedActivitiesMap(activities, options) {
  const { idMap, shouldCloneOrigins, courseId, parentId } = options;
  const originId = ({ originId }) => shouldCloneOrigins && idMap[originId]
    ? idMap[originId]
    : originId;
  return activities.map(activity => ({
    courseId,
    parentId,
    originId: originId(activity),
    data: activity.isLink ? {} : activity.data,
    ...pick(activity, ['type', 'position', 'refs'])
  }));
}

/**
 * @param {Object} options
 * @param {Number} options.activityId
 * @param {Number} options.id
 * @param {Number} options.courseId
 * @param {SequelizeTransaction} options.transaction
 * @returns {Promise}
 */
async function cloneTeachingElements(options) {
  if (options.shouldCloneOrigins) return;
  const { activityId, id, courseId, transaction } = options;
  const tes = await TeachingElement.findAll({
    where: { activityId, detached: false }, transaction
  });
  if (!tes.length) return;
  return TeachingElement.cloneElements(tes, { activityId: id, courseId, transaction });
}

/**
 * @param {SequelizeModel} Model
 * @param {Object} where
 * @param {Object} options
 * @param {Boolean} options.soft
 * @param {SequelizeTransaction} options.transaction
 * @returns {Promise}
 */
function removeAll(Model, where = {}, { soft = false, transaction }) {
  if (!soft) return Model.destroy({ where, transaction });
  return Model.update({ detached: true }, { where, transaction });
}
