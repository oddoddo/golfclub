/**
 *  resort 공통 스크립트 코어
 * */
;(function (global, $) {
	if (!$.core) {
		$.core = {};
	}
	var core = {
		config: {},
		init: function () {
			// 로그 관련 처리
			this.log = function(text) {
				try {
					console.log.apply(this, arguments);
				} catch(e){}
			};
			core.ready();
		},
		ready: function () {
			// CSRF 공통 처리 설정
			var token = $("meta[name='_csrf']").attr("content");
			$.ajaxSetup({
				headers: {
					"X-CSRF-TOKEN": token
				}
			});
		},
		alert: function (message, type) {
		    type = type || "";
		    swal(message, '', type)
		},
		confirm: function (message, successCallback, failCallback) {
			successCallback = $.isFunction (successCallback) ? successCallback : $.noop;
			failCallback = $.isFunction (failCallback) ? failCallback : $.noop;
            swal({
                title: message,
                showCancelButton: true,
                buttons: true,
                confirmButtonColor: "#1ba086",
                confirmButtonText: "Submit",
            })
            .then(function(value) {
                if(value){
                    successCallback();
                } else {
                    failCallback();
                }
            });
		},
		ajax: {
			get: function(o, isLoading) {
				isLoading = (isLoading == undefined || isLoading == null) ? true : isLoading;
				var options = {
					method: "GET"
					, contentType: "application/json; charset=utf-8"
					, dataType: "JSON"
				};
				if (typeof o == "string") {
					options.url = o;
				} else {
					$.extend(options, o);
				}

				// error 상태값 처리가 없으면 기본 오류 처리 실행
				if (!options.hasOwnProperty("error")) {
					options.error = function (e) {
						var message ='처리 중 오류가 발생하였습니다.\n다시 시도하거나 관리자에게 문의 바랍니다.';
						if (e.responseJSON && e.responseJSON.message) {
							message = e.responseJSON.message;
						} else if (e.responseText) {
							message = JSON.parse(e.responseText).message;
						}
						$.core.alert(message);
					}
				} else {
					var originErrorFunction = options.error;
					options.error = function (e) {
						originErrorFunction(e);
					}
				}

				if (isLoading) {
					$.core.loading.start();
				}

				return $.ajax(options)
					.always(function() {
						if (isLoading) {
							$.core.loading.stop();
						}
					});
			},
			post: function(o, isLoading) {
				isLoading = (isLoading == undefined || isLoading == null) ? true : isLoading;
				var options = {
					method: "POST"
					, contentType: "application/json; charset=utf-8"
					, dataType: "JSON"
				};
				if (typeof o == "string") {
					options.url = o;
				} else {
					$.extend(options, o);
				}

				// error 상태값 처리가 없으면 기본 오류 처리 실행
				if (!options.hasOwnProperty("error")) {
					options.error = function (e) {
						try {console.log(e);} catch(e) {}

						var message ='처리 중 오류가 발생하였습니다.\n다시 시도하거나 관리자에게 문의 바랍니다.';
						if (e.responseJSON && e.responseJSON.message) {
							message = e.responseJSON.message;
						} else if (e.responseText) {
							message = JSON.parse(e.responseText).message;
						}
						$.core.alert(message);
					}
				} else {
					var originErrorFunction = options.error;
					options.error = function (e) {
						//alert(e);
						originErrorFunction(e);
					}
				}


				if (isLoading) {
					$.core.loading.start();
				}
				return $.ajax(options)
					.always(function() {
						if (isLoading) {
							$.core.loading.stop();
						}
					});
			}
		},
		loading: {
			start: function () {
				$.blockUI({
					css: {
						border: 'none'
						, padding: '15px'
						, backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px'
						, opacity: .5
						, color: '#fff'
						, 'z-index': '9999'
					}
				});
			},
			stop: function () {
				$.unblockUI();
			}
		},
		randomUUID: function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}
	};

	$.extend($.core, core, true);
	$.core.init();
}(window, jQuery));


