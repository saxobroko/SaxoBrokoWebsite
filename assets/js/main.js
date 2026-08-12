(function($) {
	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});
	$(function() {
			$('form').placeholder();
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});
			if ($.fn.scrolly) {
				$('.scrolly').scrolly();
			}
			$('.gallery').each(function() {
				var	$gallery = $(this);
					$gallery.each( function() {
						var $this = $(this),
							$tabs = $this.find('.tabs a'),
							$media = $this.find('.media');
						$tabs.on('click', function(e) {
							var $this = $(this),
								tag = $this.data('tag');
							 	e.preventDefault();
								$tabs.removeClass('active');
								$this.addClass('active');
								$media
									.fadeOut('fast')
									.each(function() {
										var $this = $(this);
										if ($this.hasClass(tag))
											$this
												.fadeOut('fast')
												.delay(200)
												.queue(function(next) {
													$this.fadeIn();
													next();
												});
									});
						});
					});
			});
	});
})(jQuery);

// Image popup (only when Magnific is loaded)
$(document).ready(function() {
  if (!$.fn || !$.fn.magnificPopup) return;
  $('.popyoutube').magnificPopup({type:'iframe'});
  $('.popspotify').magnificPopup({type:'iframe',mainClass:'spotifypop'});
  $('.content').magnificPopup({delegate: 'a.imagepop, a[class="imagepop"]', type: 'image'});
  if ($('.content a.imagepop').length === 0) {
    $('.gallery .content').magnificPopup({delegate: 'a', type: 'image'});
  }
});

// Lazyload images
!function(window){var $q=function(q,res){if(document.querySelectorAll){res=document.querySelectorAll(q);}else{var d=document,a=d.styleSheets[0]||d.createStyleSheet();a.addRule(q,'f:b');for(var l=d.all,b=0,c=[],f=l.length;b<f;b++)
l[b].currentStyle.f&&c.push(l[b]);a.removeRule(0);res=c;}
return res;},addEventListener=function(evt,fn){window.addEventListener?this.addEventListener(evt,fn,false):(window.attachEvent)?this.attachEvent('on'+evt,fn):this['on'+evt]=fn;};
function loadImage(el,fn){var img=new Image(),src=el.getAttribute('data-src');img.onload=function(){if(!!el.parent)
el.parent.replaceChild(img,el)
else
el.src=src;fn?fn():null;}
img.src=src;}
function elementInViewport(el){var rect=el.getBoundingClientRect()
return(rect.top>=0&&rect.left>=0&&rect.top<=(window.innerHeight||document.documentElement.clientHeight))}
var images=new Array(),query=$q('img.lazy'),processScroll=function(){for(var i=0;i<images.length;i++){if(elementInViewport(images[i])){loadImage(images[i],function(){images.splice(i,i);});}};};for(var i=0;i<query.length;i++){images.push(query[i]);};processScroll();addEventListener('scroll',processScroll);}(this);

// Fallback css
(function($){
    var links = {};

    $( "link[data-fallback]" ).each( function( index, link ) {
        links[link.href] = link;
    });

    $.each( document.styleSheets, function(index, sheet) {
        if(links[sheet.href]) {
            var rules = sheet.rules ? sheet.rules : sheet.cssRules;
            if (rules.length == 0) {
                link = $(links[sheet.href]);
                link.attr( 'href', link.attr("data-fallback") );
            }
        }
    });
})(jQuery);

// Sidebar dropdown
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
  var dropdownContent = this.nextElementSibling;
  if (dropdownContent.style.display === "block") {
  dropdownContent.style.display = "none";
  } else {
  dropdownContent.style.display = "block";
  }
  });
}
