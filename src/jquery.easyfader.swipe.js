/*
* EASYFADER - "SWIPE" EXTENSION
* Version: 1.0
* License: Creative Commons Attribution 3.0 Unported - CC BY 3.0
* http://creativecommons.org/licenses/by/3.0/
* This software may be used freely on commercial and non-commercial projects with attribution to the author/copyright holder.
* Author: Patrick Kunka
* Copyright 2013 Patrick Kunka, All Rights Reserved
*/

(function($){
	if(typeof EasyFader === 'function'){
		$.extend(EasyFader.prototype.handlers,{
			swipe: function(){
				var self = this,
					$body = $('body'),
					swipe = false,
					swipeX = false,
					startX,
					startY,
					endX,
					endY,
					travelX,
					firstE = false,
					getEvent = function(e){
						var eData = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						return eData;
					};

				self.$container.on('touchstart',function(e){
					swipe = true;
					e = getEvent(e);
					startX = e.pageX;
					startY = e.pageY;
				});

				$body.on('touchmove',function(e){
					if(swipe){

						var newE = getEvent(e);

						endX = newE.pageX;
						if(!firstE){
							endY = newE.pageY;
							firstE = true;
							travelY = endY - startY > 0 ? -(endY - startY) : endY - startY;
							travelX = endX - startX > 0 ? -(endX - startX) : endX - startX;
							angle = travelY/travelX;
							if(angle < 1){
								e.preventDefault();
								swipeX = true;
							};
						};
					};
				});

				$body.on('touchend',function(e){
					if(swipeX){
						swipe = false,
						swipeX = false,
						travelX = endX - startX;
						if(travelX > 15){
							self.changeSlides('prev');
						} else if(travelX < 15){
							self.changeSlides('next');
						};
					}
					firstE = false;
				});
			}
		});
	} else {
		console.error('EasyFader core not found');
	};
})(jQuery);