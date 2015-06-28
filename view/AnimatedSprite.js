// Provides control AnimatedSprite.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'],
    function(jQuery, Control) {
        "use strict";

        var AnimatedSprite = Control.extend("view.AnimatedSprite", {
            metadata: {

                properties: {
                    
                    src : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
               
			        width : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null},
	
			        height : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null},
                    
                    repeat: {
                        type: "boolean",
                        defaultValue: true
                    },
                    delayMs: {
                        type: "int",
                        defaultValue: 500
                    },
                    stepsX: {
                        type: "int",
                        defaultValue: 0
                    },
                    stepsY: {
                        type: "int",
                        defaultValue: 1
                    },
                    startX: {
                        type: "int",
                        defaultValue: 0
                    },
                    startY: {
                        type: "int",
                        defaultValue: 0
                    },
                    stepWidth: {
                        type: "int",
                        defaultValue: 0
                    },
                    stepHeight: {
                        type: "int",
                        defaultValue: 0
                    },
                    animateOnce: {
                        type: "boolean",
                        defaultValue: false
                    },
                },
                events: {
                    /**
        			 * Event is fired when the user clicks on the control.
        			 */
			        press : {},
			        
			        animationFinished : {},
			        animationStarted : {}
                }
            }
        });

// /////////////////////////////////////////////////////////////////////////////
// /// Control Overrides
// /////////////////////////////////////////////////////////////////////////////

        AnimatedSprite.prototype.init = function() {
            this._initialAnimationFinished = false;
        };

        AnimatedSprite.prototype.ontap = function(oEvent) {
    		this.firePress({/* no parameters */});
    	};

        AnimatedSprite.prototype.onAfterRendering = function() {
            
			var $DomNode = this.$();
	
			// bind the load and error event handler
			$DomNode.on("load", jQuery.proxy(this.onload, this));
			$DomNode.on("error", jQuery.proxy(this.onerror, this));
	
			var oDomRef = this.getDomRef();
	
			// if image has already been loaded and the load or error event handler hasn't been called, trigger it manually.
			if (oDomRef.complete && !this._defaultEventTriggered && oDomRef.naturalWidth !== 1) {
	
				// need to use the naturalWidth property instead of jDomNode.width(),
				// the later one returns positive value even in case of broken image
				$DomNode.trigger(oDomRef.naturalWidth > 1 ? "load" : "error");	//  image loaded successfully or with error
			}
        };

        /**
    	 * Function is called when image is loaded successfully.
    	 *
    	 * @param {jQuery.Event} oEvent
    	 * @private
    	 */
    	AnimatedSprite.prototype.onload = function(oEvent) {	
    		if (!this._defaultEventTriggered) {
    			this._defaultEventTriggered = true;
    		}
    		
    		var $DomNode = this.$(),
    			oDomRef = $DomNode[0];
    
            //get set width and height and set it
            //for the step sizes (sizes of individual images in the sprite sheet)
            var width = $DomNode.width();
            this.setStepWidth(width);
            var height = $DomNode.height();
            this.setStepHeight(height);
            
            //get the background size
            //once the callback is called the image is ready to play the animation
            var that = this;
            this._getBackgroundSize(function(oBackgroundSize){
                if(oBackgroundSize.width > 0 && oBackgroundSize.height > 0){
                    that._oBackgroundSize = oBackgroundSize;
                    //background image loaded
                    //start the animation if once if animateOnce property is set
                    if (that.getAnimateOnce() && that._initialAnimationFinished === false) {
                        that._initialAnimationFinished = true;
                        that.stopAnimation();
                        that.startAnimation();
                    }
                }
            });
    	};

        /**
    	 * Function is called when error occurs during image loading.
    	 *
    	 * @param {jQuery.Event} oEvent
    	 * @private
    	 */
    	AnimatedSprite.prototype.onerror = function(oEvent) {
    	
    		// This is used to fix the late load event handler problem on ios platform, if the event handler
    		// has not been called right after image is loaded with errors, event is triggered manually in onAfterRendering
    		// method.
    		if (!this._defaultEventTriggered) {
    			this._defaultEventTriggered = true;
    		}
    	};
        
// /////////////////////////////////////////////////////////////////////////////
// /// Public functions
// /////////////////////////////////////////////////////////////////////////////
        
        AnimatedSprite.prototype.isAnimationRunning = function() {
            if (this._nIntervId) {
                return true;
            } else {
                return false;
            }
        };
        
        AnimatedSprite.prototype.startAnimation = function() {
            if(this.isAnimationRunning()){
                return;
            }

            var that = this;
            this._currentStepX = this.getStartX();
            this._currentStepY = this.getStartY();
            this._nIntervId = setInterval(function() {
                that._animateNextStep();
            }, that.getDelayMs());
            this.fireAnimationStarted({/* no parameters */});
        };

        AnimatedSprite.prototype.stopAnimation = function() {
            if(this.isAnimationRunning() === false){
                //animation not running
                return;
            }

            window.clearInterval(this._nIntervId);
            this._nIntervId = null;

            this.$().css("background-position-x", "" + 0 + "px");
            this.$().css("background-position-y", "" + 0 + "px");
            this.fireAnimationFinished({/* no parameters */});
        };

// /////////////////////////////////////////////////////////////////////////////
// /// Private functions
// /////////////////////////////////////////////////////////////////////////////

        AnimatedSprite.prototype._animateNextStep = function() {
            //var width = this.getWidth();
            this._currentStepX++;

            //end of line?
            if (this._currentStepX >= this.getStepsX()) {
                //next line
                this._currentStepY++;
                this._currentStepX = this.getStartX();

                //start from 0,0?
                if (this._currentStepY >= this.getStepsY()) {
                    this._currentStepY = this.getStartY();
                    if (this.getRepeat() === false) {
                        //stop animation
                        this.stopAnimation();
                        return;
                    }
                }
            }

            this.$().css("background-position-x", "" + this._currentStepX * this.getStepWidth() + "px");
            this.$().css("background-position-y", "" + this._currentStepY * this.getStepHeight() + "px");
        };

    	AnimatedSprite.prototype._getBackgroundSize = function(fCallback) {
            var img = new Image();
            var $DomNode = this.$();
              
            img.onload = function () {
                // call the callback with the width and height
                fCallback({ width: this.width, height: this.height });
            }
            // extract image source from css using one, simple regex
            img.src = $DomNode.css('background-image').replace(/url\(['"]*(.*?)['"]*\)/g, '$1');
        }

        return AnimatedSprite;

    }, /* bExport= */ true);
