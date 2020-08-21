import { Marquee } from "../animations/Marquee.js";
import { Flicker } from "../animations/Flicker.js";
import { Taxi } from "../animations/Taxi.js";

export const Storefront = parentEl => {
  const marqueeEl = "marquee";
  const marqueeText = "marquee_text";
  const flickerEl = "#marquee_text .neon";
  const taxiWrapper = "taxiWrapper";
  const taxiXmlEl = "svg";

  const marquee = Marquee(parentEl, marqueeEl, marqueeText);
  const taxi = new Taxi(parentEl, taxiWrapper, taxiXmlEl);
  marquee.init();

  const async = new Promise((resolve, reject) => {
    const marqueeDisplayed = marquee.isDisplayed();

    taxi
      .build()
      .then(taxiReady => {
        marqueeDisplayed && taxiReady
          ? resolve({ flicker: Flicker(flickerEl), taxi })
          : reject({ status: "Storefront.js promise failed" });
      })
      .catch(error => console.error(error));
  });

  async
    .then(value =>{
      // console.log(`Storefront.js async() complete ${Object.keys(value)}`)
    }
    )
    .catch(error => console.error(error));

  return async;
};
