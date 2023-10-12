var Pager = {
	$pager : $('.paging'),
	$form  : $('#frmDefault'),
	init : function(){
		Pager.$pager = $('.paging');
		Pager.$form = $('#frmDefault');
		if( Pager.$form.length == 0 ) Pager.$form = $('#frmSearch');
		Pager.binding();
	},
	paging : function(_this) {
		var page 		= parseInt(Pager.$pager.attr('data-page')),
			pageSize 	= parseInt(Pager.$pager.attr('data-page-size')),
			totalPage 	= parseInt(Pager.$pager.attr('data-total-pages')),
			movePage    = 0;

		/*  이전 (prev) 이후 (next) */
		if (_this.attr('class').indexOf('prev') !== -1) {
			movePage = _this.attr("data-page-no");
		} else if (_this.attr('class').indexOf('next') !== -1) {
			movePage = _this.attr("data-page-no");
		} else if (_this.attr('class').indexOf('pagerNo') !== -1) {   /*  각 페이지 번호 클릭 ( 예: 1, 2, 3.. 페이지 클릭) */
			movePage = _this.attr("data-page-no");
		} else if (_this.attr('class').indexOf('first') !== -1) {   /*  처음 페이지 */
			movePage = 1;
		} else if (_this.attr('class').indexOf('last') !== -1) {   /*  마지막 페이지 */
			movePage = totalPage;
		}

        if(Pager.$form.find('input[name="searchText"]').val() == ""){
            Pager.$form.find('input[name="searchText"]').remove();
        }
		Pager.$form.find('input[name="seq"]').remove().end()
		            .find("input[name='page']").val(movePage).end()
		            .submit();

	},
	binding : function(){
		Pager.$pager.find("button, a").off("click").on("click", function(){
			Pager.paging($(this));
		});
	}
}

