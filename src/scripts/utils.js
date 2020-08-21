window.mr = window.mr || {},
mr = function(a, b, c, d) {
    "use strict";
    function e(c) {
        c = "undefined" == typeof c ? b : c,
        g.documentReady.concat(g.documentReadyDeferred).forEach(function(a) {
            a(c)
        }),
        a.status.documentReadyRan = !0,
        a.status.windowLoadPending && f(a.setContext())
    }
    function f(c) {
        a.status.documentReadyRan ? (a.status.windowLoadPending = !1,
        c = "object" == typeof c ? b : c,
        g.windowLoad.concat(g.windowLoadDeferred).forEach(function(a) {
            a(c)
        })) : a.status.windowLoadPending = !0
    }
    a = a || {};
    var g = {
        documentReady: [],
        documentReadyDeferred: [],
        windowLoad: [],
        windowLoadDeferred: []
    };
    return a.status = {
        documentReadyRan: !1,
        windowLoadPending: !1
    },
    b(d).ready(e),
    b(c).on("load", f),
    a.setContext = function(a) {
        var c = b;
        return "undefined" != typeof a ? function(c) {
            return b(a).find(c)
        }
        : c
    }
    ,
    a.components = g,
    a.documentReady = e,
    a.windowLoad = f,
    a
}(window.mr, jQuery, window, document),
mr = function(a, b, c, d) {
        "use strict";
        return a.util = {},
        a.util.requestAnimationFrame = c.requestAnimationFrame || c.mozRequestAnimationFrame || c.webkitRequestAnimationFrame || c.msRequestAnimationFrame,
        a.util.documentReady = function(a) {
            var b = new Date
              , c = b.getFullYear();
            a(".update-year").text(c)
        }
        ,
        a.util.windowLoad = function(a) {
            a("[data-delay-src]").each(function() {
                var b = a(this);
                b.attr("src", b.attr("data-delay-src")),
                b.removeAttr("data-delay-src")
            })
        }
        ,
        a.util.getURLParameter = function(a) {
            var z= decodeURIComponent((new RegExp("[?|&]" + a + "=([^&;]+?)(&|#|;|$)").exec(location.search) || [void 0, ""])[1].replace(/\+/g, "%20")) || null;
            //console.log(z);
            return z;
        }
        ,
        a.util.capitaliseFirstLetter = function(a) {
            return a.charAt(0).toUpperCase() + a.slice(1)
        }
        ,
        a.util.slugify = function(a, b) {
            return "undefined" != typeof b ? a.replace(/ +/g, "") : a.toLowerCase().replace(/[\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\]\[\}\{\'\"\;\\\:\?\/\>\<\.\,]+/g, "").replace(/ +/g, "-")
        }
        ,
        a.util.sortChildrenByText = function(a, c) {
            var d = b(a)
              , e = d.children().get()
              , f = -1
              , g = 1;
            "undefined" != typeof c && (f = 1,
            g = -1),
            e.sort(function(a, c) {
                var d = b(a).text()
                  , e = b(c).text();
                return e > d ? f : d > e ? g : 0
            }),
            d.empty(),
            b(e).each(function(a, b) {
                d.append(b)
            })
        }
        ,
        a.util.idleSrc = function(a, c) {
            c = "undefined" != typeof c ? c : "";
            var d = a.is(c + "[src]") ? a : a.find(c + "[src]");
            d.each(function(a, c) {
                c = b(c);
                var d = c.attr("src")
                  , e = c.attr("data-src");
                "undefined" == typeof e && c.attr("data-src", d),
                c.attr("src", "")
            })
        }
        ,
        a.util.activateIdleSrc = function(a, c) {
            c = "undefined" != typeof c ? c : "";
            var d = a.is(c + "[data-src]") ? a : a.find(c + "[data-src]");
            d.each(function(a, c) {
                c = b(c);
                var d = c.attr("data-src");
                c.attr("src", d)
            })
        }
        ,
        a.util.pauseVideo = function(a) {
            var c = a.is("video") ? a : a.find("video");
            c.each(function(a, c) {
                var d = b(c).get(0);
                d.pause()
            })
        }
        ,
        a.util.parsePixels = function(a) {
            var d, e = b(c).height();
            return /^[1-9]{1}[0-9]*[p][x]$/.test(a) ? parseInt(a.replace("px", ""), 10) : /^[1-9]{1}[0-9]*[v][h]$/.test(a) ? (d = parseInt(a.replace("vh", ""), 10),
            e * (d / 100)) : -1
        }
        ,
        a.util.removeHash = function() {
            history.pushState("", d.title, c.location.pathname + c.location.search)
        }
        ,
        a.components.documentReady.push(a.util.documentReady),
        a.components.windowLoad.push(a.util.windowLoad),
        a
    }(mr, jQuery, window, document),
mr = function(a, b, c, d) {
    "use strict";
    return a.modals = a.modals || {},
    a.modals.documentReady = function(b) {
        var e = '<div class="all-page-modals"></div>'
          , f = b("div.main-container");
        if (f.length ? (jQuery(e).insertAfter(f),
        a.modals.allModalsContainer = b("div.all-page-modals")) : (jQuery("body").append(e),
        a.modals.allModalsContainer = jQuery("body div.all-page-modals")),
        b(".modal-container").each(function() {
            var d = b(this)
              , e = (b(c),
            d.find(".modal-content"));
            if (d.find(".modal-close").length || d.find(".modal-content").append('<div class="modal-close modal-close-cross"></div>'),
            void 0 !== e.attr("data-width")) {
                var f = 1 * e.attr("data-width").substr(0, e.attr("data-width").indexOf("%"));
                e.css("width", f + "%")
            }
            if (void 0 !== e.attr("data-height")) {
                var g = 1 * e.attr("data-height").substr(0, e.attr("data-height").indexOf("%"));
                e.css("height", g + "%")
            }
            a.util.idleSrc(d, "iframe")
        }),
        b(".modal-instance").each(function(c) {
            var d = b(this)
              , e = d.find(".modal-container")
              , f = (d.find(".modal-content"),
            d.find(".modal-trigger"));
            f.attr("data-modal-index", c),
            e.attr("data-modal-index", c),
            "undefined" != typeof e.attr("data-modal-id") && f.attr("data-modal-id", e.attr("data-modal-id")),
            e = e.detach(),
            a.modals.allModalsContainer.append(e)
        }),
        b(".modal-trigger").on("click", function() {
            var c, d, e = b(this);
            return "undefined" != typeof e.attr("data-modal-id") ? (c = e.attr("data-modal-id"),
            d = a.modals.allModalsContainer.find('.modal-container[data-modal-id="' + c + '"]')) : (c = b(this).attr("data-modal-index"),
            d = a.modals.allModalsContainer.find('.modal-container[data-modal-index="' + c + '"]')),
            a.util.activateIdleSrc(d, "iframe"),
            a.modals.autoplayVideo(d),
            a.modals.showModal(d),
            !1
        }),
        jQuery(d).on("click", ".modal-close", a.modals.closeActiveModal),
        jQuery(d).keyup(function(b) {
            27 === b.keyCode && a.modals.closeActiveModal()
        }),
        b(".modal-container:not(.modal--prevent-close)").on("click", function(b) {
            b.target === this && a.modals.closeActiveModal()
        }),
        b(".modal-container[data-autoshow]").each(function() {
            var c = b(this)
              , d = 1 * c.attr("data-autoshow");
            a.util.activateIdleSrc(c),
            a.modals.autoplayVideo(c),
            "undefined" != typeof c.attr("data-cookie") ? a.cookies.hasItem(c.attr("data-cookie")) || a.modals.showModal(c, d) : a.modals.showModal(c, d)
        }),
        b(".modal-container[data-show-on-exit]").each(function() {
            var c = jQuery(this)
              , e = c.attr("data-show-on-exit")
              , f = 0;
            c.attr("data-delay") && (f = parseInt(c.attr("data-delay"), 10) || 0),
            b(e).length && (c.prepend(b('<i class="ti-close close-modal">')),
            jQuery(d).on("mouseleave", e, function() {
                b(".modal-active").length || ("undefined" != typeof c.attr("data-cookie") ? a.cookies.hasItem(c.attr("data-cookie")) || a.modals.showModal(c, f) : a.modals.showModal(c, f))
            }))
        }),
        2 === c.location.href.split("#").length) {
            var g = c.location.href.split("#").pop();
            b('[data-modal-id="' + g + '"]').length && (a.modals.closeActiveModal(),
            a.modals.showModal(b('[data-modal-id="' + g + '"]')))
        }
        jQuery(d).on("click", 'a[href^="#"]', function() {
            var c = b(this).attr("href").replace("#", "");
            b('[data-modal-id="' + c + '"]').length && (a.modals.closeActiveModal(),
            setTimeout(a.modals.showModal, 500, '[data-modal-id="' + c + '"]', 0))
        }),
        jQuery(d).on("wheel mousewheel scroll", ".modal-content, .modal-content .scrollable", function(a) {
            a.preventDefault && a.preventDefault(),
            a.stopPropagation && a.stopPropagation(),
            this.scrollTop += a.originalEvent.deltaY
        })
    }
    ,
    a.modals.showModal = function(a, c) {
        var e = "undefined" != typeof c ? 1 * c : 0
          , f = b(a);
        f.length && setTimeout(function() {
            var c = d.createEvent("Event");
            c.initEvent("modalOpened.modals.mr", !0, !0),
            b(a).addClass("modal-active").trigger("modalOpened.modals.mr").get(0).dispatchEvent(c)
        }, e)
    }
    ,
    a.modals.closeActiveModal = function() {
        var b = jQuery("body div.modal-active")
          , e = d.createEvent("Event");
        a.util.idleSrc(b, "iframe"),
        a.util.pauseVideo(b),
        "undefined" != typeof b.attr("data-cookie") && a.cookies.setItem(b.attr("data-cookie"), "true", 1 / 0, "/"),
        b.length && (b.is("[data-modal-id]") && c.location.hash === "#" + b.attr("data-modal-id") && a.util.removeHash(),
        e.initEvent("modalClosed.modals.mr", !0, !0),
        b.removeClass("modal-active").trigger("modalClosed.modals.mr").get(0).dispatchEvent(e))
    }
    ,
    a.modals.autoplayVideo = function(a) {
        if (a.find("video[autoplay]").length) {
            var b = a.find("video").get(0);
            b.play()
        }
    }
    ,
    a.components.documentReady.push(a.modals.documentReady),
    a
}(mr, jQuery, window, document)
// ,
// mr = function(a, b, c, d) {
//         "use strict";
//         function typeFn(){
            
//                 b(".typed-text").each(function() {
//                     var c = b(this)
//                     , d = (c.attr("data-typed-strings") ? c.attr("data-typed-strings").split(",") : [],
//                     {
//                         strings: [],
//                         typeSpeed: 100,
//                         loop: !0,
//                         showCursor: !1
//                     })
//                     , e = {};
//                     e.strings = c.attr("data-typed-strings") ? c.attr("data-typed-strings").split(",") : void 0,
//                     b(c).typed(jQuery.extend({}, d, a.typed.options, e))
//                 })
           
            
//         }
//         return a.typed = a.typed || {},
//             a.typed.documentReady = function(b) {
//                 typeFn()
//             },
//             // jQuery(window).on("resize", function(){
//             //     typeFn();
//             // }),
//             a.components.documentReady.push(a.typed.documentReady),
//             a
        
//     }(mr, jQuery, window, document)
