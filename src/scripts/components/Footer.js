import { runAtBrowserViewport } from "../helpers.js";

export function FooterInit(footerEl) {
  var footer = $(footerEl),
    footerTop = footer.find(".footer__top"),
    config = {
      changeColPadding: function(remove, add) {
        footerTop
          .find(".row > div")
          .removeClass(remove)
          .addClass(add);
      }
    };
  runAtBrowserViewport({
    breakpoint: 992,
    run: function() {
      config.changeColPadding("space--xxs", "space--xs");
    },
    otherwise: function() {
      config.changeColPadding("space--xs", "space--xxs");
    },
    onResize: true
  });
  return footer;
}