var Share = {
    init: function(){
        $('.sns_list_box .facebook, .list_sns .facebook').on('click', function() {
            Share.sns('facebook', location.href);
        });
        $('.sns_list_box .kakao, .list_sns .kakao').on('click', function() {
            Share.sns('kakaotalk', location.href);
        });
        $('.sns_list_box .nblog, .list_sns .nblog').on('click', function() {
            Share.sns('blog', location.href, $("title").text());
        });
        $('.sns_list_box .nband, .list_sns .nband').on('click', function() {
            Share.sns('band', location.href);
        });
        $('.sns_list_box .watch, .list_sns .watch').on('click', function() {
            Share.sns('whatsapp', location.href);
        });
        $('.sns_list_box .urlcopy, .list_sns .urlcopy').on('click', function() {
            Share.sns('url', location.href);
        });
    }, sns: function(type, url, txt){
        if (txt == undefined) {
            txt = $('meta[property="og:description"]').attr('content') || '';
        }
        url = url.replace("#snsLayer", "");

        var o;
        var _url = encodeURIComponent(url);
        var _txt = encodeURIComponent(txt);
        var _br  = encodeURIComponent("\r\n");

        switch(type){
            case "whatsapp" :
                o = {
                    method: "popup",
                    //url: "https://api.whatsapp.com/send?text=" + _url
                    url: "https://wa.me/?text=" + _url
                }
                break;
            case "facebook" :
                o = {
                    method: "popup",
                    url: "http://www.facebook.com/sharer/sharer.php?u=" + _url
                };
                break;
            case "twitter":
                o = {
                    method: "popup",
                    url: "http://twitter.com/intent/tweet?text=" + _txt + "&url=" + _url
                };
                break;
            case 'kakaotalk':
                o = {
                    method: "kakao",
                    url: _url
                };
                break;
            case 'kakaostory':
                o = {
                    method: "ks",
                    url: _url,
                    txt: _txt
                };
                break;
            case 'band':
                o = {
                    method: "popup",
                    url: "http://band.us/plugin/share?body=" + _txt + encodeURIComponent("\n") + _url + "&route=" + _url
                }
                break;
            case 'blog':
                o = {
                    method: "popup",
                    url: "https://share.naver.com/web/shareView.nhn?url=" + _url + "&title=" + _txt
                }
                break;
            case 'line':
                o = {
                    method: "popup",
                    url: "https://social-plugins.line.me/lineit/share?url=" + _url
                };
                break;
            case "url":
                var clipboard = new Clipboard("#btnCopyUrl"); // TODO: URL 복사하기 버튼 selector
                $('#btnCopyUrl').attr('data-clipboard-text', url);
                alert("URL이 복사되었습니다.");
                /*
                <!-- Trigger -->
                <button class="btn" data-clipboard-text="Just because you can doesn't mean you should — clipboard.js">
                    Copy to clipboard
                </button>
                */
                break;
            default:
                alert("지원하지 않는 SNS입니다.");
                return false;
        }

        if (typeof(o) == "object") {
        	var $ogImgTag = $("meta[property='og:image']");
        	var $ogImgWidthTag = $("meta[property='og:image:width']");
        	var $ogImgHeightTag = $("meta[property='og:image:height']");

        	if(type == "whatsapp") { // 왓츠앱은 1:1 비율 썸네일
				$ogImgTag.prop("content", $ogImgTag.attr("content").replace("2-1", "1-1"));
				$ogImgWidthTag.prop("content", "800");
				$ogImgHeightTag.prop("content", "800");
        	} else { // 그외 2:1 비율 썸네일
        		$ogImgTag.prop("content", $ogImgTag.attr("content").replace("1-1", "2-1"));
				$ogImgWidthTag.prop("content", "800");
				$ogImgHeightTag.prop("content", "420");
        	}

        	setTimeout(function(){
				switch (o.method) {
					case "popup":
						if(type == "whatsapp" && navigator.userAgent.match(/iPhone|iPad|iPod/i) && navigator.userAgent.indexOf("CriOS") > -1){
							location.href = o.url;
						} else {
							window.open(o.url);
						}
						break;

					case 'kakao':
						Kakao.init('639b05bca3af2033d02f209892ecaf87');

						Kakao.Link.sendScrap({
							requestUrl: decodeURIComponent(o.url),
							success: function () {
								Kakao.cleanup();
							}
						});
						break;

					case 'ks':
						Kakao.init('639b05bca3af2033d02f209892ecaf87');

						Kakao.Story.share({
							url: decodeURIComponent(o.url),
							text : decodeURIComponent(o.txt)
						});
						Kakao.cleanup();
						break;
				}
        	}, 500);
        }
    }
}


