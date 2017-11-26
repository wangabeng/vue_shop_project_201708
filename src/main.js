// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import axios from 'axios';
// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(VueRouter);
Vue.prototype.$http = axios;

// 导入所有的公共stylus 失败 why
// import './common/stylus/index.styl';

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
import Goods from './components/goods/goods';
import Ratings from './components/ratings/ratings';
import Seller from './components/seller/seller';

Vue.config.productionTip = false;

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
// path: '/'设置默认路由 跳转到goods组件
const routes = [{
  name: 'Goods',
  path: '/goods',
  component: Goods
  // 在引用的时候 <router-link to="{name:'Goods'}">商品</router-link>直接给to传入一个对象 而代替to="/goods" 这样可以解耦合 便于代码维护 在此给此组件添加一个name属性便于引用
}, {
  path: '/ratings',
  component: Ratings
}, {
  path: '/seller',
  component: Seller
},
{
  path: '/',
  component: Goods
}];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
});

// 设置自动跳转页面 见https://segmentfault.com/q/1010000007569151/a-1020000007569462
// router.push('/goods');
// 此时会出现问题 就是在渲染ratings.vue页面的时候 会找不到refresh 因为此时更新rangtings的时候 是异步的 这个时候设置了自动跳转goods页面 异步加载还在执行 就会出现错误 把这个自动跳转移除 就可以解决这个问题
// 进入主页加载 good这个页面 需要在上线的时候设置 http://localhost:8080/#/goods 至此 9章及以前的所有问题得到了解决

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: new Vue()
  }
});
