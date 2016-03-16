//javascript Document
$(function(){
    (function($){
        function chinaz(){
            this.init();
        }
        chinaz.prototype = {
            constructor: chinaz,
            init: function(){       
                this._initBackTop();
            },  
            _initBackTop: function(){
                var $backTop = this.$backTop = $('<div class="cbbfixed">'+
                                '<a class="cweixin cbbtn"">'+
                                    '<span class="weixin-icon"></span><div></div>'+
                                '</a>'+
                                '<a class="gotop cbbtn">'+
                                    '<span class="up-icon"></span>'+
                                '</a>'+
                            '</div>');
                $('body').append($backTop);
                
                $backTop.click(function(){
                    $("html, body").animate({
                        scrollTop: 0
                    }, 120);
                });

                var timmer = null;
                $(window).bind("scroll",function() {
                    var d = $(document).scrollTop(),
                    e = $(window).height();
                    0 < d ? $backTop.css({bottom:"50px",right:"40px"}) : $backTop.css("bottom", "-90px");
                    clearTimeout(timmer);
                    timmer = setTimeout(function() {
                        clearTimeout(timmer)
                    },100);
               });
            }
            
        }
        var chinaz = new chinaz();
    })($);

    (function($){
        var $menu = $(".menu"), $menuLi = $menu.find("li"), $current = $menu.find('.current'), $li_3 = $menu.find('li.li_3'), $li_3_content = $li_3.find('.li_3_content');
        $menuLi.hover(function () {
            var $this = $(this), num = $menuLi.index($this), current = $menuLi.index($(".first")), len = current - num;
            $menu.css("background-position", (101 * current) + "px" + " bottom");
            $current.removeClass("lihover");
            $menuLi.removeClass("first");
            $this.addClass("first");
            if (len <= 0) { len = -len; };
            if (num != 4) {
                $menu.stop().animate({ backgroundPosition: (101 * num) + "px" + " bottom" }, 100 * len);
            }
            else {
                $menu.stop().animate({ backgroundPosition: (101 * num + 30) + "px" + " bottom" }, 100 * len);
            }
        });
        $li_3.hover(function () {
            $li_3_content.stop(true, true).fadeIn(0);
        }, function () {
            $li_3_content.fadeOut(500, function () {
                $li_3_content.css("display", "none");
            });
        });
        $menu.mouseleave(function () {
            var $this = $(this), num = $menuLi.index($this), current = $menuLi.index($current), len = current - num;
            $menuLi.removeClass("first");
            $current.addClass("first");
            if (len <= 0) { len = -len; };
            $menu.stop().animate({ backgroundPosition: (100 * current + 1) + "px" + " bottom" }, 100 * len);
        });
        $("a.noclick").click(function (event) {
            event.preventDefault();
        });
    })($);


    (function ($) {
        var BG_POS = 'bgPos';
        var usesTween = !!$.Tween;
        if (usesTween) {
            $.Tween.propHooks['backgroundPosition'] = {
                get: function (tween) {
                    return parseBackgroundPosition($(tween.elem).css(tween.prop));
                },
                set: function (tween) {
                    setBackgroundPosition(tween);
                }
            };
        }
        else {
            $.fx.step['backgroundPosition'] = setBackgroundPosition;
        };
        function parseBackgroundPosition(value) {
            var bgPos = (value || '').split(/ /);
            var presets = { center: '50%', left: '0%', right: '100%', top: '0%', bottom: '100%' };
            var decodePos = function (index) {
                var pos = (presets[bgPos[index]] || bgPos[index] || '50%').
                    match(/^([+-]=)?([+-]?\d+(\.\d*)?)(.*)$/);
                bgPos[index] = [pos[1], parseFloat(pos[2]), pos[4] || 'px'];
            };
            if (bgPos.length == 1 && $.inArray(bgPos[0], ['top', 'bottom']) > -1) {
                bgPos[1] = bgPos[0];
                bgPos[0] = '50%';
            }
            decodePos(0);
            decodePos(1);
            return bgPos;
        }
        function setBackgroundPosition(fx) {
            if (!fx.set) {
                initBackgroundPosition(fx);
            }
            $(fx.elem).css('background-position',
                ((fx.pos * (fx.end[0][1] - fx.start[0][1]) + fx.start[0][1]) + fx.end[0][2]) + ' ' +
                ((fx.pos * (fx.end[1][1] - fx.start[1][1]) + fx.start[1][1]) + fx.end[1][2]));
        }
        function initBackgroundPosition(fx) {
            var elem = $(fx.elem);
            var bgPos = elem.data(BG_POS);
            elem.css('backgroundPosition', bgPos);
            fx.start = parseBackgroundPosition(bgPos);
            fx.end = parseBackgroundPosition($.fn.jquery >= '1.6' ? fx.end :
                fx.options.curAnim['backgroundPosition'] || fx.options.curAnim['background-position']);
            for (var i = 0; i < fx.end.length; i++) {
                if (fx.end[i][0]) {
                    fx.end[i][1] = fx.start[i][1] + (fx.end[i][0] == '-=' ? -1 : +1) * fx.end[i][1];
                }
            }
            fx.set = true;
        }
        $.fn.animate = function (origAnimate) {
            return function (prop, speed, easing, callback) {
                if (prop['backgroundPosition'] || prop['background-position']) {
                    this.data(BG_POS, this.css('backgroundPosition') || 'left top');
                }
                return origAnimate.apply(this, [prop, speed, easing, callback]);
            };
        }($.fn.animate);
    })(jQuery);
})