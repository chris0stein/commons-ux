jQuery(document).ready( function($) {

	// unregister then reregister click events for nav tabs
	// this is to prevent the Create Group button from firing ajax
	if ( jQuery( 'body' ).hasClass( 'groups' ) ) {
		$('div.item-list-tabs').unbind( 'click' );
	}

	// Remove the <br> from the gd-bbpress-attachments label. Release me from this hell.
	$( 'p.bbp-attachments-form' ).find( 'br' ).each( function( k, v ) {
		$( v ).remove();
		return false;
	} );

	// Move attachments notice markup below the attachments field. Hell^2.
	var att_notice = $( 'p.bbp-attachments-form' ).prev( '.bbp-template-notice' );
	if ( att_notice ) {
		att_notice.insertAfter( 'p.bbp-attachments-form' );
	}

	$('body.directory.groups div.item-list-tabs').click( function(event) {
		var targetElem = ( event.target.nodeName == 'SPAN' ) ? event.target.parentNode : event.target;

		if ( $(targetElem).hasClass( 'button' ) || $(targetElem).closest( '.button' ).length ) {
			return;
		}

		if ( $(this).hasClass('no-ajax') )
			return;

		var target = $( targetElem ).parent();
		if ( 'LI' == target[0].nodeName && !target.hasClass('last') ) {
			var css_id = target.attr('id').split( '-' );
			var object = css_id[0];

			if ( 'activity' == object )
				return false;

			var scope = css_id[1];
			var filter = $("#" + object + "-order-select select").val();
			var search_terms = $("#" + object + "_search").val();

			bp_filter_request( object, filter, scope, 'div.' + object, search_terms, 1, $.cookie('bp-' + object + '-extras') );

			return false;
		}
	});

	// prefill the New Folder field on BP Group Documents
	$('input.bp-group-documents-new-folder').attr( 'placeholder','New Folder...').val('').css('color','#999').focus(function(){
		$(this).val('').css('color','inherit');
	});

	// Confirmation of file deletion
	$('#bp-group-documents a.delete-file').on( 'click', function(){
		var $clicked = $( this );
		var $dconfirm = $clicked.closest( 'td' ).find( '.delete-confirm' );
		var answer = $dconfirm.dialog( {
			buttons: {
				'Delete': function() {
					var delete_url = $clicked.attr( 'href' );
					if ( $dconfirm.find( '.bp-group-documents-silent-delete' ).is(':checked') ) {
						delete_url += '&silent=1';
					}
					window.location = delete_url;
					$( this ).dialog( 'destroy' );
				},
				Cancel: function() {
					$( this ).dialog( 'destroy' );
				}
			}
		} );
		return false;
	});

	/* Group Document Replace */
	$( '#bp-group-documents a.replace-file' ).on( 'click', function() {
		var $clicked_document = $(this).closest( 'tr' );

		// Display Name
		$( '#bp-group-documents-name' ).val( $clicked_document.find( 'a.group-documents-title' ).data( 'document-title' ) );

		// Description
		$( '#bp-group-documents-description' ).html( $clicked_document.find( 'p.description' ).html() );

		// Replace Exsting File gloss
		$( '#bp-group-documents-replace-existing-file-name' ).html( $clicked_document.find( 'a.group-documents-title' ).data( 'document-title' ) );

		// Hidden ID
		$( 'input[name="bp_group_documents_id"]' ).val( $( this ).data( 'document-id' ) );
		$( '#bp-group-documents-replace-existing-file' ).val( $( this ).data( 'document-id' ) );
		$( 'input[name="bp_group_documents_operation"]' ).val( 'edit' );

		$( '#bp-group-documents-replace-existing-file-wrapper' ).fadeIn();
		$( '#bp-group-documents-upload-button' ).trigger( 'click' );
		return false;
	} );

	$( '#bp-group-documents-upload-cancel' ).on( 'click', function() {
		$( '#bp-group-documents-name' ).val( '' );
		$( '#bp-group-documents-description' ).val( '' );
		$( 'input[name="bp_group_documents_id"]' ).val( '' );
		$( '#bp-group-documents-replace-existing-file' ).val( '' );
		$( 'input[name="bp_group_documents_operation"]' ).val( 'add' );
		$( '#bp-group-documents-replace-existing-file-wrapper' ).fadeOut();
		$( '#bp-group-documents-upload-new' ).slideUp( 500, function() {
			$( '#bp-group-documents-upload-button' ).show().css( 'display', 'inline' );
			$( '#bp-group-documents-download-all-link' ).show().css( 'display', 'inline' );
		} );
		return false;
	} );

	// Group document filesize check.
	var $groupDocumentSubmit = $( '#bp-group-documents-form input[type="submit"]' );
	var $groupDocumentUploadSizeNotice = $( '#bp-group-documents-upload-size-notice' );
	$( 'input[name="bp_group_documents_file"]' ).change( function() {
		var maxFileSize = 1000 * 1000 * 50;

		if ( maxFileSize > this.files[0].size ) {
			$groupDocumentSubmit.attr( 'disabled', false );
			$groupDocumentUploadSizeNotice.hide();
		} else {
			$groupDocumentSubmit.attr( 'disabled', true );
			$groupDocumentUploadSizeNotice.show();
		}
	} );

	/* Mod bp-groupblog stuff */
	var gbdivs = [ 'blog-details-fields', 'groupblog-blog-privacy', 'groupblog-member-options' ];
	var gbtoggle = $('#groupblog-enable-blog');

	if(!$(gbtoggle).is(':checked')) {
		$.each(gbdivs, function(index,value){
			$('#group-create-body #' + value).slideUp();
		});
	}

	$(gbtoggle).bind('click',function(){
		var gbon = $(this).is(':checked');
		$.each(gbdivs, function(index,value){
			if ( gbon ) {
				$('#group-create-body #' + value).slideDown();
			} else {
				$('#group-create-body #' + value).slideUp();
			}
		});

	});

	var $groupblog_privacy_selector = $( '#groupblog-blog-privacy' );
	var origPrivacySetting = $( 'input[name="blog_public"]:checked' ).val();
	var $groupblog_blog_selector = $( '#groupblog-blogid' );
	var $main_privacy_gloss = $( '#main-privacy-gloss' );
	var $secondary_privacy_gloss = $( '#secondary-privacy-gloss' );
	$groupblog_blog_selector.change( function( e ) {
		var groupblogId = e.target.value;
		var selectedPublic = $( '#groupblog-option-' + groupblogId ).data( 'blogpublic' );

		if ( typeof selectedPublic != 'undefined' ) {
			$groupblog_privacy_selector.find( '[value="' + selectedPublic + '"]' ).prop( 'checked', true );
		}
		setSitePrivacyEnabled();
	} );

	$( 'input[name="groupblog-create-new"]' ).change( function() {
		setSitePrivacyEnabled();
	} );

	setSitePrivacyEnabled();

	function setSitePrivacyEnabled() {
		if ( $('input[name="groupblog-create-new"]:checked').val() == 'no' && $groupblog_blog_selector.val() > 0 ) {
			$groupblog_privacy_selector.find( 'input:radio' ).prop( 'disabled', true );
			$main_privacy_gloss.hide();
			$secondary_privacy_gloss.show();
		} else {
			$groupblog_privacy_selector.find( 'input:radio' ).prop( 'disabled', false );
			$groupblog_privacy_selector.find( '[value="' + origPrivacySetting + '"]' ).prop( 'checked', true );
			$main_privacy_gloss.show();
			$secondary_privacy_gloss.hide();
		}
	}

	/** Invite Anyone ****************************************************/
	$(document).ajaxSuccess( function( event, xhr, settings ) {
		var d = settings.hasOwnProperty( 'data' ) ? settings.data : '';
		if ( d ) {
			var isInviteMod = d.indexOf( 'action=invite_anyone_groups_invite_user' ) != -1;
			if ( isInviteMod ) {
				setInviteGroupGroupCreateButtonText();
			}
		}
	} );

	function setInviteGroupGroupCreateButtonText() {
		var $groupFinishButton = $( 'input#group-creation-finish' );
		if ( $groupFinishButton ) {
			var newText = '';
			if ( $( '#invite-anyone-invite-list' ).children( 'li' ).length > 0 ) {
				newText = 'Send Invites and Finish';
			} else {
				newText = 'Finish';
			}

			$groupFinishButton.val( newText );
		}
	}

	$('span.highlight span').click( function() {
		if ( !$('div.help').length ) {
			$(this).parent().after( '<div id="message" class="info help"><p>' + CAC_Strings.mention_explain + '</p></div>' );
			$('div.help').hide().slideDown(200);
		} else {
			$('div.help').hide().remove();
		}
	});

	/* long group blog name warning */
	$('#blogname').css('margin-top', '10px'); // put a little space between the inputs

	// check the length of the blog name
	check_blog_name();

	// add an event listener to keep checking the length of the blog name
	$('#blogname').keyup(function(){
		check_blog_name();
	});
	$('#blogname').focus( function(){
		remove_blog_name_error_message();
	});
	$('#blogname').blur( function(){
		check_blog_name_uniqueness();
	});
	$('#blogname').load( function(){
		check_blog_name_uniqueness();
	});

	var yesses = jQuery( '.notification-settings .yes' );
	if ( yesses.length > 0 ) {
		yesses.each( function() {
		jQuery( this ).parent().append( jQuery( this ) );
		})
	}

	// Add listener to bbPress cancel new topic link
	var bbp_cancel_new_topic = jQuery('#bbp-cancel-new-topic-link');
	bbp_cancel_new_topic.click( function() {
		jQuery( '#new-post :input' )
		.not(':button, :submit, :hidden')
		.val('')
		.removeAttr('checked')
		.removeAttr('selected');

		jQuery('#bbp_stick_topic_select').val('unstick');
		jQuery('#bbp_topic_status_select').val('publish');
		jQuery( '#bbp-post-preview' ).html('');
	});

	// Verify that usernames in messages "Send To" are valid.
	$( '#send-to-input' ).on( 'blur', function() {
		var $self = $( this );

		// If the field is empty, don't do a check.
		if ( 0 === $self.val().length ) {
			return;
		}

		// Remove any existing messages.
		$self.parent().find( '#message' ).remove();

		$.ajax( {
			type: 'POST',
			url: ajaxurl + '?action=cac_check_sendto_names',
			data: {
				'nonce': $( '#_wpnonce' ).val(),
				'send-to-input': $self.val()
			},
			success: function( response ) {
				if ( ! response.success && response.hasOwnProperty( 'data' ) ) {
					$self.after( '<div id="message" class="error"><p>' + response.data.message + '</p></div>' );
				}
			}
		} );
	} );

	if ($('.cac-cancel-link').length >= 1 ) {
		var dialog_element = $("<p id='dialog-confirm'>Content will be discarded. Click 'OK' to continue canceling, or 'Back' to go back to editing.</p>").insertAfter($('.cac-cancel-link'));
		dialog_element.dialog({
			modal: true,
			title: "Are you sure?",
			autoOpen: false,
			draggable: false,
			resizable: false
		});

		$( '.cac-cancel-link' ).on( 'click', function( event ) {
			if ( $("#message_content").val() != "" ) {
				event.preventDefault();
				var target_url = $(this).attr("href");

				$('#dialog-confirm').dialog("option", "buttons",
				{
					"Ok": function( event ) {
						window.location.href = target_url;
					},
					"Back": function() {
						$( this ).dialog( "close" );
					}
				});
				dialog_element.dialog("open");
			}
		} );
	}

	/**
	 * Get URL parameters.
	 *
	 * Based on http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
	 */
	get_url_parameters = function() {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		var params = {};
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			params[ sParameterName[0] ] = sParameterName[1];
		}

		return params;
	}

	// Scroll to the paper directory, if necessary.
	var $paper_directory_title = $( '.paper-directory-title' );
	if ( $paper_directory_title ) {
		var url_params = get_url_parameters();
		// Add other items here for more scrolling.
		if ( 'undefined' !== typeof url_params.cacsp_paper_tag || 'undefined' !== typeof url_params.all_papers ) {
			$( window ).scrollTo( $paper_directory_title, {
				axis: 'y',
				offset: -65,
				duration: 500
			} );
		}
	}

	var $sp_hub_activity = $( '.sp-newest-comments-and-papers .activity-content' );
	$( '.sp-newest-comments-and-papers' ).on( 'click', '.sp-activity-pagination a', function( e ) {
		e.preventDefault();

		$sp_hub_activity.addClass( 'loading' );

		var acpage = e.target.href.match( /acpage=([0-9]+)/ );
		$.ajax( {
			method: 'GET',
			url: ajaxurl + '?action=cacsp_paginate_activity&acpage=' + acpage[1],
			success: function( response ) {
				if ( response.success ) {
					$sp_hub_activity.html( response.data );
				}

				$sp_hub_activity.removeClass( 'loading' );
			}
		} );
	} );

	/* CACAP Social Media Profiles Edit */
	var smp_checkboxes = document.querySelectorAll('.smp-field__checkbox');
	if (smp_checkboxes.length > 0) {
		for(var i = 0; i < smp_checkboxes.length; i++) {
			var smp_field = smp_checkboxes[i].parentNode;
			var smp_text_input = smp_field.querySelector('.smp-field__text');
			var smp_value = smp_text_input.value;
			smp_checkboxes[i].dataset.loaded_value = smp_value;
			smp_checkboxes[i].addEventListener('click', toggleSMPField);
		}
	}
},(jQuery));

