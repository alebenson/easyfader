/*
* EASYFADER - An Ultralight Fading Slideshow For Responsive Layouts
* Version: 1.4
* License: Creative Commons Attribution 3.0 Unported - CC BY 3.0
* http://creativecommons.org/licenses/by/3.0/
* This software may be used freely on commercial and non-commercial projects with attribution to the author/copyright holder.
* Author: Patrick Kunka
* Copyright 2013 Patrick Kunka, All Rights Reserved
*/

(function($){
	function prefix(el){
		var prefixes = ["Webkit", "Moz", "O", "ms"];
		for (var i = 0; i < prefixes.length; i++){
			if (prefixes[i] + "Transition" in el.style){
				return '-'+prefixes[i].toLowerCase()+'-'; 
			};
		}; 
		return "transition" in el.style ? "" : false;
	};
	$.fn.removeStyle = function(style){
		return this.each(function(){
			var obj = $(this);
			style = style.replace(/\s+/g, '');
			var styles = style.split(',');
			$.each(styles,function(){
				var search = new RegExp(this.toString() + '[^;]+;?', 'g');
				obj.attr('style', function(i, style){
					if(style) return style.replace(search, '');
			    });
			});
		});
    };
	var methods = {
			init: function(settings){
				return this.each(function(){
					var self = this;
					methods.config = {
						slideDur: 7000,
						fadeDur: 800,
						onFadeStart: null,
						onFadeEnd: null,
						$container: $(self),
						slideSelector: '.slide',
						fading: false,
						firstLoad: true,
						slideTimer: null,
						activeSlide: null,
						newSlide: null,
						$slides: null,
						totalSlides: null,
						$pagerList: null,
						$pagers: null
					};
					var config = methods.config;
					if(settings){
						$.extend(config, settings);
					};
					config.$slides = config.$container.find(config.slideSelector);
					config.totalSlides = config.$slides.length;
					config.$pagerList = config.$container.find('.pager_list');
					config.prefix = $.support.leadingWhitespace ? prefix(config.$container[0]) : false;
					for(var i = 0; i < config.totalSlides; i++){
						config.$pagerList
							.append('<li class="pager" data-target="'+i+'">'+(i+1)+'</li>');
					};
					config.$container.find('.pager').on('click',function(){
						var target = $(this).attr('data-target');
						clearTimeout(config.slideTimer);
						methods.changeSlides(target);
					});
					config.$pagers = config.$pagerList.find('.pager');
					config.$pagers.eq(0).addClass('active');
					methods.animateSlides(1, 0);
				});
			},
			cleanUp: function(activeNdx, newNdx){
				var self = this,
					config = self.config;
				config.$slides.eq(activeNdx).removeStyle('opacity, z-index');
				config.$slides.eq(newNdx).removeStyle(config.prefix+'transition, transition');
				config.activeSlide = newNdx;
				config.fading = false;
				methods.waitForNext();
				if(typeof config.onFadeEnd == 'function'){
					config.onFadeEnd.call(this, config.$slides.eq(config.activeSlide));
				};
			},
			animateSlides: function(activeNdx, newNdx){
				var self = this,
					config = self.config;
				if(config.fading || activeNdx == newNdx){
					return false;
				};
				config.fading = true;
				if(typeof config.onFadeStart == 'function' && !config.firstLoad){
					config.onFadeStart.call(this, config.$slides.eq(config.newSlide));
				};
				config.$pagers.removeClass('active').eq(config.newSlide).addClass('active');
				config.$slides.eq(activeNdx).css('z-index', 2);
				config.$slides.eq(newNdx).css('z-index', 3);
				if(!config.prefix){
					config.$slides.eq(newNdx).animate({'opacity': 1}, config.fadeDur,
					function(){
						methods.cleanUp(activeNdx, newNdx);
					});
				} else {
					var styles = {};
					styles[config.prefix+'transition'] = 'opacity '+config.fadeDur+'ms';
					styles['opacity'] = 1;
					config.$slides.eq(newNdx).css(styles);
					var fadeTimer = setTimeout(function(){
						methods.cleanUp(activeNdx, newNdx);
					},config.fadeDur);
				};
			},
			changeSlides: function(target){
				var self = this,
					config = self.config;
				if(target == 'next'){
					config.newSlide = config.activeSlide + 1;
					if(config.newSlide > config.totalSlides - 1){
						config.newSlide = 0;
					}
				} else if(target == 'prev'){
					config.newSlide = config.activeSlide - 1;
					if(config.newSlide < 0){
						config.newSlide = config.totalSlides - 1;
					};
				} else {
					config.newSlide = target;
				};
				methods.animateSlides(config.activeSlide, config.newSlide);
			},
			waitForNext: function(){
				var self = this,
					config = self.config;
				config.firstLoad = false;
				config.slideTimer = setTimeout(function(){
					methods.changeSlides('next');
				},config.slideDur);
			}
		};
	$.fn.easyFader = function(settings){
		return methods.init.apply(this, arguments);
	};
})(jQuery);