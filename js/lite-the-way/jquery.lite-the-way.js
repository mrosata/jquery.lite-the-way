// Lite The Way jQuery plugin
(function ( $, window, undefined ) {
    "use strict";
    function LiteTheWay() {
        this.regional = [];
        this.regional[''] = {}; // There shouldn't be an localization needed for this plugin
        this._defaults = {
            // Pixels from top of the 
            start    : 240,
            margin   : 135,
            faded    : 'fade-out-text',
            active   : 'active-text',
            topMult  : 1,
            bottomMult : 1,
            overlays : true,
            autoMargin  : 0.25,
            fixedMargin : false,
            document    : document,
            overlayClass : 'litetheway-overlay',
            overlayPadding : 10,
            overlayColor : false
        };
        
        $.extend(this._defaults, this.regional);
    }
     
    $.extend( LiteTheWay.prototype, {
        pluginInit   : false,
        initClass    : 'lite-the-way',
        windowHeight : $(window).height(),
        selector     : 'p',
        _topOffset   : 0,   // If context isn't document, then this will tell us how far down the page to start our plugins logic 
        _bottomOffset: 0,
        _contextHeight : 0, // The height of the element that holds our text
        // Callbacks, for hitting the top or bottom.
        _hitTop     : null,
        _hitBottom  : null,
        
        
        setDefaults : function( options ) {
            $.extend(this._defaults, options || {});
            $.extend(this, this._defaults);
            return this;
        },
        /**
         * Attach Elements to the LiteTheWay plugin
         * @param HTMLElement target  Current elm in the collection
         * @param Object options      User defined plugin config opts
         */
        _attachPlugin : function( target, options ) {
            target = $(target);
            if ( target.hasClass(this.initClass) ) {
                return; // We have already init this elm.
            }
            target.addClass(this.initClass);
            if (!this.pluginInit) {
                this.setDefaults( options );
                this._enablePlugin();
            }
        },
        
        /**Handle scroll, change vars, make adjustments
         * @param Obj e event Object
         */
        _scrollHandler : function (e) {
            var elemOffsetTop, elemOffsetBot, elemAboveLine, //this will be each element in the each loops top offset. IE: <p>
                cutoffElmPastBottom = this.cutoff,
                startMargin = this.start,
                endMargin = this.end || this.start,
                readingMargin = this.margin,
                pageOffset = this.pageOffset = +$(document).scrollTop(),
                documentHeight = this.documentHeight,
                windowHeight   = this.windowHeight,
                contextHeight = this._contextHeight,
                centerPage = this.centerPage,
                activeClass = this.active,
                bottomMult = this.bottomMult,
                topMult = this.topMult,
                fadedClass = this.faded,
                topOffset = this._topOffset,
                bottomOffset = this._bottomOffset,
                // Top of page > startMargin + the margin from top of context container to page start....
                // Bottom of page < end of context container minus endMargin 
                withinTheContext = (pageOffset > startMargin + topOffset && pageOffset < contextHeight + topOffset - ( endMargin + windowHeight) );
            
            /** Since we don't want to ask if 100 times. We ask 1 time */
            if ( withinTheContext ) {
                // If we have overlays, show them
                $('.' + this.overlayClass + '').fadeIn(600);
                $( this.selector, this.document ).each(function (e) {
                
                    elemOffsetTop = + $(this).offset().top;
                    if (cutoffElmPastBottom) {
                        elemOffsetBot = + elemOffsetTop + $(this).height();
                        elemAboveLine =  (Math.abs(elemOffsetBot - pageOffset) < centerPage + readingMargin*bottomMult);
                    } else {
                        elemAboveLine = true;
                    }
                    if ( elemAboveLine && elemOffsetTop > pageOffset && Math.abs(elemOffsetTop - pageOffset) > centerPage - (readingMargin*topMult) && Math.abs(elemOffsetTop - pageOffset) < centerPage + readingMargin*bottomMult ) {
                        $(this).removeClass(fadedClass).addClass(activeClass);
                    } else {
                        $(this).addClass(fadedClass).removeClass(activeClass);
                    }
                    
                });
            } else {
                // if we have overlays, hide them
                $('.' + this.overlayClass + '').fadeOut(600);
                
                // We are past top or bottom of context, so remove all lite-the-way classes
                $( this.selector, this.document ).each(function (e) {
                    $(this).removeClass(fadedClass).removeClass(activeClass);
                });
            }
        },
        
        /**
         * Redefine object properties that are dependant upon the size of the window
         * @param Obj e Event Object
         */
        _resizeHandler : function (e) {
            var auto = this.autoMargin,
                overlaySelect = '.'+this.overlayClass+'',
                windowHeight = this.windowHeight = $(window).height(),
                documentHeight = this.documentHeight = $(document).height(),
                centerPage  = this.centerPage = windowHeight/2,
                contextHeight = this._contextHeight = $(this.document).length ? $(this.document).height() : 0,
                topOffset = this._topOffset =  +$(this.document).offset().top,
                readingMargin = this.margin,
                bottomOffset = this._bottomOffset = ( documentHeight - ( topOffset + contextHeight ));
            
            if (auto) {
                // If auto_margin defined, then we have to recalc margin heights
                readingMargin = this.margin = auto >= 1 ? windowHeight / auto : windowHeight * auto;
            }
            
            $(overlaySelect+':eq(0)').css({
                'bottom' :  (centerPage + readingMargin * this.topMult) + 'px'
            });
            $(overlaySelect+':eq(1)').css({
                'top' :  (centerPage + readingMargin * this.bottomMult) + 'px'
            });
            
            // The document.scroll() fires here now, because on any resize, we need to also check the conditions in the scroll
            $( document ).scroll();
        },
        
        /**Setup Event handlers and change this.pluginInit to true
         * @param HTMLElement target 
         */
        _enablePlugin : function( target ) {
            var opts = this._defaults,
                overlays = '<div class="'+this.overlayClass+'"></div><div class="'+this.overlayClass+'"></div>';
            
            this.documentHeight = $(document).height();
            // Setup the event handlers that plugin uses to monitor state of page and calc locations of elems
            $( document ).on('scroll.litetheway', function (e) {
                plugin._scrollHandler();
            });
            $( window ).on('resize.litetheway', function (e) {
                plugin._resizeHandler();
            });
            // If the text area is document, prepend overlays to body, else put them inside where text is
            if ( opts.document === document )
                $('body').prepend(overlays);
            else
                $(opts.document).prepend(overlays);
            
            // Set the init state to true so we don't loop this over and over
            $( window ).resize();
            
            // setup user defined callbacks
            this.pluginInit = true;
        },
        
        /**Remove Event handlers and switch this.pluginInit false
         * @param {[[Type]]} target [[Description]]
         */
        _disablePlugin : function( target ) {
            // Turn off event handlers
            $( document ).off('scroll.litetheway');
            $( window ).off('resize.litetheway');
            // remove the overlays from the page
            $(overlays).remove();
            // remove the lite-the-way classes
            $('.lite-the-way').fadeOut();
            // set init to false so next time
            this.pluginInit = false;
        },
        
        /*I will do these another day*/
        _optionPlugin : function( target, options, value ) {},
        _destroyPlugin : function( target ) {}
    });
    
    var plugin = $.litetheway = new LiteTheWay();
    
    $.fn.litetheway = function ( options ) {
        if (plugin.pluginInit){
            plugin._disablePlugin;
        }
        return this.each( function() {
            plugin._attachPlugin( this, options || {} );
        });
    };
    
}(jQuery, window));