$(document).ready(function() {
    Pager.init();
    Share.init();

    // 네이버 지도 확대, 축소 버튼 제어
    $("#map img[alt^='지도'], div[id^='map_'] img[alt^='지도']").css("z-index", 1);

    // Edge 스와이퍼 next, prev 버튼 적용
    if(navigator.userAgent.toLowerCase().indexOf("edge/") > -1){
        $(".swiper-button-prev, .swiper-button-next").each(function(){
            if(typeof $(this).prop("style") != "undefined"){
                $(this).prop("style").cursor = "";
            }
        });
    }


	var flow = {
		init: function(o) {
			var _this = this;
			o = o || {};

			$.extend(true, _this, o);

			_this.$wrapList = $(_this.options.selector.wrap);
			_this.$searchForm = $(_this.options.selector.searchForm);
			_this.$dataForm = $(_this.options.selector.dataForm);

			if (o && o.hasOwnProperty("init")) {
				o.init();
			}

			flow.bind.init();
		},
		bind: {
			init: function() {
				flow.$wrapList.find("._flow-action-list").each(function(i, item) {
					if ($("#page").length > 0) {
						$("#page").val(($("#page").val() == "" ? 1 : $("#page").val()));
					}

					$(item).off("click").on("click", flow.bind.action.list);
				});

				flow.$wrapList.find("._flow-action-detail").each(function(i, item) {
					$(item).off("click").on("click", flow.bind.action.detail);
				});

				flow.$wrapList.find("._flow-action-edit, ._flow-action-write, ._flow-action-form").each(function(i, item) {
					$(item).off("click").on("click", function() {
						flow.bind.action.form(item);
					});
				});

				flow.$wrapList.find("._flow-action-save").each(function(i, item) {
					$(item).off("click").on("click", function() {
						flow.bind.action.save(item);
					});
				});
			},
			action: {
				list: function() {
					try {
						var uri = $(this).data("uri") || "list";

                        flow.$searchForm = $(flow.options.selector.searchForm);

                        if (flow.$searchForm.find("#page").length > 0) {
                            flow.$searchForm.find("#page").val(1);
                        }

						flow.$searchForm
							.find('input[name="seq"]').remove().end()
							.attr('action', uri)
							.submit();
					} catch (e) {
					} finally {
					}
				},
				detail: function(param) {
					try {
						var seq = $(this).data("seq");
						var uri = $(this).data("uri") || "detail";
						var hash = $(this).data("hash") || "";

						if (flow.$searchForm.find('input[name="seq"]').length === 0) {
							flow.$searchForm.prepend($('<input type="hidden" name="seq" value="' + seq + '"/>'));
						}
						if (flow.$searchForm.find('input[name="page"]').val() === "") {
							flow.$searchForm.find('input[name="page"]').val(1);
						}

						if (hash != "") {
                            location.hash = hash;
						}

						flow.$searchForm
							.find('input[name="seq"]').val(seq).end()
							.attr('action', uri)
							.submit();
					} catch (e) {
					} finally {
					}
				},
				form: function(item) {
					try {
						var uri = $(item).data("uri") || "form";
						flow.$searchForm.attr('action', uri).submit();
					} catch (e) {
					} finally {
					}
				},
				save: function(item) {

					try {
						var uri = $(item).data("uri") || "save";
						var dataType = $(item).data("result-type");
                        flow.prototype.preUploadFile().done(function () {
                            flow.prototype.preMultiUploadFile().done(function () {
                                //flow.prototype.updateFileText().done(function () {
                                    var preProcessedResult = flow.prototype.getSaveData();

                                    if (flow.bind.action.validator &&
                                        $.isFunction(flow.bind.action.validator)) {

                                        if (!flow.bind.action.validator(preProcessedResult)) {
                                            return false;
                                        }
                                    }

                                    $.core.ajax.post({
                                        dataType: (dataType != undefined && dataType != "" ? dataType : "JSON"),
                                        url: uri,
                                        data: JSON.stringify(preProcessedResult),
                                        success: function(result) {
                                            var postProcessedResult = result;

                                            if (typeof flow.bind.action.success == "function" ||
                                                typeof flow.bind.action.success == "object") {

                                                if (flow.bind.action.postSaveDataHandler &&
                                                    $.isFunction(flow.bind.action.postSaveDataHandler)) {
                                                    postProcessedResult = flow.bind.action.postSaveDataHandler(result);
                                                }
                                                // 데이터 후처리
                                                flow.bind.action.success(postProcessedResult);
                                            } else {
                                                flow.bind.action.list();
                                            }
                                        },
                                        error: function (e) {
                                            if (flow.bind.action.saveErrorHandler && $.isFunction(flow.bind.action.saveErrorHandler)) {
                                                flow.bind.action.saveErrorHandler(e);
                                            } else {
                                                if (e && e.message) {
                                                    $.core.alert(e.message);
                                                }else if (e.responseJSON && e.responseJSON.message) {
                                                    $.core.alert(e.responseJSON.message);
                                                } else {
                                                    $.core.alert("[" + e.status + "] 처리 중 오류가 발생하였습니다. 다시 시도하거나 관리자에게 문의바랍니다.");
                                                }
                                            }
                                        }
                                    });
//                                }).fail(function (e) {
//                                    $.core.log(e);
//                                });
                            }).fail(function (e) {
                                $.core.log(e);
                            });
                        }).fail(function (e) {
                            $.core.log(e);
                        });

					} catch (e) {
						$.core.alert(e);
					} finally {
					}
				},
				validator: function() {
					return true;
				},
				preSaveDataHandler: function(param) {
					return param;
				},
				postSaveDataHandler: function(param) {
						return param;
				},
				mainPopupClose: function(type, expiredays){
                    cookie.setCookie(type, "close" , expiredays);
                    if(type.indexOf("Popup") > -1) {
                        $(".layer_main_notice").css("display", "none");
                    } else if(type.indexOf("Top") > -1) {
                        $(".box_notice_bar").hide();
                    }
				}
			}
		},
		render: {},
		options: {
			selector: {
				wrap: ".container",
				searchForm: "form#frmSearch",
				dataForm: "form#frmDefault"
			}
		}, process: function (param) {
			// 데이터 전처리
			var preProcessedResult = {};
			preProcessedResult = param;

			if (flow.bind.action.preSaveDataHandler &&
				$.isFunction(flow.bind.action.preSaveDataHandler)) {

				preProcessedResult = flow.bind.action.preSaveDataHandler(param);
			}
			return preProcessedResult;
		}, prototype: {
			getSaveData: function() {
				var basicInfo = $("#frmDefault").serializeObject();

				$('.form-control').each(function (k, item) {
                    var $item = $(item),
                        name = $item.attr('name');

                    var isEditor = $item.hasClass('_editor');
                    var isFile = $item.hasClass('_ml-file-key');
                    var isRadio = $item.is(':radio');

                    if (isEditor) {
                        basicInfo[name] = editor.getBodyValue($item.attr('id'));
                    } else if (isFile) {
                        basicInfo[name] = $item.val();
                    } else if (isRadio) {
                        basicInfo[name] = $(':radio[name="' + $item.attr('name') + '"]:checked').val();
                    } else {
                        basicInfo[name] = $item.val();
                    }
                });
				var param = $.extend(basicInfo, {});

				return flow.process(param);
			}
		}
	}

	window.flow = flow;
});

