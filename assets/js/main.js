/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Audio management.
		var audio = null;
		var isAudioPlaying = false;

		// Initialize audio element
		function initializeAudio() {
			var audioSrc = $('#audio-toggle').data('audio-src');
			if (audioSrc && !audio) {
				audio = new Audio(audioSrc);
				audio.loop = true;
				audio.volume = 0.3;
			}
		}

		// Toggle audio
		$('#audio-toggle').on('click', function() {
			initializeAudio();
			if (audio) {
				if (isAudioPlaying) {
					audio.pause();
					$(this).attr('aria-pressed', 'false');
					$('#audio-icon').text('volume_off');
					isAudioPlaying = false;
				} else {
					audio.play();
					$(this).attr('aria-pressed', 'true');
					$('#audio-icon').text('volume_up');
					isAudioPlaying = true;
				}
			}
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
				// Auto-play audio on page load
				initializeAudio();
				if (audio) {
					audio.play().catch(function() {
						// Auto-play was blocked, user can click button to play
					});
					$('#audio-toggle').attr('aria-pressed', 'true');
					$('#audio-icon').text('volume_up');
					isAudioPlaying = true;
				}
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

	// Teaser Modal functionality
		var $modal = $('#teaser-modal');
		var $video = $('#teaser-video');
		var $playBtn = $('#teaser-play-btn');
		var $closeBtn = $('.teaser-close-btn');
		var $playContainer = $('#teaser-play-container');
		var $startBtn = $('#teaser-start-btn');
		var $startContainer = $('#teaser-start-container');

		// Function to unmute and play background audio
		function unmuteBackgroundAudio() {
			(function(){
				var pageAudio = document.getElementById('page-audio');
				var audioToggleBtn = document.getElementById('audio-toggle');
				var audioIcon = document.getElementById('audio-icon');
				var src = audioToggleBtn ? audioToggleBtn.dataset.audioSrc : null;
				if(!pageAudio && src){
					pageAudio = document.createElement('audio');
					pageAudio.id = 'page-audio';
					pageAudio.src = src;
					pageAudio.preload = 'auto';
					pageAudio.loop = true;
					pageAudio.volume = 0.5;
					pageAudio.style.display = 'none';
					document.body.appendChild(pageAudio);
				}
				if(pageAudio){
					pageAudio.muted = false;
					pageAudio.play().catch(function(){});
					if(audioToggleBtn && audioIcon){
						audioToggleBtn.setAttribute('aria-pressed', 'false');
						audioIcon.textContent = 'volume_up';
						audioIcon.innerText = audioIcon.textContent;
					}
				}
			})();
		}

		// Show modal on page load
		$(window).on('load', function() {
			window.setTimeout(function() {
				$modal.fadeIn(300);
			}, 500);
		});

		// Close button functionality
		$closeBtn.on('click', function() {
			unmuteBackgroundAudio();
			closeTeaseModal();
		});

		// Play button functionality
		$playBtn.on('click', function() {
			$video[0].play();
			$playContainer.fadeOut(300);
		});

		// Start button functionality (shown after video ends)
		$startBtn.on('click', function() {
			unmuteBackgroundAudio();
			closeTeaseModal();
			// Scroll to the image carousel section
			$('html, body').animate({
				scrollTop: $('#image-carousel').offset().top
			}, 1000);
		});

		// Handle video ended event
		$video.on('ended', function() {
			$playContainer.fadeOut(300);
			$startContainer.fadeIn(300);
		});

		// Function to close the modal
		function closeTeaseModal() {
			$modal.fadeOut(300, function() {
				$video[0].pause();
				$video[0].currentTime = 0;
				$playContainer.show();
				$startContainer.hide();
			});
		}

})(jQuery);