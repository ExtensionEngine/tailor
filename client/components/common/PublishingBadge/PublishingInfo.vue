<template>
  <span>{{ info }} {{ userInfo }}</span>
</template>

<script>
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import revisionApi from '@/api/revision';
import uniq from 'lodash/uniq';

const isAfter = (a, b) => new Date(a) > new Date(b);
const arrayToSentence = arr => arr.join(', ').replace(/, ([^,]*)$/, ' and $1');
const getQueryParams = (entityId, publishedAt) => ({
  descendants: true,
  offset: 0,
  limit: 25,
  entityId
});
const getInfo = (label, hasChanges) => hasChanges
  ? `${label} has unpublished content`
  : `${label} content is published`;
const getUserInfo = (collaborators, hasChanges) => {
  const target = arrayToSentence(collaborators);
  return hasChanges && target ? ` made by ${target}` : '';
};

export default {
  props: {
    hasChanges: { type: Boolean, required: true },
    repositoryId: { type: Number, default: null },
    publishedAt: { type: String, default: '' },
    id: { type: Number, default: null },
    type: { type: String, default: '' }
  },
  data: () => ({ users: [] }),
  computed: {
    info: vm => getInfo(vm.label, vm.hasChanges),
    userInfo: vm => getUserInfo(vm.users, vm.hasChanges),
    label: vm => vm.type ? getLevel(vm.type).label : 'Repository'
  },
  async created() {
    const { id, repositoryId, publishedAt } = this;
    if (!id || !repositoryId) return;
    const params = getQueryParams(id, publishedAt);
    const revisions = await revisionApi.fetch(repositoryId, params);
    const users = revisions
      .filter(it => isAfter(it.createdAt, publishedAt))
      .map(it => get(it, 'user.fullName'));
    this.users = uniq(users).slice(0, 3);
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-badge {
  margin: 0 0.125rem;
}
</style>
