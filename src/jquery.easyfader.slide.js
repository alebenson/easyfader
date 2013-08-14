/*
* EASYSLIDER
*/

(function($){
	if(typeof EasyFader === 'function'){
		$.extend(EasyFader.prototype,{
			slideSlides: function(activeNdx, newNdx, direction){
				
				var	self = this,
					$activeSlide = self.$slides.eq(activeNdx),
					$newSlide = self.$slides.eq(newNdx),
					$actors = $activeSlide.add($newSlide);
				
				if(!self.prefix){
					// IE
				} else {
						var activeX = activeNdx < newNdx ? '-100%' : '100%',
							newX = activeNdx < newNdx ? '100%' : '-100%';
						
						function applyTransitions(){
							var done = false;
							$actors
								.css(self.getPrefixedCSS('transition', 'transform '+self.effectDur+' ease-in-out' ,true))
								.bind('webkitTransitionEnd transitionend',function(e){
									if((e.originalEvent.propertyName == 'transform' || self.prefix+'transform') && !done){
										done = true;
										self.cleanUp(activeNdx, newNdx);
									};
								});
							requestAnimationFrame(animate);
						};
						
						function animate(){
							$activeSlide
								.css(self.getPrefixedCSS('transform','translate3d('+activeX+',0,0)'));
							$newSlide
								.css(self.getPrefixedCSS('transform','translate3d(0,0,0)'));
						};
						
						$newSlide
							.css({
								opacity:1,
								zIndex: 3
							})
							.css(self.getPrefixedCSS('transform','translate3d('+newX+',0,0)'));
						requestAnimationFrame(applyTransitions);
				};	
			},
			slideCleanUp: function(activeNdx, newNdx){
				var	self = this,
					$activeSlide = self.$slides.eq(activeNdx),
					$newSlide = self.$slides.eq(newNdx),
					$actors = $activeSlide.add($newSlide);
				
				$actors
					.unbind('transitionend otransitionend')
					.removeStyle(self.prefix+'transition, '+self.prefix+'transform, transition, transform');
					
				$activeSlide.removeStyle('opacity, z-index');
			}
		});
	} else {
		console.log('EasySlider requires EasyFader');
	};
})(jQuery);