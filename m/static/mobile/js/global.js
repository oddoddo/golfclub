"use strict";

var globalUi = {
    init: function () {
        var _this = this;

        /*height 100vh 용*/
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);

        if ($(".global_main_visual .main_slide_item").length > 1) {
            var $this = $(".global_main_visual");
            var swiper = new Swiper($this, {
                effect: "fade",
                autoplay: 4000,
                speed: 4000,
                loop: true,
                slidesPerView: 1,
                disableOnInteraction: false,
                autoplayDisableOnInteraction: false,
                onSlideChangeStart: function (swiper) {
                    var real_Index = swiper.realIndex;
                    if (real_Index == 1) {
                        swiper.params.autoplay = 2000;
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

        //외부유입 뒤로가기 이벤트
        var anchorChk = false;
        var sw = false;
        var topChk = false;

        $(".global_anchor").on("click", function (e) {
            anchorChk = true;
            sw = true;
        });
        $(".btn_top").on("click", function () {
            // anchorChk = true;
            topChk = true;
            sw = false;
            _this.topCtrl();
        });

        history.pushState(null, null, location.href);
        window.onpopstate = function (event) {
            if (anchorChk) {
                anchorChk = false;
                return;
            } else {
                if (topChk) {
                    topChk = false;
                    return;
                }
                if (sw) {
                    $(".wrap").scrollTop(0);
                    var noHashURL = window.location.href.replace(/#.*$/, "");
                    window.history.replaceState(null, null, noHashURL);
                    sw = false;
                } else {
                    history.go(-1);
                }
            }
        };

        _this.event();
    },
    topCtrl: function () {
        $(".wrap").scrollTop(0);
    },
};

window.addEventListener("DOMContentLoaded", function () {
    globalUi.init();
});
