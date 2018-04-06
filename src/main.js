/* global ENVIRONMENT, window, document */
/* eslint-disable no-new */
/* eslint no-console: 0 */

import Vue              from 'vue';
import firebase         from 'firebase';
import {Core}           from './core/index';
import router           from './app/_router';
import App              from './app/App.vue';
import config           from '../config';

let logConsole = (error = null) =>
{
    console.error(error);
};

try
{
    window.onerror = logConsole;

    // Initialize Firebase
    firebase.initializeApp(config.firebase);

    window.Core = new Core();
    window.Core.init(ENVIRONMENT).then(() =>
    {
        Vue.config.productionTip = false;

        window.$0 = new Vue({
            el          : '#app',
            template    : '<App/>',
            components  : {App},
            router
        });
    });
}
catch (e)
{
    logConsole(e);
}
