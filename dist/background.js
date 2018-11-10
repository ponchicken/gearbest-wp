/* -------------------------------------------------- */
/*  Start of Webpack Chrome Hot Extension Middleware  */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
(function (chrome, window) {
    var signals = JSON.parse('{"SIGN_CHANGE":"SIGN_CHANGE","SIGN_RELOAD":"SIGN_RELOAD","SIGN_RELOADED":"SIGN_RELOADED","SIGN_LOG":"SIGN_LOG","SIGN_CONNECT":"SIGN_CONNECT"}');
    var config = JSON.parse('{"RECONNECT_INTERVAL":2000,"SOCKET_ERR_CODE_REF":"https://tools.ietf.org/html/rfc6455#section-7.4.1"}');
    var reloadPage = "true" === "true";
    var wsHost = "ws://localhost:9090";
    var SIGN_CHANGE = signals.SIGN_CHANGE,
        SIGN_RELOAD = signals.SIGN_RELOAD,
        SIGN_RELOADED = signals.SIGN_RELOADED,
        SIGN_LOG = signals.SIGN_LOG,
        SIGN_CONNECT = signals.SIGN_CONNECT;
    var RECONNECT_INTERVAL = config.RECONNECT_INTERVAL,
        SOCKET_ERR_CODE_REF = config.SOCKET_ERR_CODE_REF;
    var runtime = chrome.runtime,
        tabs = chrome.tabs;

    var manifest = runtime.getManifest();
    var formatter = function formatter(msg) {
        return '[ WCER: ' + msg + ' ]';
    };
    var logger = function logger(msg) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
        return console[level](formatter(msg));
    };
    var timeFormatter = function timeFormatter(date) {
        return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    };
    function contentScriptWorker() {
        runtime.sendMessage({ type: SIGN_CONNECT }, function (msg) {
            return console.info(msg);
        });
        runtime.onMessage.addListener(function (_ref) {
            var type = _ref.type,
                payload = _ref.payload;

            switch (type) {
                case SIGN_RELOAD:
                    logger("Detected Changes. Reloading ...");
                    reloadPage && window.location.reload();
                    break;
                case SIGN_LOG:
                    console.info(payload);
                    break;
            }
        });
    }
    function backgroundWorker(socket) {
        runtime.onMessage.addListener(function (action, sender, sendResponse) {
            if (action.type === SIGN_CONNECT) {
                sendResponse(formatter("Connected to Chrome Extension Hot Reloader"));
            }
        });
        socket.addEventListener("message", function (_ref2) {
            var data = _ref2.data;

            var _JSON$parse = JSON.parse(data),
                type = _JSON$parse.type,
                payload = _JSON$parse.payload;

            if (type === SIGN_CHANGE) {
                tabs.query({ status: "complete" }, function (loadedTabs) {
                    loadedTabs.forEach(function (tab) {
                        return tabs.sendMessage(tab.id, { type: SIGN_RELOAD });
                    });
                    socket.send(JSON.stringify({
                        type: SIGN_RELOADED,
                        payload: formatter(timeFormatter(new Date()) + ' - ' + manifest.name + ' successfully reloaded')
                    }));
                    runtime.reload();
                });
            } else {
                runtime.sendMessage({ type: type, payload: payload });
            }
        });
        socket.addEventListener("close", function (_ref3) {
            var code = _ref3.code;

            logger('Socket connection closed. Code ' + code + '. See more in ' + SOCKET_ERR_CODE_REF, "warn");
            var intId = setInterval(function () {
                logger("WEPR Attempting to reconnect ...");
                var ws = new WebSocket(wsHost);
                ws.addEventListener("open", function () {
                    clearInterval(intId);
                    logger("Reconnected. Reloading plugin");
                    runtime.reload();
                });
            }, RECONNECT_INTERVAL);
        });
    }
    runtime.reload ? backgroundWorker(new WebSocket(wsHost)) : contentScriptWorker();
})(chrome, window);
/* ----------------------------------------------- */
/* End of Webpack Chrome Hot Extension Middleware  */
/* ----------------------------------------------- */!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p=".",n(n.s=6)}({6:function(e,t){console.log("bg")}})});
//# sourceMappingURL=background.js.map