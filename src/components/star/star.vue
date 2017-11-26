<template>	
	<div class='star' :class='starType'>
		<span v-for='itemClass in itemClasses' class='star-item' :class='itemClass' ></span>
	</div>
</template>

<script type='text/ecmascript-6'>
	const STAR_LENTH = 5;
	const CLS_ON = 'on';
	const CLS_HALF = 'half';
	const CLS_OFF = 'off';
	export default {
	  props: ['size', 'score'],
	  computed: {
	    'starType': function () {
	      return 'star-' + this.size;
	    },
	    'itemClasses': function () {
	      // 根据score得出itemClasses
	      var itemClasses = [];
	      var score = Math.floor(this.score * 2) / 2;
	      for (var i = 0; i < Math.floor(score); i++) {
	        itemClasses.push(CLS_ON);
	      }
	      if (score % 1 !== 0) {
	        itemClasses.push(CLS_HALF);
	      }
	      while (itemClasses.length !== STAR_LENTH) {
	        itemClasses.push(CLS_OFF);
	      }
	      return itemClasses;
	    }
	  }
	};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '../../common/stylus/mixin.styl'
	.star
		text-align: center
		margin-top: 16px
		.star-item
			display: inline-block
			background-repeat: no-repeat
		&.star-48
			.star-item
				width: 20px
				height: 20px
				margin-right: 22px
				&:last-child
					margin-right: 0
				background-size: 20px 20px
				&.on
					bg-image('star48_on')
				&.half
					bg-image('star48_half')
				&.off
					bg-image('star48_off')
		&.star-36
			.star-item
				width: 15px
				height: 15px
				margin-right: 10px
				&:last-child
					margin-right: 0
				background-size: 15px 15px
				&.on
					bg-image('star36_on')
				&.half
					bg-image('star36_half')
				&.off
					bg-image('star36_off')	
		&.star-24
			.star-item
				width: 10px
				height: 10px
				margin-right: 3px
				&:last-child
					margin-right: 0
				background-size: 10px 10px
				&.on
					bg-image('star24_on')
				&.half
					bg-image('star24_half')
				&.off
					bg-image('star24_off')									

</style>	