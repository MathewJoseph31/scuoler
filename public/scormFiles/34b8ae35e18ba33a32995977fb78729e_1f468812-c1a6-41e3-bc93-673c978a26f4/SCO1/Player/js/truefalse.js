/*
* jQuery Browser iMobile ver. 3.0.6
* 
* Microsoft grants you the right to use these script files for the sole purpose of either: (i) interacting through your browser with the Microsoft website, 
* subject to the website's terms of use; or (ii) using the files as included with a Microsoft product subject to that product's license terms. Microsoft 
* reserves all other rights to the files not expressly granted by Microsoft, whether by implication, estoppel or otherwise. 
* The notices and licenses below are for informational purposes only.
*
*
* Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
* Originally Licensed under the MIT License (LICENSE.txt).
*
* Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
* Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
* Thanks to: Seamus Leahy for adding deltaX and deltaY
*
* Version: 3.0.6
* 
* Requires: 1.2.2+
*
* Provided for Informational Purposes Only
* 
* MIT License
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
* to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
* IN THE SOFTWARE
*/
var Inspect = {
    TYPE_FUNCTION: 'function',
    methods: function(obj) {
        var testObj = obj || self;
        var methods = [];
        for (prop in testObj) {
            if (typeof testObj[prop] == Inspect.TYPE_FUNCTION && typeof Inspect[prop] != Inspect.TYPE_FUNCTION) {
                methods.push(prop);
            }
        }
        return methods;
    },
    properties: function(obj) {
        var testObj = obj || self;
        var properties = [];
        for (prop in testObj) {
            if (typeof testObj[prop] != Inspect.TYPE_FUNCTION && typeof Inspect[prop] != Inspect.TYPE_FUNCTION) {
                properties.push(prop);
            }
        }
        return properties;
    }
}

