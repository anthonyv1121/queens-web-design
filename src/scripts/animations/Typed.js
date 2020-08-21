import { isInViewport, runAtBoolean, getWindowHeight } from "../helpers.js";

export function QWDTyped() {
  const defaults = { typeSpeed: 100, loop: true, showCursor: false };
  const cssSelector = ".typed-text";
  const htmlAttribute = "data-typed-strings";
  let typedArray = [];
  const minReq = { height: 300 };
  let expired = false;

  const create = () => {
    $(cssSelector).each(function(i, el) {
      let stringsArray = $(el)
        .attr(htmlAttribute)
        .split(",");

      typedArray.push(makeTypedObject(el, stringsArray));

      let t = typedArray[i];
      // On init check if any Typed components are in the viewport and start them
      isInViewport($(returnTelement(t))) ? start(t) : stop(t);
    });
  };

  const returnTelement = t => t["instance"]["el"];

  const stop = t => {
    t["instance"].stop();
    t["playing"] = false;
    // console.log(`typed instance ${typedArray.indexOf(t)} has been set to stop`);
  };

  const start = t => {
    t["instance"].start();
    t["playing"] = true;
    // console.log(
    //   `typed instance ${typedArray.indexOf(t)} has been set to start`
    // );
  };
  const isPlaying = t => t["playing"];

  const makeTypedObject = (
    element,
    strings,
    playing = false,
    { typeSpeed, loop, showCursor } = defaults
  ) => {
    return {
      instance: new Typed(element, { strings, typeSpeed, loop, showCursor }),
      playing
    };
  };

  return {
    init: () => {
      runAtBoolean(
        getWindowHeight() > minReq.height,
        create,
        () => (expired = true)
      );
    },
    expired: () => expired,
    onScroll: () => {
      typedArray.forEach(t => {
        let tElement = returnTelement(t);
        runAtBoolean(
          isInViewport($(tElement)),
          () => start(t),
          () => stop(t),
          () => isPlaying(t)
        );
      });
    }
  };
}
