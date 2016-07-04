/**
 * Copyright (c) 2009 Sergiy Kovalchuk (serg472@gmail.com)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Following code is based on Element.mask() implementation from ExtJS framework (http://extjs.com/)
 *
 */
;(function($){

	/**
	 * Displays loading mask over selected element(s). Accepts both single and multiple selectors.
	 *
	 * @param label Text message that will be displayed on top of the mask besides a spinner (optional).
	 * 				If not provided only mask will be displayed without a label or a spinner.
	 * @param delay Delay in milliseconds before element is masked (optional). If unmask() is called
	 *              before the delay times out, no mask is displayed. This can be used to prevent unnecessary
	 *              mask display for quick processes.
	 */
	$.fn.mask = function(label, delay){
		$(this).each(function() {
			if(delay !== undefined && delay > 0) {
		        var element = $(this);
		        element.data("_mask_timeout", setTimeout(function() { $.maskElement(element, label)}, delay));
			} else {
				$.maskElement($(this), label);
			}
		});
	};

	/**
	 * Removes mask from the element(s). Accepts both single and multiple selectors.
	 */
	$.fn.unmask = function(){
		$(this).each(function() {
			$.unmaskElement($(this));
		});
	};

	/**
	 * Checks if a single element is masked. Returns false if mask is delayed or not displayed.
	 */
	$.fn.isMasked = function(){
		return this.hasClass("masked");
	};
  var getComputedStyle = document.defaultView&&document.defaultView.getComputedStyle;
	var getMaxZIndx = function(element){
			var maxIndex = 0;
			var zIndex = getComputedStyle(element[0])['z-index'];
      if(zIndex&&zIndex!='auto')
			{
				  maxIndex = Math.max(maxIndex,zIndex);
			}
      var children = element.children();
			if(children.length!=0)
			{
				children.each(function(){
						maxIndex = Math.max(maxIndex,getMaxZIndx($(this)));
				});
			}


			return maxIndex;
	};
	$.maskElement = function(element, label){

		//if this element has delayed mask scheduled then remove it and display the new one
		if (element.data("_mask_timeout") !== undefined) {
			clearTimeout(element.data("_mask_timeout"));
			element.removeData("_mask_timeout");
		}

		if(element.isMasked()) {
			$.unmaskElement(element);
		}
    /***
		if(element.css("position") == "static") {
			element.addClass("masked-relative");
		}
		element.addClass("masked");
    ***/

		var maskDiv = $('<div class="loadmask"></div>');

		//auto height fix for IE
		if(navigator.userAgent.toLowerCase().indexOf("msie") > -1){
			maskDiv.height(element.height() + parseInt(element.css("padding-top")) + parseInt(element.css("padding-bottom")));
			maskDiv.width(element.width() + parseInt(element.css("padding-left")) + parseInt(element.css("padding-right")));
		}

		//fix for z-index bug with selects in IE6
		if(navigator.userAgent.toLowerCase().indexOf("msie 6") > -1){
			element.find("select").addClass("masked-hidden");
		}

		element.append(maskDiv);

    var elementStyle = getComputedStyle(element[0],null);
		var top = 0;
		var left =  0;
		if(elementStyle['position']=='absolute'||elementStyle['position']=='relative'||elementStyle['position']=='fixed')
		{
			  top = 0;
			  left =  0;
		}
		else{
			var offsetParentStyle = getComputedStyle(element[0].offsetParent,null);
			var element_border_top = parseInt(elementStyle['border-top-width']?elementStyle['border-top-width'].replace('px',''):0);
			var element_border_left = parseInt(elementStyle['border-left-width']?elementStyle['border-left-width'].replace('px',''):0);
			top = element[0].offsetTop+element_border_top;
			left=element[0].offsetLeft+element_border_left;
		}
    maskDiv.css({'position':'absolute'});
           maskDiv.css('top',top+'px');
           maskDiv.css('left',left+'px');
    maskDiv.width(element.innerWidth());
    maskDiv.height(element.innerHeight());
		console.log(getMaxZIndx(element));
		maskDiv.css({'z-index':getMaxZIndx(element)});




		if(label !== undefined) {
			var maskMsgDiv = $('<div class="loadmask-msg" style="display:none;"></div>');
			maskMsgDiv.append('<div>' + label + '</div>');
			maskDiv.append(maskMsgDiv);

			//calculate center position

      var top = Math.round(maskDiv.height() / 2 - (maskMsgDiv.height() - parseInt(maskMsgDiv.css("padding-top")) - parseInt(maskMsgDiv.css("padding-bottom"))) / 2)+"px";
      var left = Math.round(maskDiv.width() / 2 - (maskMsgDiv.width() - parseInt(maskMsgDiv.css("padding-left")) - parseInt(maskMsgDiv.css("padding-right"))) / 2)+"px";

			maskMsgDiv.css("top", top);
			maskMsgDiv.css("left", left);

			maskMsgDiv.show();
		}

	};

	$.unmaskElement = function(element){
		//if this element has delayed mask scheduled then remove it
		if (element.data("_mask_timeout") !== undefined) {
			clearTimeout(element.data("_mask_timeout"));
			element.removeData("_mask_timeout");
		}

		element.find(".loadmask-msg,.loadmask").remove();
		element.removeClass("masked");
		element.removeClass("masked-relative");
		element.find("select").removeClass("masked-hidden");
	};

})(jQuery);
