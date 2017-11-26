<template>
  <div id="app">
    <v-header :seller='seller'></v-header>
    <div class='tab'>
      <div class='tab-item'>
      <!-- 这里要用绑定的形式:to -->
        <router-link :to="{name:'Goods'}">商品</router-link>
      </div>
      <div class='tab-item'>
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class='tab-item'>
        <router-link to="/seller">商家</router-link>
      </div>
    </div> 
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive>
      <router-view :seller='seller'></router-view>
    </keep-alive>   
  </div>
</template>

<script type='text/ecmascript-6'>
  import Header from './components/header/header.vue';
  import urlParse from './common/js/ulti.js';
  const ERR_OK = 0;
  export default {
    name: 'app',
    data () {
      return {
        seller: {
          'id': (() => {
          // 设置这个seller的id值
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created () {
      this.$http.get('/api/seller?id=' + this.seller.id).then((res) => {
        if (ERR_OK === res.data.errno) {
          // 拓展这个seller的值 seller已经设置好了id 如果使用常规的方法 this.seller=res.data.data 就相当于把新的对象地址赋值给了this.seller 那么在data中设置好的id就会消失
          this.seller = Object.assign({}, this.seller, res.data.data);
          // console.log(this.seller.id);
        }
      });
    },
    components: {
      'v-header': Header
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import './common/stylus/index.styl';
  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 21, 0.1 ))
      .tab-item
        flex: 1
        text-align: center
        & > a /* &父元素 指的是.tab-item */
          display: block
          text-decoration: none
          font-size: 14px
          color: rgb(77, 85, 93)
          &.router-link-active /* 此处&指的是a标签 */
            color: red

</style>
