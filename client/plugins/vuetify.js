import colors from 'vuetify/es5/util/colors';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VuetifySnackbar from '@/plugins/vuetify-snackbar';

Vue.use(Vuetify);
Vue.use(VuetifySnackbar);

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
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
