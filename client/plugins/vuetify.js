import colors from 'vuetify/es5/util/colors';
import PriorityCritical from '../components/repository/WorkflowBoard/icons/PriorityCritical';
import PriorityHigh from '../components/repository/WorkflowBoard/icons/PriorityHigh';
import PriorityLow from '../components/repository/WorkflowBoard/icons/PriorityLow';
import PriorityMedium from '../components/repository/WorkflowBoard/icons/PriorityMedium';
import PriorityTrivial from '../components/repository/WorkflowBoard/icons/PriorityTrivial';
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
        component: PriorityTrivial
      },
      priorityLow: {
        component: PriorityLow
      },
      priorityMedium: {
        component: PriorityMedium
      },
      priorityHigh: {
        component: PriorityHigh
      },
      priorityCritical: {
        component: PriorityCritical
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
