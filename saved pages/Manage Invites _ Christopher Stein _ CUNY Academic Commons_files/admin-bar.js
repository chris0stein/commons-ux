jQuery(document).ready(function($) {
	return;
	if ( navigator.appName == 'Microsoft Internet Explorer' ) {
		// Groan
		$('#wpadminbar .quicklinks .menupop ul li .ab-item').each(function(index,element){
			$(element).css('white-space', 'nowrap');
			$(element).css('height', '26px !important');
		});
		
		return;
	}

	var glist = $('#wp-admin-bar-my-groups-default');
	
	// calc column number
	var wh = $(window).height() - 50; // padding
	var colnum = Math.ceil(wh/30);
	
	var groupnum = $(glist).children('li').length;
	var numofcols = Math.ceil(groupnum/colnum);
	
	// How much room do we have?
	var glistp = ($('#wp-admin-bar-my-groups').offset());
	
	var contwidth = numofcols * 290;
	
	$(glist).makeacolumnlists({
		cols: numofcols,
		colWidth: '250px',
		equalHeight: 'ul',
		startN: 1
	});
	
	$("#wp-admin-bar-my-groups div.li_container").each( function( index,element ) {
		$(element).css('width', contwidth + 'px');
	});

	$("#wp-admin-bar-my-groups ul.li_cont").each( function( index,element ) {
		$(element).css('width', '250px');
	});
	
	$(glist).css('height','auto');

	/**
	 * Now do the same thing for the My Sites menu
	 */
	var blist = $('#wp-admin-bar-my-sites-list');

	// calc column number
	var bcolnum = Math.ceil((wh-150)/30); // we need a bit more space for blogs
	var blognum = $(blist).children('li').length;
	var bnumofcols = Math.ceil(blognum/bcolnum);
	
	var bcontwidth = bnumofcols * 300;
	
	$(blist).makeacolumnlists({
		cols: bnumofcols,
		colWidth: '250px',
		equalHeight: 'ul',
		startN: 1
	});
	
	$("#wp-admin-bar-my-account-blogs div.li_container").each( function( index,element ) {
		$(element).css('width', bcontwidth + 'px');
	});

	console.log($(blist).children('li'));
	$(blist).children('li').each( function( index,element ) {
		$(element).css('width', '250px');
	});
	
	$(blist).css('height','auto');

});
