(function($){
	$(document).ready(function(){
		$( '#user-invite-anyone,#nav-invite-anyone-groups-li' ).click( function( e ) {
			e.preventDefault();
			openModal();
		} );

		$( '#menu-users li a' ).click( function( e ) {
			if ( -1 === e.target.href.indexOf( 'user-new.php' ) ) {
				return true;
			}

			e.preventDefault();
			openModal();
			resizeModal();
		} );

		var resizeModal = function() {
			// Ensure it doesn't cover the menu.
			var menuwidth = $('#adminmenuwrap').width();
			var modal = $('#caco-modal');
			modal.css('left', ( parseInt( menuwidth ) + 10 ) + 'px');
		}

		var openModal = function() {
			if ( 'undefined' === typeof window.cacoModal ) {
				return;
			}

			if ( ! window.cacoModal.$store.state.initialStateLoaded ) {
				window.cacoModal.$store.dispatch( 'fetchInitialState' )
				.then( function( initialState ) {;
					window.cacoModal.$store.commit( 'setInitialState', initialState );
				} );
			}
			window.cacoModal.$store.commit( 'showModal' )
		}

		// Direct visits to legacy interfaces.
		var redirect = null;
		var body = $( 'body' );
		if ( body.hasClass( 'bp-user' ) && body.hasClass( 'invite-anyone' ) ) {
			redirect = document.location.href.replace( 'invite-anyone/', 'activity/?onboarding=launch' );
		} else if ( body.hasClass( 'groups' ) && body.hasClass( 'invite-anyone' ) ) {
			redirect = document.location.href.replace( 'invite-anyone/', '?onboarding=launch' );
		} else if ( body.hasClass( 'user-new-php' ) && $( '#add-existing-user' ).length === 0 ) {
			redirect = document.location.href.replace( 'user-new.php', '?onboarding=launch' );
		}

		if ( redirect ) {
			document.location.href = redirect;
		}

		// 'onboarding=launch' is the top-secret open code.
		if ( -1 !== document.location.search.indexOf( 'onboarding=launch' ) ) {
			openModal();

			if ( body.hasClass( 'wp-admin' ) ) {
				resizeModal();
			}
		}
	});
}(jQuery))
