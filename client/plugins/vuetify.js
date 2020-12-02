import activityIcons from '@/components/repository/Outline/icons';
import colors from 'vuetify/es5/util/colors';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VuetifySnackbar from '@/plugins/vuetify-snackbar';
import workflowIcons from '@/components/repository/WorkflowBoard/icons';

Vue.use(Vuetify);
Vue.use(VuetifySnackbar);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: {
      addAbove: {
        component: activityIcons.AddAbove
      },
      addBelow: {
        component: activityIcons.AddBelow
      },
      addInto: {
        component: activityIcons.AddInto
      },
      priorityTrivial: {
        component: workflowIcons.PriorityTrivial
      },
      priorityLow: {
        component: workflowIcons.PriorityLow
      },
      priorityMedium: {
        component: workflowIcons.PriorityMedium
      },
      priorityHigh: {
        component: workflowIcons.PriorityHigh
      },
      priorityCritical: {
        component: workflowIcons.PriorityCritical
      }
    }
  },
  theme: {
    themes: {
      light: {
        primary: colors.blueGrey.darken2,
        secondary: colors.pink
      }
    },
    options: {
      customProperties: true
    }
  }
});
