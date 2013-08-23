/*
* EASYFADER - An Ultralight Fading Slideshow For Responsive Layouts
* Version: 1.7
* License: Creative Commons Attribution 3.0 Unported - CC BY 3.0
* http://creativecommons.org/licenses/by/3.0/
* This software may be used freely on commercial and non-commercial projects with attribution to the author/copyright holder.
* Author: Patrick Kunka
* Copyright 2013 Patrick Kunka, All Rights Reserved
*/
	
(function($){
	
	$.fn.removeStyle = function(style){
		return this.each(function(){
			var $obj = $(this);
			style = style.replace(/\s+/g, '');
			var styles = style.split(',');
			$.each(styles,function(){
				var search = new RegExp(this.toString() + '[^;]+;?', 'g');
				$obj.attr('style', function(i, style){
					if(style) return style.replace(search, '');
			    });
			});
			if(typeof $obj.attr('style') !== 'undefined'){
				var cleanStyle = $obj.attr('style').replace(/\s{2,}/g, ' ').trim();
				$obj.attr('style', cleanStyle);
				if(cleanStyle == ''){
					$obj.removeAttr('style');
				};
			}
		});
    };

	function prefix(el){
		var prefixes = ["Webkit", "Moz", "O", "ms"];
		for (var i = 0; i < prefixes.length; i++){
			if (prefixes[i] + "Transition" in el.style){
				return '-'+prefixes[i].toLowerCase()+'-'; 
			};
		}; 
		return "transition" in el.style ? "" : false;
	};
	
	EasyFader = function(){
		this.slideDur = 7000,
		this.effectDur = 800,
		this.onChangeStart = null,
		this.onChangeEnd = null,
		this.slideSelector = '.slide',
		this.changing = false,
		this.effect = 'fade',
		this.firstLoad = true,
		this.autoCycle = true,
		this.slideTimer = null,
		this.activeSlide = null,
		this.newSlide = null,
		this.$slides = null,
		this.totalSlides = null,
		this.$pagerList = null,
		this.$pagers = null;
	};
	
	EasyFader.prototype = {
		constructor: EasyFader,
		init: function(domNode, settings){
			var self = this;
			
			if(settings){
				$.extend(self, settings);
			};
			self.$container = $(domNode);
			
			self.$slides = self.$container.find(self.slideSelector);
			self.totalSlides = self.$slides.length;
			self.$pagerList = self.$container.find('.pager_list');
			self.prefix = $.support.leadingWhitespace ? prefix(self.$container[0]) : false;
			for(var i = 0; i < self.totalSlides; i++){
				self.$pagerList
					.append('<li class="pager" data-target="'+i+'">'+(i+1)+'</li>');
			};
			if(typeof self[self.effect+'Init'] !== 'undefined'){
				self[self.effect+'Init']();
			};
			if(typeof self.activeSlide !== 'undefined'){
				self.activeSlide = 0;
			};
			self.bindHandlers();
			self.$pagers = self.$pagerList.find('.pager');
			self.$pagers.eq(self.activeSlide).addClass('active');
			self.fadeSlides(self.activeSlide+1, 0);
		},
		bindHandlers: function(){
			var self = this;
			self.$container.find('.pager').on('click',function(){
				var target = $(this).attr('data-target');
				clearTimeout(self.slideTimer);
				self.changeSlides(target);
			});
			$(window).on('keydown', function(e){
				var key = e.keyCode;
				if(key == 39 || key == 37){
					var dir = key == 39 ? 'next' : 'prev';
					clearTimeout(self.slideTimer);
					self.changeSlides(dir);
				};
			});
		},
		cleanUp: function(activeNdx, newNdx){
			var self = this;
			if(self.firstLoad){
				self.fadeCleanUp(activeNdx, newNdx);
			} else {
				self[self.effect+'CleanUp'](activeNdx, newNdx);
			};
			self.activeSlide = newNdx;
			self.changing = false;
			if(typeof self.onChangeEnd == 'function'){
				self.onChangeEnd.call(this, self.$slides.eq(self.activeSlide));
			};
			self.firstLoad = false;
			if(self.autoCycle){
				self.waitForNext();
			};
		},
		fadeCleanUp: function(activeNdx, newNdx){
			var self = this;
			
			self.$slides.eq(activeNdx).removeStyle('opacity, z-index');
			self.$slides.eq(newNdx).removeStyle(self.prefix+'transition, transition');
		},
		animateSlides: function(activeNdx, newNdx){
			var self = this;
			
			if(self.changing || activeNdx == newNdx){
				return false;
			};
			self.changing = true;
			self.$pagers.removeClass('active').eq(self.newSlide).addClass('active');
			if(typeof self.onChangeStart == 'function' && !self.firstLoad){
				self.onChangeStart.call(this, self.$slides.eq(self.newSlide));
			};
			
			self[self.effect+'Slides'](activeNdx, newNdx);
		},
		fadeSlides: function(activeNdx, newNdx){
			var self = this;
			
			self.$slides.eq(activeNdx).css('z-index', 2);
			self.$slides.eq(newNdx).css('z-index', 3);
			if(!self.prefix){
				self.$slides.eq(newNdx).animate({'opacity': 1}, self.effectDur,
				function(){
					self.cleanUp(activeNdx, newNdx);
				});
			} else {
				var styles = {};
				styles[self.prefix+'transition'] = 'opacity '+self.effectDur+'ms';
				styles['opacity'] = 1;
				self.$slides.eq(newNdx).css(styles);
				var fadeTimer = setTimeout(function(){
					self.cleanUp(activeNdx, newNdx);
				},self.effectDur);
			};
		},
		changeSlides: function(target){
			var self = this;
			
			if(target == 'next'){
				self.newSlide = self.activeSlide + 1;
				if(self.newSlide > self.totalSlides - 1){
					self.newSlide = 0;
				}
			} else if(target == 'prev'){
				self.newSlide = self.activeSlide - 1;
				if(self.newSlide < 0){
					self.newSlide = self.totalSlides - 1;
				};
			} else {
				self.newSlide = target;
			};
			self.animateSlides(self.activeSlide, self.newSlide);
		},
		waitForNext: function(){
			var self = this;
			self.slideTimer = setTimeout(function(){
				self.changeSlides('next');
			},self.slideDur);
		},
		getPrefixedCSS: function(property, value, prefixValue){
			var self = this,
				styles = {};
			
			for(i = 0; i < 2; i++){
				var prefix = i == 0 ? self.prefix : '';
				prefixValue ? styles[prefix+property] = prefix+value : styles[prefix+property] = value;
			};
			return styles;
		}
	};
	
	$.fn.easyFader = function(settings){
		return this.each(function(){
			var instance = new EasyFader();
			instance.init(this, settings);
		});
	};
})(jQuery);