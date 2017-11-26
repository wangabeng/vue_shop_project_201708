<template>
	<div class=''>
		<div class='shopcart'>
			<div class='content' @click='toggleList'>
				<div class='content-left'>
					<div class='logo-wrapper'>
						<div class='logo' :class="{'heighlight':totalCount>0}">
							<i class='icon-shopping_cart' :class="{'heighlight':totalCount>0}"></i>
						</div>
						<div class='num' v-show='totalCount>0'>{{ totalCount }}</div>
					</div>
					<div class='price' :class="{'heighlight':totalPrice>0}">¥ {{ totalPrice }}元</div>
					<div class='desc' :class="{'enough':totalPrice>=seller.minPrice}">另需配送费¥ {{ seller.deliveryPrice }}元</div>
				</div>
				<div class='content-right' :class="{'enough':totalPrice>=seller.minPrice}" @click.stop.prevent='pay'>{{ payDesc }}</div>
			</div>
			<div class='ball-container'>
				
				<div v-for='(ball,index) in balls'>
					<transition name='drop' @before-enter='beforeEnter' @enter='enter' @after-enter='afterEnter'>
						<div class='ball' v-show='ball.show'>
							<div class='inner inner-hook'></div>
						</div>
					</transition>
				</div>
			</div>
			<transition name='fold'>
				<div class='shopcart-list' v-show='listshow'>
					<div class='list-header'>
						<h1 class='title'>购物车</h1>
						<span class='empty' @click='empty'>清空</span>
					</div>
					<div class='list-content' ref='list-content'><!-- 注意better-scroll挂载的位置 -->
						<ul class='ulcontainer'>
							<li class='food' v-for='food in selectFoods'>
								<span class='name'>{{ food.name }}</span>
								<div class='price'>
									<span>{{ food.price*food.count }}</span>
								</div>
								<div class='cartcontrol-wrapper'>
									<cartcontrol :food='food'></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name='fadebac'>
			<div class='list-mask' v-show='listshow' @click='hideList'>
			</div>
		</transition>
	</div>
</template>

