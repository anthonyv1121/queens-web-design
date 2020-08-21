import { getOffScreenPos, getAboveTheFold, isInViewport } from "../helpers.js";

let counter = 0;
let maxCount = 3;

export class Taxi {
  constructor(parent, wrapperId, xmlElement) {
    this.parent = parent;
    this.wrapperId = wrapperId;
    this.xmlElement = xmlElement;
    this.moveable = true;
    this.runAt = 768;
    this.init = this.init.bind(this);
    this.parent.append(
      `<div id="${this.wrapperId}" class="pos-absolute img--fullwidth"></div>`
    );
    this.wrapper = $(`#${this.wrapperId}`);
  }

  build() {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: "data/taxi.xml",
        dataType: "xml",
        success: xml => {
          this.taxi = $(xml).find(this.xmlElement);
          resolve(true);
        },
        error: (req, status, error) => {
          //console.log(`taxi.xml error ${{ req, status, error }}`);
          reject({ status: "Taxi.js promise failed" });
        }
      });
    });
  }

  init() {
    this.wrapper.append(this.taxi);
  }

  display(onShowComplete) {
    //console.log({ taxi: this.taxi });
    this.taxi.show("fast", onShowComplete);
  }

  move() {
    counter++;
    //console.log({ counter });
    const left = 0 - this.taxi.width();
    this.taxi.animate(
      { left },
      {
        duration: 1500,
        complete: this.moveComplete.bind(this)
      }
    );

    //console.log("moving TAXI");
  }

  moveComplete() {
    this.taxi.hide();
    this.taxi.css("left", getOffScreenPos("left", this.taxi));
  }

  expired() {
    let exp = counter === maxCount;
    // if (exp) //console.log("TAXI EXPITRED", exp);
    return exp;
  }

  onScroll() {
    if (isInViewport(this.wrapper, getAboveTheFold() * 0.5) && this.moveable) {
      //console.log("TAXIWRAPPER IN VIEW");
      this.display(() => this.move());
      this.moveable = false;
    } else if (isInViewport($("#footer")) && !this.moveable) {
      //console.log("TAXI RESETTING", counter);
      this.moveable = true;
    }
  }
}