function toggleSMPField(event) {
	var smp_checkbox = event.target;
	var smp_text_input = smp_checkbox.parentNode.querySelector('.smp-field__text');
	if (smp_checkbox.checked) {
		smp_text_input.value = smp_checkbox.dataset.loaded_value;
	} else {
		smp_text_input.value = '';
	}
}

/**
 * This function checks the value of the group blog name input field to see if it's too long
 */
function check_blog_name() {
	$blogNameInput = jQuery('#blogname');
	blogName = $blogNameInput.val();

	// if a group blog already exists a hidden blog name input still exists on the page
	// so we'll bail here if that's the case
	if ($blogNameInput.attr('type') == 'hidden') { return false; }

	// subdomains cannot be longer than 63 characters so we need to enforce that
	if (blogName && blogName.length > 63) {

		// remove any existing warning
		jQuery('#blog-name-warning').remove();

		// alert the user tha their subdomain is too long
		$blogNameInput.css('borderColor', 'red')
									.next()
									.after('<p>This blog name is over 63 characters. This is not allowed, choose something a bit shorter.</p>')
									.next('p')
									.attr('id', 'blog-name-warning')
									.css('color', 'red');

		// hide the next button
		jQuery('#group-creation-next').hide()

		// else, check if the blog's subdomain is over 15 characters
	} else if (blogName && blogName.length >= 15) {

		// remove any existing warning
		jQuery('#blog-name-warning').remove();

		// alert the user that their subdomain should probably be shortened
		$blogNameInput.css('borderColor', 'red')
									.next()
									.after('<p>This blog name is over 15 characters. For a URL that is more memorable and easier to type, consider something a bit shorter.</p>')
									.next('p')
									.attr('id', 'blog-name-warning')
									.css('color', 'red');

		// show the next button
		jQuery('#group-creation-next').show()

	} else {
		//reset inputs
		jQuery('#blog-name-warning').remove();
		$blogNameInput.css('borderColor', '#eee');
		jQuery('#group-creation-next').show();
	}

	/* @mention Compose Scrolling */
	if ( jQuery.query.get('r') && jQuery('textarea#whats-new').length ) {
		jq.scrollTo( jq('textarea#whats-new'), 500, {
			offset:-325,
			easing:'easeOutQuad'
		} );
	}

	// Fix bbPress !important styling - Thanks bbPress!
	jQuery('body.logged-in p.bbp-forum-description').attr('style', 'margin-right: 120px !important');
}

