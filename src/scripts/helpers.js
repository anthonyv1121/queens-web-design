export function generateElements(els) {
  var obj = {},
    key;
  els.forEach(function(el) {
    key = el.replace("#", "").replace(".", "");
    key = key.indexOf("-") >= 0 ? camelCase("-", key) : key;
    obj[key] = $(el);
  });
  return obj;
}
export function getImageSrc(container) {
  return container.attr("src");
}
export function setBgImage(container, src) {
  container.css("background-image", 'url("' + src + '")');
}
export function swapClasses(el, add, remove) {
  el.addClass(add).removeClass(remove);
}
export const getPrevEl = (el, prev) => el.prev(prev);

export const getCSSVal = (el, prop) => parseInt(el.css(prop), 10);

export function camelCase(splitAt, str) {
  return str
    .split(splitAt)
    .map(caseChar)
    .join("");

  function caseChar(word, i) {
    return i === 0
      ? word.toLowerCase()
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
export const stripStartSpace = array => {
  [...array].forEach((c, i) => {
    if (c.charAt(0) === " ") {
      array[i] = c.substring(1);
    }
  });
  return array;
};
export const stripStartingStr = (strArray, start, fallback = "") => {
  fallback = typeof fallback === " function" ? () => fallback() : fallback;
  let substr = strArray.find((str, i) => str.indexOf(start) === 0);

  return typeof substr === "string" ? substr.substring(start.length) : fallback;
};
export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const daysCreator = days => days * 24 * 60 * 60 * 1000;

export const createCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + daysCreator(days));
  console.log(date.toUTCString());
  return `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export const getCookie = (name, checkAgainst) => {
  name = `${name}=`;
  const cookiesArray = decodeURIComponent(document.cookie).split(";");
  // console.log({ cookiesArray });
  const cookieArrayClean = stripStartSpace(cookiesArray);
  // console.log({ cookieArrayClean });
  let cookieValue = stripStartingStr(cookieArrayClean, name);
  // console.log({ cookieValue });

  if (checkAgainst) {
    cookieValue = valueMatchesArray(checkAgainst, cookieValue)
      ? cookieValue
      : "";
  }
  // console.log({ cookieValue });
  return cookieValue;
};
export const valueMatchesArray = (array, value) => array.includes(value);

// window.getCookie = getCookie;
export function redirect(path) {
  window.location = path;
}
window.redirect = redirect;
export function getURLHash() {
  return window.location.hash;
}
export function getUrlParams(param) {
  var urlParams = new URLSearchParams(window.location.search);
  return param == "all" ? getUrlPairs(urlParams) : urlParams.get(param);
}
export function checkUrlParam(param) {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(param);
}

export function getUrlPairs(urlParams) {
  var entries = urlParams.entries(),
    paramObj = {};
  for (var pair of entries) {
    paramObj[pair[0]] = pair[1];
    // paramsArray.push(param);
    // console.log(pair[0], pair[1]);
  }
  return paramObj;
}
export function getQueryString(url) {
  let urlParams = {};
  let match;
  let query;
  let additional = /\+/g; // Regex for replacing additional symbol with a space
  let search = /([^&=]+)=?([^&]*)/g;
  const decode = s => decodeURIComponent(s.replace(additional, " "));

  if (url) {
    if (url.split("?").length > 0) {
      query = url.split("?")[1];
    }
  } else {
    url = window.location.href;
    query = window.location.search.substring(1);
  }
  while ((match = search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
}
export const runCallbacks = (
  // fns = { name: "", stack: [], onComplete: function() {} }
  { name, stack }
) => {
  stack.forEach((fn, i) => {
    if (typeof fn === "function") {
      fn();
    }
    // i === stack.length - 1
    //   ? console.log({ runCallbacks: { [name]: stack } })
    //   : null;
  });
};
export const random = (max, min) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getElementHeight = element => element.height() >= 0 ? element.height() : 0; // height() can return a negative value under some circumstances

export const getElementWidth = element => element.width();

export const getElementTop = element => element.offset().top;

export const getWindowWidth = () => window.innerWidth;

export const getWindowHeight = () => getElementHeight($(window));

export const getWindowScroll = () => $(window).scrollTop();

export const getOffScreenPos = (pos, element) => {
  return pos === "left"
    ? getWindowWidth() + getElementWidth(element)
    : getWindowHeight() + getElementHeight(element);
};
export function runAtBrowserViewport(config) {
  //config = {breakpoint:{from:value, to:value}, run: fn, otherwise: fn, onResize:bool};
  function checkViewport(config) {
    var windowCurrentW = getWindowWidth();

    if (typeof config.breakpoint["from"] === "number") {
      if (
        windowCurrentW >= config.breakpoint["from"] &&
        windowCurrentW < config.breakpoint["to"]
      ) {
        config.run();
      } else if (typeof config.otherwise === "function") {
        config.otherwise();
      }
    } else {
      checkViewport({
        breakpoint: { from: config["breakpoint"], to: 5000 },
        run: config.run,
        otherwise: config.otherwise
      });
    }
  }

  if (config.onResize) {
    $(window).on("resize", function() {
      checkViewport(config);
    });
  }
  checkViewport(config);
}
export const getAboveTheFold = () =>
  getElementHeight($(".main-container > section:first"));

export const isScrollingPast = position => getWindowScroll() > position;

export const isInViewport = (element, offset = 0) => {
  const et = getElementTop(element) + offset;
  const eb = et + getElementHeight(element);

  const vt = getWindowScroll();
  const vb = vt + getWindowHeight();

  return eb > vt && et < vb;
};

export const runAtBoolean = (condition, truthy, falsely, additional = null) => {
  if (additional === null) {
    condition ? truthy() : falsely();
    return;
  }
  additional = typeof additional === "function" ? additional() : additional;
  // console.log({ additional, truthy });
  if (condition && !additional) {
    truthy();
  } else if (!condition && additional) {
    falsely();
  }
};
export const handleSetTimeOut = (fns, delay) => {
  // console.log({ fns });
  let callback = setTimeoutId => {
    Array.isArray(fns)
      ? runCallbacks({ name: "flicker settimeout fns", stack: fns })
      : fns();
    clearTimeout(setTimeoutId);
  };
  const sto = setTimeout(callback, delay, sto);
};
export const requireAll = r => r.keys().forEach(r);

export const detectIE = () => {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }

  var trident = ua.indexOf("Trident/");
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }

  var edge = ua.indexOf("Edge/");
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }

  // other browser
  return false;
};

// Not used
export const isAboveTheFold = el => getElementTop(el) < getAboveTheFold();

export function runWhenInViewport(config) {
  // {element:HTML ELEMENT, run: fn(), otherwise:()}
  let { element, run, otherwise } = config;
  runAtBoolean(isInViewport(element), run, otherwise);
}
export function runAtScrollPosition(config) {
  //config = {element=jQuery ELEMENT || STRING, run:fn(), otherwise:fn()};
  let { element, run, otherwise, offset } = config;
  offset = offset > 0 || offset < 0 ? offset : 0;
  let aboveFold = getAboveTheFold() - offset;
  let threshold =
    element === "above the fold"
      ? aboveFold
      : getElementHeight(element) + getElementTop(element) - offset;
  let additionalCondition = config.condition ? config.condition() : null;
  // console.log({additionalCondition});
  // const checkScrollAndRun = () => $(window).scrollTop() > threshold ? run() : otherwise()
  runAtBoolean(
    $(window).scrollTop() > threshold,
    run,
    otherwise,
    additionalCondition
  );
  // console.log({threshold, scrollTop:$(window).scrollTop()});
}
