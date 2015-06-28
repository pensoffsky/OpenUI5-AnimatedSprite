// Provides default renderer for control view.AnimatedSpriteRenderer
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
		"use strict";

		var AnimatedSpriteRenderer = {};

		AnimatedSpriteRenderer.render = function(oRm, oImage) {
			oRm.write("<img");
			
			//write a 1x1px transparent gif into src otherwise the img behaves strange
			var sTransparentGif = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
			oRm.writeAttributeEscaped("src", sTransparentGif);
			oRm.writeControlData(oImage);

			oRm.addClass("viewSprite");
			oRm.addClass("sapMImg");
			if (oImage.hasListeners("press") || oImage.hasListeners("tap")) {
				oRm.addClass("sapMPointer");
			}

			oRm.writeClasses();

			var tooltip = oImage.getTooltip_AsString();
			if (tooltip) {
				oRm.writeAttributeEscaped("title", tooltip);
			}

			// Dimensions
			if (oImage.getWidth() && oImage.getWidth() != '') {
				oRm.addStyle("width", oImage.getWidth());
			}
			if (oImage.getHeight() && oImage.getHeight() != '') {
				oRm.addStyle("height", oImage.getHeight());
			}

			//TODO escape
			oRm.addStyle("background-image", "url('" + oImage.getSrc() + "')");
			//oRm.addStyle("");
			oRm.writeStyles();

			var sTooltip = oImage.getTooltip_AsString();
			if (sTooltip) {
				oRm.writeAttributeEscaped("title", sTooltip);
			}

			oRm.write(" />"); // close the <img> element
		};


		return AnimatedSpriteRenderer;

	}, /* bExport= */ true);
