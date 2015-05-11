/*
 * Shopify JS for customizing Slick.js
 *   http://kenwheeler.github.io/slick/
 *   Untouched JS in assets/slick.min.js
 */

/*
 * Run function after window resize
 * http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed
 */
var afterResize=(function(){var t={};return function(callback,ms,uniqueId){if(!uniqueId){uniqueId="Don't call this twice without a uniqueId";}if(t[uniqueId]){clearTimeout(t[uniqueId]);}t[uniqueId]=setTimeout(callback,ms);};})();

var slickTheme = (function(module, $) {
  'use strict';

  // Public functions
  var init, onInit, beforeChange, afterChange;

  // Private variables
  var settings, $slider, $allSlides, $activeSlide, $slickDots, windowHeight, scrolled, $heroText, $heroImage, prefixedTransform;
  var currentActiveSlide = 0;

  // Private functions
  var cacheObjects, setFullScreen, sizeFullScreen, setParallax, calculateParallax, slickColors, fixIE8;

  /*============================================================================
   Initialise the plugin and define global options
  ==============================================================================*/
  cacheObjects = function () {
    slickTheme.cache = {
      $html      : $('html'),
      $window    : $(window),

      $heroImage : $('.hero__image')
    };

    slickTheme.vars = {
      slideClass      : 'slick-slide',
      activeClass     : 'slick-active',
      hiddenClass     : 'hero__slide--hidden',
      heroHeaderClass : 'hero__header'
    };
  };

  init = function (options) {
    cacheObjects();

    // Default settings
    settings = {
      // User options
      $element       : null,
      $headerClass   : null,
      fullscreen     : false,
      parallax       : false,

      // Private settings
      isTouch        : slickTheme.cache.$html.hasClass('supports-touch') ? true : false,

      // Slack options
      arrows         : false,
      dots           : true,
      adaptiveHeight : true
    };

    // Override defaults with arguments
    $.extend(settings, options);

    /*
     * Init slick slider
     *   - Add any additional option changes here
     *   - https://github.com/kenwheeler/slick/#options
     */
    settings.$element.slick({
      arrows         : settings.arrows,
      dots           : settings.dots,
      adaptiveHeight : settings.fullscreen ? false : settings.adaptiveHeight,
      draggable      : false,
      fade           : true,
      autoplay       : true,
      autoplaySpeed  : 7000,
      onInit         : this.onInit,
      onBeforeChange : this.beforeChange,
      onAfterChange  : this.afterChange
    });
  };

  onInit = function (obj) {
    $slider = obj.$slider;
    $allSlides = $slider.find('.' + slickTheme.vars.slideClass);
    $activeSlide = $slider.find('.' + slickTheme.vars.activeClass);
    $slickDots = $slider.find('.slick-dots');

    if (!settings.isTouch) {
      $allSlides.addClass(slickTheme.vars.hiddenClass);
      $activeSlide.removeClass(slickTheme.vars.hiddenClass);
    }

    if (settings.fullscreen) {
      setFullScreen();
      slickColors();

      if (slickTheme.cache.$html.hasClass('lt-ie9')) {
        fixIE8();
      }
    }

    if (settings.parallax && slickTheme.cache.$html.hasClass('supports-csstransforms3d')) {
      setParallax();
    }
  };

  beforeChange = function (evt, currentSlide, nextSlide) {
    if (settings.fullscreen) {
      var $nextSlide = $allSlides.eq(nextSlide),
          newTextColor = $nextSlide.data('color');

      slickColors(newTextColor);
    }

    if (!settings.isTouch) {
      $allSlides.removeClass(slickTheme.vars.hiddenClass);
    }

    // Set upcoming slide as index
    currentActiveSlide = nextSlide;

    // Set new active slide to proper parallax position
    calculateParallax(settings.fullscreen, currentActiveSlide);
  };

  afterChange = function (evt, currentSlide) {
    if (!settings.isTouch) {
      $activeSlide = $slider.find('.' + slickTheme.vars.activeClass);
      $allSlides.addClass(slickTheme.vars.hiddenClass);
      $activeSlide.removeClass(slickTheme.vars.hiddenClass);
    }
  };

  setFullScreen = function () {
    sizeFullScreen();

    // Move header into hero wrapper and absolutely position
    settings.$headerClass.addClass(slickTheme.vars.heroHeaderClass).prependTo(settings.$element);

    // Resize hero after screen resize
    slickTheme.cache.$window.resize(function () {
      afterResize(function() {
        sizeFullScreen();
      }, 200, 'sizeFullScreen');
    });
  };

  sizeFullScreen = function () {
    windowHeight = slickTheme.cache.$window.height();
    settings.$element.css('height', windowHeight);
  };

  setParallax = function () {
    prefixedTransform = theme.vendorPrefix ? theme.vendorPrefix('transform') : 'transform';

    $heroText = $('.hero__text-content');
    $heroImage = $('.hero__image');

    slickTheme.cache.$window.on('scroll', function(evt) {
      calculateParallax(settings.fullscreen, currentActiveSlide);
    });
  };

  calculateParallax = function (parallaxImage, currentSlide) {
    scrolled = slickTheme.cache.$window.scrollTop();

    $heroText[currentSlide].style[prefixedTransform] = 'translate3d(0, ' + scrolled / 8 + 'px, 0)';
    if (parallaxImage) {
      $heroImage[currentSlide].style[prefixedTransform] = 'translate3d(0, ' + scrolled / 4.5 + 'px, 0)';
    }
  };

  slickColors = function (color) {
    // Find the new color if one isn't sent
    if (!color) {
      var color = $('.slick-active').attr('data-color');
    }

    // Set an is-light or is-dark class on the header and nav dots to update colors
    settings.$headerClass.removeClass('is-light is-dark').addClass(color);
    if ($slickDots.length) {
      $slickDots.removeClass('is-light is-dark').addClass(color);
    }
  };

  fixIE8 = function () {
    // Add an -ms- filter to make background-size: cover (mostly) work
    slickTheme.cache.$heroImage.each(function() {
      var $el = $(this),
          img = $el.attr('data-image');

      $el.css({
        'background-image': 'none',
        'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + img + '", sizingMethod="scale")'
        });
    });
  };

  module = {
    init: init,
    onInit: onInit,
    beforeChange: beforeChange,
    afterChange: afterChange
  };

  return module;

}(slickTheme || {}, jQuery));
