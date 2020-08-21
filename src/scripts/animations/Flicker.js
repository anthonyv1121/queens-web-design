import {
  random,
  runAtBoolean,
  isScrollingPast,
  getAboveTheFold,
  handleSetTimeOut
} from "../helpers.js";

export const Flicker = element => {
  let canceled = false;
  const flickerClass = "off";
  let textHolder;
  let text;
  let letters;
  let counter = 0;
  const maxCount = 4;

  function createText() {
    textHolder = $(element);
    text = textHolder.text();
    textHolder.html(
      text
        .split("")
        .map(character => "<span class='off'>" + character + "</span>")
        .reverse()
        .reduce((total, html) => (html += total), "")
    );
    letters = textHolder.find("span");
    loop(letters, 3000, {
      count: 0,
      max: 3,
      callback: () => loopSingles([...letters])
    });
  }

  function loop(
    letters,
    time = random(2500, 10000),
    terminate = { count: 0, max: 5, callback: () => {} }
  ) {
    //console.log("FLICKER Canceled", canceled);
    if (canceled) {
      return;
    }
    let { count, max, callback } = terminate;
    let letterToAnimate = Array.isArray(letters)
      ? letters[random(0, letters.length - 1)]
      : letters;

    if (count < max) {
      let fn = () => {
        flicker(letterToAnimate, 0);
        loop(letters, time, { count: count + 1, max, callback });
      };
      handleSetTimeOut(fn, time);
    } else {
      // //console.log("LOOP MAX REACHED -- CALLBACK CALLED");
      handleSetTimeOut(callback, 4000);
    }
  }

  function runFunctions(fns, delay) {
    fns.forEach(fn => {
      let newFn = setTimeOutId => {
        fn();
        clearTimeout(setTimeOutId);
      };
      let run = setTimeout(newFn, delay, run);
    });
  }
  function loopSingles(letters) {
    $(".off").removeClass("off");
    loop(letters);
  }

  function flicker(element, counter) {
    let duration = random(5, 17);

    if (counter > duration || canceled) {
      $("." + flickerClass).removeClass(flickerClass);
      return;
    }
    let fn = () => {
      $(element).toggleClass(flickerClass);
      flicker(element, counter + 1);
    };
    handleSetTimeOut(fn, 30);
  }

  const isCanceled = () => canceled;
  const cancel = () => {
    canceled = true;
    //console.log("SETTING FLICKER TO CANCEL!!!");
  };
  const restart = () => {
    counter++;
    //console.log("RESTARTING FLICKER", counter);
    canceled = false;
    handleSetTimeOut(() => loopSingles([...letters]), 0);
    // let run = setTimeout(() => {
    //   loopSingles([...letters]);
    //   clearTimeout(run);
    // }, 0);
  };

  const expired = () => {
    const exp = counter === maxCount;
    if (exp) {
      cancel();
      // //console.log("Flicker has expired", exp);
    }
    return exp;
  };

  return {
    init: createText,
    expired,
    onScroll: () =>
      runAtBoolean(
        isScrollingPast(getAboveTheFold()),
        cancel,
        restart,
        isCanceled
      )
  };
};
