<template>
  <div>
    {{ name }}
    <outline :activities="outline"></outline>
  </div>
</template>

<script>
import Outline from './Outline.vue';

export default {
  data: function () {
    // TODO: Move to store
    return {
      name: 'Computer Science',
      outline: [
        {
          name: 'Introduction',
          activities: [{ name: '1' }, { name: '2' }, { name: '3' }]
        },
        { name: 'Values, Types, and Operators' },
        { name: 'Program Structure' },
        {
          name: 'Functions',
          activities: [
            {
              name: '1',
              activities: [{ name: '1' }, { name: '2' }, { name: '3' }]
            },
            { name: '2' },
            { name: '3' }
          ]
        },
        {
          name: 'Data Structures: Objects and Arrays',
          activities: [{ name: '1' }, { name: '2' }, { name: '3' }]
        },
        { name: 'Higher-Order Functions' },
        { name: 'The Secret Life of Objects' },
        { name: 'Bugs and Error Handling' }
      ]
    };
  },
  components: {
    Outline
  }
};
</script>

<style lang="scss">

</style>
