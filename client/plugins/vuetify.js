import colors from 'vuetify/es5/util/colors';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

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
