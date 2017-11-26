<template>	
	<div class='cartcontrol'>
		<transition name='move-transition'>
			<div class='cart-decrease' v-show='food.count>0' @click.stop.prevent='decreaseCart($event)'>
				<span class='icon-remove_circle_outline inner'></span>
			</div>
		</transition>
		<div class='cart-count' v-show='food.count'>{{ food.count }}</div>
		<div class='cart-add icon-add_circle inner' @click.stop.prevent='addCart($event)'>
		</div>
	</div>
</template>

<script type='text/ecmascript-6'>
	import Vue from 'vue';
	export default {
	  props: ['food'],
	  methods: {
	    addCart (event) {
	      if (!event._constructed) {
	        // 如果不是自身点击事件派发的就返回false
	        return;
	      }
	      if (!this.food.count) {
	        Vue.set(this.food, 'count', 1); // 设置一个新的属性
	      } else {
	        this.food.count++;
	      }
	      // console.log(this.food);
	      // this.$emit('emitGoods', event.target);
	      this.$root.eventHub.$emit('cart.add', event.target);
	    },
	    decreaseCart (event) {
	      if (!event._constructed) {
	        return;
	      }
	      if (this.food.count) {
	        this.food.count--;
	      }
	    }
	  }
	};
</script>

<style lang='stylus' rel='stylesheet/stylus'>


	.cartcontrol
		overflow: hidden
		.cart-decrease
			float: left
			font-size: 24px
			line-height: 24px
			padding: 6px
			color: rgb(0,160,220)
			&.move-transition-enter-active,&.move-transition-leave-active
				opacity: 1
				transition: all .3s linear
				transform: translate3D(0,0,0) rotate(0) /* 开启硬件加速 让动画变得更流畅 */
				.inner
					opacity: 1
					transition: all .3s linear
					transform: translate3D(0,0,0) rotate(0)

			&.move-transition-enter,&.move-transition-leave-to /* 开场动画开始 和出场动画结束的时候 */
				transform: translate3D(24px,0,0) rotate(180deg)
				opacity: 0
				.inner
					opacity: 0
					transform: translate3D(24px,0,0) rotate(180deg)
		.cart-count
			float: left
			font-size: 10px
			text-align: center
			vertical-align: top
			line-height: 24px
			width: 12px
			height: 24px
			padding-top: 6px
			color: rgb(147,153,159)
		.cart-add
			float: left
			font-size: 24px
			line-height: 24px
			padding: 6px
			color: rgb(0,160,220)
</style>