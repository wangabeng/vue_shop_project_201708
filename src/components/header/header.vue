<template>	
	<div class='header'>
	    <div class="content-wrapper">
	      <div class="avatar">
	      	<img :src="seller.avatar">
	      </div>
	      <div class="content">
	         <div class="title">
	            <span class='brand'></span>
	            <span class='name'>{{ seller.name }}</span>
	         </div>
	         <div class="description">{{ seller.description }} / {{ seller.deliveryTime }}分钟送达</div> 
	         <div class="support" v-if='seller.supports'>
	            <span class='icon' :class='classMap[seller.supports[0].type]'></span>
	            <span class='description'>{{ seller.supports[0].description }}</span>
	         </div>
	      </div>
          <div class='support-count' v-if='seller.supports'  @click='showDetail'>
         	<span class='count'>{{ seller.supports.length }}个</span>
         	<i class='icon-keyboard_arrow_right arrow'></i>
          </div> 
	    </div>

	    <div class="notice" @click='showDetail'>
	    	<span class='noticeicon'></span>
	    	<span class='noticetext'>{{ seller.bulletin }}</span>
	    	<i class='icon-keyboard_arrow_right notice-arrow'></i>
	    </div> 
	    <img class='headerbcg' :src='seller.avatar'>

	    <transition name='fade'>
	    <div class='detail' v-show='detailShow'>
	    	<div class='detail-wrapper clearfix'>
	    		<div class='detail-main'>
					<h1 class='h1-title'>{{ seller.name }}</h1>
					<star :size='48' :score='seller.score'></star>
					<div class='title'>
						<div class='line'></div>
						<div class='text'>优惠信息</div>
						<div class='line'></div>
					</div>
					<div class='support-list'>
						<ul>
							<li v-for='(list,index) in seller.supports' :class='classMap[index]'>
								<span class='list-icon'></span>
								<span class='list-text'>{{ list.description }}</span>
							</li>	
						</ul>
					</div>
					<div class='notice-title'>
						<div class='line'></div>
						<div class='text'>商家公告</div>
						<div class='line'></div>
					</div>
					<div class='notice-content'>
						<p class='notice-main'>{{ seller.bulletin }}{{ seller.bulletin }}{{ seller.bulletin }}{{ seller.bulletin }}{{ seller.bulletin }}{{ seller.bulletin }}{{ seller.bulletin }}{{ seller.bulletin }}</p>
					</div>					
	    		</div>
	    	</div>
	    	<div class='detail-close'>
	    		<i class='icon-close' @click='hideDetail()'></i>
	    	</div>
	    </div> 
	    </transition>
	</div>
</template>

