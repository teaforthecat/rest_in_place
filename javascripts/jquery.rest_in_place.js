jQuery.fn.rest_in_place = function(url, objectName, attributeName) {
	var e = this;
	function clickFunction() {
		var oldValue = e.html();
		e.html('<form action="javascript:void(0)" style="display:inline;"><input type="text" value="' + oldValue + '"></form>');
		e.unbind('click');
		e.find("form").submit(function(){
			var value = e.find("input").val();
			e.html("saving...");
			jQuery.ajax({
				"url" : url,
				"type" : "put",
				"data" : "_method=put&"+objectName+'['+attributeName+']='+value,
				"success" : function(){
					jQuery.ajax({
						"url" : url,
						"beforeSend"  : function(xhr){ xhr.setRequestHeader("Accept", "application/xml"); },
						"success" : function(xmldata, status){
							e.html(jQuery(xmldata).find(objectName+' '+attributeName).text());
							e.click(clickFunction);
						}
					});
				}
			});
			return false;
		})
	}
	this.click(clickFunction);
}

jQuery(function(){
	jQuery(".rest_in_place").each(function(){
		var e = jQuery(this);
		var url; var obj; var attrib;
		e.parents().each(function(){
			url    = url    || jQuery(this).attr("url");
			obj    = obj    || jQuery(this).attr("object");
			attrib = attrib || jQuery(this).attr("attribute");
		});
		e.parents().each(function(){
			if (res = this.id.match(/^(\w+)_(\d+)$/i)) {
				obj = obj || res[1];
			}
		});
		url    = e.attr("url")       || url    || document.location.pathname;
		obj    = e.attr("object")    || obj;
		attrib = e.attr("attribute") || attrib;
		//e.rest_in_place(url, obj, attrib);
		prototype_rip(e[0], url, obj, attrib);
	});
});