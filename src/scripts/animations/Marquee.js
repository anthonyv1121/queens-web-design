import { runAtBrowserViewport } from "../helpers.js";

export const Marquee = (parentEl, marqueeEl, textEl) => {
  const message = "<div class='neon'>websites</div>";
  const imageBgW = 1700;
  const marqueeElX = 692; // (marqueeElX * ww)/imageBgW
  let marqueeElHolder;
  let displayed = false;

  const getPosition = () => {
    const ww = parentEl.width();
    const bgPosX = (imageBgW - ww) / 2;
    const marginL = 9;
    const position = { y: 645, x: marqueeElX - bgPosX + marginL };
    return position;
  };

  const init = () => {
    //console.log("MARQUE INIT RUNNING");
    const html = `<div id="${marqueeEl}"><div id="${textEl}">${message}</div></div>`;
    parentEl.append($("<div id='marquee-wrapper'>" + html + "</div>"));
    marqueeElHolder = $("#" + marqueeEl);

    setPosition();
    displayed = true;
  };

  const setPosition = () => {
    if (marqueeElHolder) {
      const position = getPosition();
      marqueeElHolder.css({ top: position.y, left: position.x });
    }
  };

  runAtBrowserViewport({
    breakpoint: 768,
    run: setPosition,
    onResize: true
  });

  return {
    isDisplayed: () => displayed,
    init
  };
};