function Accordion(wrapper,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(wrapper)
}
Accordion.prototype = {wrapper:false,strips:false,settings:false,expandedIndices:[],completed:false,navigation:"default",expansionMode:"single",completeStrip:function()
{
},getRootVisual:function()
{
    return this.wrapper
},countTasks:function(includeComplete,includeOptional)
{
    return!this.strips ? 0 : includeComplete && includeOptional ? this.strips.length : includeComplete ? this.strips.filter('[data-required="true"]').length : includeOptional ? this.strips.not(".complete").length : this.strips.not(".complete").filter('[data-required="true"]').length
},init:function(wrapper)
{
    this.wrapper = $(wrapper);
    this.strips = this.wrapper.children(".accordion_strip");
    this.navigation = this.wrapper.attr("data-navigation") || "default";
    this.expansionMode = this.wrapper.attr("data-expansionMode") || "single";
    var ai = this,
        ss = ai.page.courseController.course.scormState,
        pageId = ai.page.pageId,
        getStripIndex = function(strip)
        {
            for(var i = 0; i < ai.strips.length; i++)
                if(ai.strips[i] === strip)
                    return i;
            return-1
        },
        isExpanded = function(strip)
        {
            return ai.expandedIndices.indexOf(getStripIndex(strip)) !== -1
        },
        getRequiredStrips = function()
        {
            return ai.strips.filter('[data-required="true"]')
        },
        getIncompleteStrips = function()
        {
            return ai.strips.not(".complete")
        },
        getRequiredIncompleteStrips = function()
        {
            return ai.strips.not(".complete").filter('[data-required="true"]')
        },
        getFirstIncompleteStripIndex = function()
        {
            for(var i = 0; i < ai.strips.length; i++)
                if(!$(ai.strips[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstRequiredIncompleteStripIndex = function()
        {
            for(var i = 0; i < ai.strips.length; i++)
                if(ai.strips[i].required && !$(ai.strips[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstActiveStripIndex = function()
        {
            for(var i = 0; i < ai.strips.length; i++)
                if(!$(ai.strips[i]).hasClass("disabled"))
                    return i;
            return-1
        },
        expand = function(strip,callback)
        {
            var $strip = $(strip),
                $expansion = $(strip.expansion).removeClass("compressed"),
                index = getStripIndex(strip),
                content = $expansion.children(".accordion_content"),
                expandedHeight = content.outerHeight();
            $expansion.stop().animate({height:expandedHeight + "px"},300,function()
            {
                $(this).css("height","auto");
                $(window).trigger("resize");
                var mediabar = $(".media_bar",$expansion),
                    mediaManager = ai.page.mediaManager,
                    mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
                mediaIndex > -1 && mediaManager.playMedia(mediaIndex);
                strip.autocomplete && 
                    completeStrip(strip);
                callback && callback()
            });
            ai.wrapper.parent(".tile_container").each(function()
            {
                var baseOverflowRatio = this.baseOverflowRatio,
                    requiredOverflowRatio = (ai.wrapper.position().top + wrapper.scrollHeight + expandedHeight - $(this.offsetParent).height() / 10) / $(this.offsetParent).width(),
                    newOverflowRatio = Math.max(baseOverflowRatio,requiredOverflowRatio);
                $(this).animate({marginBottom:newOverflowRatio * 100 + "%"},300)
            });
            $strip.hasClass("expanded") || $strip.addClass("expanded");
            ai.expandedIndices.indexOf(index) === -1 && ai.expandedIndices.push(index)
        },
        collapse = function(strip,callback)
        {
            var $strip = $(strip),
                $expansion = $(strip.expansion),
                index = getStripIndex(strip),
                content = $expansion.children(".accordion_content"),
                expandedHeight = content.height(),
                mediabar = $(".media_bar",$expansion),
                mediaManager = ai.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            mediaIndex > -1 && mediaManager.unloadMedia(mediaIndex);
            $expansion.stop().animate({height:"0px"},300,function()
            {
                ai.expandedIndices.indexOf(index) > -1 && 
                    ai.expandedIndices.splice(ai.expandedIndices.indexOf(index),1);
                $expansion.hasClass("compressed") || $expansion.addClass("compressed");
                $(window).trigger("resize");
                callback && callback()
            });
            ai.wrapper.parent(".tile_container").each(function()
            {
                var baseOverflowRatio = this.baseOverflowRatio,
                    requiredOverflowRatio = (ai.wrapper.position().top + wrapper.scrollHeight - expandedHeight - $(this.offsetParent).height() / 10) / $(this.offsetParent).width(),
                    newOverflowRatio = Math.max(baseOverflowRatio,requiredOverflowRatio);
                $(this).animate({marginBottom:newOverflowRatio * 100 + "%"},300)
            });
            $strip.hasClass("expanded") && $strip.removeClass("expanded")
        },
        markComplete = function(strip)
        {
            var $strip = $(strip);
            if(!$strip.hasClass("complete"))
            {
                $strip.addClass("complete");
                if($(".completion_indicator",strip).length === 0)
                {
                    var iconSize = $(".content_container").length ? $(".content_container").width() / 64 : $(window).width() / 64,
                        completionIndicator = $("<div/>",{"class":"completion_indicator icon"}).css({width:iconSize + "px",height:iconSize + "px"});
                    completionIndicator.append($("<div/>",{"class":"check"}).html('<img src="' + ai.settings.assetPath + 'dark/images/check.nocircle.png" alt="complete" class="showOnDark"/><img src="' + ai.settings.assetPath + 'light/images/check.nocircle.png" alt="complete" class="showOnLight"/>')).appendTo($strip.children(".accordion_strip_title"))
                }
            }
        },
        completeStrip = function(s)
        {
            var index = typeof s === "number" ? s : getStripIndex(s),
                strip = ai.strips[index];
            if(strip && !$(strip).hasClass("complete"))
            {
                markComplete(strip);
                setState();
                strip.required && ai.page.observer.fire("requiredTaskCompleted",{type:"accordion",component:ai,task:strip});
                if(!ai.completed && getRequiredIncompleteStrips().length === 0)
                {
                    ai.completed = true;
                    ai.page.observer.fire("accordionCompleted",ai.settings.index)
                }
                if(ai.navigation === "linear")
                    for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteStripIndex(),
                        i = index + 1; i < (firstRequiredIncompleteIndex === -1 ? ai.strips.length : firstRequiredIncompleteIndex + 1); i++)
                        activateStrip(ai.strips[i])
            }
        },
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "ai#" + (ai.settings.index ? ai.settings.index.toString() : "0") + ":c=([^|]*)",
                completed = currentState.match(new RegExp(pattern));
            if(completed)
                for(var completedIndices = completed[1].split(","),
                    i = 0; i < completedIndices.length; i++)
                    completedIndices[i].trim().length > 0 && !isNaN(completedIndices[i]) && 
                        markComplete(ai.strips[completedIndices[i]])
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "ai#" + (ai.settings.index ? ai.settings.index.toString() : "0") + ":c=[^|]*",
                re = new RegExp(pattern),
                completed = [],
                i = 0; i < ai.strips.length; i++)
                $(ai.strips[i]).hasClass("complete") && completed.push(i);
            if(re.test(currentState))
                currentState = currentState.replace(re,"ai#" + (ai.settings.index ? ai.settings.index.toString() : "0") + ":c=" + completed.join(","));
            else
                currentState += "ai#" + (ai.settings.index ? ai.settings.index.toString() : "0") + ":c=" + completed.join(",") + "|";
            ss.setState(pageId,currentState)
        },
        navigateNext = function(strip)
        {
            var index = getStripIndex(strip) + 1;
            index < ai.strips.length && revealStrip.call(ai.strips[index])
        },
        activateStrip = function(strip)
        {
            if(strip)
            {
                $(strip).removeClass("disabled").unbind("click",toggleStrip).bind("click",toggleStrip);
                $(strip.toggleButton).attr("href","#")
            }
        },
        deactivateStrip = function(strip)
        {
            if(strip)
            {
                $(strip).addClass("disabled").unbind("click",toggleStrip);
                $(strip.toggleButton).removeAttr("href")
            }
        },
        revealStrip = function()
        {
            var strip = this;
            if(!isExpanded(strip))
                if(ai.expansionMode !== "multiple" && ai.expandedIndices.length > 0)
                    collapse(ai.strips[ai.expandedIndices[0]],function()
                    {
                        expand(strip)
                    });
                else
                    expand(strip);
            else
            {
                var mediabar = $(".media_bar",$(strip.expansion)),
                    mediaManager = ai.page.mediaManager,
                    mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
                mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
            }
        },
        unrevealStrip = function()
        {
            isExpanded(this) && 
                collapse(this)
        },
        toggleStrip = function()
        {
            if(!isExpanded(this))
                revealStrip.call(this);
            else
                unrevealStrip.call(this)
        },
        videoEnded = function(videoFile)
        {
            expansion = $(this).closest(".accordion_expansion")[0];
            if(expansion && expansion.strip)
            {
                videoFile.mustPlayAll && 
                    completeStrip(expansion.strip);
                videoFile.videoAutoNavigate && 
                    navigateNext(expansion.strip)
            }
        };
    this.completeStrip = completeStrip;
    this.strips.each(function()
    {
        this.accordion = ai;
        this.autocomplete = $(this).attr("data-autocomplete") !== "false";
        this.required = $(this).attr("data-required") === "true";
        this.expansion = $(this).children(".accordion_expansion")[0];
        this.expansion && (this.expansion.strip = this);
        $(this.expansion).addClass("compressed").insertAfter(this);
        this.toggleButton = $(this).children("a.toggle")[0] || $("<a/>",{"class":"toggle"}).appendTo(this)[0];
        $(this.toggleButton).html('<div class="expand"><img src="' + ai.settings.assetPath + 'dark/images/add.nocircle.png" alt="expand" class="showOnDark"/><img src="' + ai.settings.assetPath + 'light/images/add.nocircle.png" alt="expand" class="showOnLight"/></div><div class="collapse"><img src="' + ai.settings.assetPath + 'dark/images/minus.nocircle.png" alt="collapse" class="showOnDark"/><img src="' + ai.settings.assetPath + 'light/images/minus.nocircle.png" alt="collapse" class="showOnLight"/></div>').append($('<img src="' + ai.settings.assetPath + 'dark/images/1px.png" aria-hidden="true" alt=""/>'));
        if(ai.navigation === "linear" || ai.navigation === "synched")
            deactivateStrip(this);
        else
            activateStrip(this);
        var mediabar = $(".media_bar",this.expansion);
        if(mediabar.attr("data-video"))
        {
            mediabar[0].onMediaEnded = videoEnded;
            (!mediabar.attr("data-mediaContainer") || $("#" + mediabar.attr("data-mediaContainer"))[0] === mediabar[0]) && !mediabar.hasClass("accordion_video") && mediabar.addClass("accordion_video")
        }
        else
            mediabar.attr("data-audio")
    });
    restoreState();
    if(getRequiredIncompleteStrips().length === 0)
        ai.completed = true;
    if(this.navigation === "linear")
        for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteStripIndex(),
            i = 0; i < (firstRequiredIncompleteIndex === -1 ? this.strips.length : firstRequiredIncompleteIndex + 1); i++)
            activateStrip(this.strips[i]);
    else
        if(this.navigation === "synched")
        {
            this.syncStripIn = revealStrip;
            this.syncStripOut = unrevealStrip;
            this.strips.addClass("media_sync").attr("data-inAction","page.interactiveComponents.accordions.items." + (this.settings.index ? this.settings.index.toString() : "0") + ".syncStripIn").attr("data-outAction","page.interactiveComponents.accordions.items." + (this.settings.index ? this.settings.index.toString() : "0") + ".syncStripOut")
        }
}};
function ClickRevealTileSet(container,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(container)
}
ClickRevealTileSet.prototype = {container:false,tabs:false,settings:false,revealedIndex:-1,completed:false,navigation:"default",completeTab:function()
{
},getRootVisual:function()
{
    return this.container
},countTasks:function(includeComplete,includeOptional)
{
    return!this.tabs ? 0 : includeComplete && includeOptional ? this.tabs.length : includeComplete ? this.tabs.filter('[data-required="true"]').length : includeOptional ? this.tabs.not(".complete").length : this.tabs.not(".complete").filter('[data-required="true"]').length
},init:function(container)
{
    this.container = $(container);
    this.tabs = this.container.find(".tab");
    this.navigation = this.container.attr("data-navigation") || "default";
    var cr = this,
        ss = cr.page.courseController.course.scormState,
        pageId = cr.page.pageId,
        getTabIndex = function(tab)
        {
            for(var i = 0; i < cr.tabs.length; i++)
                if(cr.tabs[i] === tab)
                    return i;
            return-1
        },
        getRevealedTab = function()
        {
            return cr.tabs[cr.revealedIndex] || null
        },
        getRequiredTabs = function()
        {
            return cr.tabs.filter('[data-required="true"]')
        },
        getIncompleteTabs = function()
        {
            return cr.tabs.not(".complete")
        },
        getRequiredIncompleteTabs = function()
        {
            return cr.tabs.not(".complete").filter('[data-required="true"]')
        },
        getFirstIncompleteTabIndex = function()
        {
            for(var i = 0; i < cr.tabs.length; i++)
                if(!$(cr.tabs[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstRequiredIncompleteTabIndex = function()
        {
            for(var i = 0; i < cr.tabs.length; i++)
                if(cr.tabs[i].required && !$(cr.tabs[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstActiveTabIndex = function()
        {
            for(var i = 0; i < cr.tabs.length; i++)
                if(!$(cr.tabs[i]).hasClass("disabled"))
                    return i;
            return-1
        },
        adjustTabSize = function()
        {
            if(!this.style.height)
            {
                var adjustFactor = 1;
                if(container.style.height.indexOf("%") > -1)
                    adjustFactor *= parseFloat(container.style.height) / 1e3;
                if(this.parentElement.className === "tile_block" && this.parentElement.style.height.indexOf("%") > -1)
                    adjustFactor *= parseFloat(this.parentElement.style.height) / 100;
                if(adjustFactor !== 1)
                    if(this.currentStyle)
                    {
                        if(this.currentStyle.height.indexOf("%") > -1)
                            this.style.height = parseFloat(this.currentStyle.height) + parseFloat(this.currentStyle.marginBottom) * (1 - 1 / adjustFactor) + "%"
                    }
                    else
                        this.style.height = 100 * $(this).height() / $(this).offsetParent().height() + Math.round(1e3 * parseFloat($(this).css("marginBottom")) / parseFloat($(container).width())) / 10 * (1 - 1 / adjustFactor) + "%"
            }
        },
        initPopup = function(popup)
        {
            var $popup = $(popup),
                $tab = $(popup.tab),
                marginPercent = {right:Math.round(1e3 * parseFloat($(popup.tab).css("marginRight")) / parseFloat($(container).width())) / 10},
                expandedDimensions = {width:(100 - marginPercent.right) / 100 * cr.container.width(),height:(100 - marginPercent.right * cr.container.width() / cr.container.height()) / 100 * cr.container.height()},
                expandedOffset = {left:cr.container.offset() ? cr.container.offset().left : NaN,right:cr.container.offset() ? cr.container.offset().left + expandedDimensions.width : NaN,top:cr.container.offset() ? cr.container.offset().top : NaN,bottom:cr.container.offset() ? cr.container.offset().top + expandedDimensions.height : NaN},
                tabOffset = {left:$tab.offset() ? $tab.offset().left - expandedOffset.left : NaN,right:$tab.offset() ? expandedOffset.right - $tab.offset().left - $tab.width() : NaN,top:$tab.offset() ? $tab.offset().top - expandedOffset.top : NaN,bottom:$tab.offset() ? expandedOffset.bottom - $tab.offset().top - $tab.height() : NaN},
                collapsedOffset = {left:tabOffset.left <= tabOffset.right ? tabOffset.left + $tab.width() * tabOffset.left / expandedDimensions.width : NaN,right:tabOffset.left > tabOffset.right ? tabOffset.right + $tab.width() * tabOffset.right / expandedDimensions.width : NaN,top:tabOffset.top <= tabOffset.bottom ? tabOffset.top + $tab.height() * tabOffset.top / expandedDimensions.height : NaN,bottom:tabOffset.top > tabOffset.bottom ? tabOffset.bottom + $tab.height() * tabOffset.bottom / expandedDimensions.height : NaN},
                collapsedPercentOffset = {left:collapsedOffset.left / cr.container.width() * 100,right:collapsedOffset.right / cr.container.width() * 100 + marginPercent.right,top:collapsedOffset.top / cr.container.height() * 100,bottom:collapsedOffset.bottom / cr.container.height() * 100 + marginPercent.right * cr.container.width() / cr.container.height()};
            cr.container.append(popup);
            popup.collapsedPercentOffset = collapsedPercentOffset;
            popup.marginPercent = marginPercent;
            if(!isNaN(collapsedPercentOffset.left) && !isNaN(collapsedPercentOffset.top))
                $popup.css({left:collapsedPercentOffset.left + "%",top:collapsedPercentOffset.top + "%"});
            else
                if(!isNaN(collapsedPercentOffset.left))
                    $popup.css({left:collapsedPercentOffset.left + "%",bottom:collapsedPercentOffset.bottom + "%"});
                else
                    if(!isNaN(collapsedPercentOffset.top))
                        $popup.css({right:collapsedPercentOffset.right + "%",top:collapsedPercentOffset.top + "%"});
                    else
                        $popup.css({right:collapsedPercentOffset.right + "%",bottom:collapsedPercentOffset.bottom + "%"})
        },
        expand = function(popup,callback)
        {
            var $popup = $(popup),
                tab = popup.tab,
                scrollbox = $(".scroll_box",popup),
                scrollbar = $(".scroll_track",popup),
                expandedPercentWidth = 100 - popup.marginPercent.right,
                collapsedPercentOffset = popup.collapsedPercentOffset,
                animateParameters = {opacity:"1",width:expandedPercentWidth + "%",height:100 - (100 - expandedPercentWidth) * (cr.container.width() / cr.container.height()) + "%"};
            if(!isNaN(collapsedPercentOffset.left))
                animateParameters.left = "0%";
            else
                animateParameters.right = 100 - expandedPercentWidth + "%";
            if(!isNaN(collapsedPercentOffset.top))
                animateParameters.top = "0%";
            else
                animateParameters.bottom = (100 - expandedPercentWidth) * (cr.container.width() / cr.container.height()) + "%";
            scrollbar.css("opacity","0");
            $popup.stop().animate(animateParameters,300,function()
            {
                scrollbox.each(function()
                {
                    this.scrollbox && this.scrollbox.containerResized()
                });
                scrollbar.css("opacity","1");
                var mediabar = $(".media_bar",popup),
                    mediaManager = cr.page.mediaManager,
                    mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
                mediaIndex > -1 && mediaManager.playMedia(mediaIndex);
                tab.autocomplete && 
                    completeRevealedTab();
                callback && callback()
            });
            cr.revealedIndex = getTabIndex(tab);
            $(".close",popup).focus()
        },
        collapse = function(popup,callback)
        {
            var $popup = $(popup),
                tab = popup.tab,
                collapsedPercentOffset = popup.collapsedPercentOffset,
                animateParameters = {opacity:"0",width:"0px",height:"0px"};
            mediabar = $(".media_bar",popup), mediaManager = cr.page.mediaManager, mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            mediaIndex > -1 && mediaManager.unloadMedia(mediaIndex);
            if(!isNaN(collapsedPercentOffset.left))
                animateParameters.left = collapsedPercentOffset.left + "%";
            else
                animateParameters.right = collapsedPercentOffset.right + "%";
            if(!isNaN(collapsedPercentOffset.top))
                animateParameters.top = collapsedPercentOffset.top + "%";
            else
                animateParameters.bottom = collapsedPercentOffset.bottom + "%";
            $popup.stop().animate(animateParameters,300,function()
            {
                cr.revealedIndex = -1;
                callback && callback()
            });
            $(".expand",tab).focus()
        },
        markComplete = function(tab)
        {
            var $tab = $(tab);
            if(!$tab.hasClass("complete"))
            {
                $tab.addClass("complete");
                if($tab.children(".completion_indicator").length == 0)
                {
                    var iconSize = $(".content_container") ? $(".content_container").width() / 64 : $(window).width() / 64,
                        completionIndicator = $("<div/>",{"class":"completion_indicator icon"}).css({width:iconSize + "px",height:iconSize + "px"});
                    completionIndicator.append($("<div/>",{"class":"check"}).html('<img src="' + cr.settings.assetPath + 'dark/images/check.nocircle.png" alt="complete" class="showOnDark"/><img src="' + cr.settings.assetPath + 'light/images/check.nocircle.png" alt="complete" class="showOnLight"/>')).appendTo($tab)
                }
            }
        },
        completeTab = function(t)
        {
            var index = typeof t === "number" ? t : getTabIndex(t),
                tab = cr.tabs[index];
            if(tab && !$(tab).hasClass("complete"))
            {
                markComplete(tab);
                setState();
                tab.required && cr.page.observer.fire("requiredTaskCompleted",{type:"clickRevealSet",component:cr,task:tab});
                if(!cr.completed && getRequiredIncompleteTabs().length === 0)
                {
                    cr.completed = true;
                    cr.page.observer.fire("clickRevealSetCompleted",cr.settings.index)
                }
                if(cr.navigation === "linear")
                    for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteTabIndex(),
                        i = index + 1; i < (firstRequiredIncompleteIndex === -1 ? cr.tabs.length : firstRequiredIncompleteIndex + 1); i++)
                        activateTab(cr.tabs[i])
            }
        },
        completeRevealedTab = function()
        {
            completeTab(cr.revealedIndex)
        },
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "cr#" + (cr.settings.index ? cr.settings.index.toString() : "0") + ":c=([^|]*)",
                completed = currentState.match(new RegExp(pattern));
            if(completed)
                for(var completedIndices = completed[1].split(","),
                    i = 0; i < completedIndices.length; i++)
                    completedIndices[i].trim().length > 0 && !isNaN(completedIndices[i]) && 
                        markComplete(cr.tabs[completedIndices[i]])
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "cr#" + (cr.settings.index ? cr.settings.index.toString() : "0") + ":c=[^|]*",
                re = new RegExp(pattern),
                completed = [],
                i = 0; i < cr.tabs.length; i++)
                $(cr.tabs[i]).hasClass("complete") && completed.push(i);
            if(re.test(currentState))
                currentState = currentState.replace(re,"cr#" + (cr.settings.index ? cr.settings.index.toString() : "0") + ":c=" + completed.join(","));
            else
                currentState += "cr#" + (cr.settings.index ? cr.settings.index.toString() : "0") + ":c=" + completed.join(",") + "|";
            ss.setState(pageId,currentState)
        },
        navigateNext = function()
        {
            for(var i = cr.revealedIndex + 1; i < cr.tabs.length; i++)
                if(cr.tabs[i].popup)
                {
                    revealTab.call(cr.tabs[i]);
                    break
                }
        },
        activateTab = function(tab)
        {
            if(tab && tab.popup)
            {
                $(tab).unbind("click",revealTab).bind("click",revealTab);
                $(tab.expandButton).removeClass("disabled").attr("href","#");
                $(tab.collapseButton).removeClass("disabled").attr("href","#").unbind("click",handleCollapseClick).bind("click",handleCollapseClick)
            }
        },
        deactivateTab = function(tab)
        {
            if(tab && tab.popup)
            {
                $(tab).unbind("click",revealTab);
                $(tab.expandButton).addClass("disabled").removeAttr("href");
                $(tab.collapseButton).addClass("disabled").removeAttr("href").unbind("click",handleCollapseClick)
            }
        },
        revealTab = function()
        {
            var tab = this,
                index = getTabIndex(this);
            if(index !== -1 && index !== cr.revealedIndex && tab.popup)
            {
                var revealedTab = getRevealedTab();
                if(revealedTab)
                    collapse(revealedTab.popup,function()
                    {
                        expand(tab.popup)
                    });
                else
                    expand(tab.popup)
            }
        },
        handleCollapseClick = function()
        {
            unrevealTab.call(this.tab)
        },
        unrevealTab = function()
        {
            var index = getTabIndex(this);
            index !== -1 && index === cr.revealedIndex && collapse(this.popup)
        },
        videoEnded = function(videoFile)
        {
            videoFile.mustPlayAll && 
                completeRevealedTab();
            videoFile.videoAutoNavigate && 
                navigateNext()
        };
    this.completeTab = completeTab;
    if(container.style.height.indexOf("%") > -1)
        this.tabs.each(adjustTabSize);
    else
        this.container.find(".tile_block").each(function()
        {
            this.style.height.indexOf("%") > -1 && 
                $(this).children(".tab").each(adjustTabSize)
        });
    this.tabs.each(function()
    {
        this.clickRevealTileSet = cr;
        this.autocomplete = $(this).attr("data-autocomplete") !== "false";
        this.required = $(this).attr("data-required") === "true";
        this.popup = $(".tab_popup",this)[0];
        this.expandButton = $(".expand",this)[0];
        this.collapseButton = this.popup ? $(".close",this.popup)[0] : undefined;
        this.collapseButton && (this.collapseButton.tab = this);
        $(this.expandButton).html('<img src="' + cr.settings.assetPath + 'dark/images/add.normal.png" alt="" class="showOnDark"/><img src="' + cr.settings.assetPath + 'light/images/add.normal.png" alt="" class="showOnLight"/>');
        $(this.collapseButton).html('<img src="' + cr.settings.assetPath + 'dark/images/minus.normal.png" alt="" class="showOnDark"/><img src="' + cr.settings.assetPath + 'light/images/minus.normal.png" alt="close" class="showOnLight"/>');
        $(this.expandButton).attr("aria-label",parent.Resources.LiveTiles_ExpandTile_Text);
        $(this.collapseButton).attr("aria-label",parent.Resources.LiveTiles_CloseTile_Text);
        if(this.popup)
        {
            this.popup.tab = this;
            initPopup(this.popup)
        }
        else
            $(this).addClass("complete");
        var mediabar = $(".media_bar",this.popup);
        if(mediabar.attr("data-video"))
            mediabar[0].onMediaEnded = videoEnded;
        if(cr.navigation === "linear" || cr.navigation === "synched")
            deactivateTab(this);
        else
            activateTab(this)
    });
    restoreState();
    if(getRequiredIncompleteTabs().length === 0)
        cr.completed = true;
    if(this.navigation === "linear")
        for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteTabIndex(),
            i = 0; i < (firstRequiredIncompleteIndex === -1 ? this.tabs.length : firstRequiredIncompleteIndex + 1); i++)
            activateTab(this.tabs[i]);
    else
        if(this.navigation === "synched")
        {
            this.syncTabIn = revealTab;
            this.syncTabOut = unrevealTab;
            this.tabs.addClass("media_sync").attr("data-inAction","page.interactiveComponents.clickRevealSets.items." + (this.settings.index ? this.settings.index.toString() : "0") + ".syncTabIn").attr("data-outAction","page.interactiveComponents.clickRevealSets.items." + (this.settings.index ? this.settings.index.toString() : "0") + ".syncTabOut")
        }
}};
function CompoundContent(wrapper,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(wrapper)
}
CompoundContent.prototype = {wrapper:false,container:false,sections:false,settings:false,currentIndex:-1,forwardButton:false,backButton:false,completed:false,navigation:"default",getRootVisual:function()
{
    return this.wrapper
},countTasks:function(includeComplete,includeOptional)
{
    return!this.sections ? 0 : includeComplete && includeOptional ? this.sections.length : includeComplete ? this.sections.filter('[data-required="true"]').length : includeOptional ? this.sections.not(".complete").length : this.sections.not(".complete").filter('[data-required="true"]').length
},init:function(wrapper)
{
    this.wrapper = $(wrapper);
    this.container = this.wrapper.children(".compoundcontent_container");
    this.sections = this.container.children(".compoundcontent_section");
    this.backButton = this.wrapper.find(".back_button:first");
    this.forwardButton = this.wrapper.find(".forward_button:first");
    this.navigation = this.wrapper.attr("data-navigation") || "default";
    var cc = this,
        ss = cc.page.courseController.course.scormState,
        pageId = cc.page.pageId,
        getSectionIndex = function(section)
        {
            for(var i = 0; i < cc.sections.length; i++)
                if(cc.sections[i] === section)
                    return i;
            return-1
        },
        getCurrentSection = function()
        {
            return cc.sections[cc.currentIndex] || null
        },
        getRequiredSections = function()
        {
            return cc.sections.filter('[data-required="true"]')
        },
        getIncompleteSections = function()
        {
            return cc.sections.not(".complete")
        },
        getRequiredIncompleteSections = function()
        {
            return cc.sections.not(".complete").filter('[data-required="true"]')
        },
        getFirstIncompleteSectionIndex = function()
        {
            for(var i = 0; i < cc.sections.length; i++)
                if(!$(cc.sections[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstRequiredIncompleteSectionIndex = function()
        {
            for(var i = 0; i < cc.sections.length; i++)
                if(cc.sections[i].required && !$(cc.sections[i]).hasClass("complete"))
                    return i;
            return-1
        },
        completeSection = function(section)
        {
            if(section && !$(section).hasClass("complete"))
            {
                $(section).addClass("complete");
                setState();
                section.required && cc.page.observer.fire("requiredTaskCompleted",{type:"compoundContentSet",component:cc,task:section});
                if(!cc.completed && getRequiredIncompleteSections().length === 0)
                {
                    cc.completed = true;
                    cc.page.observer.fire("compoundContentCompleted",cc.settings.index)
                }
                else
                    if(!cc.completed && cc.navigation === "linear")
                        for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteSectionIndex(),
                            i = getSectionIndex(section) + 1; i < (firstRequiredIncompleteIndex === -1 ? cc.sections.length : firstRequiredIncompleteIndex + 1); i++)
                            activateSection(cc.sections[i])
            }
        },
        setCurrentSection = function(index)
        {
            if(index >= 0 && index < cc.sections.length && index !== cc.currentIndex)
            {
                cc.currentIndex = index;
                var currentSection = getCurrentSection();
                if(currentSection && (currentSection.autocomplete || currentSection.componentsComplete) && !$(currentSection).hasClass("complete"))
                {
                    currentSection.visited = true;
                    completeSection(getCurrentSection())
                }
                else
                    if(currentSection && !currentSection.visited)
                    {
                        currentSection.visited = true;
                        setState()
                    }
            }
        },
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "cc#" + (cc.settings.index ? cc.settings.index.toString() : "0") + ":v=([^~]*)~c=([^~]*)~l=([^|]*)",
                match = currentState.match(new RegExp(pattern));
            if(match)
            {
                for(var visited = match[1].split(","),
                    completed = match[2].split(","),
                    i = 0; i < visited.length; i++)
                    if(visited[i].trim().length > 0 && !isNaN(visited[i]))
                        cc.sections[visited[i]] && (cc.sections[visited[i]].visited = true);
                for(var i = 0; i < completed.length; i++)
                    completed[i].trim().length > 0 && !isNaN(completed[i]) && 
                        $(cc.sections[completed[i]]).addClass("complete");
                return parseInt(match[3])
            }
            else
                return null
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "cc#" + (cc.settings.index ? cc.settings.index.toString() : "0") + ":v=[^~]*~c=[^~]*~l=[^|]*",
                re = new RegExp(pattern),
                visited = [],
                completed = [],
                i = 0; i < cc.sections.length; i++)
            {
                cc.sections[i].visited && visited.push(i);
                $(cc.sections[i]).hasClass("complete") && completed.push(i)
            }
            if(re.test(currentState))
                currentState = currentState.replace(re,"cc#" + (cc.settings.index ? cc.settings.index.toString() : "0") + ":v=" + visited.join(",") + "~c=" + completed.join(",") + "~l=" + cc.currentIndex);
            else
                currentState += "cc#" + (cc.settings.index ? cc.settings.index.toString() : "0") + ":v=" + visited.join(",") + "~c=" + completed.join(",") + "~l=" + cc.currentIndex + "|";
            ss.setState(pageId,currentState)
        },
        navigateNext = function()
        {
            var index = cc.currentIndex + 1;
            index < cc.sections.length && navigateToIndex(index)
        },
        navigatePrevious = function()
        {
            var index = cc.currentIndex - 1;
            index >= 0 && navigateToIndex(index)
        },
        navigateToSection = function()
        {
            navigateToIndex(getSectionIndex(this))
        },
        navigateToIndex = function(index)
        {
            if(index >= 0 && index < cc.sections.length && index !== cc.currentIndex && !cc.sections[index].disabled)
            {
                if(cc.currentIndex === -1)
                    if(cc.settings.transitionType === "fade")
                        $(cc.sections[index]).css("visibility","visible").animate({opacity:1},500,navigationCompleteHandler);
                    else
                    {
                        cc.container.css({left:-index * 100 + "%"});
                        cc.sections.css("visibility","visible").animate({opacity:1},500,function()
                        {
                            this === cc.sections[index] && navigationCompleteHandler()
                        })
                    }
                else
                {
                    var mediabar = $(cc.sections[cc.currentIndex]).children(".media_bar"),
                        mediaManager = cc.page.mediaManager,
                        mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
                    mediaIndex > -1 && mediaManager.unloadMedia(mediaIndex);
                    if(cc.settings.transitionType === "fade")
                    {
                        $(cc.sections[cc.currentIndex]).animate({opacity:0},300).css("visibility","hidden");
                        $(cc.sections[index]).delay(100).css("visibility","visible").animate({opacity:1},500,navigationCompleteHandler)
                    }
                    else
                        cc.container.stop().animate({left:-index * 100 + "%"},500,navigationCompleteHandler)
                }
                setCurrentSection(index);
                setNavButtons()
            }
        },
        navigationCompleteHandler = function()
        {
            var mediabar = $(cc.sections[cc.currentIndex]).children(".media_bar"),
                mediaManager = cc.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
        },
        setNavButtons = function()
        {
            if(cc.navigation === "synched")
                return;
            if(cc.sections.length > 0 && cc.currentIndex + 1 < cc.sections.length && !cc.sections[cc.currentIndex + 1].disabled)
                cc.forwardButton.hasClass("disabled") && cc.forwardButton.removeClass("disabled").attr("href","#").off("click",navigateNext).on("click",navigateNext);
            else
                !cc.forwardButton.hasClass("disabled") && cc.forwardButton.addClass("disabled").removeAttr("href").off("click",navigateNext).trigger("blur");
            if(cc.sections.length > 0 && cc.currentIndex > 0 && !cc.sections[cc.currentIndex - 1].disabled)
                cc.backButton.hasClass("disabled") && cc.backButton.removeClass("disabled").attr("href","#").off("click",navigatePrevious).on("click",navigatePrevious);
            else
                !cc.backButton.hasClass("disabled") && cc.backButton.addClass("disabled").removeAttr("href").off("click",navigatePrevious).trigger("blur")
        },
        activateSection = function(section)
        {
            section.disabled = false
        },
        deactivateSection = function(section)
        {
            section.disabled = true
        },
        videoEnded = function(videoFile)
        {
            section = $(this).parent(".compoundcontent_section")[0];
            section === getCurrentSection() && videoFile.videoAutoNavigate && 
                navigateNext()
        };
    this.backButton.addClass("disabled").html('<img src="' + cc.settings.assetPath + 'dark/images/arrow.left.normal.png" alt="previous" class="showOnDark"/><img src="' + cc.settings.assetPath + 'light/images/arrow.left.normal.png" alt="previous" class="showOnLight"/>');
    this.forwardButton.addClass("disabled").html('<img src="' + cc.settings.assetPath + 'dark/images/arrow.right.normal.png" alt="next" class="showOnDark"/><img src="' + cc.settings.assetPath + 'light/images/arrow.right.normal.png" alt="next" class="showOnLight"/>');
    this.settings.transitionType = (this.wrapper.attr("data-transitionType") || "default").toLowerCase();
    this.sections.each(function(index)
    {
        this.autocomplete = $(this).attr("data-autocomplete") !== "false";
        this.required = $(this).attr("data-required") === "true";
        cc.settings.transitionType !== "fade" && 
            $(this).css({left:index * 100 + "%"});
        cc.navigation === "linear" && 
            deactivateSection(this);
        var mediabar = $(this).children(".media_bar");
        mediabar.attr("data-video") && (mediabar[0].onMediaEnded = videoEnded);
        if(!this.autocomplete)
        {
            var section = this,
                trackingComponentTypes = [],
                componentCompletionHandler = function()
                {
                    for(var incomplete = false,
                        i = trackingComponentTypes.length - 1,
                        property; i >= 0; i--)
                    {
                        property = trackingComponentTypes[i];
                        if(!cc.page.interactiveComponents[property])
                            continue;
                        if(cc.page.interactiveComponents[property].complete || cc.page.interactiveComponents[property].getIncompleteItems(section).length === 0)
                        {
                            cc.page.interactiveComponents[property].removeItemCompletionHandler(componentCompletionHandler);
                            trackingComponentTypes.splice(i,1)
                        }
                        else
                            incomplete = true
                    }
                    if(!incomplete)
                    {
                        section.componentsComplete = true;
                        if(section.visited)
                        {
                            completeSection(section);
                            setNavButtons()
                        }
                    }
                };
            if(cc.page.interactiveComponents.requiredComponentsComplete())
                this.componentsComplete = true;
            else
            {
                var incomplete = false;
                for(var property in cc.page.interactiveComponents)
                    if(typeof cc.page.interactiveComponents[property] === "function" || property === "compoundContentSets")
                        continue;
                    else
                        if(!cc.page.interactiveComponents[property].complete && cc.page.interactiveComponents[property].getIncompleteItems(this).length > 0)
                        {
                            incomplete = true;
                            trackingComponentTypes.push(property);
                            cc.page.interactiveComponents[property].attachItemCompletionHandler(componentCompletionHandler)
                        }
                this.componentsComplete = !incomplete
            }
        }
    });
    var initialSection = Math.max(restoreState() || 0,0);
    if(getRequiredIncompleteSections().length === 0)
        cc.completed = true;
    if(this.navigation === "linear")
        for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteSectionIndex(),
            i = 0; i < (firstRequiredIncompleteIndex === -1 ? this.sections.length : firstRequiredIncompleteIndex + 1); i++)
            activateSection(this.sections[i]);
    if(this.navigation === "synched")
    {
        this.syncSectionIn = navigateToSection;
        this.sections.addClass("media_sync").attr("data-inAction","page.interactiveComponents.compoundContentSets.items." + (this.settings.index ? this.settings.index.toString() : "0") + ".syncSectionIn")
    }
    else
        navigateToIndex(initialSection)
}};
function HotspotSet(tile,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(tile)
}
HotspotSet.prototype = {tile:false,hotspots:false,contentItems:false,settings:false,selectedIndex:-1,completed:false,navigation:"default",initSelection:null,completeHotspot:function()
{
},getRootVisual:function()
{
    return this.tile
},countTasks:function(includeComplete,includeOptional)
{
    return!this.hotspots ? 0 : includeComplete && includeOptional ? this.hotspots.length : includeComplete ? this.hotspots.filter('[data-required="true"]').length : includeOptional ? this.hotspots.not(".complete").length : this.hotspots.not(".complete").filter('[data-required="true"]').length
},init:function(tile)
{
    this.tile = $(tile);
    this.hotspots = this.tile.children(".hotspot");
    this.contentItems = this.tile.children(".hotspotcontent");
    this.navigation = this.tile.attr("data-navigation") || "default";
    var hs = this,
        ss = hs.page.courseController.course.scormState,
        pageId = hs.page.pageId,
        getHotspotIndex = function(hotspot)
        {
            for(var i = 0; i < hs.hotspots.length; i++)
                if(hs.hotspots[i] === hotspot)
                    return i;
            return-1
        },
        getSelectedItem = function()
        {
            return hs.contentItems[hs.selectedIndex] || null
        },
        getSelectedHotspot = function()
        {
            return hs.hotspots[hs.selectedIndex] || null
        },
        getRequiredHotspots = function()
        {
            return hs.hotspots.filter('[data-required="true"]')
        },
        getIncompleteHotspots = function()
        {
            return hs.hotspots.not(".complete")
        },
        getRequiredIncompleteHotspots = function()
        {
            return hs.hotspots.not(".complete").filter('[data-required="true"]')
        },
        getFirstIncompleteHotspotIndex = function()
        {
            for(var i = 0; i < hs.hotspots.length; i++)
                if(!$(hs.hotspots[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstRequiredIncompleteHotspotIndex = function()
        {
            for(var i = 0; i < hs.hotspots.length; i++)
                if(hs.hotspots[i].required && !$(hs.hotspots[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstActiveHotspotIndex = function()
        {
            for(var i = 0; i < hs.hotspots.length; i++)
                if(!$(hs.hotspots[i]).hasClass("disabled"))
                    return i;
            return-1
        },
        hideContent = function(item)
        {
            var $item = $(item),
                mediabar = $(".media_bar",item),
                mediaManager = hs.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            mediaIndex > -1 && mediaManager.unloadMedia(mediaIndex);
            $item.stop().fadeOut(300,function()
            {
                $item.css({opacity:"",display:""})
            })
        },
        showContent = function(item)
        {
            var $item = $(item),
                mediabar = $(".media_bar",item),
                mediaManager = hs.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            $item.stop().fadeIn(300,function()
            {
                mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
            })
        },
        markComplete = function(hotspot)
        {
            var $hotspot = $(hotspot);
            if(!$hotspot.hasClass("complete"))
            {
                $hotspot.addClass("complete");
                if($hotspot.children(".completion_indicator").length == 0)
                {
                    var iconSize = $(".content_container") ? $(".content_container").width() / 64 : $(window).width() / 64,
                        completionIndicator = $("<div/>",{"class":"completion_indicator icon"}).css({width:iconSize + "px",height:iconSize + "px"});
                    completionIndicator.append($("<div/>",{"class":"check"}).html('<img src="' + hs.settings.assetPath + 'dark/images/check.nocircle.png" alt="complete" class="showOnDark"/><img src="' + hs.settings.assetPath + 'light/images/check.nocircle.png" alt="complete" class="showOnLight"/>')).appendTo($hotspot)
                }
            }
        },
        completeHotspot = function(h)
        {
            var index = typeof h === "number" ? h : getHotspotIndex(h),
                hotspot = hs.hotspots[index];
            if(hotspot && !$(hotspot).hasClass("complete"))
            {
                markComplete(hotspot);
                setState();
                hotspot.required && hs.page.observer.fire("requiredTaskCompleted",{type:"hotspotSet",component:hs,task:hotspot});
                if(!hs.completed && getRequiredIncompleteHotspots().length === 0)
                {
                    hs.completed = true;
                    hs.page.observer.fire("hotspotSetCompleted",hs.settings.index)
                }
                if(hs.navigation === "linear")
                    for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteHotspotIndex(),
                        i = index + 1; i < (firstRequiredIncompleteIndex === -1 ? hs.hotspots.length : firstRequiredIncompleteIndex + 1); i++)
                        activateHotspot(hs.hotspots[i])
            }
        },
        completeSelectedHotspot = function()
        {
            completeHotspot(hs.selectedIndex)
        },
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "hs#" + (hs.settings.index ? hs.settings.index.toString() : "0") + ":c=([^|]*)",
                completed = currentState.match(new RegExp(pattern));
            if(completed)
                for(var completedIndices = completed[1].split(","),
                    i = 0; i < completedIndices.length; i++)
                    completedIndices[i].trim().length > 0 && !isNaN(completedIndices[i]) && 
                        markComplete(hs.hotspots[completedIndices[i]])
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "hs#" + (hs.settings.index ? hs.settings.index.toString() : "0") + ":c=[^|]*",
                re = new RegExp(pattern),
                completed = [],
                i = 0; i < hs.hotspots.length; i++)
                $(hs.hotspots[i]).hasClass("complete") && completed.push(i);
            if(re.test(currentState))
                currentState = currentState.replace(re,"hs#" + (hs.settings.index ? hs.settings.index.toString() : "0") + ":c=" + completed.join(","));
            else
                currentState += "hs#" + (hs.settings.index ? hs.settings.index.toString() : "0") + ":c=" + completed.join(",") + "|";
            ss.setState(pageId,currentState)
        },
        navigateNext = function()
        {
            var index = hs.selectedIndex + 1;
            index < hs.hotspots.length && selectHotspot.call(hs.hotspots[index])
        },
        activateHotspot = function(hotspot)
        {
            if(hotspot)
            {
                $(hotspot).removeClass("disabled");
                hotspot.target.attr("href","#").unbind("click",toggleHotspot).bind("click",toggleHotspot)
            }
        },
        deactivateHotspot = function(hotspot)
        {
            if(hotspot)
            {
                $(hotspot).addClass("disabled");
                hotspot.target.removeAttr("href").unbind("click",toggleHotspot)
            }
        },
        toggleHotspot = function()
        {
            var index = getHotspotIndex(this.hotspot);
            if(index > -1)
                if(index === hs.selectedIndex)
                    unselectHotspot();
                else
                    selectHotspot(this.hotspot)
        },
        unselectHotspot = function()
        {
            var selectedHotspot = getSelectedHotspot(),
                selectedItem = getSelectedItem();
            selectedHotspot && $(selectedHotspot).removeClass("selected");
            selectedItem && hideContent(selectedItem);
            hs.selectedIndex = -1
        },
        selectHotspot = function(hotspot)
        {
            var index = getHotspotIndex(hotspot);
            if(index !== -1 && index !== hs.selectedIndex)
            {
                unselectHotspot();
                hs.selectedIndex = index;
                selectedHotspot = getSelectedHotspot();
                $(selectedHotspot).addClass("selected");
                selectedItem = getSelectedItem();
                selectedItem && showContent(selectedItem);
                $(window).trigger("resize");
                selectedHotspot.autocomplete && 
                    completeSelectedHotspot()
            }
        },
        videoEnded = function(videoFile)
        {
            videoFile.mustPlayAll && 
                completeSelectedHotspot();
            videoFile.videoAutoNavigate && 
                navigateNext()
        };
    this.completeHotspot = completeHotspot;
    this.contentItems.each(function()
    {
        mediabar = $(".media_bar",this);
        if(mediabar.attr("data-video"))
            mediabar[0].onMediaEnded = videoEnded
    });
    this.contentItems.each(function()
    {
        var position = {left:$(this).attr("data-x"),top:$(this).attr("data-y"),height:$(this).attr("data-height"),width:$(this).attr("data-width")};
        for(var i in position)
            typeof position[i] !== "function" && !isNaN(parseFloat(position[i])) && parseFloat(position[i]) + "" === position[i] && $(this).css(i,position[i] + "%")
    });
    this.hotspots.each(function(index)
    {
        this.hotspotSet = hs;
        this.frame = $("<div/>",{"class":"frame accent_border"}).appendTo($(this));
        this.target = $("<a/>",{"class":"target accent"}).html('<span class="showOnDark"><img src="' + hs.settings.assetPath + 'dark/images/add.normal.png" alt=""/><img src="' + hs.settings.assetPath + 'dark/images/minus.normal.png" alt=""/></span><span class="showOnLight"><img src="' + hs.settings.assetPath + 'light/images/add.normal.png" alt=""/><img src="' + hs.settings.assetPath + 'light/images/minus.normal.png" alt=""/></span>').appendTo($(this));
        this.target.attr("aria-label",$(this).attr("aria-label"));
        this.target[0].hotspot = this;
        var position = {left:$(this).attr("data-x"),top:$(this).attr("data-y"),height:$(this).attr("data-height"),width:$(this).attr("data-width")};
        !isNaN(parseFloat(position.left)) && parseFloat(position.left) + "" === position.left && 
            $(this).css("left",position.left + "%");
        !isNaN(parseFloat(position.top)) && parseFloat(position.top) + "" === position.top && 
            $(this).css("top",position.top + "%");
        if(!isNaN(parseFloat(position.height)) && parseFloat(position.height) + "" === position.height)
        {
            var h = parseFloat(position.height);
            h < 0 && 
                this.frame.css({top:"auto",bottom:"100%"});
            this.frame.css("height",Math.abs(h) / .07 + "%")
        }
        if(!isNaN(parseFloat(position.width)) && parseFloat(position.width) + "" === position.width)
        {
            var w = parseFloat(position.width);
            w < 0 && 
                this.frame.css({left:"auto",right:"100%"});
            this.frame.css("width",Math.abs(w) / .035 + "%")
        }
        this.autocomplete = $(this).attr("data-autocomplete") !== "false";
        this.required = $(this).attr("data-required") === "true";
        if(hs.navigation === "linear" || hs.navigation === "synched")
            deactivateHotspot(this);
        else
            activateHotspot(this);
        $(this).delay(index * 125).fadeIn(250)
    });
    restoreState();
    if(getRequiredIncompleteHotspots().length === 0)
        hs.completed = true;
    if(this.navigation === "linear")
        for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteHotspotIndex(),
            i = 0; i < (firstRequiredIncompleteIndex === -1 ? this.hotspots.length : firstRequiredIncompleteIndex + 1); i++)
            activateHotspot(this.hotspots[i]);
    else
        if(this.navigation === "synched")
        {
            this.syncHotspotIn = selectHotspot;
            this.syncHotspotOut = unselectHotspot;
            this.hotspots.addClass("media_sync").attr("data-inAction","page.interactiveComponents.hotspotSets.items." + (this.settings.index ? this.settings.index.toString() : "0") + ".syncHotspotIn").attr("data-outAction","page.interactiveComponents.hotspotSets.items." + (this.settings.index ? this.settings.index.toString() : "0") + ".syncHotspotOut")
        }
}};
function InstructionOverlay()
{
    this.container = false;
    this.closeButton = false;
    this.openButton = false;
    this.settings = false
}
InstructionOverlay.prototype.init = function(container,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.container = $(container);
    this.closeButton = this.container.children("a.close");
    this.openButton = window.parent.InfoButtonView;
    if(!this.closeButton.length)
        this.closeButton = $("<a/>",{"class":"button close"}).appendTo(this.container);
    var io = this,
        d;
    buttonSize = $(".content_container").length ? $(".content_container").width() / 32 : $(window).width() / 32;
    this.closeButton.attr("href","#").css({width:buttonSize + "px",height:buttonSize + "px"}).empty().append($(new Image).attr({src:this.settings.assetPath + "dark/images/close.normal.png",alt:parent.Resources.InstructionsDialog_Close_Button_Text,height:"100%",width:"100%","class":"showOnDark"})).click(function()
    {
        io.close.call(io)
    });
    this.closeButton.append($(new Image).attr({src:this.settings.assetPath + "light/images/close.normal.png",alt:parent.Resources.InstructionsDialog_Close_Button_Text,height:"100%",width:"100%","class":"showOnLight"})).click(function()
    {
        io.close.call(io)
    });
    this.openButton && this.openButton.bind("click",function()
    {
        io.open.call(io)
    });
    var ss = this.page.courseController.course.scormState,
        pageId = this.page.pageId,
        currentState = ss.getState(pageId),
        overlayState = currentState.match(/info:([^\|]*)/);
    if(!overlayState || overlayState[1] !== "c")
        this.open.call(this);
    else
    {
        this.openButton && this.openButton.show();
        if(this.container.closest(".tabset_wrapper").length)
        {
            var tabSet = this.container.closest(".tabset_wrapper")[0].tabSet;
            tabSet && tabSet.tabs.length > 0 && tabSet.tabs.filter(".selected").length === 0 && tabSet.initSelection && tabSet.initSelection()
        }
    }
};
InstructionOverlay.prototype.close = function()
{
    if(this.container.is(":visible"))
    {
        this.container.hide();
        this.openButton && this.openButton.show();
        if(this.container.closest(".tabset_wrapper").length)
        {
            var tabSet = this.container.closest(".tabset_wrapper")[0].tabSet;
            tabSet && tabSet.tabs.length > 0 && tabSet.tabs.filter(".selected").length === 0 && tabSet.initSelection && tabSet.initSelection()
        }
        var ss = this.page.courseController.course.scormState,
            pageId = this.page.pageId,
            currentState = ss.getState(pageId);
        if(/info:[^\|]*/.test(currentState))
            currentState = currentState.replace(/info:[^\|]*/,"info:c");
        else
            currentState += "info:c|";
        ss.setState(pageId,currentState)
    }
};
InstructionOverlay.prototype.open = function()
{
    if(this.container.is(":not(:visible)"))
    {
        this.container.show().css("z-index",2e3);
        this.openButton && this.openButton.hide();
        var ss = this.page.courseController.course.scormState,
            pageId = this.page.pageId,
            currentState = ss.getState(pageId);
        if(/overlay:[^\|]*/.test(currentState))
            currentState = currentState.replace(/info:[^\|]*/,"info:o");
        else
            currentState += "info:o|";
        ss.setState(pageId,currentState)
    }
};
function MatchingInterface(wrapper,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(wrapper);
    this.assemble()
}
MatchingInterface.prototype = {wrapper:false,pairContainer:false,statementContainer:false,answerContainer:false,statements:false,answers:false,settings:false,completed:false,required:false,getRootVisual:function()
{
    return this.wrapper
},assemble:function()
{
    if($("body").hasClass("accessible"))
    {
        $(".match_input_container",this.wrapper).children("input").attr("disabled",false);
        $(".matched .match_input_container",this.wrapper).children("input").attr("disabled",true);
        var statementContainer = this.statementContainer,
            answerContainer = this.answerContainer;
        this.pairContainer.children(".match_pair").each(function()
        {
            for(var index = $(this).children(".match_statement").data("originalIndex"),
                i = 0; i < statementContainer.children(".match_statement").length; i++)
                if(statementContainer.children(".match_statement").eq(i).data("originalIndex") > index)
                    break;
            if(i >= statementContainer.children().length)
                statementContainer.append($(this).children(".match_statement"));
            else
                $(this).children(".match_statement").insertBefore(statementContainer.children(".match_statement").eq(i));
            index = $(this).children(".match_answer").data("originalIndex");
            for(i = 0; i < answerContainer.children(".match_answer").length; i++)
                if(answerContainer.children(".match_answer").eq(i).data("originalIndex") > index)
                    break;
            if(i >= answerContainer.children().length)
                answerContainer.append($(this).children(".match_answer"));
            else
                $(this).children(".match_answer").insertBefore(answerContainer.children(".match_answer").eq(i));
            $(this).remove()
        });
        this.answers.draggable("disable");
        this.statements.droppable("disable")
    }
    else
    {
        $(".match_input_container",this.wrapper).children("input").attr("disabled",true);
        var answerContainer = this.answerContainer,
            pairContainer = this.pairContainer;
        $(".matched",this.statementContainer).each(function()
        {
            var answer = $('.match_answer[data-value="' + $(this).attr("data-answer") + '"]',answerContainer),
                pair = $("<div/>",{"class":"match_pair"});
            pair.append(this,answer,$("<div/>",{"class":"clear"}));
            pairContainer.append(pair)
        });
        this.answers.draggable && 
            $(".match_answer",this.answerContainer).draggable({disabled:false,revert:true});
        this.statements.droppable && 
            $(".match_statement",this.statementContainer).droppable("enable")
    }
},init:function(wrapper)
{
    this.wrapper = $(wrapper);
    this.statementContainer = this.wrapper.children(".match_statement_container");
    this.answerContainer = this.wrapper.children(".match_answer_container");
    this.pairContainer = $("<div/>",{"class":"match_pair_container"}).prependTo(this.wrapper);
    this.statements = this.statementContainer.children(".match_statement");
    this.answers = this.answerContainer.children(".match_answer");
    this.required = this.wrapper.attr("data-required") === "true";
    var mi = this,
        ss = mi.page.courseController.course.scormState,
        pageId = mi.page.pageId,
        markStatementMatched = function(statement)
        {
            if(!statement.hasClass("matched"))
            {
                var answer = statement.attr("data-answer");
                statement.addClass("matched").droppable("disable");
                $('.match_answer[data-value="' + answer + '"]',mi.wrapper).addClass("matched").draggable("disable");
                if($(".completion_indicator",statement).length === 0)
                {
                    var iconSize = $(".content_container").length ? $(".content_container").width() / 64 : $(window).width() / 64,
                        completionIndicator = $("<div/>",{"class":"completion_indicator icon"}).css({width:iconSize + "px",height:iconSize + "px"});
                    completionIndicator.append($("<div/>",{"class":"check"}).html('<img src="' + mi.settings.assetPath + 'dark/images/check.nocircle.png" alt="complete" class="showOnDark"/><img src="' + mi.settings.assetPath + 'light/images/check.nocircle.png" alt="complete" class="showOnLight"/>')).appendTo(statement)
                }
                $("input",statement.children(".match_input_container")).val(answer).attr("disabled",true).siblings(".input_feedback").remove()
            }
        },
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "mi#" + (mi.settings.index ? mi.settings.index.toString() : "0") + ":c=([^|]*)",
                matchedStatements = currentState.match(new RegExp(pattern));
            if(matchedStatements)
                for(var statements = matchedStatements[1].split(","),
                    i = 0,
                    index; i < mi.statements.length; i++)
                {
                    index = mi.statements.eq(i).data("originalIndex");
                    index != null && index != undefined && statements.indexOf(index.toString()) >= 0 && 
                        markStatementMatched(mi.statements.eq(i))
                }
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "mi#" + (mi.settings.index ? mi.settings.index.toString() : "0") + ":c=[^|]*",
                re = new RegExp(pattern),
                statements = [],
                i = 0; i < mi.statements.length; i++)
                mi.statements.eq(i).hasClass("matched") && statements.push(mi.statements.eq(i).data("originalIndex"));
            if(re.test(currentState))
                currentState = currentState.replace(re,"mi#" + (mi.settings.index ? mi.settings.index.toString() : "0") + ":c=" + statements.join(","));
            else
                currentState += "mi#" + (mi.settings.index ? mi.settings.index.toString() : "0") + ":c=" + statements.join(",") + "|";
            ss.setState(pageId,currentState)
        },
        answerDropped = function(e,ui)
        {
            var statement = $(this),
                answer = ui.draggable;
            answer.position({of:statement,my:"right top",at:"left top"}).removeClass("correct").draggable("option","revert",false);
            markStatementMatched(statement);
            var pair = $("<div/>",{"class":"match_pair"}).css({top:statement.offset().top - mi.pairContainer.offset().top - mi.pairContainer.height() + "px"});
            pair.append(statement,answer,$("<div/>",{"class":"clear"})).appendTo(mi.pairContainer);
            answer.css({top:"auto",left:"auto"});
            pair.animate({top:"0px"},400);
            setState();
            if(mi.statements.not(".matched").length === 0)
            {
                mi.completed = true;
                mi.required && mi.page.observer.fire("requiredTaskCompleted",{type:"matchingSet",component:mi,task:mi});
                mi.page.observer.fire("matchingSetCompleted",mi.settings.index)
            }
        },
        validateInput = function()
        {
            var statement = $(this).closest(".match_statement");
            if($(this).val().toUpperCase() === statement.attr("data-answer").toUpperCase())
            {
                markStatementMatched(statement);
                if(statement.nextAll().not(".matched").length > 0)
                    statement.nextAll().not(".matched").first().find("input").focus();
                else
                    statement.siblings().not(".matched").length > 0 && 
                        statement.siblings().not(".matched").first().find("input").focus();
                setState();
                if(mi.statements.not(".matched").length === 0)
                {
                    mi.completed = true;
                    mi.required && mi.page.observer.fire("requiredTaskCompleted",{type:"matchingSet",component:mi,task:mi});
                    mi.page.observer.fire("matchingSetCompleted",mi.settings.index)
                }
            }
            else
                $(this).siblings(".input_feedback").length === 0 && 
                    $(this).after($('<div class="input_feedback">incorrect</div>'))
        };
    this.answers.each(function()
    {
        $(this).data("originalIndex",$(this).index());
        $(this).draggable && 
            $(this).draggable({containment:"document",revert:true,revertDuration:100}).contextmenu(function(e)
            {
                e.preventDefault();
                e.stopPropagation();
                return false
            }).mousedown(function(e)
            {
                if(e.button === 2)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    return false
                }
            })
    });
    this.statements.each(function()
    {
        $(this).data("originalIndex",$(this).index());
        $("input",$(this).children(".match_input_container")).change(validateInput).keydown(function(e)
        {
            e.keyCode === 13 && 
                $(this).trigger("change")
        });
        var answer = $(this).attr("data-answer");
        answer && $(this).droppable && 
            $(this).droppable({accept:$('.match_answer[data-value="' + answer + '"]',mi.wrapper),hoverClass:"correct",over:function(e,ui)
            {
                ui.draggable.addClass("correct")
            },out:function(e,ui)
            {
                ui.draggable.removeClass("correct")
            },drop:answerDropped})
    });
    restoreState();
    if(this.statements.not(".matched").length === 0)
        this.completed = true
}};
function MediaElement(mediaBar,type,source,host,index,autoLoad,autoUnload,required)
{
    this.mediaBar = mediaBar;
    this.type = type;
    this.source = source;
    this.host = host;
    this.mediaIndex = index;
    this.autoLoad = autoLoad;
    this.required = required;
    this.autoUnload = autoUnload;
    this.isAutoLoaded = false;
    this.mediaController = null;
    this.completed = false;
    this.getRootVisual = function()
    {
        return this.mediaBar
    }
}
function MediaManager()
{
    this.page = false;
    this.mediaElements = [];
    this.observer = false;
    this.getActiveIndex = null
}
MediaManager.prototype.init = function(page)
{
    this.page = page;
    this.observer = new Observer;
    var mm = this,
        elements = [],
        activeIndex = -1,
        playingIndex = -1,
        pageId = mm.page.pageId,
        ss = mm.page.courseController.course.scormState,
        getActiveAudioIndex = function()
        {
            for(var i = 0; i < mm.mediaElements.length; i++)
                if(mm.mediaElements[i].type === "audio" && mm.mediaElements[i].mediaController)
                    return i;
            return-1
        },
        stopMedia = function(index)
        {
            if(index === -1)
                mm.page.audioController.stop();
            else
            {
                var element = mm.mediaElements[index];
                element && element.mediaController && element.mediaController.stop && element.mediaController.stop()
            }
        },
        completeMediaElement = function(element)
        {
            if(!element.completed)
            {
                element.completed = true;
                setState();
                element.required && mm.page.observer.fire("requiredTaskCompleted",{type:"mediaElement",component:element,task:element});
                mm.page.observer.fire("mediaElementCompleted")
            }
        },
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "mm:c=([^|]*)",
                completed = currentState.match(new RegExp(pattern));
            if(completed)
                for(var completedIndices = completed[1].split(","),
                    i = 0; i < completedIndices.length; i++)
                    if(completedIndices[i].trim().length > 0 && !isNaN(completedIndices[i]))
                        mm.mediaElements[completedIndices[i]].completed = true
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "mm:c=[^|]*",
                re = new RegExp(pattern),
                completed = [],
                i = 0; i < mm.mediaElements.length; i++)
                mm.mediaElements[i].completed && completed.push(i);
            if(re.test(currentState))
                currentState = currentState.replace(re,"mm:c=" + completed.join(","));
            else
                currentState += "mm:c=" + completed.join(",") + "|";
            ss.setState(pageId,currentState)
        };
    this.getActiveIndex = function()
    {
        return activeIndex
    };
    $(".media_bar",".tabcontent,.accordion_expansion,.tab_popup").attr("data-autoLoad","false");
    $(".compoundcontent_section > .media_bar").attr("data-autoLoad","false");
    $(".media_bar").not($(".media_bar",".visuallyhidden")).each(function()
    {
        var $mediabar = $(this),
            audio = $mediabar.attr("data-audio"),
            video = $mediabar.attr("data-video"),
            autoLoad = $mediabar.attr("data-autoLoad") === "true" ? true : false,
            autoUnload = $mediabar.attr("data-autoUnload") === "true" ? true : false,
            required = $mediabar.attr("data-required") === "true" ? true : false,
            mediaIndex = /^([0-9]+)$/.test($mediabar.attr("data-mediaIndex")) ? parseInt($mediabar.attr("data-mediaIndex")) : NaN,
            host = $mediabar.attr("data-mediaContainer") ? $("#" + $mediabar.attr("data-mediaContainer"))[0] || this : this;
        (video || audio) && 
            elements.push(new MediaElement(this,video ? "video" : "audio",video ? video : audio,host,mediaIndex,autoLoad,autoUnload,required))
    });
    this.mediaElements = elements.sort(function(a,b)
    {
        return a.autoLoad && !b.autoLoad ? -1 : b.autoLoad && !a.autoLoad ? 1 : a.mediaIndex !== NaN && (b.mediaIndex === NaN || a.mediaIndex < b.mediaIndex) ? -1 : b.mediaIndex !== NaN && (a.mediaIndex === NaN || b.mediaIndex < a.mediaIndex) ? 1 : 0
    });
    this.observer.observe("mediaUnloaded",function(index)
    {
        playingIndex === index && (playingIndex = -1);
        if(activeIndex === index)
        {
            var oldIndex = activeIndex;
            activeIndex = -1;
            mm.observer.fire("mediaIndexChanged",{oldIndex:oldIndex,newIndex:activeIndex})
        }
    });
    this.observer.observe("mediaLoaded",function(controller)
    {
        this.mediaController = controller;
        !controller.videoFile.mustPlayAll && 
            completeMediaElement(this)
    });
    this.observer.observe("mediaStarted",function()
    {
        mm.page.audioController.stop();
        var i = mm.indexOf(this);
        playingIndex !== -1 && playingIndex !== i && stopMedia(playingIndex);
        playingIndex = i;
        if(activeIndex !== i)
        {
            var oldIndex = activeIndex;
            activeIndex = i;
            mm.observer.fire("mediaIndexChanged",{oldIndex:oldIndex,newIndex:activeIndex})
        }
    });
    this.observer.observe("mediaStopped",function()
    {
        playingIndex === mm.indexOf(this) && (playingIndex = -1)
    });
    this.observer.observe("mediaEnded",function(videoFile)
    {
        var i = mm.indexOf(this);
        playingIndex === i && (playingIndex = -1);
        this.autoUnload && 
            mm.unloadMedia(i);
        videoFile.mustPlayAll && 
            completeMediaElement(this);
        if(this.mediaBar && this.mediaBar.onMediaEnded)
            this.mediaBar.onMediaEnded.call(this.mediaBar,videoFile);
        else
            if(videoFile.videoAutoNavigate || this.isAutoLoaded)
                if(mm.mediaElements[i + 1] && mm.mediaElements[i + 1].autoLoad)
                    mm.playMedia(i + 1,this.isAutoLoaded);
                else
                    if(videoFile.videoAutoNavigate && i === mm.mediaElements.length - 1)
                        !mm.page.isPopup && mm.page.courseController.navigateToNextPage()
    });
    this.observer.observe("audioLoaded",function()
    {
        var i = getActiveAudioIndex();
        playingIndex !== -1 && playingIndex !== i && stopMedia(playingIndex);
        if(activeIndex !== i)
        {
            var oldIndex = activeIndex;
            activeIndex = i;
            mm.observer.fire("mediaIndexChanged",{oldIndex:oldIndex,newIndex:activeIndex})
        }
        activeIndex !== -1 && completeMediaElement(mm.mediaElements[activeIndex])
    });
    this.observer.observe("audioStarted",function()
    {
        var i = getActiveAudioIndex();
        playingIndex !== -1 && playingIndex !== i && stopMedia(playingIndex);
        if(activeIndex !== i)
        {
            var oldIndex = activeIndex;
            activeIndex = i;
            mm.observer.fire("mediaIndexChanged",{oldIndex:oldIndex,newIndex:activeIndex})
        }
    });
    this.observer.observe("audioStopped",function()
    {
        var i = getActiveAudioIndex();
        playingIndex === i && (playingIndex = -1)
    });
    this.observer.observe("audioEnded",function()
    {
        var i = getActiveAudioIndex();
        playingIndex === i && (playingIndex = -1);
        if(activeIndex === i && i !== -1)
        {
            mm.mediaElements[i].autoUnload && 
                mm.unloadMedia(i);
            if(mm.mediaElements[i].mediaBar && mm.mediaElements[i].mediaBar.onMediaEnded)
                mm.mediaElements[i].mediaBar.onMediaEnded.call(mm.mediaElements[i].mediaBar);
            else
                mm.mediaElements[i].isAutoLoaded && mm.mediaElements[i + 1] && mm.mediaElements[i + 1].autoLoad && 
                    mm.playMedia(i + 1,true)
        }
    });
    this.mediaElements.length > 0 && (this.page.audioController.observer = this.observer);
    this.mediaElements.length > 0 && this.mediaElements[0].autoLoad && 
        this.playMedia(0,true);
    $(window).on("unload",function()
    {
        mm.unload()
    })
};
MediaManager.prototype.indexOf = function(e,field)
{
    for(var i = 0; i < this.mediaElements.length; i++)
        if(e === (field ? this.mediaElements[i][field] : this.mediaElements[i]))
            return i;
    return-1
};
MediaManager.prototype.playMedia = function(index,isAutoLoaded)
{
    var element = this.mediaElements[index],
        mm = this;
    if(element)
    {
        element.isAutoLoaded = isAutoLoaded ? true : false;
        if(element.mediaController)
            element.mediaController.play();
        else
            if(element.type === "video")
            {
                for(var loadVideo = function()
                    {
                        element.host.id = element.host.id || "videoHost-" + index.toString();
                        $(element.host).hasClass("videohost") || $(element.host).addClass("videohost");
                        mm.page.courseController.showVideo(element.source,element.host.id,element,mm.observer,"_media_" + index.toString())
                    },
                    i = 0,
                    hasConflict = false; i < this.mediaElements.length; i++)
                    if(i !== index && this.mediaElements[i].mediaController && this.mediaElements[i].host === element.host && this.mediaElements[i].type === "video")
                    {
                        hasConflict = true;
                        this.unloadMedia(i,loadVideo);
                        break
                    }
                !hasConflict && loadVideo()
            }
            else
            {
                for(var ac = this.page.audioController,
                    cc = this.page.courseController,
                    mediaFolder = cc.course.getMediaFolderPath(),
                    loadAudio = function()
                    {
                        element.mediaController = ac;
                        ac.readyToPlay(mediaFolder + element.source,ac.volume,mm.observer,element)
                    },
                    i = 0,
                    hasConflict = false; i < this.mediaElements.length; i++)
                    if(i !== index && this.mediaElements[i].mediaController && this.mediaElements[i].type === "audio")
                    {
                        hasConflict = true;
                        this.unloadMedia(i,loadAudio);
                        break
                    }
                !hasConflict && loadAudio()
            }
    }
};
MediaManager.prototype.unloadMedia = function(index,callback)
{
    var element = this.mediaElements[index];
    if(element)
        if(element.type === "video")
        {
            $(element.host).children("iframe").load(function()
            {
                $(this).remove();
                callback && callback()
            }).attr("src","");
            element.host.id === "videoHost-" + index.toString() && (element.host.id = "");
            $(element.host).hasClass("videohost") && $(element.host).removeClass("videohost");
            this.observer.fire("mediaUnloaded",index);
            element.mediaController = null
        }
        else
        {
            !this.unloading && element.mediaController.hideAndStop();
            this.observer.fire("mediaUnloaded",index);
            element.mediaController = null;
            callback && callback()
        }
};
MediaManager.prototype.unload = function()
{
    this.unloading = true;
    for(var i = 0; i < this.mediaElements.length; i++)
        this.mediaElements[i].mediaController && this.unloadMedia(i);
    this.page.audioController.observer === this.observer && (this.page.audioController.observer = null)
};
function MediaSyncManager()
{
    this.page = false;
    this.items = []
}
MediaSyncManager.prototype.init = function(page)
{
    this.page = page;
    var msm = this,
        audioPlayer = page.audioController ? $("#" + page.audioController.id,parent.document).find("#" + page.audioController.id + "Audio")[0] : undefined,
        currentMediaElement = null,
        syncElements = function()
        {
            for(var mediaPosition = !currentMediaElement || currentMediaElement.type === "audio" ? audioPlayer.src && !/\/$/.test(audioPlayer.src) ? audioPlayer.currentTime : NaN : currentMediaElement.mediaController ? currentMediaElement.mediaController.videoPosition : NaN,
                i = 0; i < msm.items.length; i++)
                if(!isNaN(mediaPosition) && (currentMediaElement && msm.items[i].mediaId === currentMediaElement.mediaBar.id || !currentMediaElement && !msm.items[i].mediaId) && msm.items[i].startTime !== null && msm.items[i].startTime <= mediaPosition && (msm.items[i].endTime === null || msm.items[i].endTime > mediaPosition))
                {
                    if(!$(msm.items[i].element).hasClass("insync"))
                    {
                        $(msm.items[i].element).addClass("insync");
                        msm.items[i].inAction && msm.items[i].inAction.call(msm.items[i].element)
                    }
                }
                else
                    if($(msm.items[i].element).hasClass("insync"))
                    {
                        $(msm.items[i].element).removeClass("insync");
                        msm.items[i].outAction && msm.items[i].outAction.call(msm.items[i].element)
                    }
        },
        parseAction = function(action)
        {
            if(!action)
                return;
            var m = action.match(/^([\w, \$]+[\w, \$, \.]*)/),
                f = window;
            if(!m)
                return null;
            for(var i = 0,
                c = m[1].split("."); i < c.length; i++)
            {
                if(c[i].length === 0)
                    continue;
                if(typeof f[c[i]] === "undefined")
                    return null;
                f = f[c[i]]
            }
            if(typeof f !== "function")
                return null;
            var p = action.substring(m[1].length);
            if(p.length > 0 && (p.substring(0,1) !== "(" || p.substring(p.length - 1,p.length) !== ")"))
                return null;
            p = p.substring(1,p.length - 1);
            for(var a = p.split(","),
                i = 0; i < a.length; i++)
                !isNaN(Number(a[i])) && (a[i] = Number(a[i]));
            return function()
            {
                return f.apply(this,a)
            }
        };
    this.items = [];
    $(".media_sync").each(function()
    {
        msm.items.push({element:this,mediaId:$(this).attr("data-mediaId"),startTime:utils.getTimeInSeconds($(this).attr("data-startTime")),endTime:utils.getTimeInSeconds($(this).attr("data-endTime")),inAction:parseAction($(this).attr("data-inAction")),outAction:parseAction($(this).attr("data-outAction"))})
    });
    if(this.items.length)
    {
        audioPlayer && audioPlayer.addEventListener("timeupdate",syncElements);
        $(window).unload(function()
        {
            audioPlayer && audioPlayer.removeEventListener("timeupdate",syncElements);
            currentMediaElement && currentMediaElement.type === "video" && currentMediaElement.mediaController && currentMediaElement.mediaController.observer && currentMediaElement.mediaController.observer.unobserve("timeupdate",syncElements)
        });
        if(this.page.mediaManager.getActiveIndex && this.page.mediaManager.getActiveIndex() !== -1)
        {
            currentMediaElement = this.page.mediaManager.mediaElements[this.page.mediaManager.getActiveIndex()];
            currentMediaElement && currentMediaElement.type === "video" && currentMediaElement.mediaController && currentMediaElement.mediaController.observer && currentMediaElement.mediaController.observer.observe("timeupdate",syncElements);
            syncElements()
        }
        this.page.mediaManager.observer.observe("mediaIndexChanged",function(data)
        {
            currentMediaElement && currentMediaElement.type === "video" && currentMediaElement.mediaController && currentMediaElement.mediaController.observer && currentMediaElement.mediaController.observer.unobserve("timeupdate",syncElements);
            currentMediaElement = this.page.mediaManager.mediaElements[data.newIndex];
            currentMediaElement && currentMediaElement.type === "video" && currentMediaElement.mediaController && currentMediaElement.mediaController.observer && currentMediaElement.mediaController.observer.observe("timeupdate",syncElements);
            syncElements()
        })
    }
};
function ModuleLinkTileSet(container,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.settings = $.extend(false,defaults,settings);
    this.page = page;
    this.init(container)
}
ModuleLinkTileSet.prototype = {container:false,tiles:false,settings:false,init:function(container)
{
    this.container = $(container);
    var cc = this.page.courseController,
        modules = cc.course.modules,
        currentModule = cc.course.getCurrentPage().getModule();
    this.container.children(".module_link").remove();
    for(var i = 0,
        count = 0,
        tile; i < modules.length; i++)
        if(modules[i].isRequired())
        {
            count++;
            tile = $("<a/>",{"class":"module_link half_square tile"}).html('<div class="module_title"></div><div class="module_duration subtle"></div><div class="module_number"></div><div class="tile_footer"><div class="tile_footer_content"></div></div>');
            for(var j = 0,
                duration = 0,
                pageId = null,
                started = false; j < modules[i].pages.length; j++)
            {
                duration += utils.getRecursivePageDuration(modules[i].pages[j]);
                if(!modules[i].pageState.isLocked && pageId === null)
                    pageId = utils.getRecursiveFirstIncompletePageId(modules[i].pages[j]);
                if(!started)
                    started = utils.getRecursiveFirstCompletePageId(modules[i].pages[j]) !== null
            }
            if(!modules[i].pageState.isLocked && cc.course.getPageById(pageId) === null)
                pageId = modules[i].pages[0].id;
            $(".module_title",tile).text(modules[i].name);
            $(".module_number",tile).text(count < 10 ? "0" + count.toString() : count);
            $(".module_duration",tile).text(duration + " minutes to complete");
            !modules[i].pageState.isLocked && tile.attr("href","#").attr("data-pageId",pageId).click(function()
            {
                cc.navigateToPageById($(this).attr("data-pageId"))
            });
            if(modules[i].isComplete())
                $(".tile_footer_content",tile).html('<div class="completion_indicator icon"><div class="check"><img src="' + this.settings.assetPath + 'dark/images/check.nocircle.png" alt="complete" class="showOnDark"/><img src="' + this.settings.assetPath + 'light/images/check.nocircle.png" alt="complete" class="showOnLight"/></div></div>');
            else
                if(modules[i].pageState.isLocked)
                {
                    $(".tile_footer_content",tile).html('<div class="locked_indicator icon"><div class="lock"><img src="' + this.settings.assetPath + 'dark/images/lock16.png" alt="complete" class="showOnDark"/><img src="' + this.settings.assetPath + 'light/images/lock16.png" alt="locked" class="showOnLight"/></div></div>');
                    $(".module_number",tile).addClass("disabled")
                }
                else
                    started && $(".tile_footer_content",tile).text("In Progress");
            modules[i] === currentModule && $(".module_number",tile).addClass("accent_text");
            this.container.append(tile);
            tile.offset().left + tile.width() > $(".content_container").offset().left + $(".content_container").width() && 
                $("<div/>",{"class":"clear"}).insertBefore(tile);
            var iconSize = $(".content_container").length ? $(".content_container").width() / 64 : $(window).width() / 64;
            $(".icon",tile).css({width:iconSize + "px",height:iconSize + "px"})
        }
    this.tiles = this.container.children(".module_link")
}};
function Observer()
{
    this.observations = []
}
function Observation(name,func)
{
    this.name = name;
    this.func = func
}
Observer.prototype = {observe:function(name,func)
{
    for(var exists = false,
        i = 0,
        ilen = this.observations.length; i < ilen; i++)
    {
        var observer = this.observations[i];
        if(observer.name == name && observer.func == func)
        {
            exists = true;
            break
        }
    }
    !exists && 
        this.observations.push(new Observation(name,func))
},unobserve:function(name,func)
{
    for(var i = 0,
        ilen = this.observations.length; i < ilen; i++)
    {
        var observer = this.observations[i];
        if(observer.name == name && observer.func == func)
        {
            this.observations.splice(i,1);
            break
        }
    }
},fire:function(name,data,scope)
{
    for(var observers = [],
        i = 0,
        ilen = this.observations.length; i < ilen; i++)
    {
        var observer = this.observations[i];
        observer.name == name && 
            observers.push(observer)
    }
    for(var i = 0,
        ilen = observers.length; i < ilen; i++)
        observers[i].func.call(scope || window,data)
}};
var page = function()
    {
        var toggleAccessibility = function()
            {
                if($("body").hasClass("accessible"))
                    accessibilityOff();
                else
                    accessibilityOn()
            },
            accessibilityOn = function()
            {
                $("body").addClass("accessible");
                handleAccessibleModeChange()
            },
            accessibilityOff = function()
            {
                $("body").removeClass("accessible");
                handleAccessibleModeChange()
            },
            handleAccessibleModeChange = function()
            {
                $(".match_wrapper").each(function()
                {
                    this.matchingInterface && this.matchingInterface.assemble.call(this.matchingInterface)
                });
                $(".stack_wrapper").each(function()
                {
                    this.stackingInterface && this.stackingInterface.assemble.call(this.stackingInterface)
                })
            },
            hookAccessibility = function()
            {
                $(document).keydown(function(e)
                {
                    e.altKey && e.ctrlKey && e.keyCode === 65 && toggleAccessibility()
                });
                var accessibleWrapper = $("<div/>",{"class":"visuallyhidden"}).prependTo("body");
                pageModel && pageModel.canSendCompletion() && !pageModel.isComplete() && accessibleWrapper.append($("<a/>",{href:"#"}).click(function()
                {
                    pageModel.setComplete()
                }).text("Click here to mark page complete."));
                return accessibleWrapper
            },
            resources = parent.Resources,
            player = parent.player,
            cc = player.courseController,
            ac = parent.player.activeAudioController || parent.player.pageAudioController,
            observer = new Observer,
            tileManager = new TileManager,
            mediaManager = new MediaManager,
            mediaSyncManager = new MediaSyncManager,
            instructionOverlay = new InstructionOverlay,
            interactiveComponents = {requiredComponentsComplete:function()
            {
                for(var property in interactiveComponents)
                    if(typeof interactiveComponents[property] !== "function" && interactiveComponents[property].complete === false)
                        return false;
                return true
            }},
            registerComponentType = function(name,items,completionEvent,optionalAllowed)
            {
                var getIncompleteItems = optionalAllowed ? function(context,includeOptional)
                    {
                        for(var i = 0,
                            incomplete = []; i < items.length; i++)
                            (items[i].required || includeOptional === true) && !items[i].completed && (!context || typeof items[i].getRootVisual !== "function" || $(context).find(items[i].getRootVisual()).length > 0) && incomplete.push(items[i]);
                        return incomplete
                    } : function(context)
                    {
                        for(var i = 0,
                            incomplete = []; i < items.length; i++)
                            !items[i].completed && (!context || typeof items[i].getRootVisual !== "function" || $(context).find(items[i].getRootVisual()).length > 0) && incomplete.push(items[i]);
                        return incomplete
                    },
                    completionHandler = function()
                    {
                        if(getIncompleteItems().length === 0)
                        {
                            interactiveComponents[name] && (interactiveComponents[name].complete = true);
                            observer.unobserve(completionEvent,completionHandler);
                            interactiveComponents.requiredComponentsComplete() && observer.fire("requiredComponentsComplete")
                        }
                    },
                    complete = getIncompleteItems().length === 0;
                interactiveComponents[name] = {items:items,complete:complete,getIncompleteItems:getIncompleteItems,attachItemCompletionHandler:function(handler)
                {
                    observer.observe(completionEvent,handler)
                },removeItemCompletionHandler:function(handler)
                {
                    observer.unobserve(completionEvent,handler)
                },countTasks:function(includeComplete,includeOptional)
                {
                    for(var count = 0,
                        i = 0; i < items.length; i++)
                        if(typeof items[i].countTasks === "function")
                            count += items[i].countTasks(includeComplete,includeOptional);
                        else
                            if((includeOptional || items[i].required) && (includeComplete || !items[i].completed))
                                count += 1;
                    return count
                }};
                !complete && observer.observe(completionEvent,completionHandler)
            },
            countTasks = function(includeComplete,includeOptional,omitTypes,includeTypes)
            {
                var count = 0;
                for(var property in interactiveComponents)
                    if(typeof interactiveComponents[property] !== "function" && (!omitTypes || omitTypes.indexOf(property) === -1) && (!includeTypes || includeTypes.indexOf(property) !== -1))
                        count += interactiveComponents[property].countTasks(includeComplete,includeOptional);
                return count
            },
            setComplete = function()
            {
                pageModel && pageModel.setComplete()
            },
            getPageModel = function(pageId)
            {
                var page = cc.course.getPageById(pageId);
                page || cc.course.recursePagesFn(cc.course.privatePages,function(p)
                {
                    if(p.id == pageId)
                        page = p
                },0);
                return page
            },
            initReceiveCreditContent = function()
            {
                if(cc.course.scormState.isComplete)
                    $(this).addClass("creditReceived");
                else
                {
                    var remainingPages = cc.countRemainingRequiredPages(false);
                    if(remainingPages === 0)
                        $(this).addClass("complete").append($('<input type="button" class="accent accent_border"/>').val(resources.RC_CreditButton_Text).on("click",function()
                        {
                            setComplete();
                            window.location.reload()
                        }));
                    else
                    {
                        $(this).append($('<input type="button" class="accent accent_border"/>').val(resources.RC_ReturnButton_Text).on("click",function()
                        {
                            var incompleteId = utils.getFirstIncompletePageInCourse(cc.course);
                            incompleteId && cc.course.navigateToPageById(incompleteId)
                        }));
                        if(player.contentsWidgetView)
                        {
                            player.contentsWidgetView.showContentsWidget(true);
                            player.contentsWidgetView.expandAllItems()
                        }
                    }
                }
            },
            id = null,
            pageModel = null,
            isPopup = false;
        if(cc.contentPopupView && cc.course.currentPopupPageId)
        {
            id = cc.course.currentPopupPageId;
            isPopup = true
        }
        else
            id = cc.course.getCurrentPage().id;
        pageModel = getPageModel(id);
        if(pageModel && pageModel.pageType.PlaybackSource === "Branching" && pageModel.BranchingGraph)
        {
            var branchingPoint = pageModel.BranchingGraph.getCurrentLocation();
            if(branchingPoint)
            {
                if(branchingPoint.location === 0)
                    id = branchingPoint.contentPageId;
                else
                    if(branchingPoint.location === 3 && branchingPoint.currentAttempt)
                        id = branchingPoint.currentAttempt.getFeedbackPageId();
                    else
                        if(branchingPoint.selectedFeedbackPageId)
                            id = branchingPoint.selectedFeedbackPageId;
                pageModel = getPageModel(id)
            }
        }
        $(document).ready(function()
        {
            $(".page_container > .content_wrapper > .content_container").each(function()
            {
                $(this).sizable({aspectRatio:window.aspectRatioOverride ? window.aspectRatioOverride : 2 / 1})
            });
            $(".scroll_box").each(function()
            {
                $(this).scrollbox({scrollStep:14,mouseOverArrowScroll:true,ballHeight:"relative",sizeControls:function(container,controls,settings)
                {
                    var pointSize = $(".content_container").length ? $(".content_container").width() / 100 : $(window).width() / 100;
                    if(settings.mobileMode)
                    {
                        var arrowSize = container.parent(".tile_block").length ? 2 * pointSize : 2.5 * pointSize;
                        controls.upArrow.css({width:arrowSize + "px",height:arrowSize + "px"});
                        controls.downArrow.css({width:arrowSize + "px",height:arrowSize + "px"});
                        controls.track.css("width","0px")
                    }
                    else
                    {
                        var trackSize = 1.5 * pointSize;
                        controls.upArrow.css({width:"0px",height:"0px"});
                        controls.downArrow.css({width:"0px",height:"0px"});
                        controls.track.css("width",trackSize + "px")
                    }
                }})
            });
            var accessibleWrapper = hookAccessibility();
            window.page.accessibleWrapper = accessibleWrapper;
            mediaManager.init(window.page);
            mediaManager.mediaElements.length > 0 && registerComponentType("mediaElements",mediaManager.mediaElements,"mediaElementCompleted",true);
            tileManager.init(window.page,{assetPath:window.imagePath,liveTileInterval:window.liveTileInterval});
            tileManager.clickRevealTileSets.length > 0 && registerComponentType("clickRevealSets",tileManager.clickRevealTileSets,"clickRevealSetCompleted",false);
            tileManager.popupLinkTiles.length > 0 && registerComponentType("popupLinks",tileManager.popupLinkTiles,"popupLinkCompleted",true);
            tileManager.tabSets.length > 0 && registerComponentType("tabSets",tileManager.tabSets,"tabSetCompleted",false);
            var accordions = [];
            $(".accordion_wrapper").each(function()
            {
                if($(this).closest(accessibleWrapper).length === 0)
                {
                    this.accordion = new Accordion(this,window.page,{assetPath:window.imagePath,index:accordions.length});
                    accordions.push(this.accordion)
                }
            });
            accordions.length > 0 && registerComponentType("accordions",accordions,"accordionCompleted",false);
            var matchingSets = [];
            $(".match_wrapper").each(function()
            {
                if($(this).closest(accessibleWrapper).length === 0)
                {
                    this.matchingInterface = new MatchingInterface(this,window.page,{assetPath:window.imagePath,index:matchingSets.length});
                    matchingSets.push(this.matchingInterface)
                }
            });
            matchingSets.length > 0 && registerComponentType("matchingSets",matchingSets,"matchingSetCompleted",true);
            var stackingSets = [];
            $(".stack_wrapper").each(function()
            {
                if($(this).closest(accessibleWrapper).length === 0)
                {
                    this.stackingInterface = new StackingInterface(this,window.page,{assetPath:window.imagePath,index:stackingSets.length});
                    stackingSets.push(this.stackingInterface)
                }
            });
            stackingSets.length > 0 && registerComponentType("stackingSets",stackingSets,"stackingSetCompleted",true);
            var hotspotSets = [];
            $(".hotspot_host").each(function()
            {
                if($(this).closest(page.accessibleWrapper).length === 0)
                {
                    this.hotspotSet = new HotspotSet(this,window.page,{assetPath:window.imagePath,index:hotspotSets.length});
                    hotspotSets.push(this.hotspotSet)
                }
            });
            hotspotSets.length > 0 && registerComponentType("hotspotSets",hotspotSets,"hotspotSetCompleted",false);
            var shortAnswers = [];
            $(".shortanswer_wrapper").each(function()
            {
                if($(this).closest(accessibleWrapper).length === 0)
                {
                    this.shortAnswer = new ShortAnswer(this,window.page,{assetPath:window.imagePath,index:shortAnswers.length});
                    shortAnswers.push(this.shortAnswer)
                }
            });
            shortAnswers.length > 0 && registerComponentType("shortAnswers",shortAnswers,"shortAnswerCompleted",true);
            var trueFalses = [];
            $(".truefalse_wrapper").each(function()
            {
                if($(this).closest(accessibleWrapper).length === 0)
                {

                    this.trueFalse = new TrueFalse(this,window.page,{assetPath:window.imagePath,index:trueFalses.length});
                    trueFalses.push(this.trueFalse)
                }
            });
            trueFalses.length > 0 && registerComponentType("trueFalses",trueFalses,"trueFalseCompleted",true);
            var thoughtBubbles = [];
            $(".thoughtbubble_wrapper").each(function()
            {
                if($(this).closest(accessibleWrapper).length === 0)
                {
                    this.thoughtBubble = new ThoughtBubble(this,window.page,{assetPath:window.imagePath,index:thoughtBubbles.length});
                    thoughtBubbles.push(this.thoughtBubble)
                }
            });
            thoughtBubbles.length > 0 && registerComponentType("thoughtBubbles",thoughtBubbles,"thoughtBubbleCompleted",true);
            var compoundContentSets = [];
            $(".compoundcontent_wrapper").each(function()
            {
                if($(this).closest(accessibleWrapper).length === 0)
                {
                    this.compoundContent = new CompoundContent(this,window.page,{assetPath:window.imagePath,index:compoundContentSets.length});
                    compoundContentSets.push(this.compoundContent)
                }
            });
            compoundContentSets.length > 0 && registerComponentType("compoundContentSets",compoundContentSets,"compoundContentCompleted",false);
            mediaSyncManager.init(window.page);
            $(".instruction_overlay").not(accessibleWrapper.find(".instruction_overlay")).first().each(function()
            {
                instructionOverlay.init(this,window.page,{assetPath:window.imagePath})
            });
            if(tileManager.taskProgressTiles.length > 0)
            {
                var updateProgress = function()
                    {
                        var required = countTasks(true,false,["mediaElements","compoundContentSets"]),
                            complete = required - countTasks(false,false,["mediaElements","compoundContentSets"]);
                        tileManager.updateTaskProgressTiles(complete,required);
                        complete === required && observer.unobserve("requiredTaskCompleted",updateProgress)
                    };
                observer.observe("requiredTaskCompleted",updateProgress);
                updateProgress()
            }
            var completionType = $("body").attr("data-completionType"),
                creditButton = $("a.credit_button").addClass("disabled").text("Receive Credit"),
                handleTasksComplete = function()
                {
                    if(creditButton.length === 0)
                        setComplete();
                    else
                    {
                        $("body").addClass("tasks_complete");
                        creditButton.removeClass("disabled").attr("href","#").off("click",handleCreditClick).on("click",handleCreditClick)
                    }
                },
                handleCreditClick = function()
                {
                    setComplete();
                    creditButton.addClass("disabled").removeAttr("href").off("click",handleCreditClick);
                    this.blur()
                };
            if(completionType === "immediate")
                !pageModel.isComplete() && setComplete();
            else
                if(completionType === "auto" && !pageModel.isComplete() && pageModel.canSendCompletion())
                    if(interactiveComponents.requiredComponentsComplete())
                        handleTasksComplete();
                    else
                        observer.observe("requiredComponentsComplete",handleTasksComplete);
            $(".data-coursename").text(cc.course.name);
            $("#ReceiveCreditContent").each(initReceiveCreditContent);
            $(window).trigger("resize")
        });
        return{toggleAccessibility:toggleAccessibility,tileManager:tileManager,mediaManager:mediaManager,mediaSyncManager:mediaSyncManager,instructions:instructionOverlay,observer:observer,interactiveComponents:interactiveComponents,setComplete:setComplete,resources:resources,courseController:cc,audioController:ac,pageId:id,pageModel:pageModel,isPopup:isPopup}
    }();
(function($)
{
    var preventDefault = function(evt)
        {
            evt.stopPropagation();
            evt.preventDefault()
        },
        stopPropagation = function(evt)
        {
            evt.stopPropagation()
        };
    $.fn.disableselect = function()
    {
        $(this).data("selectdisabled",true);
        $("div",this).bind("dragstart",preventDefault).bind("selectstart",preventDefault);
        $("input, textarea",this).bind("selectstart",stopPropagation);
        $.browser.mozilla && 
            $("div",this).not($("input,textarea").parents()).css("MozUserSelect","none")
    };
    $.fn.enableselect = function()
    {
        $(this).data("selectdisabled",false);
        $("div",this).unbind("dragstart",preventDefault).unbind("selectstart",preventDefault);
        $("input,textarea",this).bind("selectstart",stopPropagation);
        $.browser.mozilla && 
            $("div",this).not($("input,textarea").parents()).css("MozUserSelect","text")
    };
    $.fn.scrolltoelement = function()
    {
        var element = $(this);
        $(this).parents(".scroll_box").each(function()
        {
            var scrollbox = $(this).data("ScrollBox");
            if(scrollbox && scrollbox.container)
                if(scrollbox.content.height() > scrollbox.container.height())
                {
                    var scrollPosition = Math.max(scrollbox.content.offset().top - element.offset().top,scrollbox.container.height() - scrollbox.content.height());
                    scrollbox.content.data("top",scrollPosition).css("top",scrollPosition + "px");
                    scrollbox.updateControls()
                }
        })
    };
    $.fn.scrollbox = function(options)
    {
        var defaults = {scrollStep:8,mouseOverArrowScroll:false,scrollDelay:50,ballHeight:"fixed",mobileMode:$.browser.mobile === true || $.browser.touch === true},
            settings = $.extend(false,defaults,options);
        $(this).each(function()
        {
            this.scrollbox = new ScrollBox(this,settings)
        })
    };
    function ScrollBox(container,settings)
    {
        if($.browser.iMobile === true)
            $(container).css("overflow-y","auto");
        else
        {
            this.init(container,settings);
            this.reset();
            this.unbindEvents();
            this.bindEvents();
            this.updateContentPosition()
        }
    }
    ScrollBox.prototype = {container:false,content:false,controls:{downArrow:false,upArrow:false,track:false,ball:false},settings:false,init:function(container,settings)
    {
        this.container = $(container);
        this.settings = settings;
        !this.container.hasClass("scroll_box") && 
            this.container.addClass("scroll_box");
        this.container.children(".scroll_content").length === 0 && 
            this.container.html('<div class="scroll_content">' + this.container.html() + "</div>");
        if(this.container.children(".scroll_track").length === 0)
            this.container.append($("<div />",{"class":"scroll_track"}).html('<div class="scroll_line"></div><div class="scroll_ball">'));
        else
        {
            var scrollTrack = this.container.children(".scroll_track");
            scrollTrack.children(".scroll_line").length === 0 && 
                scrollTrack.append($("<div />",{"class":"scroll_line"}));
            scrollTrack.children(".scroll_ball").length === 0 && 
                scrollTrack.append($("<div />",{"class":"scroll_ball"}))
        }
        this.container.children(".scroll_up_arrow").length === 0 && 
            this.container.append($("<div />",{"class":"scroll_up_arrow"}));
        this.container.children(".scroll_down_arrow").length === 0 && 
            this.container.append($("<div />",{"class":"scroll_down_arrow"}));
        this.content = this.container.children(".scroll_content");
        this.controls = {upArrow:this.container.children(".scroll_up_arrow"),downArrow:this.container.children(".scroll_down_arrow"),track:this.container.children(".scroll_track"),ball:this.container.children(".scroll_track").children(".scroll_ball")}
    },toggleMobileMode:function()
    {
        if(this.settings)
        {
            if(this.settings.mobileMode === false)
                this.settings.mobileMode = true;
            else
                this.settings.mobileMode = false;
            this.settings.sizeControls && this.settings.sizeControls(this.container,this.controls,this.settings);
            this.unbindEvents();
            this.bindEvents()
        }
    },unbindEvents:function()
    {
        var scrollbox = this;
        scrollbox.container.unbind("scroll");
        scrollbox.content.unbind("mousewheel");
        scrollbox.controls.upArrow.unbind("click").unbind("mouseenter").unbind("mouseout").unbind("mousedown").unbind("mouseup");
        scrollbox.controls.downArrow.unbind("click").unbind("mouseenter").unbind("mouseout").unbind("mousedown").unbind("mouseup");
        scrollbox.controls.ball.unbind("mousedown");
        $('a[href^="#"]').each(function()
        {
            var anchor = $("a[id=" + $(this).attr("href").substring(1) + "]");
            $(anchor,scrollbox.content).length > 0 && 
                $(this).unbind("click")
        })
    },bindEvents:function()
    {
        var scrollbox = this;
        scrollbox.container.scroll(function()
        {
            scrollbox.updateContentPosition()
        });
        if(scrollbox.settings.mobileMode === true)
        {
            scrollbox.controls.upArrow.click(function()
            {
                if(scrollbox.controls.upArrow.data("mousedown") === true)
                    scrollbox.controls.upArrow.data("mousedown",false);
                else
                {
                    scrollbox.controls.upArrow.data("mousedown",true);
                    scrollbox.controls.downArrow.data("mousedown",false);
                    !scrollbox.controls.upArrow.hasClass("scroll_arrow_disabled") && 
                        scrollbox.doScroll("up")
                }
            });
            scrollbox.controls.downArrow.click(function()
            {
                if(scrollbox.controls.downArrow.data("mousedown") === true)
                    scrollbox.controls.downArrow.data("mousedown",false);
                else
                {
                    scrollbox.controls.downArrow.data("mousedown",true);
                    scrollbox.controls.upArrow.data("mousedown",false);
                    !scrollbox.controls.downArrow.hasClass("scroll_arrow_disabled") && 
                        scrollbox.doScroll("down")
                }
            })
        }
        else
            if(scrollbox.settings.mouseOverArrowScroll === true)
            {
                scrollbox.controls.upArrow.mouseenter(function()
                {
                    if($(document).data("scroll_drag") != true && !scrollbox.controls.upArrow.hasClass("scroll_arrow_disabled"))
                    {
                        scrollbox.controls.upArrow.addClass("scroll_arrow_hover").data("mousedown",true);
                        scrollbox.doScroll("up")
                    }
                });
                scrollbox.controls.downArrow.mouseenter(function()
                {
                    if($(document).data("scroll_drag") != true && !scrollbox.controls.downArrow.hasClass("scroll_arrow_disabled"))
                    {
                        scrollbox.controls.downArrow.addClass("scroll_arrow_hover").data("mousedown",true);
                        scrollbox.doScroll("down")
                    }
                });
                scrollbox.controls.upArrow.mouseout(function()
                {
                    scrollbox.controls.upArrow.removeClass("scroll_arrow_hover").data("mousedown",false)
                });
                scrollbox.controls.downArrow.mouseout(function()
                {
                    scrollbox.controls.downArrow.removeClass("scroll_arrow_hover").data("mousedown",false)
                })
            }
            else
            {
                scrollbox.controls.upArrow.mousedown(function()
                {
                    if(!scrollbox.controls.upArrow.hasClass("scroll_arrow_disabled"))
                    {
                        scrollbox.controls.upArrow.data("mousedown",true);
                        scrollbox.doScroll("up")
                    }
                });
                scrollbox.controls.downArrow.mousedown(function()
                {
                    if(!scrollbox.controls.downArrow.hasClass("scroll_arrow_disabled"))
                    {
                        scrollbox.controls.downArrow.data("mousedown",true);
                        scrollbox.doScroll("down")
                    }
                });
                scrollbox.controls.upArrow.mouseout(function()
                {
                    scrollbox.controls.upArrow.data("mousedown",false)
                }).mouseup(function()
                {
                    scrollbox.controls.upArrow.data("mousedown",false)
                });
                scrollbox.controls.downArrow.mouseout(function()
                {
                    scrollbox.controls.downArrow.data("mousedown",false)
                }).mouseup(function()
                {
                    scrollbox.controls.downArrow.data("mousedown",false)
                })
            }
        scrollbox.controls.ball.mousedown(function(e)
        {
            scrollbox.dragstart(e,scrollbox)
        });
        scrollbox.content.mousewheel(function(event,delta)
        {
            preventDefault(event);
            if(Math.abs(delta) > 0)
            {
                var boxHeight = scrollbox.container.height(),
                    contentHeight = scrollbox.content.outerHeight(),
                    topPosition = scrollbox.content.data("top") != undefined ? scrollbox.content.data("top") : 0,
                    bottomOverflow = contentHeight - boxHeight + topPosition;
                if(delta > 0 && topPosition < 0)
                {
                    topPosition = Math.min(topPosition + scrollbox.settings.scrollStep * delta,0);
                    scrollbox.content.data("top",topPosition).css("top",topPosition + "px")
                }
                else
                    if(delta < 0 && bottomOverflow > 0)
                    {
                        topPosition = Math.max(topPosition + scrollbox.settings.scrollStep * delta,boxHeight - contentHeight);
                        scrollbox.content.data("top",topPosition).css("top",topPosition + "px")
                    }
                scrollbox.updateControls()
            }
        });
        $('a[href^="#"]').each(function()
        {
            var anchor = $("a[id=" + $(this).attr("href").substring(1) + "]");
            $(anchor,scrollbox.content).length > 0 && 
                $(this).click(function()
                {
                    anchor.scrolltoelement();
                    return false
                })
        })
    },dragstart:function(e,scrollbox)
    {
        $(document).data({scroll_drag:true,scroll_y:e.pageY,active_scrollbox:scrollbox}).disableselect();
        $(document).bind("mouseup",scrollbox.dragend);
        $(document).bind("mousemove",scrollbox.dragmove)
    },dragmove:function(e)
    {
        var scrollbox = $(document).data("active_scrollbox");
        if(scrollbox)
        {
            var mouseMoveDelta = e.pageY - $(document).data("scroll_y");
            if(Math.abs(mouseMoveDelta) > 0)
            {
                $(document).data("scroll_y",e.pageY);
                var maxTop = scrollbox.controls.track.height() - scrollbox.controls.ball.outerHeight(),
                    currentTop = scrollbox.controls.ball.data("top") != undefined ? scrollbox.controls.ball.data("top") : 0;
                currentTop = Math.max(0,Math.min(maxTop,currentTop + mouseMoveDelta));
                scrollbox.controls.ball.data("top",currentTop).css("top",currentTop + "px");
                var topPosition = -currentTop * (scrollbox.content.outerHeight() - scrollbox.container.height()) / (scrollbox.controls.track.height() - scrollbox.controls.ball.outerHeight()),
                    bottomOverflow = scrollbox.content.outerHeight() - scrollbox.container.height() + topPosition;
                scrollbox.content.data("top",topPosition).css("top",topPosition + "px");
                scrollbox.updateControls()
            }
        }
    },dragend:function()
    {
        var scrollbox = $(document).data("active_scrollbox");
        $(document).data({scroll_drag:false,active_scrollbox:null});
        $(document).data("selectdisabled") == true && 
            $(document).enableselect();
        scrollbox && 
            $(document).unbind("mouseup",scrollbox.dragend).unbind("mousemove",scrollbox.dragmove)
    },reset:function()
    {
        this.content.data("top",0).css("top","0px");
        this.updateControls();
        this.settings.sizeControls && this.settings.sizeControls(this.container,this.controls,this.settings)
    },containerResized:function()
    {
        this.updateContentPosition();
        this.settings.sizeControls && this.settings.sizeControls(this.container,this.controls,this.settings)
    },contentResized:function()
    {
        this.updateContentPosition()
    },updateContentPosition:function()
    {
        if(this.content === false)
            return;
        var boxHeight = this.container.height(),
            contentHeight = this.content.outerHeight(),
            topPosition = this.content.data("top") != undefined ? this.content.data("top") : 0;
        if(this.container.scrollTop() > 0)
        {
            topPosition -= this.container.scrollTop();
            this.container.scrollTop(0);
            this.content.data("top",topPosition).css("top",topPosition + "px")
        }
        var bottomOverflow = contentHeight - boxHeight + topPosition;
        bottomOverflow < 0 && 
            this.content.data("top",Math.min(0,topPosition - bottomOverflow)).css("top",Math.min(0,topPosition - bottomOverflow) + "px");
        this.updateControls()
    },updateControls:function()
    {
        if(this.content === false)
            return;
        var boxHeight = this.container.height(),
            contentHeight = this.content.outerHeight(),
            topPosition = this.content.data("top") != undefined ? this.content.data("top") : 0,
            bottomOverflow = contentHeight - boxHeight + topPosition;
        if(topPosition < 0)
            this.controls.upArrow.removeClass("scroll_arrow_disabled");
        else
        {
            this.controls.upArrow.addClass("scroll_arrow_disabled");
            this.settings.mouseOverArrowScroll === true && 
                this.controls.upArrow.removeClass("scroll_arrow_hover")
        }
        if(bottomOverflow > 0)
            this.controls.downArrow.removeClass("scroll_arrow_disabled");
        else
            this.controls.downArrow.addClass("scroll_arrow_disabled");
        if(topPosition === 0 && bottomOverflow <= 0)
        {
            this.controls.upArrow.css("display","none");
            this.controls.downArrow.css("display","none");
            this.controls.track.css("display","none");
            this.content.css("margin-right","0px")
        }
        else
        {
            this.controls.upArrow.css("display","block");
            this.controls.downArrow.css("display","block");
            this.controls.track.css("display","block");
            this.content.css("margin-right",Math.max(this.controls.track.outerWidth() - (this.container.css("paddingRight") ? parseInt(this.container.css("paddingRight")) : 0),0) + "px")
        }
        this.controls.track.css("height",boxHeight - this.controls.upArrow.outerHeight() - this.controls.downArrow.outerHeight() + "px");
        this.settings.ballHeight === "relative" && 
            this.controls.ball.css("height",Math.min(Math.max(boxHeight / contentHeight,.1),.9) * this.controls.track.height() + "px");
        var scrollRatio = -topPosition / (contentHeight - boxHeight),
            ballTop = scrollRatio * (this.controls.track.height() - this.controls.ball.outerHeight());
        this.controls.ball.data("top",ballTop).css("top",ballTop + "px")
    },doScroll:function(direction)
    {
        var scrollbox = this;
        if(scrollbox.content === false)
            return;
        var boxHeight = scrollbox.container.height(),
            contentHeight = scrollbox.content.outerHeight(),
            topPosition = scrollbox.content.data("top") != undefined ? scrollbox.content.data("top") : 0,
            bottomOverflow = contentHeight - boxHeight + topPosition;
        if(direction === "up" && topPosition < 0)
        {
            topPosition = Math.min(topPosition + scrollbox.settings.scrollStep,0);
            scrollbox.content.data("top",topPosition).css("top",topPosition + "px")
        }
        else
            if(direction === "down" && bottomOverflow > 0)
            {
                topPosition = Math.max(topPosition - scrollbox.settings.scrollStep,boxHeight - contentHeight);
                scrollbox.content.data("top",topPosition).css("top",topPosition + "px")
            }
        bottomOverflow = contentHeight - boxHeight + topPosition;
        this.updateControls();
        if(topPosition < 0 && direction === "up" && scrollbox.controls.upArrow.data("mousedown") === true || bottomOverflow > 0 && direction === "down" && scrollbox.controls.downArrow.data("mousedown") === true)
            setTimeout(function()
            {
                scrollbox.doScroll(direction)
            },scrollbox.settings.scrollDelay);
        else
            if(bottomOverflow === 0 && direction === "down")
            {
                this.controls.downArrow.data("mousedown",false);
                scrollbox.settings.mouseOverArrowScroll === true && 
                    scrollbox.controls.downArrow.removeClass("scroll_arrow_hover")
            }
            else
                if(topPosition === 0 && direction === "up")
                {
                    scrollbox.controls.upArrow.data("mousedown",false);
                    scrollbox.settings.mouseOverArrowScroll === true && 
                        scrollbox.controls.upArrow.removeClass("scroll_arrow_hover")
                }
    }}
})(jQuery);
(function()
{
    jQuery.browser.touch = "ontouchstart" in window
})();
(function(a)
{
    jQuery.browser.mobile = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))
})(navigator.userAgent || navigator.vendor || window.opera);
(function(a)
{
    jQuery.browser.iMobile = /ip(hone|od|ad)/i.test(a)
})(navigator.userAgent || navigator.vendor || window.opera);
/* Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($)
{
    var types = ["DOMMouseScroll","mousewheel"];
    if($.event.fixHooks)
        for(var i = types.length; i; )
            $.event.fixHooks[types[--i]] = $.event.mouseHooks;
    $.event.special.mousewheel = {setup:function()
    {
        if(this.addEventListener)
            for(var i = types.length; i; )
                this.addEventListener(types[--i],handler,false);
        else
            this.onmousewheel = handler
    },teardown:function()
    {
        if(this.removeEventListener)
            for(var i = types.length; i; )
                this.removeEventListener(types[--i],handler,false);
        else
            this.onmousewheel = null
    }};
    $.fn.extend({mousewheel:function(fn)
    {
        return fn ? this.bind("mousewheel",fn) : this.trigger("mousewheel")
    },unmousewheel:function(fn)
    {
        return this.unbind("mousewheel",fn)
    }});
    function handler(event)
    {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments,1),
            delta = 0,
            returnValue = true,
            deltaX = 0,
            deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";
        if(orgEvent.wheelDelta)
            delta = orgEvent.wheelDelta / 120;
        if(orgEvent.detail)
            delta = -orgEvent.detail / 3;
        deltaY = delta;
        if(orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS)
        {
            deltaY = 0;
            deltaX = -1 * delta
        }
        if(orgEvent.wheelDeltaY !== undefined)
            deltaY = orgEvent.wheelDeltaY / 120;
        if(orgEvent.wheelDeltaX !== undefined)
            deltaX = -1 * orgEvent.wheelDeltaX / 120;
        args.unshift(event,delta,deltaX,deltaY);
        return($.event.dispatch || $.event.handle).apply(this,args)
    }
})(jQuery);
function ShortAnswer(wrapper,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(wrapper)
}
ShortAnswer.prototype = {wrapper:false,question:false,answer:false,idealAnswer:false,input:false,submitButton:false,settings:false,completed:false,required:false,getRootVisual:function()
{
    return this.wrapper
},init:function(wrapper)
{
    this.wrapper = $(wrapper);
    this.question = this.wrapper.children(".questionbox:first");
    this.answer = this.wrapper.children(".answerbox:first");
    this.idealAnswer = this.wrapper.children(".idealanswerbox:first");
    this.input = this.answer.find("textarea:first");
    this.submitButton = this.answer.find(".submit:first");
    this.required = this.wrapper.attr("data-required") === "true";
    var sa = this,
        ss = sa.page.courseController.course.scormState,
        pageId = sa.page.pageId,
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "sa#" + (sa.settings.index ? sa.settings.index.toString() : "0") + ":a=([^|]*)",
                answer = currentState.match(new RegExp(pattern));
            answer && answer[1].length > 0 && sa.input.val(answer[1])
        },
        setState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "sa#" + (sa.settings.index ? sa.settings.index.toString() : "0") + ":a=[^|]*",
                re = new RegExp(pattern);
            if(re.test(currentState))
                currentState = currentState.replace(re,"sa#" + (sa.settings.index ? sa.settings.index.toString() : "0") + ":a=" + sa.input.val().trim());
            else
                currentState += "sa#" + (sa.settings.index ? sa.settings.index.toString() : "0") + ":a=" + sa.input.val().trim() + "|";
            ss.setState(pageId,currentState)
        },
        submitAnswer = function()
        {
            if(sa.input.val().trim().length > 0)
            {
                sa.answer.find(".tile_detail").text(sa.input.val().trim());
                sa.wrapper.addClass("complete");
                sa.completed = true;
                setState();
                sa.required && sa.page.observer.fire("requiredTaskCompleted",{type:"shortAnswer",component:sa,task:sa});
                sa.page.observer.fire("shortAnswerCompleted",sa.settings.index);
                var mediabar = $(".media_bar",sa.idealAnswer),
                    mediaManager = sa.page.mediaManager,
                    mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
                mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
            }
        },
        setSubmit = function()
        {
            if(sa.input.val().trim().length > 0)
                sa.submitButton.hasClass("disabled") && sa.submitButton.removeClass("disabled").attr("href","#").off("click",submitAnswer).on("click",submitAnswer);
            else
                !sa.submitButton.hasClass("disabled") && sa.submitButton.addClass("disabled").removeAttr("href").off("click",submitAnswer)
        };
    this.submitButton.addClass("disabled").html('<img src="' + sa.settings.assetPath + 'dark/images/right.normal.png" alt="submit" class="showOnDark"/><img src="' + sa.settings.assetPath + 'light/images/right.normal.png" alt="submit" class="showOnLight"/>');
    this.input.on("keydown",function(e)
    {
        var code = e.keyCode || e.which;
        if(e.shiftKey && code === 220)
            return false
    }).on("keyup",function()
    {
        $(this).trigger("change")
    }).on("change",setSubmit);
    restoreState();
    if(this.input.val().trim().length > 0)
    {
        this.answer.find(".tile_detail").text(this.input.val().trim());
        this.wrapper.addClass("complete");
        this.completed = true
    }
    !this.completed && 
        this.question.each(function()
        {
            var mediabar = $(".media_bar",this),
                mediaManager = sa.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
        })
}};
function TrueFalse(wrapper,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(wrapper)
}
TrueFalse.prototype = {wrapper:false,question:false,answer:false,idealAnswer:false,input:false,submitButton:false,settings:false,completed:false,required:false,getRootVisual:function()
{
    return this.wrapper
},init:function(wrapper)
{
    this.wrapper = $(wrapper);
    this.question = this.wrapper.children(".questionbox:first");
    this.answer = this.wrapper.children(".answerbox:first");
    this.radios = this.wrapper.find('.optionbox:first');
    this.idealAnswer = this.wrapper.children(".idealanswerbox:first");
    this.input = this.radios.find("input[type='radio']");
    this.submitButton = this.answer.find(".submit:first");
    this.required = this.wrapper.attr("data-required") === "true";
    var tf = this,
        ss = tf.page.courseController.course.scormState,
        pageId = tf.page.pageId,
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "tf#" + (tf.settings.index ? tf.settings.index.toString() : "0") + ":a=([^|]*)",
                answer = currentState.match(new RegExp(pattern));
            answer && answer[1].length > 0 && tf.input.val(answer[1])
        },
        setState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "tf#" + (tf.settings.index ? tf.settings.index.toString() : "0") + ":a=[^|]*",
                re = new RegExp(pattern);
            if(re.test(currentState))
                currentState = currentState.replace(re,"tf#" + (tf.settings.index ? tf.settings.index.toString() : "0") + ":a=" + tf.input.val().trim());
            else
                currentState += "tf#" + (tf.settings.index ? tf.settings.index.toString() : "0") + ":a=" + tf.input.val().trim() + "|";
            ss.setState(pageId,currentState)
        },
        submitAnswer = function()
        {
            if(tf.input.is(':checked'))
            {
               
                //tf.answer.find(".tile_detail").text(tf.input.val());
                tf.wrapper.addClass("complete");
                tf.completed = true;
                setState();
                tf.required && tf.page.observer.fire("requiredTaskCompleted",{type:"trueFalse",component:tf,task:tf});
                tf.page.observer.fire("trueFalseCompleted",tf.settings.index);
                var mediabar = $(".media_bar",tf.idealAnswer),
                    mediaManager = tf.page.mediaManager,
                    mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
                mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
            }
        },
        setSubmit = function()
        {
            if(tf.input.is(':checked'))
                tf.submitButton.hasClass("disabled") && tf.submitButton.removeClass("disabled").attr("href","#").off("click",submitAnswer).on("click",submitAnswer);
            else
                !tf.submitButton.hasClass("disabled") && tf.submitButton.addClass("disabled").removeAttr("href").off("click",submitAnswer)
        };
    this.submitButton.addClass("disabled").html('<img src="' + tf.settings.assetPath + 'dark/images/right.normal.png" alt="submit" class="showOnDark"/><img src="' + tf.settings.assetPath + 'light/images/right.normal.png" alt="submit" class="showOnLight"/>');
    this.input.on("click",function(e)
    {
        var code = e.keyCode || e.which;
        if(e.shiftKey && code === 220)
            return false
    }).on("change",function()
    {
        $(this).trigger("click")
    }).on("change",setSubmit);
    restoreState();
    if(this.input.is(':checked'))
    {
        alert('ok');
        this.answer.find(".tile_detail").text(this.input.val());
        this.wrapper.addClass("complete");
        this.completed = true
    }
    !this.completed && 
        this.question.each(function()
        {
            var mediabar = $(".media_bar",this),
                mediaManager = tf.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
        })
}};
(function($)
{
    $.fn.sizable = function(options)
    {
        var defaults = {aspectRatio:2 / 1},
            settings = $.extend(false,defaults,options);
        new SizableContent(this,settings)
    };
    function SizableContent(container,settings)
    {
        this.init(container,settings)
    }
    SizableContent.prototype = {page:false,wrapper:false,container:false,settings:false,scaleFactor:1,init:function(container,settings)
    {
        this.container = $(container);
        this.settings = settings;
        this.wrapper = this.container.parent();
        this.page = this.wrapper.parent();
        this.scaleFactor = Math.max(Math.min(+this.container.attr("data-scaleFactor") || 1,1),0);
        var sc = this;
        $(".scroll_box",this.container).each(function()
        {
            $(this).parent(".tile_block").length && !$(this).get(0).style.height.length && 
                $(this).css("height","97%")
        });
        this.container.css("opacity","0");
        $(window).bind("resize",function()
        {
            sc.handleResize.call(sc)
        }).trigger("resize");
        this.container.css("opacity","1")
    },resizeContainer:function()
    {
        var zoom = getZoomLevel();
        if(zoom <= 1.25)
            zoom = 1;
        this.page.css({width:zoom * 100 + "%",height:zoom * 100 + "%",overflow:"hidden"});
        this.wrapper.css({width:this.page.width() + "px"});
        var availWidth = this.wrapper.width(),
            availHeight = this.wrapper.height(),
            scaleFactor;
        if(this.settings.aspectRatio * availHeight > availWidth)
            this.container.css({width:this.scaleFactor * availWidth + "px",height:this.scaleFactor * availWidth / this.settings.aspectRatio + "px"});
        else
            this.container.css({width:this.scaleFactor * availHeight * this.settings.aspectRatio + "px",height:this.scaleFactor * availHeight + "px"});
        if(this.page.width() > $(document).width() || this.page.height() > $(document).height())
            this.page.css({overflow:"auto"});
        else
        {
            this.page.scrollTop(0).scrollLeft(0);
            this.page.css({overflowY:"visible"})
        }
    },handleResize:function()
    {
        this.resizeContainer();
        $(".scrolling_block",this.container).each(function()
        {
            $(this).css({width:$(this).parents(".tile_block:first").width() + "px",height:$(this).parents(".tile_block:first").height() + "px"});
            $(this).children(".tile:last").length > 0 && 
                $(this).parent(".scroll_content").height($(this).children(".tile:last").height() + $(this).children(".tile:last").position().top)
        });
        $(".scroll_box",this.container).each(function()
        {
            this.scrollbox && this.scrollbox.containerResized()
        });
        this.wrapper.css({marginTop:Math.max((this.page.height() - this.wrapper.outerHeight()) / 2,0) + "px"});
        this.container.css({fontSize:this.container.width() / 800 + "em"});
        $(".tile_content",this.container).each(function()
        {
            if($(this).parents(".tile_popup").length === 0)
                $(this).height($(this).parent().height() - Math.max($(this).parents(".tile").children(".tile_footer").height(),$(".tile_popup_header",$(this).parents(".tile")).height()) - $(this).position().top - parseFloat($(this).css("marginTop")) - parseFloat($(this).css("marginBottom")) + "px");
            else
                $(this).height($(this).parent().height() - $(this).parents(".tile_popup").children(".tile_popup_header").height() - $(this).parents(".tile_popup").children(".tile_footer").height() - $(this).position().top - parseFloat($(this).css("marginTop")) - parseFloat($(this).css("marginBottom")) + "px")
        });
        $(".accordion_video",this.container).each(function()
        {
            $(this).css("height",$(this).width() * 9 / 16 + "px")
        });
        $(".hotspot > .target",this.container).css({width:this.container.width() * .035 + "px",height:this.container.width() * .035 + "px",left:-this.container.width() * .0175 + "px",top:-this.container.width() * .0175 + "px"});
        $(".icon",this.container).css({width:this.container.width() / 64 + "px",height:this.container.width() / 64 + "px"});
        $(".button",this.container).css({width:this.container.width() / 32 + "px",height:this.container.width() / 32 + "px"});
        $(".tileActionButton",this.container).css({width:this.container.width() / 24 + "px",height:this.container.width() / 24 + "px"});
        $(".fix_right").each(function()
        {
            $(this).css("right",Math.min(-$(".content_wrapper").outerWidth() + $(this).parent().offset().left + $(this).parent().outerWidth(),0) + "px")
        });
        $(".tile_block.rightbound").each(function()
        {
            $(this).find(".tile").removeClass("customclear-left");
            var rightBoundaryElementSelector = $(this).attr("data-rightBoundary"),
                rightBoundaryElement = $(rightBoundaryElementSelector).filter(":visible");
            if(rightBoundaryElement.length)
            {
                for(var j = 0,
                    maxRight = $(".content_wrapper").offset().left + $(".content_wrapper").width(); j < rightBoundaryElement.length; j++)
                    maxRight = Math.min(maxRight,rightBoundaryElement.eq(j).offset().left - parseInt(rightBoundaryElement.eq(j).css("marginLeft")));
                $(this).find(".tile").each(function()
                {
                    $(this).css("float") === "left" && $(this).offset().left + $(this).outerWidth() + parseInt($(this).css("marginRight")) > maxRight && 
                        $(this).addClass("customclear-left")
                })
            }
        });
        $(".tile_block.leftbound").each(function()
        {
            $(this).find(".tile").removeClass("customclear-right");
            var leftBoundaryElementSelector = $(this).attr("data-leftBoundary"),
                leftBoundaryElement = $(leftBoundaryElementSelector).filter(":visible");
            if(leftBoundaryElement.length)
            {
                for(var j = 0,
                    minLeft = 0; j < leftBoundaryElement.length; j++)
                    minLeft = Math.max(minLeft,leftBoundaryElement.eq(j).offset().left + leftBoundaryElement.eq(j).outerWidth() + parseInt(leftBoundaryElement.eq(j).css("marginRight")));
                $(this).find(".tile").each(function()
                {
                    $(this).css("float") === "right" && $(this).offset().left - parseInt($(this).css("marginLeft")) < minLeft && 
                        $(this).addClass("customclear-right")
                })
            }
        })
    }}
})(jQuery);
(function()
{
    getZoomLevel = function()
    {
        try
        {
            return window.screen.deviceXDPI != undefined && window.screen.logicalXDPI != undefined ? window.screen.deviceXDPI / window.screen.logicalXDPI : 1
        }
        catch(e)
        {
            return 1
        }
    }
})();
function StackingInterface(wrapper,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(wrapper);
    this.assemble()
}
StackingInterface.prototype = {wrapper:false,stackContainer:false,itemContainer:false,stacks:false,items:false,settings:false,completed:false,required:false,getRootVisual:function()
{
    return this.wrapper
},assemble:function()
{
    if($("body").hasClass("accessible"))
    {
        this.stacks.not(".stacked").each(function()
        {
            $("input:last",$(".item_input_container",this)).attr("disabled",false)
        });
        $(".stack_item_placeholder",this.itemContainer).remove();
        var itemContainer = this.itemContainer;
        $(".stack_item",this.stacks).each(function()
        {
            for(var index = $(this).data("originalIndex"),
                i = 0; i < itemContainer.children(".stack_item").length; i++)
                if(itemContainer.children(".stack_item").eq(i).data("originalIndex") > index)
                    break;
            if(i >= itemContainer.children(".stack_item").length)
                itemContainer.append(this);
            else
                $(this).insertBefore(itemContainer.children(".stack_item").eq(i));
            $(".stack_item_text",this).removeAttr("title")
        });
        this.items.draggable("disable");
        this.stacks.droppable("disable")
    }
    else
    {
        $(".item_input_container",this.wrapper).children("input").attr("disabled",true);
        var stackContainer = this.stackContainer;
        $(".stack_item.stacked",this.itemContainer).each(function()
        {
            var placeholder = $("<div/>",{"class":"stack_item_placeholder"});
            if($(this).hasClass("tile"))
                placeholder.addClass("tile");
            else
                placeholder.html($(this).html());
            placeholder.insertAfter($(this));
            $('.stack[data-group="' + $(this).attr("data-group") + '"]',stackContainer).children(".item_container").append(this);
            $(".stack_item_text",this).each(function()
            {
                if(this.offsetWidth < this.scrollWidth)
                    this.title = this.innerText
            })
        });
        this.items.draggable && 
            this.items.not(".stacked").draggable({disabled:false,revert:true});
        this.stacks.droppable && 
            this.stacks.not(".stacked").droppable("enable")
    }
},init:function(wrapper)
{
    this.wrapper = $(wrapper);
    this.stackContainer = this.wrapper.children(".stack_container");
    this.itemContainer = this.wrapper.children(".stack_item_container");
    this.stacks = this.stackContainer.children(".stack");
    this.items = this.itemContainer.children(".stack_item");
    this.required = this.wrapper.attr("data-required") === "true";
    var si = this,
        ss = si.page.courseController.course.scormState,
        pageId = si.page.pageId,
        markStackComplete = function(stack)
        {
            stack.addClass("stacked").droppable("disable");
            if($(".completion_indicator",stack).length === 0)
            {
                var iconSize = $(".content_container").length ? $(".content_container").width() / 64 : $(window).width() / 64,
                    completionIndicator = $("<div/>",{"class":"completion_indicator icon"}).css({width:iconSize + "px",height:iconSize + "px"});
                completionIndicator.append($("<div/>",{"class":"check"}).html('<img src="' + si.settings.assetPath + 'dark/images/check.nocircle.png" alt="complete" class="showOnDark"/><img src="' + si.settings.assetPath + 'light/images/check.nocircle.png" alt="complete" class="showOnLight"/>')).appendTo(stack.children(".stack_content"))
            }
        },
        markItemStacked = function(item)
        {
            if(!item.hasClass("stacked"))
            {
                var group = item.attr("data-group"),
                    stack = $('.stack[data-group="' + group + '"]',si.wrapper);
                item.addClass("stacked").draggable("disable");
                $(".item_input_container",stack).children("input:last").val(item.attr("data-value")).attr("disabled",true).siblings(".input_feedback").remove();
                for(var i = 3; i <= 10; i++)
                    $('.stack_item[data-group="' + group + '"].stacked',si.wrapper).length >= i && 
                        stack.addClass("with" + i.toString());
                if($('.stack_item[data-group="' + group + '"]',si.wrapper).not(".stacked").length === 0)
                    markStackComplete(stack);
                else
                    insertItemInput(stack)
            }
        },
        insertItemInput = function(stack)
        {
            var input = $("<input/>");
            $(".item_input_container",stack).append(input);
            !$("body").hasClass("accessible") && 
                input.attr("disabled",true);
            input.change(validateInput).keydown(function(e)
            {
                e.keyCode === 13 && 
                    $(this).trigger("change")
            })
        },
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "si#" + (si.settings.index ? si.settings.index.toString() : "0") + ":c=([^|]*)",
                stackedItems = currentState.match(new RegExp(pattern));
            if(stackedItems)
                for(var items = stackedItems[1].split(","),
                    i = 0,
                    index; i < si.items.length; i++)
                {
                    index = si.items.eq(i).data("originalIndex");
                    index != null && index != undefined && items.indexOf(index.toString()) >= 0 && 
                        markItemStacked(si.items.eq(i))
                }
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "si#" + (si.settings.index ? si.settings.index.toString() : "0") + ":c=[^|]*",
                re = new RegExp(pattern),
                items = [],
                i = 0; i < si.items.length; i++)
                si.items.eq(i).hasClass("stacked") && items.push(si.items.eq(i).data("originalIndex"));
            if(re.test(currentState))
                currentState = currentState.replace(re,"si#" + (si.settings.index ? si.settings.index.toString() : "0") + ":c=" + items.join(","));
            else
                currentState += "si#" + (si.settings.index ? si.settings.index.toString() : "0") + ":c=" + items.join(",") + "|";
            ss.setState(pageId,currentState)
        },
        answerDropped = function(e,ui)
        {
            var stack = $(this),
                item = ui.draggable,
                placeholder = $("<div/>",{"class":"stack_item_placeholder"});
            if(item.hasClass("tile"))
                placeholder.addClass("tile");
            else
                placeholder.html(item.html());
            placeholder.insertAfter(item);
            item.draggable("option","revert",false).removeClass("correct").css({left:"auto",top:"auto"}).appendTo(stack.children(".item_container"));
            $(".stack_item_text",item).each(function()
            {
                if(this.offsetWidth < this.scrollWidth)
                    this.title = this.innerText
            });
            markItemStacked(item);
            setState();
            if(si.stacks.not(".stacked").length === 0)
            {
                si.completed = true;
                si.required && si.page.observer.fire("requiredTaskCompleted",{type:"stackingSet",component:si,task:si});
                si.page.observer.fire("stackingSetCompleted",si.settings.index)
            }
        },
        validateInput = function()
        {
            for(var stack = $(this).closest(".stack"),
                group = stack.attr("data-group"),
                i = 0; i < $('.stack_item[data-group="' + group + '"]',si.wrapper).not(".stacked").length; i++)
                if($('.stack_item[data-group="' + group + '"]',si.wrapper).not(".stacked").eq(i).attr("data-value").toUpperCase() === $(this).val().toUpperCase())
                    break;
            if(i < $('.stack_item[data-group="' + group + '"]',si.wrapper).not(".stacked").length)
            {
                markItemStacked($('.stack_item[data-group="' + group + '"]',si.wrapper).not(".stacked").eq(i));
                if(!stack.hasClass("stacked"))
                    stack.find("input").last().focus();
                else
                    if(stack.nextAll().not(".stacked").length > 0)
                        stack.nextAll().not(".stacked").first().find("input").last().focus();
                    else
                        stack.siblings().not(".stacked").length > 0 && 
                            stack.siblings().not(".stacked").first().find("input").last().focus();
                setState();
                if(si.stacks.not(".stacked").length === 0)
                {
                    si.completed = true;
                    si.required && si.page.observer.fire("requiredTaskCompleted",{type:"stackingSet",component:si,task:si});
                    si.page.observer.fire("stackingSetCompleted",si.settings.index)
                }
            }
            else
                $(this).siblings(".input_feedback").length === 0 && 
                    $(this).after($('<div class="input_feedback">incorrect</div>'))
        };
    this.items.each(function()
    {
        $(this).data("originalIndex",$(this).index());
        $(this).prepend($("<div/>",{"class":"accessible_overlay"}).text($(this).attr("data-value")));
        $(this).draggable && 
            $(this).draggable({containment:"document",revert:true,revertDuration:100}).contextmenu(function(e)
            {
                e.preventDefault();
                e.stopPropagation();
                return false
            }).mousedown(function(e)
            {
                if(e.button === 2)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    return false
                }
            })
    });
    this.stacks.each(function()
    {
        $(this).prepend($("<div/>",{"class":"drag_highlight"}));
        var group = $(this).attr("data-group");
        group && $(this).droppable && 
            $(this).droppable({accept:$('.stack_item[data-group="' + group + '"]',si.wrapper),hoverClass:"correct",over:function(e,ui)
            {
                ui.draggable.addClass("correct")
            },out:function(e,ui)
            {
                ui.draggable.removeClass("correct")
            },drop:answerDropped});
        if($('.stack_item[data-group="' + group + '"]').not(".stacked").length === 0)
            markStackComplete($(this));
        else
            insertItemInput($(this))
    });
    this.wrapper.css("margin-bottom",100 * (wrapper.scrollHeight - $(wrapper.offsetParent).height() / 10) / $(wrapper.offsetParent).width() + "%");
    restoreState();
    if(this.stacks.not(".stacked").length === 0)
    {
        this.completed = true;
        si.required && si.page.observer.fire("requiredTaskCompleted",{type:"stackingSet",component:si,task:si});
        this.page.observer.fire("stackingSetCompleted",this.settings.index)
    }
}};
function TabSet(wrapper,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(wrapper)
}
TabSet.prototype = {wrapper:false,contentTile:false,tabs:false,contentItems:false,settings:false,selectedIndex:-1,completed:false,navigation:"default",initSelection:null,completeTab:function()
{
},getRootVisual:function()
{
    return this.wrapper
},countTasks:function(includeComplete,includeOptional)
{
    return!this.tabs ? 0 : includeComplete && includeOptional ? this.tabs.length : includeComplete ? this.tabs.filter('[data-required="true"]').length : includeOptional ? this.tabs.not(".complete").length : this.tabs.not(".complete").filter('[data-required="true"]').length
},init:function(wrapper)
{
    this.wrapper = $(wrapper);
    this.contentTile = this.wrapper.children(".tabcontent_tile");
    this.tabs = this.wrapper.find(".tablink");
    this.contentItems = this.contentTile.children(".tabcontent");
    this.navigation = this.wrapper.attr("data-navigation") || "default";
    var ts = this,
        ss = ts.page.courseController.course.scormState,
        pageId = ts.page.pageId,
        getTabIndex = function(tab)
        {
            for(var i = 0; i < ts.tabs.length; i++)
                if(ts.tabs[i] === tab)
                    return i;
            return-1
        },
        getSelectedItem = function()
        {
            return ts.contentItems[ts.selectedIndex] || null
        },
        getSelectedTab = function()
        {
            return ts.tabs[ts.selectedIndex] || null
        },
        getRequiredTabs = function()
        {
            return ts.tabs.filter('[data-required="true"]')
        },
        getIncompleteTabs = function()
        {
            return ts.tabs.not(".complete")
        },
        getRequiredIncompleteTabs = function()
        {
            return ts.tabs.not(".complete").filter('[data-required="true"]')
        },
        getFirstIncompleteTabIndex = function()
        {
            for(var i = 0; i < ts.tabs.length; i++)
                if(!$(ts.tabs[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstRequiredIncompleteTabIndex = function()
        {
            for(var i = 0; i < ts.tabs.length; i++)
                if(ts.tabs[i].required && !$(ts.tabs[i]).hasClass("complete"))
                    return i;
            return-1
        },
        getFirstActiveTabIndex = function()
        {
            for(var i = 0; i < ts.tabs.length; i++)
                if(!$(ts.tabs[i]).hasClass("disabled"))
                    return i;
            return-1
        },
        hideContent = function(item)
        {
            var $item = $(item),
                mediabar = $(".media_bar",item),
                mediaManager = ts.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            mediaIndex > -1 && mediaManager.unloadMedia(mediaIndex);
            $item.stop().fadeOut(300,function()
            {
                $item.css({opacity:"",display:""})
            })
        },
        showContent = function(item)
        {
            var $item = $(item),
                mediabar = $(".media_bar",item),
                mediaManager = ts.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            $item.stop().fadeIn(300,function()
            {
                mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
            })
        },
        markComplete = function(tab)
        {
            var $tab = $(tab);
            if(!$tab.hasClass("complete"))
            {
                $tab.addClass("complete");
                if($tab.children(".completion_indicator").length == 0)
                {
                    var iconSize = $(".content_container") ? $(".content_container").width() / 64 : $(window).width() / 64,
                        completionIndicator = $("<div/>",{"class":"completion_indicator icon"}).css({width:iconSize + "px",height:iconSize + "px"});
                    completionIndicator.append($("<div/>",{"class":"check"}).html('<img src="' + ts.settings.assetPath + 'dark/images/check.nocircle.png" alt="complete" class="showOnDark"/><img src="' + ts.settings.assetPath + 'light/images/check.nocircle.png" alt="complete" class="showOnLight"/>')).appendTo($tab)
                }
            }
        },
        completeTab = function(t)
        {
            var index = typeof t === "number" ? t : getTabIndex(t),
                tab = ts.tabs[index];
            if(tab && !$(tab).hasClass("complete"))
            {
                markComplete(tab);
                setState();
                tab.required && ts.page.observer.fire("requiredTaskCompleted",{type:"tabSet",component:ts,task:tab});
                if(!ts.completed && getRequiredIncompleteTabs().length === 0)
                {
                    ts.completed = true;
                    ts.page.observer.fire("tabSetCompleted",ts.settings.index)
                }
                if(ts.navigation === "linear")
                    for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteTabIndex(),
                        i = index + 1; i < (firstRequiredIncompleteIndex === -1 ? ts.tabs.length : firstRequiredIncompleteIndex + 1); i++)
                        activateTab(ts.tabs[i])
            }
        },
        completeSelectedTab = function()
        {
            completeTab(ts.selectedIndex)
        },
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "ts#" + (ts.settings.index ? ts.settings.index.toString() : "0") + ":c=([^~]*)~l=([^|]*)",
                match = currentState.match(new RegExp(pattern));
            if(match)
            {
                for(var completed = match[1].split(","),
                    i = 0; i < completed.length; i++)
                    completed[i].trim().length > 0 && !isNaN(completed[i]) && 
                        markComplete(ts.tabs[completed[i]]);
                return parseInt(match[2])
            }
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "ts#" + (ts.settings.index ? ts.settings.index.toString() : "0") + ":c=[^~]*~l=[^|]",
                re = new RegExp(pattern),
                completed = [],
                i = 0; i < ts.tabs.length; i++)
                $(ts.tabs[i]).hasClass("complete") && completed.push(i);
            if(re.test(currentState))
                currentState = currentState.replace(re,"ts#" + (ts.settings.index ? ts.settings.index.toString() : "0") + ":c=" + completed.join(",") + "~l=" + ts.selectedIndex);
            else
                currentState += "ts#" + (ts.settings.index ? ts.settings.index.toString() : "0") + ":c=" + completed.join(",") + "~l=" + ts.selectedIndex + "|";
            ss.setState(pageId,currentState)
        },
        navigateNext = function()
        {
            var index = ts.selectedIndex + 1;
            index < ts.tabs.length && selectTab.call(ts.tabs[index])
        },
        activateTab = function(tab)
        {
            $(tab).removeClass("disabled").attr("href","#").unbind("click",selectTab).bind("click",selectTab)
        },
        deactivateTab = function(tab)
        {
            $(tab).addClass("disabled").removeAttr("href").unbind("click",selectTab)
        },
        selectTab = function()
        {
            var index = getTabIndex(this);
            if(index !== -1 && index !== ts.selectedIndex)
            {
                var selectedTab = getSelectedTab(),
                    selectedItem = getSelectedItem();
                selectedTab && $(selectedTab).removeClass("selected").children(".tilefocusborder").remove();
                selectedItem && hideContent(selectedItem);
                ts.selectedIndex = index;
                setState();
                selectedTab = getSelectedTab();
                $(selectedTab).addClass("selected");
                $(selectedTab).hasClass("tile") && $(selectedTab).prepend('<div class="tilefocusborder topborder"></div><div class="tilefocusborder bottomborder"></div><div class="tilefocusborder leftborder"></div><div class="tilefocusborder rightborder"></div>');
                selectedItem = getSelectedItem();
                selectedItem && showContent(selectedItem);
                $(window).trigger("resize");
                selectedTab.autocomplete && 
                    completeSelectedTab()
            }
            ts.page.instructions.container && ts.page.instructions.close.call(ts.page.instructions)
        },
        videoEnded = function(videoFile)
        {
            videoFile.mustPlayAll && 
                completeSelectedTab();
            videoFile.videoAutoNavigate && 
                navigateNext()
        };
    this.completeTab = completeTab;
    this.contentItems.each(function()
    {
        mediabar = $(".media_bar",this);
        if(mediabar.attr("data-video"))
            mediabar[0].onMediaEnded = videoEnded
    });
    if(ts.wrapper.hasClass("hubandspoke"))
    {
        ts.wrapper.find(".spoke").each(function(index)
        {
            $(this).delay(index * 125).animate({opacity:1},250)
        });
        this.wrapper.hasClass("hubandspoke") && 
            this.contentTile.delay(200 + ts.wrapper.find(".spoke").length * 125).animate({opacity:1},250)
    }
    this.tabs.each(function()
    {
        this.tabSet = ts;
        this.autocomplete = $(this).attr("data-autocomplete") !== "false";
        this.required = $(this).attr("data-required") === "true";
        if(ts.navigation === "linear" || ts.navigation === "synched")
            deactivateTab(this);
        else
            activateTab(this)
    });
    var initialTabIndex = Math.max(restoreState() || 0,0);
    if(getRequiredIncompleteTabs().length === 0)
        ts.completed = true;
    if(this.navigation === "linear")
        for(var firstRequiredIncompleteIndex = getFirstRequiredIncompleteTabIndex(),
            i = 0; i < (firstRequiredIncompleteIndex === -1 ? this.tabs.length : firstRequiredIncompleteIndex + 1); i++)
            activateTab(this.tabs[i]);
    if(this.navigation === "synched")
    {
        this.syncTabIn = selectTab;
        this.tabs.addClass("media_sync").attr("data-inAction","page.interactiveComponents.tabSets.items." + (this.settings.index ? this.settings.index.toString() : "0") + ".syncTabIn")
    }
    else
    {
        this.initSelection = function()
        {
            if(initialTabIndex <= ts.tabs.length)
                selectTab.call(ts.tabs[initialTabIndex]);
            else
                selectTab.call(ts.tabs[0])
        };
        $(".instruction_overlay",this.wrapper).length === 0 && this.initSelection()
    }
}};
function ThoughtBubble(wrapper,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.init(wrapper)
}
ThoughtBubble.prototype = {wrapper:false,question:false,answer:false,submitButton:false,settings:false,completed:false,required:false,getRootVisual:function()
{
    return this.wrapper
},init:function(wrapper)
{
    this.wrapper = $(wrapper);
    this.question = this.wrapper.children(".questionbox:first");
    this.answer = this.wrapper.children(".answerbox:first");
    this.submitButton = this.question.find(".submit:first");
    this.required = this.wrapper.attr("data-required") === "true";
    var tb = this,
        ss = tb.page.courseController.course.scormState,
        pageId = tb.page.pageId,
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "tb#" + (tb.settings.index ? tb.settings.index.toString() : "0") + ":([^|]*)",
                complete = currentState.match(new RegExp(pattern));
            complete && complete[1] === "c" && (tb.completed = true)
        },
        setState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "tb#" + (tb.settings.index ? tb.settings.index.toString() : "0") + ":[^|]*",
                re = new RegExp(pattern);
            if(re.test(currentState))
                currentState = currentState.replace(re,"tb#" + (tb.settings.index ? tb.settings.index.toString() : "0") + ":" + (tb.completed ? "c" : "i"));
            else
                currentState += "tb#" + (tb.settings.index ? tb.settings.index.toString() : "0") + ":" + (tb.completed ? "c" : "i") + "|";
            ss.setState(pageId,currentState)
        },
        submit = function()
        {
            tb.submitButton.off("click",submit);
            tb.completed = true;
            setState();
            tb.required && tb.page.observer.fire("requiredTaskCompleted",{type:"thoughtBubble",component:tb,task:tb});
            tb.page.observer.fire("thoughtBubbleCompleted",tb.settings.index);
            tb.submitButton.fadeOut(300,function()
            {
                tb.question.find(".check").fadeIn(300)
            });
            tb.answer.children(".unanswered_content").fadeOut(300);
            tb.answer.children(".answered_content:first").delay(100).fadeIn(500,function()
            {
                tb.wrapper.addClass("complete");
                var mediabar = $(".media_bar",tb.answer),
                    mediaManager = tb.page.mediaManager,
                    mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
                mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
            })
        };
    this.submitButton.attr("href","#").on("click",submit).html('<img src="' + tb.settings.assetPath + 'dark/images/right.normal.png" alt="submit" class="showOnDark"/><img src="' + tb.settings.assetPath + 'light/images/right.normal.png" alt="submit" class="showOnLight"/>');
    this.question.find(".check").html('<img src="' + tb.settings.assetPath + 'dark/images/checkmark2.png" alt="check" class="showOnDark"/><img src="' + tb.settings.assetPath + 'light/images/checkmark2.png" alt="check" class="showOnLight"/>');
    this.answer.find(".question_icon").html('<img src="' + tb.settings.assetPath + 'dark/images/question.png" alt="question" class="showOnDark"/><img src="' + tb.settings.assetPath + 'light/images/question.png" alt="question" class="showOnLight"/>');
    restoreState();
    this.completed && tb.wrapper.addClass("complete");
    !this.completed && 
        this.question.each(function()
        {
            var mediabar = $(".media_bar",this),
                mediaManager = tb.page.mediaManager,
                mediaIndex = mediaManager.indexOf(mediabar[0],"mediaBar");
            mediaIndex > -1 && mediaManager.playMedia(mediaIndex)
        })
}};
function TileManager()
{
    this.page = false;
    this.settings = false;
    this.quickLinkTiles = [];
    this.moduleInfoTiles = [];
    this.progressTiles = [];
    this.completionProgressTiles = [];
    this.taskProgressTiles = [];
    this.liveTiles = [];
    this.popupLinkTiles = [];
    this.moduleLinkTileSets = [];
    this.trackSelectionTileSets = [];
    this.clickRevealTileSets = [];
    this.tabSets = []
}
TileManager.prototype.init = function(page,settings)
{
    var tm = this,
        defaults = {assetPath:"../../../Player/theme/",liveTileInterval:{openDelay:10,closeDelay:-1}};
    this.page = page;
    this.settings = $.extend(false,defaults,settings);
    this.quickLinkTiles = $(".tile",".quicklink_tiles");
    this.quickLinkTiles.length && this.initializeQuickLinkTiles();
    this.moduleInfoTiles = $(".module_info_tile");
    this.moduleInfoTiles.length && this.initializeModuleInfoTiles();
    this.progressTiles = $(".progress_tile");
    this.progressTiles.length && this.initializeProgressTiles();
    this.completionProgressTiles = $(".completionprogress_tile");
    this.completionProgressTiles.length && this.initializeCompletionProgressTiles();
    this.taskProgressTiles = $(".taskprogress_tile");
    this.moduleLinkTileSets = [];
    $(".module_link_container").each(function()
    {
        this.tileSet = new ModuleLinkTileSet(this,tm.page,{assetPath:tm.settings.assetPath,index:tm.moduleLinkTileSets.length});
        tm.moduleLinkTileSets.push(this.tileSet)
    });
    this.trackSelectionTileSets = [];
    $(".track_tile_container").each(function()
    {
        this.tileSet = new TrackSelectionTileSet(this,tm.page,{assetPath:tm.settings.assetPath,index:tm.trackSelectionTileSets.length});
        tm.trackSelectionTileSets.push(this.tileSet)
    });
    this.liveTiles = $(".tile_popup").not(page.accessibleWrapper.find(".tile_popup")).parent(".tile");
    if(page.accessibleWrapper)
        this.liveTiles = this.liveTiles.not(page.accessibleWrapper.find(".tile"));
    this.liveTiles.length && this.initializeLiveTiles();
    this.popupLinkTiles = $(".popuplink");
    if(page.accessibleWrapper)
        this.popupLinkTiles = this.popupLinkTiles.not(page.accessibleWrapper.find(".popuplink"));
    this.popupLinkTiles.length && this.initializePopupLinks();
    this.clickRevealTileSets = [];
    $(".tab_container").each(function()
    {
        if($(this).closest(page.accessibleWrapper).length === 0)
        {
            this.tileSet = new ClickRevealTileSet(this,tm.page,{assetPath:tm.settings.assetPath,index:tm.clickRevealTileSets.length});
            tm.clickRevealTileSets.push(this.tileSet)
        }
    });
    this.tabSets = [];
    $(".tabset_wrapper").each(function()
    {
        if($(this).closest(page.accessibleWrapper).length === 0)
        {
            this.tabSet = new TabSet(this,tm.page,{assetPath:tm.settings.assetPath,index:tm.tabSets.length});
            tm.tabSets.push(this.tabSet)
        }
    });
    var assetPath = this.settings.assetPath;
    $(".tile_background_overlay").each(function()
    {
        $(this).append($(new Image).attr({src:assetPath + "dark/images/tilegradient.png",width:"100%",height:"100%",alt:""}))
    });
    $(window).on("resize",function()
    {
        $(".tile_container").each(function()
        {
            this.baseOverflowRatio = (this.scrollHeight - $(this.offsetParent).height() / 10) / $(this.offsetParent).width();
            $(this).css("margin-bottom",100 * this.baseOverflowRatio + "%")
        })
    })
};
TileManager.prototype.initializeQuickLinkTiles = function()
{
    this.quickLinkTiles.filter(".changelanguages").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().changeLanguagesTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".changetracks").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().changeTracksTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".community").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().communityTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".contents").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().contentsTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".downloadcourse").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().downloadCourseTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".downloadtranscript").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().downloadTranscriptTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".glossary").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().glossaryTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".help").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().helpTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".progress").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().progressTile();
        if(tileAction)
        {
            $(this).append(tileAction);
            tileAction.adjustLayout && $(window).on("resize",tileAction.adjustLayout)
        }
        else
            $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".resources").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().resourcesTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    });
    this.quickLinkTiles.filter(".testout").each(function()
    {
        var tileAction = window.parent.playerAPI.ui().testOutTile();
        tileAction && $(this).append(tileAction) || $(this).addClass("tile-disabled")
    })
};
TileManager.prototype.initializeModuleInfoTiles = function()
{
    for(var cc = this.page.courseController,
        module = cc.course.getCurrentPage().getModule(),
        name = module.name,
        i = 0,
        number = 0; i < cc.course.modules.length; i++)
    {
        cc.course.modules[i].isRequired() && number++;
        if(module === cc.course.modules[i])
            break
    }
    for(var i = 0,
        duration = 0; i < module.pages.length; i++)
        duration += utils.getRecursivePageDuration(module.pages[i]);
    $(".tile_title",this.moduleInfoTiles).text(name);
    $(".tile_footer_content",this.moduleInfoTiles).text("module " + (number < 10 ? "0" + number.toString() : number));
    $(".tile_subtitle",this.moduleInfoTiles).text(duration + " minutes to complete")
};
TileManager.prototype.initializeProgressTiles = function()
{
    for(var cc = this.page.courseController,
        i = 0,
        completed = 0,
        required = 0; i < cc.course.modules.length; i++)
        if(cc.course.modules[i].isRequired())
        {
            required++;
            cc.course.modules[i].isComplete() && completed++
        }
    $(".tile_title",this.progressTiles).text(Math.round(100 * completed / required) + "%");
    $(".tile_subtitle",this.progressTiles).text(completed + "/" + required + " Modules Complete")
};
TileManager.prototype.initializeCompletionProgressTiles = function()
{
    var cc = this.page.courseController,
        pageModel = this.page.pageModel,
        countCurrentPage = pageModel.pageType.id != "54434C22-4760-41D7-9D0E-92821CCF0258";
    $(".tile_title",this.completionProgressTiles).text(cc.countRemainingRequiredPages(countCurrentPage))
};
TileManager.prototype.updateTaskProgressTiles = function(completeTaskCount,requiredTaskCount)
{
    if(completeTaskCount < requiredTaskCount)
    {
        $(".tile_title",this.taskProgressTiles).text(completeTaskCount + "/" + requiredTaskCount);
        $(".tile_subtitle",this.taskProgressTiles).text(this.page.resources.TaskProgress_Text)
    }
    else
    {
        $(".tile_title",this.taskProgressTiles).text("");
        $(".tile_subtitle",this.taskProgressTiles).text(this.page.resources.TaskProgress_Complete_Text)
    }
};
TileManager.prototype.initializeLiveTiles = function()
{
    var interval = this.settings.liveTileInterval,
        tm = this,
        togglePopup = function()
        {
            var tile = this,
                popup = $(tile).children(".tile_popup"),
                popupHeader = $(".tile_popup_header",tile),
                expand = popupHeader.children(".expand"),
                close = popupHeader.children(".close");
            this.timer && clearTimeout(this.timer);
            if(popup.length > 0)
                if(tile.popupState !== "open")
                {
                    tile.popupState = "open";
                    popup.addClass("popup-open").css("top",popup.height() - popupHeader.height() + "px").animate({top:"0%"},300);
                    expand.hide();
                    close.show();
                    if(tile.liveTileInterval && !isNaN(tile.liveTileInterval.closeDelay) && tile.liveTileInterval.closeDelay >= 0)
                        tile.timer = setTimeout(function()
                        {
                            togglePopup.call(tile)
                        },1e3 * tile.liveTileInterval.closeDelay)
                }
                else
                {
                    tile.popupState = "closed";
                    popup.animate({top:popup.height() - popupHeader.height() + "px"},300,function()
                    {
                        $(this).removeClass("popup-open").css("top","")
                    });
                    close.hide();
                    expand.show();
                    if(tile.liveTileInterval && !isNaN(tile.liveTileInterval.openDelay) && tile.liveTileInterval.openDelay >= 0)
                        tile.timer = setTimeout(function()
                        {
                            togglePopup.call(tile)
                        },1e3 * tile.liveTileInterval.openDelay)
                }
        };
    this.liveTiles.each(function()
    {
        var expandButton = $(".tile_popup_header > .expand",this).first(),
            closeButton = $(".tile_popup_header > .close",this).first(),
            popup = $(this).children(".tile_popup"),
            re = /^(-?)([0-9]+)$/,
            tile = this,
            toggle = function()
            {
                togglePopup.call(tile)
            };
        this.liveTileInterval = {openDelay:re.test(popup.attr("data-openDelay")) ? parseInt(popup.attr("data-openDelay")) : interval.openDelay,closeDelay:re.test(popup.attr("data-closeDelay")) ? parseInt(popup.attr("data-closeDelay")) : interval.closeDelay};
        expandButton.html('<img src="' + tm.settings.assetPath + 'dark/images/add.nocircle.png" alt="" class="showOnDark"/><img src="' + tm.settings.assetPath + 'light/images/add.nocircle.png" alt="" class="showOnLight"/>').attr("href","#").click(toggle);
        closeButton.html('<img src="' + tm.settings.assetPath + 'dark/images/minus.nocircle.png" alt="" class="showOnDark"/><img src="' + tm.settings.assetPath + 'light/images/minus.nocircle.png" alt="" class="showOnLight"/>').attr("href","#").click(toggle);
        expandButton.attr("aria-label",parent.Resources.LiveTiles_ExpandTile_Text);
        closeButton.attr("aria-label",parent.Resources.LiveTiles_CloseTile_Text);
        if(!isNaN(this.liveTileInterval.openDelay) && this.liveTileInterval.openDelay >= 0)
            this.timer = setTimeout(toggle,1e3 * this.liveTileInterval.openDelay + Math.floor(Math.random() * 5e3))
    })
};
TileManager.prototype.initializePopupLinks = function()
{
    var popupLinks = this.popupLinkTiles,
        plainLinks = [],
        tm = this,
        ss = tm.page.courseController.course.scormState,
        pageId = tm.page.pageId,
        restoreState = function()
        {
            var currentState = ss.getState(pageId),
                pattern = "pl:c=([^|]*)",
                completed = currentState.match(new RegExp(pattern));
            if(completed)
                for(var completedIndices = completed[1].split(","),
                    i = 0; i < completedIndices.length; i++)
                    if(completedIndices[i].trim().length > 0 && !isNaN(completedIndices[i]))
                    {
                        plainLinks[completedIndices[i]].completed = true;
                        markComplete(plainLinks[completedIndices[i]])
                    }
        },
        setState = function()
        {
            for(var currentState = ss.getState(pageId),
                pattern = "pl:c=[^|]*",
                re = new RegExp(pattern),
                completed = [],
                i = 0; i < plainLinks.length; i++)
                $(plainLinks[i]).hasClass("complete") && completed.push(i);
            if(re.test(currentState))
                currentState = currentState.replace(re,"pl:c=" + completed.join(","));
            else
                currentState += "pl:c=" + completed.join(",") + "|";
            ss.setState(pageId,currentState)
        },
        markComplete = function(link)
        {
            if(!link.hasClass("complete"))
            {
                link.addClass("complete");
                if(link.children(".completion_indicator").length == 0)
                {
                    var iconSize = $(".content_container") ? $(".content_container").width() / 48 : $(window).width() / 48,
                        completionIndicator = $("<div/>",{"class":"completion_indicator icon"}).css({width:iconSize + "px",height:iconSize + "px"});
                    completionIndicator.append($("<div/>",{"class":"check"}).html('<img src="' + tm.settings.assetPath + 'dark/images/check.nocircle.png" alt="complete" class="showOnDark"/><img src="' + tm.settings.assetPath + 'light/images/check.nocircle.png" alt="complete" class="showOnLight"/>')).appendTo(link)
                }
            }
        },
        checkComplete = function()
        {
            var link = $(this),
                linkPage = this.linkPage;
            if(linkPage && linkPage.isComplete())
            {
                popupLinks.each(function()
                {
                    if(this.linkPage === linkPage)
                    {
                        markComplete($(this));
                        this.completed = true
                    }
                });
                this.required && tm.page.observer.fire("requiredTaskCompleted",{type:"popupLink",component:this,task:this});
                tm.page.observer.fire("popupLinkCompleted")
            }
        },
        openPopup = function()
        {
            var link = this;
            this.linkPage && tm.page.courseController.showContentPopup(this.linkPage,function()
            {
                checkComplete.call(link)
            })
        },
        openPlainLink = function()
        {
            var link = this;
            if(link.href)
            {
                window.open(link.href);
                markComplete($(link));
                this.completed = true;
                this.required && tm.page.observer.fire("requiredTaskCompleted",{type:"popupLink",component:this,task:this});
                tm.page.observer.fire("popupLinkCompleted")
            }
        };
    popupLinks.each(function()
    {
        var popupLink = this,
            linkPageId = $(this).attr("data-linkpageid"),
            linkPage = linkPageId && parseInt(linkPageId) + "" === linkPageId ? tm.page.courseController.getPageFromId(linkPageId) : null,
            resourceName = $(this).attr("data-resourceName"),
            resource = null,
            href = $(this).attr("data-href"),
            openButton = $(popupLink).find(".open").html('<img src="' + tm.settings.assetPath + 'dark/images/right.normal.png" alt="" class="showOnDark"/><img src="' + tm.settings.assetPath + 'light/images/right.normal.png" alt="" class="showOnLight"/>');
        this.required = $(this).attr("data-required") === "true";
        this.getRootVisual = function()
        {
            return popupLink
        };
        if(linkPage)
        {
            this.linkPage = linkPage;
            openButton.attr("href","#");
            $(this).click(openPopup);
            checkComplete.call(this)
        }
        else
        {
            if(resourceName)
                for(var i = 0,
                    pageLinkArray = tm.page.courseController.course.PageLinkArray; i < pageLinkArray.length; i++)
                    if(pageLinkArray[i].id == tm.page.pageId && pageLinkArray[i].name == resourceName)
                    {
                        resource = pageLinkArray[i];
                        break
                    }
            this.href = resource ? resource.type != "URI" && resource.source.substring(0,10) != "Resources/" ? "../Resources/" + resource.source : resource.source : href ? href : null;
            if(this.href)
            {
                openButton.attr("href",this.href).click(function()
                {
                    openPlainLink.call(popupLink);
                    return false
                });
                $(this).click(openPlainLink);
                plainLinks.push(this)
            }
            else
            {
                openButton.remove();
                $(this).addClass("nolink")
            }
        }
        $("a",this).not(openButton).click(function(e)
        {
            e.stopPropagation()
        })
    });
    plainLinks.length > 0 && 
        restoreState()
};
function TrackSelectionTileSet(container,page,settings)
{
    var defaults = {assetPath:"../../../Player/theme/"};
    this.settings = $.extend(false,defaults,settings);
    this.page = page;
    this.init(container)
}
TrackSelectionTileSet.prototype = {container:false,tiles:false,selectors:false,infoContainer:false,sidebar:false,settings:false,init:function(container)
{
    this.container = $(container);
    var ts = this,
        cc = ts.page.courseController,
        openButton = window.parent.InfoButtonView,
        tracks = cc.course.tracks.items,
        minSelection = cc.course.tracks.trackSelectionMin,
        maxSelection = cc.course.tracks.trackSelectionMax !== 0 ? cc.course.tracks.trackSelectionMax : cc.course.tracks.items.length,
        toggleSelection = function()
        {
            if(this.track.required)
                return;
            this.isSelected = !this.isSelected;
            updateSelectors();
            validateSelections() && handleValidTrackSelection()
        },
        validateSelections = function()
        {
            var selectedTracks = getSelectedTracks();
            if(selectedTracks.length >= minSelection && selectedTracks.length <= maxSelection)
            {
                page.observer.fire("trackSelectionValidated");
                return true
            }
            return false
        },
        handleValidTrackSelection = function()
        {
            for(var i = 0; i < ts.selectors.length; i++)
                ts.selectors[i].track.state.isSelected = ts.selectors[i].isSelected;
            setTrackSelectionState();
            cc.course.loadPageNavigation(true);
            cc.course.updateForAssessments()
        },
        setTrackSelectionState = function()
        {
            for(var i = 0,
                selectedTracks = ""; i < cc.course.tracks.items.length; i++)
                if(cc.course.tracks.items[i].state.isSelected)
                    selectedTracks += (selectedTracks ? "," : "") + (i + 1);
            cc.course.scormState.setState("TRACKS",selectedTracks)
        },
        enableSelection = function(trackSelector)
        {
            $(trackSelector).attr("href","#").off("click",toggleSelection).on("click",toggleSelection)
        },
        disableSelection = function(trackSelector)
        {
            $(trackSelector).removeAttr("href").off("click",toggleSelection)
        },
        getSelectedCount = function()
        {
            for(var i = 0,
                count = 0; i < ts.selectors.length; i++)
                ts.selectors[i].isSelected && count++;
            return count
        },
        getSelectedTracks = function()
        {
            for(var i = 0,
                selected = []; i < ts.selectors.length; i++)
                ts.selectors[i].isSelected && selected.push(ts.selectors[i].track);
            return selected
        },
        updateSelectors = function()
        {
            var selectedCount = getSelectedCount();
            ts.selectors.each(function()
            {
                if(this.isSelected)
                    $(this).addClass("accent2");
                else
                    $(this).removeClass("accent2");
                if(selectedCount < maxSelection)
                    !this.track.required && enableSelection(this);
                else
                    if(this.isSelected)
                        enableSelection(this);
                    else
                        disableSelection(this)
            })
        },
        expandInfo = function()
        {
            ts.infoContainer.data("infoButton",this);
            ts.infoContainer.find(".track_title").html(this.track.name);
            ts.infoContainer.find(".track_description").html(this.track.description);
            ts.container.addClass("info_expanded");
            ts.infoContainer.find(".close_button").focus()
        },
        closeInfo = function()
        {
            ts.container.removeClass("info_expanded");
            ts.infoContainer.data("infoButton").focus();
            ts.infoContainer.removeData("infoButton")
        },
        updateTracksByUserType = function(userProfile,value)
        {
            if(userProfile)
            {
                var profile = value ? userProfile.yes : userProfile.no;
                if(profile)
                {
                    if(profile.required)
                        for(var aRequired = profile.required.split(","),
                            i = 0; i < aRequired.length; i++)
                        {
                            var nIndex = --aRequired[i];
                            if(tracks[nIndex])
                            {
                                tracks[nIndex].required = true;
                                tracks[nIndex].state.isSelectedByAuthor = true;
                                tracks[nIndex].state.isSelected = true
                            }
                        }
                    if(profile.removed)
                        for(var aRemoved = profile.removed.split(","),
                            i = 0; i < aRemoved.length; i++)
                        {
                            var nIndex = --aRemoved[i];
                            if(tracks[nIndex])
                            {
                                tracks[nIndex].required = false;
                                tracks[nIndex].state.isActive = false;
                                tracks[nIndex].state.isSelected = false
                            }
                        }
                }
            }
        },
        updateTracksFromUserProfile = function(skipValidateTrackSelection)
        {
            !skipValidateTrackSelection && 
                cc.course.tracks.reset();
            updateTracksByUserType(ts.settings.FTE,ts.settings.isFTE);
            updateTracksByUserType(ts.settings.peopleManager,ts.settings.isPeopleManager);
            if(ts.settings.organization && ts.settings.organizations)
                for(var org in ts.settings.organizations)
                    if(ts.settings.organizations[org].alias)
                        if(ts.settings.organizations[org].alias.toLowerCase() == ts.settings.organization.alias.toLowerCase())
                            updateTracksByUserType(ts.settings.organizations[org],true);
                        else
                            updateTracksByUserType(ts.settings.organizations[org],false);
            var aState = [];
            aState.push(Number(ts.settings.isFTE));
            aState.push(Number(ts.settings.isPeopleManager));
            aState.push(Number(ts.settings.useProfileData));
            aState.push(Number(ts.settings.useReportsToData));
            ts.settings.organization && ts.settings.organization.alias && 
                aState.push(ts.settings.organization.alias);
            cc.course.scormState.setState(ts.page.pageId,aState.join(","));
            buildTiles();
            !skipValidateTrackSelection && 
                handleValidTrackSelection()
        },
        buildTiles = function()
        {
            ts.container.children(".track_tile").remove();
            var tempTracks = tracks.slice(0);
            tempTracks.sort(function(a,b)
            {
                return b.required - a.required
            });
            for(var i = 0,
                count = 0,
                required,
                tile,
                link,
                tileId,
                linkId; i < tempTracks.length; i++)
            {
                if(!tempTracks[i].state.isActive)
                    continue;
                tileId = (ts.settings.index ? "ts" + ts.settings.index : "") + "trackTile" + i;
                linkId = (ts.settings.index ? "ts" + ts.settings.index : "") + "trackSelector" + i;
                required = tempTracks[i].required;
                required ? (tile = $("<div/>",{"class":"track_tile tile required",id:tileId})) : (tile = $("<div/>",{"class":"track_tile tile optional",id:tileId}));
                selector = $("<a/>",{"class":"track_selector",id:linkId}).html('<div class="track_title">' + tempTracks[i].name + "</div>").appendTo(tile).each(function()
                {
                    this.track = tempTracks[i];
                    this.isSelected = this.track.state.isSelected
                });
                footer = $("<div/>",{"class":"tile_footer"}).html(required ? parent.Resources.TracksPage_RequiredTrack_Text : parent.Resources.TracksPage_OptionalTrack_Text).appendTo(tile);
                info = $("<a/>",{"class":"button info"}).attr("href","#").html('<img src="' + ts.settings.assetPath + 'neutral/images/i.normal.png" alt=""/>').appendTo(footer).on("click",expandInfo).each(function()
                {
                    this.track = tempTracks[i]
                });
                check = $("<div/>",{"class":"selection_indicator icon"}).html('<div class="check"><img src="' + ts.settings.assetPath + 'dark/images/check.nocircle.png" alt="select" class="showOnDark"/><img src="' + ts.settings.assetPath + 'light/images/check.nocircle.png" alt="select" class="showOnLight"/></div>').appendTo(selector);
                ts.container.append(tile)
            }
            ts.container.children(".required").first().before("<p>" + parent.Resources.TracksPage_RequiredTracks_Text + "</p>");
            ts.container.children(".optional").first().before("<p style='clear:left'>" + parent.Resources.TracksPage_OptionalTracks_Text + "</p>");
            ts.tiles = ts.container.children(".track_tile");
            ts.selectors = ts.container.find(".track_selector");
            updateSelectors();
            validateSelections();
            ts.container.children(".track_info_container").remove();
            ts.infoContainer = $("<div/>",{"class":"track_info_container"}).html('<div class="track_info_tile"><div class="track_info_content"><div class="track_title"></div><div class="track_description"></div></div><a class="close_button" href="#">Close</a></div>').appendTo(ts.container);
            ts.infoContainer.find(".close_button").on("click",closeInfo);
            ts.sidebar = ts.container.siblings(".track_selection_sidebar");
            if(ts.sidebar.length > 0)
            {
                ts.container.addClass("rightbound").attr("data-rightBoundary",".track_selection_sidebar");
                $(window).on("resize",function()
                {
                    var maxWidth = ts.sidebar.is(":visible") ? Math.min(ts.sidebar.offset().left - parseInt(ts.sidebar.css("marginLeft")),$(".content_container").outerWidth()) : $(".content_container").outerWidth();
                    ts.infoContainer.css("padding-right",100 * ($(window).width() - maxWidth) / $(window).width() + "%")
                });
                var sidebarText = parent.Resources.TracksPage_Sidebar_Text;
                if(cc.course.tracks.trackSelectionMin !== 0 && cc.course.tracks.trackSelectionMax !== 0)
                    if(cc.course.tracks.trackSelectionMin !== cc.course.tracks.trackSelectionMax)
                        sidebarText = sidebarText.replace("%%selectionRequirement%%",parent.Resources.TracksPage_Sidebar_SelectionRequirementRange.replace("%%minTracks%%",cc.course.tracks.trackSelectionMin).replace("%%maxTracks%%",cc.course.tracks.trackSelectionMax));
                    else
                        sidebarText = sidebarText.replace("%%selectionRequirement%%",parent.Resources.TracksPage_Sidebar_SelectionRequirementExact.replace("%%trackCount%%",cc.course.tracks.trackSelectionMin));
                else
                    if(cc.course.tracks.trackSelectionMin !== 0)
                        sidebarText = sidebarText.replace("%%selectionRequirement%%",parent.Resources.TracksPage_Sidebar_SelectionRequirementMin.replace("%%minTracks%%",cc.course.tracks.trackSelectionMin));
                    else
                        if(cc.course.tracks.trackSelectionMax !== 0)
                            sidebarText = sidebarText.replace("%%selectionRequirement%%",parent.Resources.TracksPage_Sidebar_SelectionRequirementMax.replace("%%maxTracks%%",cc.course.tracks.trackSelectionMax));
                        else
                            sidebarText = sidebarText.replace("%%selectionRequirement%%","");
                ts.sidebar.find(".sidebar_content").html("<p>" + sidebarText + "</p>");
                ts.sidebar.find("a.close_button").html('<img src="' + ts.settings.assetPath + 'dark/images/close.png" alt="close"/>').on("click",function()
                {
                    ts.sidebar.hide();
                    openButton && openButton.show();
                    $(window).trigger("resize")
                });
                (ts.settings.alwaysShowDialog || ts.settings.useProfileData == false || ts.settings.useReportsToData == false) && 
                    ts.sidebar.find(".sidebar_content").append($('<input type="button" title="' + parent.Resources.TracksPage_EditRole_Button_TitleText + '"/>').val(parent.Resources.TracksPage_EditRole_Button_Text).on("click",function()
                    {
                        parent.DefineYourRoleDialogView.open(ts.settings,updateTracksFromUserProfile)
                    }))
            }
        };
    openButton && openButton.bind("click",function()
    {
        ts.sidebar.show();
        openButton.hide();
        $(window).trigger("resize")
    });
    jQuery.ajax({type:"GET",url:"page.xml",dataType:"XML",async:false,success:function(xml)
    {
        parent.CourseParser.parseTrackSelectionFromProfile(xml,ts.settings)
    }});
    if(ts.settings.callServices)
    {
        var sState = cc.course.scormState.getState(ts.page.pageId);
        if(sState)
        {
            var aState = sState.split(",");
            ts.settings.isFTE = Boolean(aState[0] - 0);
            ts.settings.isPeopleManager = Boolean(aState[1] - 0);
            ts.settings.useProfileData = Boolean(aState[2] - 0);
            ts.settings.useReportsToData = Boolean(aState[3] - 0);
            if(aState.length >= 5)
                ts.settings.organization = ts.settings.organizations[aState[4]];
            updateTracksFromUserProfile(true)
        }
        else
        {
            parent.LoadingDialogView.open(parent.Resources.Dialog_Wait_Title_Text,parent.Resources.UserProfileInfo_ServiceCall_Wait_Text);
            jQuery.ajax({type:"GET",url:ts.settings.urlProfile,dataType:"XML",async:true,success:function(xml)
            {
                ts.settings.useProfileData = true;
                ts.settings.isPeopleManager = $(xml).find("IsPeopleManager").text() == "true";
                $(xml).find("DirectReport UserAlias").each(function()
                {
                    if($(this).text().indexOf("-") == -1)
                    {
                        ts.settings.isPeopleManager = true;
                        return false
                    }
                });
                ts.settings.isFTE = $(xml).find("IsFTE").text() == "true"
            },error:function()
            {
                ts.settings.useProfileData = false
            },complete:function()
            {
                jQuery.ajax({type:"GET",url:ts.settings.urlReportsTo,dataType:"XML",async:true,success:function(xml)
                {
                    ts.settings.useReportsToData = true;
                    $(xml).find("EmailName").each(function()
                    {
                        var currentAlias = $(this).text();
                        if(currentAlias)
                            for(var org in ts.settings.organizations)
                                if(ts.settings.organizations[org].alias)
                                    if(ts.settings.organizations[org].alias.toLowerCase() == currentAlias.toLowerCase())
                                    {
                                        ts.settings.organization = ts.settings.organizations[org];
                                        break
                                    }
                        if(ts.settings.organization)
                            return false
                    })
                },error:function()
                {
                    ts.settings.useReportsToData = false
                },complete:function()
                {
                    parent.LoadingDialogView.close();
                    if(ts.settings.alwaysShowDialog || !ts.settings.useProfileData || !ts.settings.useReportsToData)
                        parent.DefineYourRoleDialogView.open(ts.settings,updateTracksFromUserProfile);
                    else
                        updateTracksFromUserProfile()
                }})
            }})
        }
    }
    else
        buildTiles()
}};
var utils = utils || {};
utils.getRecursivePageDuration = function(page)
{
    for(var duration = page.time,
        i = 0; i < page.pages.length; i++)
        duration += this.getRecursivePageDuration(page.pages[i]);
    return duration
};
utils.getRecursiveFirstCompletePageId = function(page)
{
    if(page.isComplete())
        return page.id;
    else
    {
        for(var i = 0,
            firstCompletePageId = null; i < page.pages.length; i++)
        {
            firstCompletePageId = this.getRecursiveFirstCompletePageId(page.pages[i]);
            if(firstCompletePageId !== null)
                return firstCompletePageId
        }
        return null
    }
};
utils.getRecursiveFirstIncompletePageId = function(page)
{
    if(!page.isComplete())
        return page.id;
    else
    {
        for(var i = 0,
            firstIncompletePageId = null; i < page.pages.length; i++)
        {
            firstIncompletePageId = this.getRecursiveFirstIncompletePageId(page.pages[i]);
            if(firstIncompletePageId != null)
                return firstIncompletePageId
        }
        return null
    }
};
utils.getFirstIncompletePageInModule = function(module)
{
    for(var i = 0,
        pageId = null; i < module.pages.length; i++)
    {
        pageId = utils.getRecursiveFirstIncompletePageId(module.pages[i]);
        if(pageId)
            break
    }
    return pageId
};
utils.getFirstIncompletePageInCourse = function(course)
{
    for(var i = 0,
        pageId = null,
        modules = course.modules; i < modules.length; i++)
        if(modules[i].isRequired() && !modules[i].isComplete())
        {
            pageId = utils.getFirstIncompletePageInModule(modules[i]);
            if(pageId)
                break
        }
    return pageId
};
utils.getTimeInSeconds = function(timeString)
{
    var parts = /^(\d{2}):(\d{2}):(\d{2})$/.exec(timeString);
    return parts !== null ? parseInt(parts[1]) * 3600 + parseInt(parts[2]) * 60 + parseInt(parts[3]) : null
};
String.prototype.isInt = function()
{
    var parts = /^(-?)([0-9]+)$/.exec(this);
    if(parts[1] === undefined)
        parts[1] = 0;
    if(parts[1] === undefined)
        parts[1] = 0;
    return new Date(+parts[1] + offset + parts[2] * 3.6e6 + parts[3] * 6e4)
};
if(typeof String.prototype.trim !== "function")
    String.prototype.trim = function()
    {
        return this.replace(/^\s+|\s+$/g,"")
    };
if(typeof Array.prototype.indexOf != "function")
    Array.prototype.indexOf = function(elt)
    {
        var len = this.length >>> 0,
            from = Number(arguments[1]) || 0;
        from = from < 0 ? Math.ceil(from) : Math.floor(from);
        if(from < 0)
            from += len;
        for(; from < len; from++)
            if(from in this && this[from] === elt)
                return from;
        return-1
    }

// SIG // Begin signature block
// SIG // MIIauwYJKoZIhvcNAQcCoIIarDCCGqgCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFG36hwpjmBhX
// SIG // ZyoRWRSt0Zi708RWoIIVgjCCBMMwggOroAMCAQICEzMA
// SIG // AAArOTJIwbLJSPMAAAAAACswDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTEyMDkwNDIx
// SIG // MTIzNFoXDTEzMTIwNDIxMTIzNFowgbMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDTALBgNVBAsTBE1PUFIxJzAlBgNVBAsT
// SIG // Hm5DaXBoZXIgRFNFIEVTTjpDMEY0LTMwODYtREVGODEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAKa2MA4DZa5QWoZrhZ9IoR7JwO5eSQeF4HCWfL65
// SIG // X2JfBibTizm7GCKlLpKt2EuIOhqvm4OuyF45jMIyexZ4
// SIG // 7Tc4OvFi+2iCAmjs67tAirH+oSw2YmBwOWBiDvvGGDhv
// SIG // sJLWQA2Apg14izZrhoomFxj/sOtNurspE+ZcSI5wRjYm
// SIG // /jQ1qzTh99rYXOqZfTG3TR9X63zWlQ1mDB4OMhc+LNWA
// SIG // oc7r95iRAtzBX/04gPg5f11kyjdcO1FbXYVfzh4c+zS+
// SIG // X+UoVXBUnLjsfABVRlsomChWTOHxugkZloFIKjDI9zMg
// SIG // bOdpw7PUw07PMB431JhS1KkjRbKuXEFJT7RiaJMCAwEA
// SIG // AaOCAQkwggEFMB0GA1UdDgQWBBSlGDNTP5VgoUMW747G
// SIG // r9Irup5Y0DAfBgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7
// SIG // syuwwzWzDzBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNyb3NvZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsG
// SIG // AQUFBwEBBEwwSjBIBggrBgEFBQcwAoY8aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQB+zLB75S++
// SIG // 51a1z3PbqlLRFjnGtM361/4eZbXnSPObRogFZmomhl7+
// SIG // h1jcxmOOOID0CEZ8K3OxDr9BqsvHqpSkN/BkOeHF1fnO
// SIG // B86r5CXwaa7URuL+ZjI815fFMiH67holoF4MQiwRMzqC
// SIG // g/3tHbO+zpGkkSVxuatysJ6v5M8AYolwqbhKUIzuLyJk
// SIG // pajmTWuVLBx57KejMdqQYJCkbv6TAg0/LCQNxmomgVGD
// SIG // ShC7dWNEqmkIxgPr4s8L7VY67O9ypwoM9ADTIrivInKz
// SIG // 58ScCyiggMrj4dc5ZjDnRhcY5/qC+lkLeryoDf4c/wOL
// SIG // Y7JNEgIjTy2zhYQ74qFH6M8VMIIE7DCCA9SgAwIBAgIT
// SIG // MwAAALARrwqL0Duf3QABAAAAsDANBgkqhkiG9w0BAQUF
// SIG // ADB5MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSMwIQYDVQQDExpN
// SIG // aWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQTAeFw0xMzAx
// SIG // MjQyMjMzMzlaFw0xNDA0MjQyMjMzMzlaMIGDMQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMQ0wCwYDVQQLEwRNT1BSMR4wHAYD
// SIG // VQQDExVNaWNyb3NvZnQgQ29ycG9yYXRpb24wggEiMA0G
// SIG // CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDor1yiIA34
// SIG // KHy8BXt/re7rdqwoUz8620B9s44z5lc/pVEVNFSlz7SL
// SIG // qT+oN+EtUO01Fk7vTXrbE3aIsCzwWVyp6+HXKXXkG4Un
// SIG // m/P4LZ5BNisLQPu+O7q5XHWTFlJLyjPFN7Dz636o9UEV
// SIG // XAhlHSE38Cy6IgsQsRCddyKFhHxPuRuQsPWj/ov0DJpO
// SIG // oPXJCiHiquMBNkf9L4JqgQP1qTXclFed+0vUDoLbOI8S
// SIG // /uPWenSIZOFixCUuKq6dGB8OHrbCryS0DlC83hyTXEmm
// SIG // ebW22875cHsoAYS4KinPv6kFBeHgD3FN/a1cI4Mp68fF
// SIG // SsjoJ4TTfsZDC5UABbFPZXHFAgMBAAGjggFgMIIBXDAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDAzAdBgNVHQ4EFgQUWXGm
// SIG // WjNN2pgHgP+EHr6H+XIyQfIwUQYDVR0RBEowSKRGMEQx
// SIG // DTALBgNVBAsTBE1PUFIxMzAxBgNVBAUTKjMxNTk1KzRm
// SIG // YWYwYjcxLWFkMzctNGFhMy1hNjcxLTc2YmMwNTIzNDRh
// SIG // ZDAfBgNVHSMEGDAWgBTLEejK0rQWWAHJNy4zFha5TJoK
// SIG // HzBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWND
// SIG // b2RTaWdQQ0FfMDgtMzEtMjAxMC5jcmwwWgYIKwYBBQUH
// SIG // AQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY0NvZFNpZ1BD
// SIG // QV8wOC0zMS0yMDEwLmNydDANBgkqhkiG9w0BAQUFAAOC
// SIG // AQEAMdduKhJXM4HVncbr+TrURE0Inu5e32pbt3nPApy8
// SIG // dmiekKGcC8N/oozxTbqVOfsN4OGb9F0kDxuNiBU6fNut
// SIG // zrPJbLo5LEV9JBFUJjANDf9H6gMH5eRmXSx7nR2pEPoc
// SIG // sHTyT2lrnqkkhNrtlqDfc6TvahqsS2Ke8XzAFH9IzU2y
// SIG // RPnwPJNtQtjofOYXoJtoaAko+QKX7xEDumdSrcHps3Om
// SIG // 0mPNSuI+5PNO/f+h4LsCEztdIN5VP6OukEAxOHUoXgSp
// SIG // Rm3m9Xp5QL0fzehF1a7iXT71dcfmZmNgzNWahIeNJDD3
// SIG // 7zTQYx2xQmdKDku/Og7vtpU6pzjkJZIIpohmgjCCBbww
// SIG // ggOkoAMCAQICCmEzJhoAAAAAADEwDQYJKoZIhvcNAQEF
// SIG // BQAwXzETMBEGCgmSJomT8ixkARkWA2NvbTEZMBcGCgmS
// SIG // JomT8ixkARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMkTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // MB4XDTEwMDgzMTIyMTkzMloXDTIwMDgzMTIyMjkzMlow
// SIG // eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EwggEiMA0GCSqG
// SIG // SIb3DQEBAQUAA4IBDwAwggEKAoIBAQCycllcGTBkvx2a
// SIG // YCAgQpl2U2w+G9ZvzMvx6mv+lxYQ4N86dIMaty+gMuz/
// SIG // 3sJCTiPVcgDbNVcKicquIEn08GisTUuNpb15S3GbRwfa
// SIG // /SXfnXWIz6pzRH/XgdvzvfI2pMlcRdyvrT3gKGiXGqel
// SIG // cnNW8ReU5P01lHKg1nZfHndFg4U4FtBzWwW6Z1KNpbJp
// SIG // L9oZC/6SdCnidi9U3RQwWfjSjWL9y8lfRjFQuScT5EAw
// SIG // z3IpECgixzdOPaAyPZDNoTgGhVxOVoIoKgUyt0vXT2Pn
// SIG // 0i1i8UU956wIAPZGoZ7RW4wmU+h6qkryRs83PDietHdc
// SIG // pReejcsRj1Y8wawJXwPTAgMBAAGjggFeMIIBWjAPBgNV
// SIG // HRMBAf8EBTADAQH/MB0GA1UdDgQWBBTLEejK0rQWWAHJ
// SIG // Ny4zFha5TJoKHzALBgNVHQ8EBAMCAYYwEgYJKwYBBAGC
// SIG // NxUBBAUCAwEAATAjBgkrBgEEAYI3FQIEFgQU/dExTtMm
// SIG // ipXhmGA7qDFvpjy82C0wGQYJKwYBBAGCNxQCBAweCgBT
// SIG // AHUAYgBDAEEwHwYDVR0jBBgwFoAUDqyCYEBWJ5flJRP8
// SIG // KuEKU5VZ5KQwUAYDVR0fBEkwRzBFoEOgQYY/aHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvbWljcm9zb2Z0cm9vdGNlcnQuY3JsMFQGCCsGAQUF
// SIG // BwEBBEgwRjBEBggrBgEFBQcwAoY4aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRS
// SIG // b290Q2VydC5jcnQwDQYJKoZIhvcNAQEFBQADggIBAFk5
// SIG // Pn8mRq/rb0CxMrVq6w4vbqhJ9+tfde1MOy3XQ60L/svp
// SIG // LTGjI8x8UJiAIV2sPS9MuqKoVpzjcLu4tPh5tUly9z7q
// SIG // QX/K4QwXaculnCAt+gtQxFbNLeNK0rxw56gNogOlVuC4
// SIG // iktX8pVCnPHz7+7jhh80PLhWmvBTI4UqpIIck+KUBx3y
// SIG // 4k74jKHK6BOlkU7IG9KPcpUqcW2bGvgc8FPWZ8wi/1wd
// SIG // zaKMvSeyeWNWRKJRzfnpo1hW3ZsCRUQvX/TartSCMm78
// SIG // pJUT5Otp56miLL7IKxAOZY6Z2/Wi+hImCWU4lPF6H0q7
// SIG // 0eFW6NB4lhhcyTUWX92THUmOLb6tNEQc7hAVGgBd3TVb
// SIG // Ic6YxwnuhQ6MT20OE049fClInHLR82zKwexwo1eSV32U
// SIG // jaAbSANa98+jZwp0pTbtLS8XyOZyNxL0b7E8Z4L5UrKN
// SIG // MxZlHg6K3RDeZPRvzkbU0xfpecQEtNP7LN8fip6sCvsT
// SIG // J0Ct5PnhqX9GuwdgR2VgQE6wQuxO7bN2edgKNAltHIAx
// SIG // H+IOVN3lofvlRxCtZJj/UBYufL8FIXrilUEnacOTj5XJ
// SIG // jdibIa4NXJzwoq6GaIMMai27dmsAHZat8hZ79haDJLmI
// SIG // z2qoRzEvmtzjcT3XAH5iR9HOiMm4GPoOco3Boz2vAkBq
// SIG // /2mbluIQqBC0N1AI1sM9MIIGBzCCA++gAwIBAgIKYRZo
// SIG // NAAAAAAAHDANBgkqhkiG9w0BAQUFADBfMRMwEQYKCZIm
// SIG // iZPyLGQBGRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWlj
// SIG // cm9zb2Z0MS0wKwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBD
// SIG // ZXJ0aWZpY2F0ZSBBdXRob3JpdHkwHhcNMDcwNDAzMTI1
// SIG // MzA5WhcNMjEwNDAzMTMwMzA5WjB3MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
// SIG // ggEKAoIBAQCfoWyx39tIkip8ay4Z4b3i48WZUSNQrc7d
// SIG // GE4kD+7Rp9FMrXQwIBHrB9VUlRVJlBtCkq6YXDAm2gBr
// SIG // 6Hu97IkHD/cOBJjwicwfyzMkh53y9GccLPx754gd6udO
// SIG // o6HBI1PKjfpFzwnQXq/QsEIEovmmbJNn1yjcRlOwhtDl
// SIG // KEYuJ6yGT1VSDOQDLPtqkJAwbofzWTCd+n7Wl7PoIZd+
// SIG // +NIT8wi3U21StEWQn0gASkdmEScpZqiX5NMGgUqi+YSn
// SIG // EUcUCYKfhO1VeP4Bmh1QCIUAEDBG7bfeI0a7xC1Un68e
// SIG // eEExd8yb3zuDk6FhArUdDbH895uyAc4iS1T/+QXDwiAL
// SIG // AgMBAAGjggGrMIIBpzAPBgNVHRMBAf8EBTADAQH/MB0G
// SIG // A1UdDgQWBBQjNPjZUkZwCu1A+3b7syuwwzWzDzALBgNV
// SIG // HQ8EBAMCAYYwEAYJKwYBBAGCNxUBBAMCAQAwgZgGA1Ud
// SIG // IwSBkDCBjYAUDqyCYEBWJ5flJRP8KuEKU5VZ5KShY6Rh
// SIG // MF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJkiaJ
// SIG // k/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1pY3Jv
// SIG // c29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eYIQ
// SIG // ea0WoUqgpa1Mc1j0BxMuZTBQBgNVHR8ESTBHMEWgQ6BB
// SIG // hj9odHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2Ny
// SIG // bC9wcm9kdWN0cy9taWNyb3NvZnRyb290Y2VydC5jcmww
// SIG // VAYIKwYBBQUHAQEESDBGMEQGCCsGAQUFBzAChjhodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01p
// SIG // Y3Jvc29mdFJvb3RDZXJ0LmNydDATBgNVHSUEDDAKBggr
// SIG // BgEFBQcDCDANBgkqhkiG9w0BAQUFAAOCAgEAEJeKw1wD
// SIG // RDbd6bStd9vOeVFNAbEudHFbbQwTq86+e4+4LtQSooxt
// SIG // YrhXAstOIBNQmd16QOJXu69YmhzhHQGGrLt48ovQ7DsB
// SIG // 7uK+jwoFyI1I4vBTFd1Pq5Lk541q1YDB5pTyBi+FA+mR
// SIG // KiQicPv2/OR4mS4N9wficLwYTp2OawpylbihOZxnLcVR
// SIG // DupiXD8WmIsgP+IHGjL5zDFKdjE9K3ILyOpwPf+FChPf
// SIG // wgphjvDXuBfrTot/xTUrXqO/67x9C0J71FNyIe4wyrt4
// SIG // ZVxbARcKFA7S2hSY9Ty5ZlizLS/n+YWGzFFW6J1wlGys
// SIG // OUzU9nm/qhh6YinvopspNAZ3GmLJPR5tH4LwC8csu89D
// SIG // s+X57H2146SodDW4TsVxIxImdgs8UoxxWkZDFLyzs7BN
// SIG // Z8ifQv+AeSGAnhUwZuhCEl4ayJ4iIdBD6Svpu/RIzCzU
// SIG // 2DKATCYqSCRfWupW76bemZ3KOm+9gSd0BhHudiG/m4LB
// SIG // J1S2sWo9iaF2YbRuoROmv6pH8BJv/YoybLL+31HIjCPJ
// SIG // Zr2dHYcSZAI9La9Zj7jkIeW1sMpjtHhUBdRBLlCslLCl
// SIG // eKuzoJZ1GtmShxN1Ii8yqAhuoFuMJb+g74TKIdbrHk/J
// SIG // mu5J4PcBZW+JC33Iacjmbuqnl84xKf8OxVtc2E0bodj6
// SIG // L54/LlUWa8kTo/0xggSlMIIEoQIBATCBkDB5MQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSMwIQYDVQQDExpNaWNyb3NvZnQg
// SIG // Q29kZSBTaWduaW5nIFBDQQITMwAAALARrwqL0Duf3QAB
// SIG // AAAAsDAJBgUrDgMCGgUAoIG+MBkGCSqGSIb3DQEJAzEM
// SIG // BgorBgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgor
// SIG // BgEEAYI3AgEVMCMGCSqGSIb3DQEJBDEWBBQ3bMjUfnUk
// SIG // NbD174AQOlvByYIIGjBeBgorBgEEAYI3AgEMMVAwTqAm
// SIG // gCQATQBpAGMAcgBvAHMAbwBmAHQAIABMAGUAYQByAG4A
// SIG // aQBuAGehJIAiaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L2xlYXJuaW5nIDANBgkqhkiG9w0BAQEFAASCAQApv9d5
// SIG // IIFpUyMckdxggjbc+jytk9XHRTROmVaSmdpj5qDg+YJn
// SIG // fpLD2Ll7/OK5uUDSMlG7P3NiUT56BWUEIh7HiKFx+9Oo
// SIG // P1n+5QIWCZLrHnql28CWZYFyMAx/1MmutJ+R45fEu/Pc
// SIG // po8ZBYB/ET1Xa8vRhsDkHxVFmCpN6VYgXuA5WWyaxym9
// SIG // 1PWaYXbLkdVjT/y2Pqmm8/u92oiCnrarhJBpYQUREapK
// SIG // RXe+oT7hGDel1FQizct9xKR1hSVGrrMzkyTITyqa3xx3
// SIG // ZcSNvZWonoF8GRAoXxwxNWwzhU+zgzanm2bWk3luB8Y9
// SIG // NAY1wJI3aHbLA6wTHqSlf8K7SBmvoYICKDCCAiQGCSqG
// SIG // SIb3DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQQITMwAAACs5MkjBsslI8wAAAAAAKzAJ
// SIG // BgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3
// SIG // DQEHATAcBgkqhkiG9w0BCQUxDxcNMTMwOTE4MjEyODI3
// SIG // WjAjBgkqhkiG9w0BCQQxFgQU9IuI3GZFZiaaeg2zi4SL
// SIG // MjyR4KMwDQYJKoZIhvcNAQEFBQAEggEAJEqEt4807p6f
// SIG // rpogWunLpgEbeDxh8Gns26EHKL+ONJmfIg+rRG9OKaJ9
// SIG // +fPehtUvAdpegsOHhaQPrgKXhd/ZigOaehnPA5yjNXiv
// SIG // vAQmYzjhQJ14KF+/AQ6EBlqoxGro0maw26dRF875E/PA
// SIG // xoWi83OHYBdVhSG67iPqAefQ3jtcxWzKEepl9LFALl9b
// SIG // evBo6/rM+e9/4zCYVbQRPyAoN4DHeQGIVPNCmDudbMys
// SIG // dwEcUupygT3R5g3Lmsf7q4ewEHUZWV6xNhGEkYDx83mB
// SIG // gYQWp+G5k9YM+//cZ5nAybaDD0jAt+2n6COhBmgG84sq
// SIG // oUN8I/GI6Wv+ClsmqZ5KOQ==
// SIG // End signature block