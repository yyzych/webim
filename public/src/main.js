var Vue = require('vue');
var Router = require('vue-router');
var VueTouch = require('vue-touch');

var App = require('./views/app.vue');
var auth = require('./auth');
var routeMap = require('./router');

Vue.use(Router);
Vue.use(VueTouch);

auth.checkAuth();

var router = new Router();

routeMap(router);

router.beforeEach(function() {
    window.scrollTo(0, 0);
});

router.redirect({
    '*': '/index'
});

router.start(App, '#app');

module.exports = router;