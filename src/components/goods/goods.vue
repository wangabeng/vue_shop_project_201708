<template>	
	<div class='goods'>
		<div class='menu-wrapper' ref='menu-wrapper'>
			<ul class='menu-main'>
				<li v-for='(value,index) in goods' class='menu-item' :class='{"current": currentIndex == index}' @click='selectMenu(index,$event)'>
					<span class='menu-text border-1px'><span v-if='value.type>0' :class='classMap[index]' class='menu-icon'></span>{{ value.name }}</span>
				</li>
			</ul>
		</div>
		<div class='foods-wrapper' ref='foods-wrapper'>
			<ul>
				<li v-for='item in goods' class='food-list food-list-hook'>
					<h2 class='title'>{{ item.name }}</h2>
					<ul class='food-main'>
						<li v-for='foods in item.foods' class='border-1px' @click='selectFood(foods,$event)'>
							<div class='icon'>
								<img :src='foods.icon'>
							</div>
							<div class='content'>
								<h2 class='name'>{{ foods.name }}</h2>
								<p class='description'>{{ foods.description }}</p>
								<div class='extra'>
									<span class='sellCount'>月售{{ foods.sellCount }}</span>
									<span class='rating'>好评率{{ foods.rating }}</span>
								</div>
								<div class='price'>
									<span class='sale'>¥<span class='sale-price'>{{ foods.price }}</span></span>
									<span v-if='foods.oldPrice' class='oldprice'>¥{{ foods.oldPrice }}</span>							
								</div>
								<div class='cartcontrol-wrapper'>
									<cartcontrol :food='foods'></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart :seller='seller' :select-foods='selectFoods' ref='shopCart'></shopcart>
		<food :food='selectedFood' ref='food'></food>
	</div>
</template>

<script type='text/ecmascript-6'>
	// import Vue from 'vue';
	import BScroll from 'better-scroll'; // 1 引入
	import Shopcart from '../shopcart/shopcart'; // 1 引入
	import Cartcontrol from '../cartcontrol/cartcontrol';
	import Food from '../food/food';

	const ERR_OK = 0;
	// const eventHub = new Vue();
	export default {
	  props: ['seller'],
	  data () {
	    return {
	      'goods': [],
	      listHeight: [],
	      scrollY: 0,
	      selectedFood: {}
	    };
	  },
	  created () {
	    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	    this.$http.get('/api/goods').then((res) => {
	      if (ERR_OK === res.data.errno) {
	        this.goods = res.data.data;
	        // console.log('goods:', this.goods);
	        this.$nextTick(() => {
	          this._initScroll();
	          this._calculateHeight();
	        });
	      }
	    });
	  },
	  methods: {
	    _initScroll () {
	      if (!this.menuScroll) {
	        this.menuScroll = new BScroll(this.$refs['menu-wrapper'], {
	          click: true
	        }); // this.$refs.menuWrapper 这样写就报错
	      } else {
	        this.menuScroll.refresh();
	      }
	      if (!this.foodsScroll) {
	        this.foodsScroll = new BScroll(this.$refs['foods-wrapper'], {
	          click: true,
	          probeType: 3
	        });
	      } else {
	        this.foodsScroll.refresh();
	      }
	    },
	    _calculateHeight () {
	      let foodlist = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
	      let height = 0;
	      this.listHeight.push(height);
	      for (let i = 0; i < foodlist.length; i++) {
	        let item = foodlist[i];
	        height += item.clientHeight;
	        this.listHeight.push(height);
	      }
	      // 添加滚动监听
	      this.foodsScroll.on('scroll', (pos) => {
	        this.scrollY = Math.abs(Math.round(pos.y));
	      });
	    },
	    selectMenu (index, event) {
	      if (!event._constructed) {
	        return;
	      }
	      // console.log(index);
	      let foodlist = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
	      let el = foodlist[index];
	      this.foodsScroll.scrollToElement(el, 300);
	    },
	    // 商品详情页
	    selectFood (food, event) {
	      if (!event._constructed) {
	        return;
	      }
	      // console.log(food);
	      this.selectedFood = food;
	      this.$refs.food['show']();
	    }
	  },
	  computed: {
	    currentIndex () {
	      for (let i = 0; i < this.listHeight.length; i++) {
	        let height1 = this.listHeight[i];
	        let height2 = this.listHeight[i + 1];
	        // console.log('height1', height1);
	        // console.log('height2', height2);
	        // console.log('scrollY', this.scrollY);
	        if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
	          return i;
	        }
	      }
	      return 0;
	    },
	    selectFoods () {
	      let foods = [];
	      this.goods.forEach((good) => {
	        good.foods.forEach((food) => {
	          if (food.count) {
	            foods.push(food);
	          }
	        });
	      });
	      return foods;
	    }
	  },
	  components: {
	    'shopcart': Shopcart,
	    'cartcontrol': Cartcontrol,
	    'food': Food
	  }
	};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '../../common/stylus/mixin.styl'
	.goods
		display: flex
		position: absolute
		top: 177px
		bottom: 46px
		width: 100%
		overflow: hidden

		.menu-wrapper
			flex: 0 1 80px
			width: 80px /* 兼容安卓浏览器 */
			background: #f3f5f7


			.menu-item
				display: table
				height: 54px
				width: 56px
				line-height: 14px
				font-size: 12px
				padding: 0 12px
				.menu-text
					display: table-cell
					border-1px(rgba(7,17,27,0.1))
					width: 56px
					vertical-align: middle
					font-size: 12px
					font-weight: 200
					line-height: 14px
					margin-left:4px
					text-align: center
					.menu-icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						background-repeat: no-repeat
						background-size: 12px 12px
						margin-left: 2px
						&.decrease							
							bg-image('decrease_3')
						&.discount
							bg-image('discount_3')
						&.special
							bg-image('special_3')
						&.invoice
							bg-image('invoice_3')
						&.guarantee
							bg-image('guarantee_3')
			.current /* 想要去掉激活状态的白线 需要把.current放到后面 */
				background: #fff
				color: #07111b
				line-height: 14px
				font-weight: 700
				position: relative
				margin-top: -1px
				z-index: 10
				&>.menu-text
					border-none()
		.foods-wrapper
			flex: 1	
			.food-list
				.title
					color: rgb(147,153,159)
					background-color: #f3f5f7
					padding-left: 14px
					border-left: 2px solid #d9dde1
					font-size: 12px
					line-height: 26px
				.food-main
					li
						display: flex
						align-items: flex-start
						border-1px(rgba(7,17,27,0.1))
						padding: 18px
						&:last-child
							borer-none()
						.icon
							flex: 0 1 57px
							img
								width: 57px
								height: 57px
								border-radius: 2px
						.content
							flex: 1
							padding-left: 10px
							.name
								font-size: 14px
								color: rgb(7,17,27)
								line-height: 14px
								padding-top: 2px
								padding-bottom: 8px
							.description
								font-size: 10px
								color: rgb(147,153,159)
								line-height: 18px
								padding-bottom: 8px
							.extra
								.sellCount, .rating
									font-size: 10px
									color: rgb(147,153,159)
									font-weight: normal
									line-height: 24px
								。rating
									padding-left: 12px	

							.price
								padding-bottom: 18p
								.sale
									font-size: 10px
									color: #f01414
									font-weight: normal
									line-height: 24px
									.sale-price
										font-weight: 700
										font-size: 14px

								.oldprice
									font-size: 0
									color: rgb(147,153,159)
									line-height: 24px
									text-decoration: line-through
							.cartcontrol-wrapper
								position: absolute
								right: 0
								bottom: 12px		


</style>	