var editor = {
	data: [],
	init: function (key) {
		nhn.husky.EZCreator.createInIFrame({
			oAppRef: editor.data,
			elPlaceHolder: key,
			sSkinURI: "/static/plugins/smarteditor/SmartEditor2Skin.html",
			fCreator: "createSEditor2",
			htParams: {
                fOnBeforeUnload: function () {},
                SE2M_FontName: {
                    htMainFont: {'id': '나눔고딕','name': '나눔고딕','size': '10','url': '','cssUrl': ''} // 기본 글꼴 설정
                }
            },
            fOnAppLoad: function () {
                editor.data.getById[key].setDefaultFont( "나눔고딕", 10);
            },
            fOnBeforeUnload: function () {
            }
		});
	},
	getEditor: function (key) {
		if (editor.data.getById) {
			return editor.data.getById[key];
		}
		return null;
	}, getBodyValue: function (key) {
		try {
			var bodyValue = '';

			if (editor.getEditor(key)) {
				bodyValue = editor.getEditor(key).getContents();
			} else {
				bodyValue = $('#' + key).val();
			}
			if (/^\<p\>(\&nbsp\;){1,}\<\/p\>$/.test(bodyValue)) {
				bodyValue = '';
			}
			return bodyValue.replace(/\ufeff/g, '').replace(/\u200B/g, '');
		} catch(e) {
			return '';
		}
	}, setBodyValue: function (key) {
		editor.getEditor(key).setContents(document.getElementById(key).value);
	}, validate: function (key) {
		if(!editor.getBodyValue(key)){
			return false;
		} else {
			return true;
		}
	}, refresh: function () {
		// 노출중인 에디터 영역에 포함된 에디터 갱신
		$('._editor-area:visible').each(function () {
			var id = $(this).find("._editor").prop('id')
				, editorSource = id && !$.isEmptyObject(editor.data) ? editor.getEditor(id) : null;

			if (!editorSource) {
				editor.init(id);
			} else {
				// Iframe 사이즈 변경
				editorSource.exec("SE_FIT_IFRAME", []);
				// 에디터 모드 변경(포커스를 받을 수 있도록 하기 위함)
				// editorSource.exec('CHANGE_EDITING_MODE', ['WYSIWYG']);
				editorSource.exec('MSG_EDITING_AREA_RESIZE_STARTED', []);
				editorSource.exec('MSG_EDITING_AREA_RESIZE_ENDED', []);

				/*
                에디터 모드 변경이 문제가 될 때 아래 처리로 변경 할 것
                editorSource.exec('MSG_EDITING_AREA_RESIZE_STARTED', []);
                //$editor.exec('RESIZE_EDITING_AREA', ['1000px', '600']);
                editorSource.exec('MSG_EDITING_AREA_RESIZE_ENDED', []);
                 */
			}
		});
	}
};