<script type='text/ecmascript-6'>
	import Star from '../star/star.vue';
	export default {
	  props: ['seller'],
	  data () {
	    return {
	      'detailShow': false
	    };
	  },
	  created () {
	    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	  },
	  methods: {
	    showDetail: function () {
	      this.detailShow = true;
	    },
	    hideDetail: function () {
	      this.detailShow = false;
	    }
	  },
	  components: {
	    'star': Star
	  }
	};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '../../common/stylus/mixin.styl'
	/* vue 2.18以上版本css过渡效果用法见https://cn.vuejs.org/v2/guide/transitions.html */
	.fade-enter
		opacity: 0
	.fade-leave-to
		opacity: 0
	.fade-enter-active, .fade-leave-active
		transition: opacity 1s
	.header
		position: relative
		overflow: hidden
		background-color: rgba(7,17,27,0.5)
		color: rgb(255,255,255)
		.content-wrapper
			position: relative
			overflow: hidden
			padding: 24px 12px 18px 24px
			.avatar
				& > img
					width: 64px
					height:64px
					border-radius: 2px
				float: left

			.content
				float: left
				padding-left:16px
				.title
					.brand
						display: inline-block
						width: 30px
						height: 18px
						background-size: 30px 18px
						bg-image('./brand')
						background-repeat: no-repeat
						vertical-align: top	
					.name
						vertical-align: top	
						font-size: 16px
						font-weight: bold
						line-height: 16px
						margin-left:6px

				.description
					font-size: 12px
					font-weight: 100
					line-height: 12px
					margin-top: 8px	
				.support
					font-size: 10px
					font-weight: 100
					line-height: 12px
					margin-top: 10px
				.support
					.icon
						display: inline-block
						width: 12px
						height: 12px
						background-repeat: no-repeat
						background-size: 12px 12px
						margin-left: 2px
						vertical-align: top
						&.decrease							
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.special
							bg-image('special_1')
						&.invoice
							bg-image('invoice_1')
						&.guarantee
							bg-image('guarantee_1')
					.description
						font-size: 10px
						font-weight: 200
						line-height: 12px
						margin-left:4px
						vertical-align: top		
			.support-count
				position: absolute
				right: 12px
				bottom: 8px
				background-color: rgba(0,0,0,0.2)
				padding: 0 10px
				border-radius: 12px
				.count
					font-size: 10px
					font-weight: 200
					line-height: 24px
					vertical-align: top	
				.arrow
					font-size: 10px
					font-weight: 200
					line-height: 24px
		.notice
			position: relative
			background: rgba(7,17,27,0.2)
			padding: 0 22px 0 12px
			white-space: nowrap
			overflow: hidden
			text-overflow: ellipsis
			height: 28px
			line-height: 28px
			.noticeicon
				display: inline-block
				width: 22px
				height: 12px
				bg-image('bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat
				vertical-align: top
				margin-top: 8px
			.noticetext
				font-size: 10px
				vertical-align: top
			.notice-arrow
				font-size: 10px
				margin-left: 4px
				right: 12px
				bottom: 6px
				position: absolute
		.headerbcg
			position: absolute
			width: 100%
			height: 100%
			top: 0
			left: 0	
			z-index: -1
			filter: blur(10px)	
		.detail
			position: fixed
			left: 0
			top: 0
			z-index:100
			background:rgba(7,17,27,0.8)
			height: 100%
			width: 100%	
			overflow: auto
			.detail-wrapper
				min-height: 100%
				width: 100%
				.detail-main
					margin-top: 64px
					padding-bottom: 64px
					.h1-title
						font-size: 16px
						line-height: 16px
						text-align: center
						font-weight: 700
					.title
						display: flex
						width: 80%
						margin: 28px auto 24px auto
						.line
							position: relative
							top: -6px
							flex: 1
							border-bottom: 1px solid rgba(255,255,255,0.2)
						.text
							padding: 0 12px
							font-size: 14px
					.notice-title
						display: flex
						width: 80%
						margin: 28px auto 24px auto
						.line
							position: relative
							top: -6px
							flex: 1
							border-bottom: 1px solid rgba(255,255,255,0.2)
						.text
							padding: 0 12px
							font-size: 14px									
					.support-list
						margin: 24px auto 0 auto
						padding: 0 12px
						width: 80%
						li
							padding-bottom: 12px
							&:last-child
								padding-bottom: 0
							.list-icon
								display: inline-block
								width: 16px
								height: 16px
								background-size: 16px 16px
								vertical-align: middle
								margin-left: 6px
							&.decrease
								.list-icon
									bg-image('decrease_4')
							&.discount
								.list-icon
									bg-image('discount_4')
							&.special
								.list-icon
									bg-image('special_4')
							&.invoice
								.list-icon
									bg-image('invoice_4')
							&.guarantee
								.list-icon
									bg-image('guarantee_4')		
							.list-text
								font-size: 12px
								font-weight: 200
								padding-left: 6px
					.notice-content
						width: 80%
						margin: 0 auto
						.notice-main
							font-size: 12px
							font-weight: 200
							line-height: 24px
							padding: 0 12px

			.detail-close
				position: relative
				width: 32px
				height: 32px
				margin: -64px auto 0 auto
				clear: both
				font-size: 32px
</style>