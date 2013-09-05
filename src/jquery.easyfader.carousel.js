/*
* EASYFADER - "CAROUSEL" EXTENSION
* Version: 1.0
* License: Creative Commons Attribution 3.0 Unported - CC BY 3.0
* http://creativecommons.org/licenses/by/3.0/
* This software may be used freely on commercial and non-commercial projects with attribution to the author/copyright holder.
* Author: Patrick Kunka
* Copyright 2013 Patrick Kunka, All Rights Reserved
*/

(function($){
	if(typeof EasyFader === 'function'){		
		$.extend(EasyFader.prototype,{
			minimumSlides: 3,
			carouselInit: function(){
				var self = this;
				
				self.fadeOnLoad = false;
				self.$scrollWrapper = self.$slides.parent();
				self.carouselBuild();
			},
			carouselSlides: function(activeNdx, newNdx){
				var self = this;
				
				activeNdx = activeNdx ? activeNdx : 0;
				self.travel = activeNdx - newNdx;
				
				if(activeNdx == self.totalSlides-1 && newNdx == 0){
					self.travel = -1;
				} else if(activeNdx == 0 && newNdx == self.totalSlides-1){
					self.travel = 1;
				};
				
				var slideWidth = self.$slides.eq(0).outerWidth(),
					distance = self.travel * slideWidth;
				
				if(!self.prefix){
					var leftPos = self.$scrollWrapper.css('left');
						newLeftPos = (leftPos.slice(0, -2) * 1) + distance;
				
					self.$scrollWrapper
						.css('left',leftPos+'px')
						.animate({
							left: newLeftPos+'px'
						},
						self.effectDur, 
						function(){
							self.cleanUp(activeNdx, newNdx);
						});
				} else {
					var transitionCSS = self.getPrefixedCSS('transition', 'transform '+self.effectDur+' ease-in-out' ,true),
						transformCSS = self.getPrefixedCSS('transform', 'translateX('+distance+'px)');
				
					self.$scrollWrapper
						.css(transitionCSS)
						.bind('webkitTransitionEnd transitionend',function(e){
							if(e.originalEvent.propertyName == 'transform' || self.prefix+'transform'){
								self.$scrollWrapper.unbind('webkitTransitionEnd transitionend');
								self.cleanUp(activeNdx, newNdx);
							};
						});
					var delay = setTimeout(function(){
						self.$scrollWrapper.css(transformCSS);
					},10);
				};
			},
			carouselCleanUp: function(activeNdx, newNdx){
				var	self = this,
					travel = -self.travel > 0 ? -self.travel : self.travel;
					
				if(-self.travel > 0){
					for(i = 0; i<travel; i++){
						self.$scrollWrapper.find('.slide').eq(0).insertBefore(self.$filler);
					};
				} else {
					for(i = 0; i<travel; i++){
						self.$scrollWrapper.find('.slide').eq(self.totalActual -2).prependTo(self.$scrollWrapper);
					};
				};
				
				if(!self.prefix){
					self.$scrollWrapper.removeStyle('left');
				} else {
					self.$scrollWrapper.removeStyle(self.prefix+'transition, '+self.prefix+'transform, transition, transform');
				};
				
			},
			carouselBuild: function(){
				var self = this;
					
				for(i = self.totalSlides; i > 0; i--){
					self.$slides.eq(i - 1).clone().prependTo(self.$scrollWrapper);
				};
				
				self.$filler = self.$slides.eq(0).clone().appendTo(self.$scrollWrapper);
				
				self.totalActual = self.$scrollWrapper.find('.slide').length;
			}
		});
	} else {
		console.error('EasyFader core not found');
	};
})(jQuery);