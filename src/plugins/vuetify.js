import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({

    theme: {
        themes: {
            light: {
                primary: '#2827CC',
                secondary: '#F46A1D',
                accent: '#8c9eff',
                error: '#b71c1c',
            },
        },
    },
});
