import colors from 'vuetify/es5/util/colors';
import icons from '@/components/repository/WorkflowBoard/icons';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VuetifySnackbar from '@/plugins/vuetify-snackbar';

Vue.use(Vuetify);
Vue.use(VuetifySnackbar);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: {
      priorityTrivial: {
        component: icons.PriorityTrivial
      },
      priorityLow: {
        component: icons.PriorityLow
      },
      priorityMedium: {
        component: icons.PriorityMedium
      },
      priorityHigh: {
        component: icons.PriorityHigh
      },
      priorityCritical: {
        component: icons.PriorityCritical
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