var airWeather = {
    init: function(localType){
        if(localType != "global"){
            // 미세먼지 조회
            $.ajax({
                url: '/cmmn/getAirData',
                data: {localType: localType},
                dataType : 'json',
                success: function(data) {
                    // 0~15㎍/m³ 좋음 / 16~35㎍/m³보통 / 36~75㎍/m³ 나쁨 / 76㎍/m³~매우나쁨
                    if(data.item != null){
                        $("#_air_temp").empty().append(Math.floor(data.item.pm25) + '<span class="sign">㎍/m³</span>');
                        var airText = "";
                        if (data.item.pm25 <= 15){
                            airText = "좋음";
                        } else if (data.item.pm25 <= 35){
                            airText = "보통";
                        } else if (data.item.pm25 <= 75){
                            airText = "나쁨";
                        } else {
                            airText = "매우나쁨";
                        }
                        $("#_main_air_text").empty().append(airText + '<span><em>' + Math.floor(data.item.pm25) + '</em>㎍/m³</span>');
                        $("#_air_text").text(airText);
                    }
                }
            });

            // 현재날씨 조회 TODO: K-Weather API 로 변경, 수치에 따라 아이콘 적용
            $.ajax({
                url: '/cmmn/getWeatherData',
                data: {localType: localType},
                dataType : 'json',
                success: function(data) {
                    var pad = function(x) { return (x < 10) ? "0"+x : x; }
                    var divnNum = Number(data.icon40);
                    var divnText = "";
                    var divnClass = "";

                    if(1 == divnNum) { // 맑음
                        divnText = "맑음";
                        divnClass = "ico_weather01";
                    } else if (2 <= divnNum && divnNum <= 3) { // 구름 많음
                        divnText = "구름 많음";
                        divnClass = "ico_weather03";
                    } else if (4 <= divnNum && divnNum <= 6) { // 흐림
                        divnText = "흐림";
                        divnClass = "ico_weather02";
                    } else if (7 <= divnNum && divnNum <= 9) { // 소나기
                        divnText = "소나기";
                        divnClass = "ico_weather08";
                    } else if (10 <= divnNum && divnNum <= 17) { // 비
                        divnText = "비";
                        divnClass = "ico_weather07";
                    } else if (18 <= divnNum && divnNum <= 25) { // 눈
                        divnText = "눈";
                        divnClass = "ico_weather05";
                    } else if (26 <= divnNum && divnNum <= 38) { // 비/눈
                        divnText = "비/눈";
                        divnClass = "ico_weather06";
                    } else if (39 == divnNum) { // 천둥번개
                        divnText = "천둥번개";
                        divnClass = "ico_weather09";
                    } else if (40 == divnNum) { // 안개
                        divnText = "안개";
                        divnClass = "ico_weather04";
                    }

                    $(".ico_wrap > .ico").addClass(divnClass);
                    $("#_mo_weather_temp").empty().append(data.temp);
                    $("#_mo_weather_text").empty().append(divnText);
                    $("#_weather_temp").empty().append(data.temp + '<span class="sign">℃</span>');
                    $("#_weather_time").text('(' + data.tm.substring(8) + ':00 기준)');
                }
            });
        }

    }
}


var cookie = {
    setCookie: function(name, value, expiredays) {
        var todayDate = new Date();
        todayDate.setDate( todayDate.getDate() + Number(expiredays) );
        document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
    },
    getCookie: function(Name) {
        var search = Name + "="
        if (document.cookie.length > 0) { // 쿠키가 설정되어 있다면
            offset = document.cookie.indexOf(search)
            if (offset != -1) { // 쿠키가 존재하면
                offset += search.length
                // set index of beginning of value
                end = document.cookie.indexOf(";", offset)
                // 쿠키 값의 마지막 위치 인덱스 번호 설정
                if (end == -1)
                    end = document.cookie.length
                return unescape(document.cookie.substring(offset, end))
            }
        }
        return "";
    }
}
