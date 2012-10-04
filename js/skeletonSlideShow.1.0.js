;(function($) {
	
	"use strict";
	
	$.fn.skeletonSlideShow = function (options) 
	{
		// Set the defaults
		var settings = $.extend(
			{
				advanceStart: function(){},
				advanceEnd: function(){},
				animation: 'slide',
				easingMethod: 'swing',
				height: null,
				markupNavigation: false,
				navigationContainer: false,
				paginationContainer: false,
				pluginLoaded: function(){},
				transitionSpeed: 500,
				visibleFor: 5000,
				width: null
			}, options),
		
			container = this,
			timers = [];
		
		function init()
		{
			container.each(function() 
			{
				var	animationDestination = 0,
					animateTo = 0,
					aSlider = this,
					currentSlide = 1,
					extraMarkup = '',
					height = null,
					innerWrapper = '',
					j = 0,
					numSlides = 0,
					positionToSlide = ['0'],
					slideShowInfo = {},
					theChildren = '',
					theNavigation = '',
					thePagination = '',
					timer = 0,
					totalWidth = 0,
					typeOfPositioning,
					width = null;
				
				if(settings.height == null)
				{
					height = $(aSlider).height();	
				}
				else
				{
					height = settings.height;
				}
				if(settings.width == null)
				{
					width = $(aSlider).width();	
				}
				else
				{
					width = settings.width;
				}
				
				function calculateAnimationDestination(direction, slideNumber)
				{
					if(direction == 'forward')
					{
						if(currentSlide == numSlides){
							animateTo = 0;
						}
						else
						{
							animateTo = currentSlide * width * -1;
						}
					}
					else if(direction == 'backward')
					{
						if(currentSlide == 1){
							animateTo = width * (numSlides - 1) * -1;
						}
						else
						{
							animateTo = (currentSlide - 2) * width * -1;
						}
					}
					else  if(direction == 'exact')
					{
						animateTo = slideNumber * width * -1;	
					}
					return animateTo;
				}
				
				function afterTransition()
				{
					if(settings.advanceEnd)
					{
						settings.advanceEnd(currentSlide);
					}
					
					$(' a', $(settings.paginationContainer)).removeClass('nav_current_slide');
					$(' ul :nth-child(' + currentSlide + ') a', $(settings.paginationContainer)).addClass('nav_current_slide');
					
					$(' > *', theChildren.parent()).removeClass('current_slide');
					$(' > :nth-child(' + currentSlide + ')', theChildren.parent()).addClass('current_slide');
				}
				
				
				function moveSlides(animationDestination)
				{
					if(animationDestination < (totalWidth * -1))
					{
						animationDestination = (totalWidth * -1);
					}
					if(animationDestination > 0)
					{
						animationDestination = 0;	
					}
					
					if(settings.advanceStart)
					{
						settings.advanceStart(currentSlide);
					}
					
					$(' .skeleton_wrapper', $(aSlider))
						.stop()
						.animate(
						{
							left: animationDestination
						}, settings.transitionSpeed, settings.easingMethod, function()
						{
							timer = 0;
							currentSlide = positionToSlide.indexOf(parseFloat($(' .skeleton_wrapper', $(aSlider)).css('left')));
							if($(settings.paginationContainer).length)
							{
								afterTransition();
								
							}
						}
					);
				}
				
				function advanceSlide(direction)
				{
					if(direction == 'forward')
					{
						animationDestination = calculateAnimationDestination('forward');
						moveSlides(animationDestination, 'forward');
					}
					else if(direction == 'backward')
					{
						animationDestination = calculateAnimationDestination('backward');
						moveSlides(animationDestination, 'backward');
					}
				}
				
				if($(aSlider).is('ul'))
				{
					$(' > *', aSlider).wrapAll('<li class="skeleton_wrapper"><ul></ul></li>');
					theChildren = $('.skeleton_wrapper li', aSlider);
				}
				else
				{
					$(' > *', aSlider).wrapAll('<div class="skeleton_wrapper"></div>');
					theChildren = $('.skeleton_wrapper > *', aSlider);
				}
				
				numSlides = theChildren.length;
				totalWidth = numSlides * width;

				if($(aSlider).css('position') == 'absolute')
				{
					typeOfPositioning = 'absolute';	
				}
				else
				{
					typeOfPositioning = 'relative';
				}

				$(aSlider).css(
				{
					height: height,
					overflow: 'hidden',
					position: typeOfPositioning,
					width: width
				});
				
				innerWrapper = $(' .skeleton_wrapper', aSlider);
				
				innerWrapper.css(
				{
					height: height,
					left: 0,
					overflow: 'visible',
					position: 'absolute',
					top: 0,
					width: width
				});
				
				theChildren.each(function(index, aSlide) 
				{
					$(aSlide).css(
						{
							height: height,
							left: (width * index),
							position: 'absolute',
							top: 0,
							width: width	
						});
					
					positionToSlide.push((width * index) * -1);  
				});
				timers.push(
					setInterval(function()
					{
						if(timer == settings.visibleFor)
						{
							animationDestination = calculateAnimationDestination('forward');
							moveSlides(animationDestination);
						}					
						timer += 100;
					}, 100)
				);
				
				if($(settings.navigationContainer).length)
				{
					theNavigation = '<a href="#" class="previous_page">Previous</a> <a href="#" class="next_page">Next</a>';
					$(settings.navigationContainer).append(theNavigation);
					
					$(' .previous_page', settings.navigationContainer).click(function(evt)
					{
						evt.preventDefault();
						advanceSlide('backward');
					});
					$(' .next_page', settings.navigationContainer).click(function(evt)
					{
						evt.preventDefault();
						advanceSlide('forward');
					});
				}		
				
				if($(settings.paginationContainer).length)
				{
					thePagination = '<ul>';
					for(j = 0; j < numSlides; j += 1)
					{
						extraMarkup = '';
						if(settings.markupNavigation  || j == 0)
						{
							if(settings.markupNavigation  && j == 0)
							{
								extraMarkup = extraMarkup + ' class="goto_slide_' + (j + 1) + ' nav_current_slide"';	
							}
							else if(settings.markupNavigation && j != 0)
							{
								extraMarkup = extraMarkup + ' class="goto_slide_' + (j + 1) + '"';	
							}
							else
							{
								extraMarkup = extraMarkup + ' class="nav_current_slide"';	
							}
						}
						
						thePagination = thePagination + '<li><a href="#pagination"' + extraMarkup + '>' + (j + 1) + '</a></li>';
					}
					thePagination = thePagination + '</ul>';
					$(settings.paginationContainer).append(thePagination);
					
					$(' li a', settings.paginationContainer).click(function(evt)
					{
						evt.preventDefault();
						moveSlides(calculateAnimationDestination('exact', $(this).parent().index()));
					});
				}
				
				if(settings.pluginLoaded)
				{
					slideShowInfo.wrapper = innerWrapper;
					slideShowInfo.totalSlides = numSlides;
					slideShowInfo.totalWidth = totalWidth;
					slideShowInfo.slidesObject = theChildren;
					settings.pluginLoaded(slideShowInfo);	
				}
			});
		}
		init();
	};
}(jQuery));