<script type='text/ecmascript-6'>
	import Cartcontrol from '../cartcontrol/cartcontrol';
	import BScroll from 'better-scroll';

	export default {
	  data () {
	    return {
	      balls: [{
	        show: false
	      }, {
	        show: false
	      }, {
	        show: false
	      }, {
	        show: false
	      }, {
	        show: false
	      } ],
	      dropBalls: [],
	      fold: true
	    };
	  },
	  created () {
	    this.$root.eventHub.$on('cart.add', this.drop);
	  },
	  props: {
	    'seller': {
	      type: Object,
	      default () {
	        return {};
	      }
	    },
	    'selectFoods': {
	      type: Array,
	      default () {
	        return [];
	      }
	    }
	  },
	  computed: {
	    totalPrice () {
	      let total = 0;
	      this.selectFoods.forEach((food) => {
	        total += food.price * food.count;
	      });
	      return total;
	    },
	    totalCount () {
	      let count = 0;
	      this.selectFoods.forEach((food) => {
	        count += food.count;
	      });
	      return count;
	    },
	    payDesc () {
	      if (this.totalPrice === 0) {
	        return `¥ ${this.seller.minPrice}元起送`;
	      } else if (this.totalPrice < this.seller.minPrice) {
	        let diff = this.seller.minPrice - this.totalPrice;
	        return `还差¥ ${diff}元起送`;
	      } else {
	        return '去结算';
	      }
	    },
	    listshow () {
	      if (!this.totalCount) {
	        this.fold = true;
	        return false;
	      }
	      let show = !this.fold;
	      // 在组件里点击加号 减号 都可以实现数量的增减
	      if (show) {
	        // 数据变了 DOM不能立即生效
	        this.$nextTick(() => {
	          if (!this.scroll) {
	            this.scroll = new BScroll(this.$refs['list-content'], {
	              click: true
	            });
	          } else {
	            this.scroll.refresh();
	          }
	        });
	      }
	      return show;
	    }
	  },
	  methods: {
	    drop (el) {
	      // console.log(el);
	      for (let i = 0; i < this.balls.length; i++) {
	        let ball = this.balls[i];
	        if (!ball.show) {
	          ball.show = true;
	          ball.el = el;
	          this.dropBalls.push(ball);
	          return;
	        }
	      }
	    },
	    beforeEnter (el) {
	      // 遍历ball中show为true的小球
	      let count = this.balls.length;
	      while (count--) {
	        let ball = this.balls[count];
	        if (ball.show) {
	          let rect = ball.el.getBoundingClientRect();
	          let x = rect.left - 32;
	          let y = -(window.innerHeight - rect.top - 22);
	          el.style.display = 'block';
	          el.style.webkitTransform = `translate3d(0, ${y}pxx, 0)`;
	          el.style.transform = `translate3d(0, ${y}px, 0)`;
	          let inner = el.getElementsByClassName('inner-hook')[0];
	          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
	          inner.style.transform = `translate3d(${x}px, 0, 0)`;
	        }
	      }
	    },
	    enter (el) {
	      /* eslint-disable no-unused-vars */
	      let rf = el.offsetHeight; // 浏览器重绘
	      this.$nextTick(() => {
	        el.style.webkitTransform = 'translate3d(0, 0, 0)';
	        el.style.transform = 'translate3d(0, 0, 0)';
	        let inner = el.getElementsByClassName('inner-hook')[0];
	        inner.style.webkitTransform = 'translate3d(0, 0, 0)';
	        inner.style.transform = 'translate3d(0, 0, 0)';
	      });
	    },
	    afterEnter (el) {
	      let ball = this.dropBalls.shift();
	      if (ball) {
	        ball.show = false;
	        el.style.display = 'none';
	      }
	    },
	    toggleList () {
	      if (!this.totalCount) {
	        return;
	      }
	      this.fold = !this.fold;
	    },
	    empty () {
	      this.selectFoods.forEach((food) => {
	        food.count = 0;
	      });
	    },
	    hideList () {
	      this.fold = true;
	    },
	    pay () {
	      if (this.totalPrice < this.minePrice) {
	        return;
	      }
	      window.alert(`支付 ${this.totalPrice}元`);
	    }
	  },
	  components: {
	    'cartcontrol': Cartcontrol
	  }
	};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '../../common/stylus/mixin.styl'
	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px
		.content
			display: flex
			background: #141d27
			.content-left
				flex: 1
				/* overflow: hidden不可以加 一加就不显示了 */
				.logo-wrapper
					position: relative
					top: -10px
					float: left
					background:  #141d27
					width: 56px
					height: 56px
					box-sizing: border-box
					padding: 6px
					margin: 0 12px
					vertical-align: top
					border-radius: 50%
					.logo
						text-align: center
						width: 100%
						height: 100%
						background: rgba(255,255,255,0.4)
						border-radius: 50%
						&.heighlight
							background: rgb(0,160,220)
						.icon-shopping_cart
							color: #141d27
							display: block
							width: 100%
							height: 100%
							font-size: 24px
							line-height: 44px
							&.heighlight
								color:#fff 
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						text-align: center
						font-size: 9px
						line-height: 16px
						font-weight: 700
						color: #fff
						background: rgb(240,20,20)
						border-radius: 16px		
				.price
					float: left
					color: rgb(255,255,255)
					line-height: 24px
					font-size: 16px
					margin-top: 10px
					padding-left: 2px
					padding-right: 6px
					border-right: 1px solid rgb(255,255,255)
					font-weight: 200
					color: rgba(255,255,255,0.4)
					&.heighlight
						color: #fff
				.desc
					float: left
					color: rgba(255,255,255,0.4)
					line-height: 24px
					font-size: 14px
					margin-top: 10px
					padding-left: 4px
					&.enough
						color: rgb(255,255,255)
			.content-right
				flex: 0 0 105px
				background: rgba(0,0,0,0.2)
				width: 105px
				font-size: 12px
				font-weight: 700
				line-height: 46px 
				color: rgba(255,255,255,0.4)
				text-align: center
				&.enough
					background: #00b43c
					color: #fff
					font-weight: 700
		.ball-container
			.ball
				position:fixed
				left: 32px
				bottom: 22px
				z-index: 200
				transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)

				/* 小球的落点位置 */
				.inner
					width: 16px
					height: 16px
					border-radius: 50%
					background: rgb(0,160,220)
					transition: all 0.4s linear
		.shopcart-list
			position: absolute
			top: 0
			left: 0
			z-index: -1
			width: 100%

			transform:  translate3d(0,-100%,0) /* 没有动画的自然状态 在最顶端 */
			&.fold-enter-active,&.fold-leave-active
				transition: all 0.5s
			&.fold-enter,&.fold-leave-to/* 动画出场开始点 在最底端 结束后位置也在最低端 */
				transform: translate3d(0,0,0)
			.list-header
				height: 40px
				line-height: 40px
				background: #f3f5f7
				padding: 0 18px
				border-bottom: 1px solid rgba(7,17,27,0.1)
				overflow: hidden
				.title
					float: left
					font-size: 14px
					font-weight: 200
					color: rgb(7,17,27)
					padding-left: 18px
				.empty
					float: right
					right: 8px
					font-size: 12px
					color: rgb(0,160,220)
					padding: 0 10px
			.list-content
				padding: 0 18px
				max-height: 217px
				overflow: hidden
				background: #fff
				.food
					box-sizing: border-box	
					border-1px(rgba(7,17,27,0.1))
					padding: 12px 0
					-background: red
					.name
						font-size: 14px
						color: rgb(7,17,27)
						line-height: 24px
					.price
						position: absolute
						right: 90px
						bottom: 12px
						line-height: 24px
						font-size: 14px
						font-weight: 700	
						color: rgb(240,20,20)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 2px
	.list-mask
		position: fixed
		top: 0
		left: 0
		width: 100%				
		height: 100%
		z-index: 40

		background: rgba(7,17,27,0.6)
		opacity: 1
		&.fadebac-enter-active,&.fadebac-leave-active
			transition: all 0.5s
		&.fadebac-enter,&.fadebac-leave-to
			opacity: 0
			background: rgba(7,17,27,0)		
</style>	