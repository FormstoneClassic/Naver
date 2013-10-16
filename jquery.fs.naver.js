/*
 * Naver Plugin [Formstone Library]
 * @author Ben Plum
 * @version 0.0.9
 *
 * Copyright © 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
 
if (jQuery) (function($) {
	
	// Default Options
	var options = {
		animated: false,
		label: true,
		labelClosed: "Navigation",
		labelOpen: "Close"
	};
	
	// Public Methods
	var pub = {
		
		// Activate
		activate: function() {
			return $(this).each(function() {
				$(this).addClass("active")
					   .trigger("close.naver");
			});
		},
		
		// Deactivate
		deactivate: function() {
			return $(this).each(function() {
				$(this).removeClass("active")
					   .trigger("close.naver");
			});
		},
		
		// Destroy
		destroy: function() {
			return $(this).each(function() {
				var data = $(this).data("naver");
				
				data.$handle.remove();
				data.$container.contents()
							   .unwrap()
							   .unwrap();
				
				data.$nav.removeClass("active")
						 .off(".naver")
						 .removeData("naver");
			});
		}
	};
	
	// Private Methods
	
	// Initialize
	function _init(opts) {
		// Settings
		opts = $.extend({}, options, opts);
		
		// Apply to each element
		var $items = $(this);
		for (var i = 0, count = $items.length; i < count; i++) {
			_build($items.eq(i), opts);
		}
		return $items;
	}
	
	function _build($nav, opts) {
		if (!$nav.data("naver")) {
			// EXTEND OPTIONS
			$.extend(opts, $nav.data("naver-options"));
			
			opts.labelClosed = $nav.data("label-closed") || opts.labelClosed;
			opts.labelOpen = $nav.data("label-open") || opts.labelOpen;
			
			if (opts.animated) {
				$nav.addClass("animated");
			}
			
			$nav.addClass("naver")
				.wrapInner('<div class="naver-container" />')
				.wrapInner('<div class="naver-wrapper" />')
				.prepend('<span class="naver-handle">' + ((opts.label) ? opts.labelClosed : '') + '</span>');
			
			opts = $.extend({
				$nav: $nav,
				$container: $nav.find(".naver-container"),
				$wrapper: $nav.find(".naver-wrapper"),
				$handle: $nav.find(".naver-handle")
			}, opts);
			
			opts.$nav.on("touchstart.naver mousedown.naver", ".naver-handle", opts, _onClick)
					 .on("open.naver", opts, _open)
					 .on("close.naver", opts, _close)
					 .data("naver", opts);
			
			pub.activate.apply(opts.$nav);
		}
	}
	
	// Handle Click
	function _onClick(e) {
		e.preventDefault();
		e.stopPropagation();
		
		var $target = $(e.currentTarget),
			data = e.data;
		
		$(".naver").not(data.$nav)
				   .trigger("close.naver");
		
		if (data.$nav.hasClass("open")) {
			data.$nav.trigger("close.naver");
		} else {
			data.$nav.trigger("open.naver");
		}
	}
	
	// Open Nav
	function _open(e) {
		var data = e.data;
		data.$wrapper.css({ height: data.$container.outerHeight(true) });
		data.$nav.addClass("open");
		if (data.label) {
			data.$handle.html(data.labelOpen);
		}
	}
	
	// Close Nav
	function _close(e) {
		var data = e.data;
		data.$wrapper.css({ height: 0 });
		data.$nav.removeClass("open");
		if (data.label) {
			data.$handle.html(data.labelClosed);
		}
	}
	
	
	// Define plugin
	$.fn.naver = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};
})(jQuery);