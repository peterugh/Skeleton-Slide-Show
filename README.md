Skeleton-Slide-Show
===================

A bare-bones slider

## Introduction 

I created this plugin as a coding exercise and the desire for a blank slider plugin. Like my other plugins, the shell is totally empty. There are no themes or CSS files to include. It simply takes a series of elements within a container and makes them into a slide show.

## The Code 

There are no necessary plugin options. The slideshow by default will be the size of your container. The size definition takes place first in the plugin, so take into consideration the size of your inner elements.

##Simplest Usage

``` javascript
$(document).ready(function(){
    $("#slideShow").skeletonSlideShow();
});
```

##Advanced Usage

The plugin provides several options that allow you to gain more control. There are also events available to you so you can pile on effects. Below is the plugin with all the non-required options. This is also the code that is running the sliding doors example at the top of the page.

``` javascript
$(document).ready(function(){
    $("#slideShow").skeletonSlideShow({
        advanceEnd:  function(thisSlide) {
            //Just finished and animation a transision
            console.log('The current slide was just updated to: ' + thisSlide);
        },
        advanceStart:  function(thisSlide) {
            //Animation is beginning a transision
            console.log('The slide that is now animating away is: ' + thisSlide);
        },
        animation: 'slide',
        easingMethod: 'linear',
        height: 300,
        markupNavigation: true,
        navigationContainer: '#slideShowArrows',
        paginationContainer: '#slideShowPager',
        pluginLoaded: function() {
            //Manipulate DOM of plugin now
        },
        transitionSpeed: 500,
        visibleFor: 3000,
        width: 900
    });
});
```

##CSS Reference

The plugin writes CSS classes to the slideshow as well as adding a container element. Below is the explanation of these classes and how they can be manipulated.

###Generated container

If the slides that are passed in are list items, the container is an unordered list.

Sample Markup:

``` html
<ul id="slideShow">
    <li>First Slide</li>
    <li>Second Slide</li>
    <li>Third Slide</li>
</ul>
```

###Pagination

If a pagination container is passed as a plugin option, then the following markup will be written in that container.

###Previous/Next Navigation

If a navigation container is passed as a plugin option, then the following markup will be written in that container.

###For default values and options see the [index.html](https://github.com/peterugh/Skeleton-Slide-Show/blob/master/index.html) file included in this repository
