import Vue                  from 'vue';
import Router               from 'vue-router';
import Default              from './pages/default';

Vue.use(Router);

let router = new Router({
    model   : 'hash',
    routes  : [
        {
            path        : '/',
            name        : 'default',
            component   : Default
        }
    ]
});

export default router;
