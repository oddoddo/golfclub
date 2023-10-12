$(function () {
    // 로딩
    var customElement = $("<div>", {
        class: "loading",
        text: "Loading...",
    });
    $.LoadingOverlay("show", {
        image: "",
        background: "rgba(0,0,0,0.2)",
        custom: customElement,
    });
    setTimeout(function () {
        $.LoadingOverlay("hide");
    }, 2000);

    // mobile 주소창 높이 제거
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    window.addEventListener("resize", () => {
        console.log("resize");
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    });

    $("#gnb").each(function () {
        let $gnb = $("#gnb .box_indicator"),
            $gnbLink = $gnb.find(".global_anchor"),
            $gnbBtn = $gnb.find("button"),
            $burger = $(".burger-input");

        $gnbLink.on("click", function (event) {
            event.preventDefault();

            var hash = this.hash;

            $("html, body").animate(
                {
                    scrollTop: $(hash).offset().top,
                },
                900,
                function () {
                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
                },
            );

            if ($burger.is(":checked")) {
                $burger.prop("checked", false);
            } else {
                $burger.prop("checked", true);
            }
        });

        // $gnbBtn.click(function () {
        //     $(this).parent("li").addClass("on");
        // });
    });

    // movie
    $(".container-movie").each(function () {
        // movie
        let $this = $(".container-movie"),
            $closeMovie = $this.find(".link-close"),
            $openMovie = $("#gnb .link-movie"),
            embed = $(".player");

        $(".wrapper-movie").empty();

        $openMovie.on("click", function (event) {
            event.preventDefault();
            $(".burger-input").prop("checked", false);
            $this.addClass("active");
            $(".wrapper-movie").append(embed);
        });
        $closeMovie.on("click", function () {
            $this.removeClass("active");
            $(".wrapper-movie").empty();
        });
    });
});
