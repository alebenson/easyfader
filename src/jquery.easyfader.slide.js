/*
* EASYSLIDER
*/

(function($){
	if(typeof EasyFader === 'function'){
		$.extend(EasyFader.prototype,{
			slideSlides: function(activeNdx, newNdx){
				console.info(newNdx);
			},
			slideCleanUp: function(activeNdx, newNdx){
				
			}
		});
	} else {
		console.log('EasySlider requires EasyFader');
	};
})(jQuery);