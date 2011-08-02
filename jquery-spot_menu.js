/*
    A brand new jquery menu plugin like you've never seen before!
    
    Author: Davide Callegari - http://www.brokenseal.it/
    Home page: http://github.com/brokenseal/jquery-spot_menu/
    
    License: MIT
*/

;(function($){
    var
        defaultOptions= {
            addFilter: true                        // wether you want to add the filter or not
            ,filterText: true                    // wether you want to filter the list by text or not
            ,filterAttributes: [ 'rel' ]        // a list of attributes that the filter will search against the filter term
            ,maxHeight: 500                        // a max height to apply to the list
            ,filterPlaceHolderText: 'Filter...'    // text placeholder for the input (for localization/customization purposes)
            ,preventDefault: true                // wether to prevent default actions on the spot element
        }
        ,closeButton= {
            klass: 'ui-spotmenu-closebutton'
            // cloning is faster than creating
            ,element: $('<a href="#" class="ui-spotmenu-closebutton" style="display:none;">close</a>')
        }
        // cloning is faster than creating
        ,filterField= $('<li class="ui-spotmenu-filterspot"><input type="text" name="ui-spotmenu-filterspot" value="" class="ui-spotmenu-activeplaceholder"/></li>')
        
        // private methods
        ,openSpot= function(options, spot, spotted){
            
            // add open class to the spot
            spot.addClass('ui-spotmenu-open');
            
            // show the spotted list
            spotted.slideDown();
            
            // show the close button
            spot.children('.'+closeButton.klass).show();
            
            // hide the siblings elements
            spot.parent().siblings('li').slideUp();
        }
        ,closeSpot= function(options, spot, spotted){
            
            // remove the open class
            spot.removeClass('ui-spotmenu-open');
            
            // hide the spotted list
            spotted.slideUp();
            
            // hide the close button
            spot.children('.'+closeButton.klass).hide();
            
            // show the siblings elements
            spot.parent().siblings('li').slideDown();
            
            // trigger a click event on the close button of any sub element
            // of the siblings elements
            spot.siblings().find('.'+closeButton.klass).click();
            
            // unfilter the spot
            unFilterSpot(options, spot, spotted);
            
            // and empty the filter inside the spotted element
            emptyFilter(options, spotted.children('.ui-spotmenu-filterspot').children('input'));
        }
        ,filterSpot= function(options, filterTerm, spot, spotted){
            var
                elementsToFilter= spotted.children().not('.ui-spotmenu-filterspot')
                ,filterAttributes= options.filterAttributes
            ;
            
            if(!filterTerm) {
                unFilterSpot(options, spot, spotted);
                return;
            }
            
            elementsToFilter.each(function(){
                var
                    element= $(this)
                    ,len= filterAttributes.length
                    ,valueToFilter= ''
                ;
                
                if(options.filterText) {
                    valueToFilter= element.text() + ' '
                }
                
                while(len--) {
                    valueToFilter+= element.attr(filterAttributes[len]) || '';
                    
                    if(valueToFilter && valueToFilter.search(filterTerm) < 0) {
                        element.hide();
                    } else {
                        element.show();
                    }
                }
            });
        }
        ,unFilterSpot= function(options, spot, spotted){
            spotted.children().show();
        }
        ,emptyFilter= function(options, filterField){
            filterField.addClass('ui-spotmenu-activeplaceholder');
            filterField.val(options.filterPlaceHolderText);
        }
    ;
    
    // the main plugin function
    $.fn.spotMenu= function(options){
        
        // merge provided options with default options
        options= $.fn.extend(defaultOptions, options);
        
        return this.each(function(){
            var
                spotMenu= $(this)
                ,spots= spotMenu.find('.spot')
            ;
            
            // manage every single spot
            spots.each(function(e){
                var
                    newCloseButton= closeButton.element.clone() // cloning is faster than creating
                    ,newFilterField
                    ,spot= $(this)
                ;
                
                // append the close button to the spot
                spot.append(newCloseButton);
                
                // bind the click on the close button so that it could actually
                // close the spotted list
                newCloseButton.click(function(e){
                    var
                        _this= $(this)
                    ;
                    
                    // stop any kind of event propagation and default action from the browser
                    e.preventDefault();
                    e.stopPropagation();
                    
                    closeSpot(options, _this.parent(), _this.parent().siblings('ul'));
                });
                
                if(spot.hasClass('last') && options.addFilter) {
                    // create a new filter field
                    newFilterField= filterField.clone(); // cloning is faster than creating
                    
                    // append it to the spotted ul
                    spot.siblings('ul').prepend(newFilterField);
                    
                    // add the placeholder text
                    newFilterField.children('input').val(options.filterPlaceHolderText);
                    
                    // bind any key press inside the field
                    newFilterField.children('input').bind('keypress, keydown, keyup', function(e){
                        var filterField= $(this);
                        
                        if(e.keyCode == 13) {
                            
                            // in case of an enter key press, do nothing
                            // if the menu is placed inside a form, it could involuntarily submit it
                            e.preventDefault();
                            
                        } else if(e.keyCode == 27) {
                            
                            // in case of an esc key press, erase the current filter term
                            filterField.val('');
                            
                        }
                        
                        filterSpot(options, filterField.val(), spot, spot.siblings('ul'));
                        
                        if(e.keyCode == 27) {
                            
                            // in case of an esc key press, blur the field
                            // after having filtered/cleaned the spot
                            filterField.blur();
                            
                        }
                    }).focus(function(){
                        // hide the place holder, if necessary
                        var filterField= $(this);
                        
                        if(filterField.hasClass('ui-spotmenu-activeplaceholder')) {
                            filterField.removeClass('ui-spotmenu-activeplaceholder');
                            filterField.val('');
                        }
                        
                    }).blur(function(){
                        // show the place holder, if necessary
                        
                        var filterField= $(this);
                        
                        if(filterField.val() == '' && !filterField.hasClass('ui-spotmenu-activeplaceholder')) {
                            emptyFilter(options, filterField);
                        }
                        
                    });
                }
            });
            
            // open the spot on click, if it's not already open
            spots.click(function(e){
                var
                    spot= $(this)
                ;
                
                // wether to prevent default actions on the spot element
                if(options.preventDefault) {
                    e.preventDefault();
                }
                
                // if the spot is already open, do nothing
                // the only way to close a spot is by clicking the close button
                if(spot.hasClass('open')) {
                    return;
                }
                
                // open the spot
                openSpot(options, spot, spot.siblings('ul'));
            });
        });
    };
    
    $.fn.destroySpotMenu= function(){
        // TODO
        
        // remove the search field
        
        // remove the close button
        
        // remove any class specific of the plugin, applied to the menu
    };
})(jQuery);
