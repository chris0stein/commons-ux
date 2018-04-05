jQuery(document).ready(function() {
	jQuery('.slideshow').cycle({
		fx: 'fade',
		timeout: 7000,
		pause: true,
		prev:   '#pgw-prev',
		next:   '#pgw-next'
	});
});
