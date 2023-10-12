"use strict";

var globalUi = {
    wheelChk: false,
    animatedChk: false,
    downChk: true,
    upChk: true,
    timeChk: "",
    clickChk: false,
    slide: "",
    init: function () {
        var _this = this;

        if ($(".box_global_main").find(".img_box").length > 1) {
            var globalVisual = new Swiper($(".box_global_main"), {
                // pagination: $(".swiper-pagination-b"),
                // paginationType: "progress",
                effect: "fade",
                slidesPerView: 1,
                autoplay: 4000,
                speed: 2000,
                loop: true,
                disableOnInteraction: false,
                autoplayDisableOnInteraction: false,
                onSlideChangeStart: function (swiper) {
                    var real_Index = swiper.realIndex;
                    if (real_Index == 1) {
                        swiper.params.autoplay = 1000;
                        swiper.update();
                        swiper.startAutoplay();
                    } else {
                        swiper.params.autoplay = 4000;
                        swiper.update();
                        swiper.startAutoplay();
                    }
                    //console.log('real_Inde:'+real_Index+'****swiper.params.autoplay'+swiper.params.autoplay);
                },
            });
        }

        _this.event();
    },
    event: function () {
        var _this = this;
        var view = $(".box_global_view");
        var viewLen = view.length;
        var height = $(window).height();
        var current;
        var currentIdx;
        var pageId;
        var slideChk = false;
        var delta;

        $(window).on("mousewheel DOMMouseScroll ", function (e) {
            current = $(".box_global_view.active");
            currentIdx = current.index();

            if (e.originalEvent.detail === 0) {
                delta = e.originalEvent.wheelDelta / -120;
            } else {
                //파이어폭스용
                delta = e.originalEvent.detail / 3;
            }

            if (_this.wheelChk || _this.animatedChk) {
                return false;
            }

            if (currentIdx == 5) {
                _this.downChk = true;
            }

            // if (
            //     delta > 0 &&
            //     $(".brand_special_offer").scrollTop() ==
            //         $(".brand_special_offer")[0].scrollHeight - $(".brand_special_offer")[0].clientHeight
            // ) {
            //     $(".wrap").addClass("banner_type");
            //     _this.upChk = true;
            // }

            if (delta > 0 && currentIdx < viewLen - 1 && _this.downChk) {
                _this.down(currentIdx);
                _this.indiHandler();
            } else if (delta < 0 && currentIdx > 0 && _this.upChk) {
                if ($(".wrap").hasClass("banner_type")) {
                    $(".wrap").addClass("scrHidden");
                    $(".wrap").removeClass("banner_type");
                    _this.upChk = false;
                    _this.downChk = true;

                    setTimeout(function () {
                        $(".wrap").removeClass("scrHidden");
                    }, 2000);
                } else {
                    _this.up(currentIdx);
                    _this.indiHandler();
                }
            }
        });

        //click evnets
        $(".indicator").find("a").on("click", _this.indiHandler);
        $(".box_main_indicator").on("mouseenter", _this.mainIndicator);
        $(".box_main_indicator").on("mouseleave", _this.mainIndicator);
    },
    down: function (n) {
        var _this = this;
        var slideChk = false;
        var view = $(".box_global_view");
        var currentIdx = n;
        var pageId;

        _this.wheelChk = true;

        view.eq(currentIdx).addClass("fix");

        view.eq(currentIdx + 1)
            .addClass("animated")
            .css({
                transform: "translateY(0%)",
                "z-index": 10,
            });

        pageId = currentIdx + 1;
        $(".wrap")
            .attr("class", "wrap")
            .addClass("wrap_global0" + pageId);

        if (view.eq(currentIdx + 1).find(".box_slide_item").length > 1) {
            slideChk = true;
        }

        let $gnb = $("#gnb"),
            $gnbLink = $gnb.find("a"),
            $burger = $(".burger-input");

        view.eq(currentIdx + 1)
            .addClass("active")
            .siblings(".box_global_view")
            .removeClass("active");

        if (view.eq(currentIdx + 1).data("anchor") == 1) {
            $(".wrap").addClass("black");
        }

        var count = 0;

        view.eq(currentIdx + 1).on("transitionend", function (e) {
            count++;
            if (count > 1) return false;

            view.removeClass("animated");
            view.eq(currentIdx).removeClass("fix");
            for (var i = 0; i <= currentIdx; i++) {
                view.eq(i).css({
                    transform: "translateY(-100%)",
                    "z-index": "",
                });
            }

            if (view.eq(currentIdx).find(".swiper-container-horizontal").length == 1) {
                if (currentIdx !== 0) {
                    _this.slide.init();
                } else {
                    $(".wrap_view_main").find(".swiper-container-horizontal")[0].swiper.init();
                }
            }
            if (slideChk) {
                _this.row();
            }

            // $(".brand_special_offer").scrollTop(0);

            _this.wheelChk = false;
            _this.upChk = true;
            slideChk = false;

            // if (currentIdx == 4) {
            //     $(".wrap").addClass("black");
            //     // _this.wheelChk = true;
            //     _this.cardEvent();
            // }
        });
    },
    up: function (n) {
        var _this = this;
        var slideChk = false;
        var view = $(".box_global_view");
        var viewLen = view.length;
        var currentIdx = n;
        var pageId;

        _this.wheelChk = true;
        slideChk = false;

        view.eq(currentIdx - 1)
            .addClass("animated")
            .css({
                transform: "translateY(0%)",
                "z-index": "11",
            });

        if (view.eq(currentIdx - 1).find(".box_slide_item").length > 1) {
            slideChk = true;
        }

        pageId = currentIdx - 1;
        if (pageId == 0) {
            $(".wrap").attr("class", "wrap").addClass("wrap_global_main");
        } else {
            $(".wrap")
                .attr("class", "wrap")
                .addClass("wrap_global0" + pageId);
        }

        view.eq(currentIdx - 1)
            .addClass("active")
            .siblings(".box_global_view")
            .removeClass("active");

        // if (currentIdx == 2) {
        //     $(".wrap").addClass("black");
        // }

        var count = 0;

        view.eq(currentIdx - 1).on("transitionend", function (e) {
            count++;
            if (count > 1) return false;
            view.removeClass("animated");
            view.eq(currentIdx - 1).css("z-index", "8");

            for (var i = currentIdx; i <= viewLen; i++) {
                view.eq(i).css({
                    transform: "translateY(100%)",
                    "z-index": "",
                });
            }
            if (view.eq(currentIdx).find(".swiper-container-horizontal").length == 1) {
                _this.slide.init();
            }
            if (slideChk) {
                _this.row();
            }

            $(".brand_special_offer").scrollTop(0);

            _this.wheelChk = false;
            _this.downChk = true;
            slideChk = false;
            // console.log('asdfadf')
        });
    },
    row: function (e) {
        var _this = this;
        var current = $(".box_global_view.active .swiper-container");
        var idx = $(".box_global_view.active").index();
        var autoSpeed = 4000;
        var speed = 2000;

        _this.wheelChk = false;
        _this.downChk = false;
        _this.upChk = true;

        var count = 0;
        // console.log("active");

        var opt = {
            // pagination: $(".box_indicator .box0" + idx + " .swiper-pagination"),
            pagination: $(".box_global_view.box_view0" + idx + " .swiper-pagination-s"),
            paginationType: "progress",
            slidesPerView: 1,
            paginationClickable: true,
            // mousewheelControl: true,
            autoplayStopOnLast: true,
            speed: speed,
            effect: "fade",
            autoplay: autoSpeed,
            loop: false,
            mousewheelSensitivity: 0,
            mousewheelReleaseOnEdges: true,
            onInit: function (swiper) {
                var active = swiper.activeIndex;
                var slidesLen = swiper.slides.length;
                swiper.stopAutoplay();

                $(swiper.wrapper)
                    .find(".box_slide_item")
                    .on("transitionstart", function (e) {
                        active = swiper.activeIndex;

                        // if ($(e.target).hasClass("box_slide_item") && active == slidesLen - 1) {
                        //움직였고 라스트일경우

                        _this.upChk = true;
                        _this.downChk = true;
                        // }
                        // console.log(active,$(e.target).hasClass('box_slide_item'))
                    });
            },
            onSlideChangeStart: function (swiper) {
                var active = swiper.activeIndex;
                var slidesLen = swiper.slides.length;
                //cascadia
                if ($(swiper.wrapper[0].offsetParent).hasClass("box_view01 active")) {
                    if (active == 0) {
                        $(".wrap").addClass("black");
                    } else {
                        $(".wrap").removeClass("black");
                    }
                }

                //golf
                if ($(swiper.wrapper[0].offsetParent).hasClass("box_view02 active")) {
                    if (active == 1 || active == 2) {
                        $(".wrap").addClass("global_menu_hidden");
                    } else {
                        $(".wrap").removeClass("global_menu_hidden");
                    }
                }

                if (active < slidesLen) {
                    _this.upChk = false;
                    _this.downChk = false;
                }

                if (active == 0) {
                    _this.upChk = true;
                    _this.downChk = false;
                }
                // console.log('ch st', active)
            },
            onSlideChangeEnd: function (swiper) {
                var active = swiper.activeIndex;
                var slidesLen = swiper.slides.length;

                // if(active == slidesLen -1) {
                //     _this.upChk = false;
                //     _this.downChk = true;
                // } else if(active == 0){
                //     _this.upChk = true;
                //     _this.downChk = false;
                // }

                // console.log('ch en', active)
            },
        };

        _this.slide = new Swiper(current, opt);
        _this.slide.startAutoplay();
    },
    cardEvent: function () {
        var _this = this;
        var height = $(window).height();
        var position;
        var scrTop;
        var lastScr = 0;
        var delta = 5;

        // $(".brand_special_offer").scrollTop(0);

        // $('.card_item').each(function(){
        //     var $this = $(this);
        //     position = $this.position().top;

        //     if(position < height / 2){
        //         $this.addClass('active');
        //     }
        // });

        _this.upChk = true;
        _this.downChk = false;

        // $(".brand_special_offer").on("scroll", function (e) {
        //     scrTop = $(this).scrollTop();

        //     if (Math.abs(lastScr - scrTop) <= delta) return;

        //     if (scrTop > lastScr) {
        //         if ($(".brand_special_offer")[0].scrollHeight - $(".brand_special_offer")[0].clientHeight <= scrTop + 20) {
        //             $(".wrap").addClass("banner_type");
        //             _this.upChk = true;
        //         }
        //     } else {
        //         //up
        //         _this.upChk = false;
        //         if (scrTop <= 20) {
        //             _this.upChk = true;
        //         }
        //     }
        //     lastScr = scrTop;
        // });
    },
    indiHandler: function (e) {
        var _this = globalUi;
        var evtType = e !== undefined ? true : false;
        var count;
        var currentIdx;
        var activeIdx = $(".box_global_view.active").index();

        if (_this.clickChk) return false;

        if (evtType) {
            currentIdx = $(e.currentTarget).data("anchor");
            count = $(".box_global_list")
                .find(".box_global_view[data-anchor=" + currentIdx + "]")
                .index();

            if (currentIdx < activeIdx) {
                _this.up(currentIdx + 1);
                _this.clickChk = true;
            } else if (currentIdx > activeIdx) {
                $(".box_global_view.active").addClass("fix");
                _this.down(currentIdx - 1);
                _this.clickChk = true;
            }
            $("#gnb .box_indicator")
                .find("[data-anchor=" + currentIdx + "]")
                .parents("li")
                .addClass("on")
                .siblings("li")
                .removeClass("on");
        } else {
            count = activeIdx - 1;
            $("#gnb .box_indicator").find("li").eq(count).addClass("on").siblings("li").removeClass("on");
        }
        if (evtType) {
            currentIdx = $(e.currentTarget).data("anchor");
            count = $(".box_global_list")
                .find(".box_global_view[data-anchor=" + currentIdx + "]")
                .index();

            if (currentIdx < activeIdx) {
                _this.up(currentIdx + 1);
                _this.clickChk = true;
            } else if (currentIdx > activeIdx) {
                $(".box_global_view.active").addClass("fix");
                _this.down(currentIdx - 1);
                _this.clickChk = true;
            }
            $(".global_view_wrap .box_indicator")
                .find("[data-anchor=" + currentIdx + "]")
                .parents("li")
                .addClass("on")
                .siblings("li")
                .removeClass("on");
        } else {
            count = activeIdx - 1;
            $(".global_view_wrap .box_indicator").find("li").eq(count).addClass("on").siblings("li").removeClass("on");
        }

        setTimeout(function () {
            _this.clickChk = false;
        }, 1500);
    },
    mainIndicator: function (e) {
        var _this = globalUi;
        var target = $(e.currentTarget);
        target.toggleClass("active");
    },
};

window.addEventListener("DOMContentLoaded", function () {
    globalUi.init();
});
