#Lite-the-Way
##### jquery.lite-the-way.js
######By: Michael Rosata 

Lite-the-Way is a jQuery plugin that adds class names to elements based on whether they fall within margins that are set when you add the lite-the-way plugin to your page. The purpose for this plugin is to make long pages of text easy to read. [There is a Lite-the-Way demo page] or you may download the demo straight from the repository. In the demo I made text that fell outside of the margins "deactive" fade so that the text in the middle of the page would be easier to read. I also set an option that by default is off, that option is `$('p').litetheway({cutoff : true}};` Having cutoff set to true will measure whether an element has past the bottom horizontal margin based on the elments lower edge rather then it's top edge.

Some cool features of Lite the Way are

  - Free, easy to use, makes long text fun!
  - It's context can easily be set so that the plugin only begins to add classes within a certain 'context' element. Even then it is simple to add top and bottom offsets to the container 'context' element so that lite-the-way doesn't start making visual changes until the reader is a set amount of pixels into the text. This is set through the `start` and `end` properties
  - Magic Overlays! Lite-the-Way will add in magic overlays that can further help add to the smooth reading effect that your text will now give to your users. You can style these overlays with your own classes, this is done setting the `overlayClass` to `your-class`. You may also turn overlays off by setting `overlay` to false.
  -  Plenty more options, they are all listed in the [demo], download or visit. We are still in beta. Before this weekend (Feb 21, 2015) all will be updated and listed below!



> Coming Soon: callback functions for events such as when the plugin reaches the top or bottom of the plugins >`context` container as well as callbacks that are called by the plugin when specific elements within your page come into the users view.
  
### Installation

Just include ```jquery.lite-the-way.js``` after you have already loaded the `jquery` library. Then just call `jQuery(selector)litetheway(options)` where selector is for the collection of elements that the deactivated and active classes will be applied to and `options` is the object that overwrites any of the default settings with your own. You may optionally pass no `options` into the method. Enjoy!

**Lite-the-Way is free to use, if you want to thank the author, do, if you don't, don't, just have fun!!**
##[OnethingSimple]



[There is a Lite-the-Way demo page]:http://onethingsimple.com/lite-the-way/
[demo]:http://onethingsimple.com/lite-the-way/
[OnethingSimple]:http://onethingsimple.com/
