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
			carouselInit: function(){
				var self = this;
				
					
			},
			carouselSlides: function(activeNdx, newNdx){
				var self = this;
				
				
				console.info(activeNdx);
				self.cleanUp(activeNdx, newNdx);
			},
			carouselCleanUp: function(activeNdx, newNdx){
				var	self = this;

				
				
			},
			carouselFillBlanks: function(){
				var self = this;

				
			}
		});
	} else {
		console.error('EasyFader core not found');
	};
})(jQuery);