/**
 * Lite-the-Way jQuery plugin
 * @author Michael Rosata
 * @email  mike@onethingsimple.com
 * @version 0.2
 * @since 1.11
 */
/* Notes
# Change log v0.2
# - Removed Overlay Color as on option on the plugin. This is an option that should be set through CSS. Using JS to change color settings is a bit too obtrusive.
# - Changed `margin` to represent the entire margin area, where before it only represented half
# - Fixed the disable feature. Call $(selector).litetheway('disable') to turn the plugin off 
*/

// Lite The Way jQuery plugin
(function ( $, window, undefined ) {
    "use strict";
    function LiteTheWay() {
        this.regional = [];
        this.regional[''] = {}; // There shouldn't be an localization needed for this plugin
        this._defaults = {
            // Pixels from the top of the plugin context container
            start          : 140,
            // Size of margin in pixel if the autoMargin is set to false
            margin         : 290,
            selector       : 'p',
            faded          : 'faded-class',
            active         : 'active-class',
            topMult        : 1,
            bottomMult     : 1,
            overlays       : true,
            auto           : 0.25,
            fixedMargin    : false,
            context        : document,
            initClass      : 'lite-the-way',
            overlayClass   : 'lite-the-way-overlay',
            overlayPadding : 10
        };
        
        $.extend(this._defaults, this.regional);
    }
     
    $.extend( LiteTheWay.prototype, {
        _pluginInit   : false,
        _windowHeight : $(window).height(),
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
            // Set the init class on every item in collection
            target.addClass(this.initClass);
            if (!this._pluginInit) {
                this.setDefaults( options );
                this._enablePlugin();
            }
            return target;
        },
        
        /**
         * Adds an element into the _collection so we don't have to rebuild every scroll
         * @param HTMLElement target element to add to _collection
         */
        _attachElements : function ( target ) {
            if ( !this._collection ) {
                // make a jQuery collection any elements with initClass
                this._collection = $('.'+plugin.initClass);
            }
            if ( target ){
                // Add the passed target/s into the jQuery collection
                this._collection = this._collection.add(target);
            }
            return this._collection;
        },
        
        _removeElements : function ( target ) {
            if ( !this._collection ) {
                // make a jQuery collection any elements with initClass
                this._collection = $('.'+plugin.initClass);
            } else if ( target ) {
                this._collection = this._collection.remove(target);
            }
            return this._collection;
        },
        
        /**Handle scroll, change vars, make adjustments
         * @param Obj e event Object
         */
        _scrollHandler : function (e) {
            var elemOffsetTop, elemOffsetBot, elemAboveLine, //this will be each element in the each loops top offset. IE: <p>
                cutoffElmPastBottom = this.cutoff,
                startMargin = this.start,
                endMargin = this.end || this.start,
                readingMargin = this.margin/2,
                pageOffset = this.pageOffset = +$(document).scrollTop(),
                documentHeight = this._documentHeight,
                windowHeight   = this._windowHeight,
                contextHeight = this._contextHeight,
                centerPage = this._centerPage,
                activeClass = this.active,
                bottomMult = this.bottomMult,
                topMult = this.topMult,
                fadedClass = this.faded,
                topOffset = this._topOffset,
                bottomOffset = this._bottomOffset,
                collection = this._collection,
                // Top of page > startMargin + the margin from top of context container to page start....
                // Bottom of page < end of context container minus endMargin 
                withinTheContext = (pageOffset > startMargin + topOffset && pageOffset < contextHeight + topOffset - ( endMargin + windowHeight) );
            
            
            /** Since we don't want to ask if 100 times. We ask 1 time */
            if ( withinTheContext) {
                // If we have overlays, show them
                $('.' + this.overlayClass + '').fadeIn(600);
                if (collection.length) {
                    collection.each(function (e) {
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
                }
            } else {
                // if we have overlays, hide them
                $('.' + this.overlayClass + '').fadeOut(400);

                // We are past top or bottom of context, so remove both fadedClass and activeClass
                if (collection.length) {
                    collection.each(function (e) {
                        $(this).removeClass(fadedClass).removeClass(activeClass);
                    });
                }
            }
        },
        
        /**
         * Redefine object properties that are dependant upon the size of the window
         * @param Obj e Event Object
         */
        _resizeHandler : function (e) {
            // pull the options into local scope
            var auto = this.auto,
                overlaySelect = '.'+this.overlayClass+'',
                overlayPadding = this.overlayPadding,
                windowHeight = this._windowHeight = $(window).height(),
                documentHeight = this._documentHeight = $(document).height(),
                centerPage  = this._centerPage = windowHeight/2,
                contextHeight = this._contextHeight = $(this.context).length ? $(this.context).height() : 0,
                topOffset = this._topOffset =  +$(this.context).offset().top,
                readingMargin = this.margin/2,
                bottomOffset = this._bottomOffset = ( documentHeight - ( topOffset + contextHeight ));
            console.log(centerPage);
            if (auto) {
                // If auto_margin defined, then we have to recalc margin heights
                readingMargin = auto >= 1 ? windowHeight / auto : windowHeight * auto;
                this.margin = parseInt(readingMargin * 2, 10);
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
        
        /**Setup Event handlers and change this._pluginInit to true
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
            if ( opts.context === document ) {
                $('body').prepend(overlays);
            } else {
                if ($(opts.context).length) {
                    $(opts.context).prepend(overlays);
                }
            }
            
            
            // Set the init state to true so we don't loop this over and over
            $( window ).resize();
            
            // setup user defined callbacks
            this._pluginInit = true;
        },
        
        /**Remove Event handlers and switch this._pluginInit false
         * @param  target [[Description]]
         */
        _disablePlugin : function( target ) {
            var fadedClass = this.faded || '',
                activeClass = this.active || '';
            // Turn off event handlers
            $( document ).off('scroll.litetheway');
            $( window ).off('resize.litetheway');
            // remove the overlays from the page
            if (this.overlays && $('.'+this.overlayClass).length) {
                $('.'+this.overlayClass).remove();
            }
            // remove the lite-the-way classes
            $('.lite-the-way').removeClass('lite-the-way ' + fadedClass + ' ' + activeClass);
            // set init to false so next time
            this._pluginInit = false;
        },
        
        /*I will do these another day*/
        _optionPlugin : function( target, options, value ) {},
        _destroyPlugin : function( target ) {}
    });
    
    var plugin = $.litetheway = new LiteTheWay();
    
    $.fn.litetheway = function ( options ) {
        options = options || {};
        if ( $.isPlainObject(options)) {
            if (plugin._pluginInit){
                plugin._disablePlugin;
            }
            var context = !!options.context ? options.context : document;
            plugin._attachElements( $(context).find(this) );
            return this.each( function() {
                plugin._attachPlugin( this, options );
            });
        } else {
            if (typeof options == 'string') {
                if ( $.isFunction( plugin['_'+options+'Plugin'] ) ) {
                    var userArgs = [this.selector];
                    if (arguments.length > 1) {
                        userArgs = userArgs.concat( Array.prototype.splice.call(arguments) );
                    }
                    plugin['_'+options+'Plugin']();
                }
            }
        }
        
    };
    
}(jQuery, window));