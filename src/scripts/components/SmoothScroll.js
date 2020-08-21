import {
  getElementHeight,
  getPrevEl,
  getCSSVal,
  runCallbacks
} from "../helpers.js";

export const SS = (navEl, ...cbs) => {
  //console.log({ cbs });
  const $navEl = $(navEl);
  let ssArray = [];

  const configSS = deviceInfo => {
    let config = { bodyClass: deviceInfo.bodyClass, id: deviceInfo.type };

    config =
      deviceInfo.type === "desktop"
        ? { ...config, header: navEl, offset: desktopScrollOffset }
        : { ...config, offset: mobileScrollOffset };
    //console.log({config})
    scrollFactory(config);
  };
  const scrollFactory = config => {
    let settings = {
      updateURL: true,
      popstate: true,
      offset: (section, toggle) => config.offset(section, toggle)
    };
    if (config.header) {
      settings.header = config.header;
    }
    const ssObj = {
      id: config.id,
      fn: new SmoothScroll(`body.${config.bodyClass} a[data-scroll]`, settings)
    };
    ssArray.push(ssObj);
    //console.log({ ssArray });

    if (cbs.length) {
      document.addEventListener("scrollStop", onScrollComplete, false);
    }
  };
  const onScrollComplete = e => {
    //console.log("onScrollComplete");
    let triggeredByNav = [...$(e.detail.toggle).parents()].filter(
      item => item.id === `${navEl.substring(1)}` // qwdNav
    );
    if (triggeredByNav.length === 1) {
      runCallbacks({ name: "onScrollComplete", stack: cbs });
    }
  };

  const scrollOffsetFactory = ({ noPadding, withPadding }) => {
    return (section, toggle) => {
      const target = $("#" + section.id);

      // section scrolling to has no padding (set to 'unpad' CSS class)
      if (target.hasClass("unpad") || target.hasClass("imagebg")) {
        return typeof noPadding === "function" ? -noPadding(target) : noPadding;
      }

      // section scolling to doesn't have 'unpad' CSS class
      const topPadding = parseInt(target.css("padding-top"), 10);
      return typeof withPadding === "function"
        ? -withPadding(topPadding)
        : -topPadding + withPadding;
    };
  };

  const desktopScrollOffset = scrollOffsetFactory({
    noPadding: 0,
    withPadding: 30
  });

  const mobileScrollOffset = scrollOffsetFactory({
    noPadding: target => getCSSVal(getPrevEl(target, "section"), "padding-bottom"),
    withPadding: topPadding => topPadding 
  });

  const doesSSInstanceExist = id => {
    const currentInstance = ssArray.find(ss => ss.id === id);
    return currentInstance === undefined ? false : true;
  };

  //   scrollFactory({
  //     bodyClass: "dropdowns--hover",
  //     header: navEl,
  //     offset: desktopScrollOffset
  //   });
  //   scrollFactory({
  //     bodyClass: "dropdowns--click",
  //     offset: mobileScrollOffset
  //   });

  return {
    smoothScroll: deviceInfo => {
      if (doesSSInstanceExist(deviceInfo.type) && deviceInfo.type === "mobile") {
        return;
      }
      configSS(deviceInfo);
    }
  };
};