function check_blog_name_uniqueness() {
	$blogNameInput = jQuery('#blogname');
	blogName = $blogNameInput.val();

	var data = {
		'action': 'check_blog_name_uniqueness',
		'url': blogName
	};

	jQuery.post(ajaxurl, data, function(response) {
		return_data = jQuery.parseJSON(response);

		// this is ugly because the markup on regular site creation,
		// group site create on group create, and group site create on
		// group admin are all slightly different

		// If we're in groups
		if ( 'yes' === return_data.groups) {
			// but not the group admin screen
			if ( 'no' === return_data.groups_admin ) {
				// and the site name is already taken
				if ( 'no' === return_data.unique ) {
					jQuery('#group-creation-next').hide().prop("disabled", "true");
					if ( jQuery('#site-taken').length === 0 ) {
						jQuery('#groupblog-details').after("<p id='site-taken' style='color: red;'><strong>Sorry, that site URL is already taken.</strong></p>");
					}
				// and the site name isn't taken yet
				} else if ( 'yes' === return_data.unique ) {
					jQuery('#group-creation-next').show().prop("disabled", "false");
					jQuery('#site-taken').remove();
				}
			// and we're in the group admin screen
			} else if ( 'yes' === return_data.groups_admin ) {
				// and the site name is already taken
				if ( 'no' === return_data.unique ) {
					jQuery('#save').hide().prop("disabled", "true");
					if ( jQuery('#site-taken').length === 0 ) {
						jQuery('#groupblog-details').after("<p id='site-taken' style='color: red;'><strong>Sorry, that site URL is already taken.</strong></p>");
					}
				// and the site name isn't taken yet
				} else if ( 'yes' === return_data.unique ) {
					jQuery('#save').show().prop("disabled", "false");
					jQuery('#site-taken').remove();
				}
			}
		// if we aren't in groups
		} else if ( 'no' === return_data.groups ) {
			// and the site name is already taken
			if ( 'no' === return_data.unique ) {
				jQuery('#submit').hide().prop("disabled", "true");
				if ( jQuery('#site-taken').length === 0 ) {
					jQuery('.suffix_address').after("<p id='site-taken' style='color: red; margin-bottom: -20px;'><strong>Sorry, that site URL is already taken.</strong></p>");
				}
			// and the site name isn't taken yet
			} else if ( 'yes' === return_data.unique ) {
				jQuery('#submit').show().prop("disabled", "false");
				jQuery('#site-taken').remove();
			}
		}
	});
}

function remove_blog_name_error_message() {
	if ( jQuery('#site-taken').length > 0 ) {
		jQuery('#site-taken').remove();
	}
}
