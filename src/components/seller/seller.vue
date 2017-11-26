<template>	
	<div class='seller' ref='seller'>
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{ seller.name }}</h1>
				<div class="desc border-1px">
					<star :size='36' :score='seller.score'></star>
					<span class="text">({{ seller.ratingCount }})&nbsp;</span>
					<span class="text">月售{{ seller.sellCount }}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{ seller.minPrice }}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{ seller.deliveryPrice }}</span>元
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{ seller.deliveryTime }}</span>分钟
						</div>
					</li>
				</ul>
				<div class='favorite' @click='toggleFavorite($event)'>
					<span class='icon-favorite' :class='{"active":favorite}'></span>
					<span class='text'>{{ favoriteText }}</span>
				</div>
			</div>
			<split></split>
			<div class='bulletin'>
				<h1 class='title'>公告与活动</h1>
				<div class=content-wrapper>
					<p class='content'>{{ seller.bulletin }}</p>
				</div>
				<ul v-if='seller.supports' class='supports'>
					<li v-for='(list,index) in seller.supports' :class='classMap[index]' class='supports-item border-1px'>
						<span class='list-icon'></span>
						<span class='list-text'>{{ list.description }}</span>
					</li>	
				</ul>
			</div>
			<split></split>
			<div class='pics'>
				<h1 class='title'>商家实景</h1>
				<div class='pic-wrapper' ref='pic-wrapper'>
					<ul class='pic-list' ref='pic-list'>
						<li class='pic-item' v-for='pic in seller.pics'>
							<img :src='pic' width='120' height='90'>
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class='info'>
				<h1 class='title'></h1>
				<ul>
					<li class='info-item' v-for='info in seller.infos'>{{ info }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script type='text/ecmascript-6'>
	import Star from '../star/star';
	import Split from '../split/split';
	import BScroll from 'better-scroll';
	import {saveToLocal, loadFromLocal} from '../../common/js/store.js';

	export default {
	  data () {
	    return {
	      favorite: (() => {
	        return loadFromLocal(this.seller.id, 'favorite', false);
	      })()
	    };
	  },
	  computed: {
	    favoriteText () {
	      return this.favorite ? '已收藏' : '收藏';
	    }
	  },
	  props: {
	    seller: {
	      type: Object
	    }
	  },
	  methods: {
	    toggleFavorite (event) {
	      if (!event._constructed) {
	        return;
	      }
	      this.favorite = !this.favorite;
	      saveToLocal(this.seller.id, 'favorite', this.favorite);
	    }
	  },
	  watch: {
	    'seller' () {
	      this.$nextTick(() => {
	        this.sellerScroll.refresh();
	      });
	    }
	  },
	  created () {
	    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	  },
	  mounted () {
	    if (!this.sellerScroll) {
	      this.sellerScroll = new BScroll(this.$refs.seller, {
	        click: true
	      });
	    } else {
	      this.sellerScroll.refresh();
	    }
	    // 动态设置ul的宽度
	    if (this.seller.pics) {
	      let picWidth = 120;
	      let margin = 6;
	      let width = (picWidth + margin) * this.seller.pics.length - margin;
	      this.$refs['pic-list'].style.width = width + 'px';
	      // 设置图片(ul的父元素)X轴方向的滚动
	      this.$nextTick(() => {
	        if (!this.picScroll) {
	          this.picScroll = new BScroll(this.$refs['pic-wrapper'], {
	            scrollX: true,
	            eventPassthrough: 'vertical'
	          });
	        } else {
	          this.picScroll.refresh();
	        }
	      });
	    }
	  },
	  components: {
	    'star': Star,
	    'split': Split
	  }
	};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '../../common/stylus/mixin.styl'

	.seller
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.overview
			position: relative
			padding: 18px
			.title
				margin-bottom: 8px
				line-height: 14px
				color: rgb(7,17,27)
				font-size: 14px
			.desc
				padding-bottom: 18px
				line-height: 18px
				border-1px(rgba(7,17,27,0.1))
				font-size: 0
				.star
					display: inline-block
					margin-top: 2px
					margin-right: 10px
					vertical-align: top
				.text
					display: inline-block
					vertical-align: top
					line-height: 18px
					font-size: 10px
					color: rgb(77,85,93)
			.remark
				display: flex
				padding-top: 18px
				.block
					flex: 1
					text-align: center
					border-right: 1px solid rgba(7,17,27,0.1)
					&:last-child
						border: none
					h2
						margin-bottom: 4px
						line-height: 10px
						font-size: 10px
						color: rgb(147,153,159)
					.content
						line-height: 24px
						font-size: 10px
						color: rgb(7,17,27)
						.stress
							font-size: 24px
			.favorite
				position: absolute
				width: 50px
				right: 11px
				top: 18px
				text-align: center
				.icon-favorite
					display: block
					margin-bottom: 4px
					line-height: 24px
					font-size: 24px
					color: #d4d6d9
					&.active
						color: rgb(240,20,20)
					.text
						line-height: 10px
						font-size: 14px
						color: rgb(77,25,93)	
		.bulletin
			padding: 18px
			.title
				margin-bottom: 8px
				line-height: 14px
				color: rgb(7,17,27)
				font-size: 14px
			.content-wrapper
				padding: 0 12px 16px 12px
				border-1px(rgba(7,17,27,0.1))
				.content
					line-height: 24px
					font-size: 12px
					color: rgb(240,20,20)
			.supports
				margin: 24px auto 0 auto
				padding: 0 12px
				width: 80%
				.supports-item
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
		.pics
			padding: 18px
			.title
				margin-bottom: 12px
				line-height: 14px
				color: rgb(7,17,27)
				font-size: 14px
			.pic-wrapper
				width: 100%
				overflow: hidden
				.pic-list
					white-space: nowrap
					font-size: 0
					/* 宽度通过计算获得 */
					border: 1px solid red
					.pic-item
						display: inline-block
						margin-right: 6px
						width: 120px
						height: 90px
						&:last-child
							margin: 0
		.info
			padding: 18px 18px 0 18px
			color: rgb(7,17,27,0.1)
			.title
				padding-bottom: 12px
				line-height: 14px
				border-1px(rgba(7,17,27,0.1))
				font-size: 14px
			.info-item
				padding: 16px 12px
				line-height: 16px
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border: 0
					border: none		
</style>