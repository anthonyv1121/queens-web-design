import {
  runAtBrowserViewport,
  runAtBoolean,
  isScrollingPast,
  getAboveTheFold
} from "../helpers.js";
import { SS } from "./SmoothScroll.js";

/* Nav */
export function NavInit(navEl, page) {
  const element = $(navEl);
  const links = element.find(".menu-horizontal > li > a");
  const sticky = "pos-fixed";
  const notSticky = page === "home" ? "bar--absolute" : "bar--relative";
  const mobileMenuToggle = $(".hamburger-toggle");
  const mobileHeaderEl = $("#mobile-header");
  const darkMobileHeaders = ["wdlessons", "unions", "partners", "mobile-app"];
  let hasDarkMobileHeader = false;

  // set as notSticky on load
  element.addClass(notSticky);

  // change to white logo and hamburger toggle on mobile for pages with dark hero images
  if(darkMobileHeaders.find(pageName => pageName === page)){
    hasDarkMobileHeader = true
    mobileHeaderEl.addClass("bg--dark bar--transparent bg--none")
  }
  
  // functions
  const setSticky = () => {
    element.addClass(sticky).removeClass(notSticky);
    // console.log("SETSTICKY");
  };

  const unStick = () => {
    element.removeClass(sticky).addClass(notSticky);
    // console.log("UNSTICK");
  };

  const displayMobileLabel = () => {
    links.each(function() {
      var mobileName = $(this).data("mobile-name");
      if (!$(this).data("desktop-name")) {
        $(this).attr("data-desktop-name", $(this).text());
      }
      $(this).text(mobileName);
    });
  };
  const displayDesktopLabel = () => {
    links.each(function() {
      if ($(this).data("desktop-name")) {
        $(this).text($(this).data("desktop-name"));
      }
    });
  };

  const defineDropdownType = deviceInfo => {
    const trigger = $(`body.${deviceInfo.bodyClass} .dropdown__trigger`);
    trigger.each((i, el) => {
      deviceInfo.dropDownBehavior === "hover"
        ? desktopTrigger($(el))
        : mobileTrigger($(el));
    });
  };

  const desktopTrigger = el => {
    const name = el.text().toLowerCase();
    el.attr({ href: `/#${name}`, "data-scroll": true });
  };

  const mobileTrigger = el => {
    el.attr({ href: "#", "data-scroll": null });

    const mobileClick = $("body.dropdowns--click");
    if (!mobileClick.hasClass("hasClick")) {
      addMobileClickHandler(mobileClick);
    }
  };

  const addMobileClickHandler = mobileClick => {
    // console.log("addMobileClickHandler()");
    const ddClass = "dropdown--active";
    mobileClick.click(e => {
      const clicked = $(e.target).parent();
      if (!clicked.hasClass(ddClass)) {
        $(`.${ddClass}`).removeClass(ddClass);
      }
      clicked.toggleClass(ddClass);

      if(hasDarkMobileHeader){
        mobileHeaderEl.toggleClass("bg--none")
      }
    });

    mobileClick.addClass("hasClick");
  };

  const closeHamburgerMenu = () => {
    mobileMenuToggle.is(":visible")
      ? runAtBrowserViewport({
          breakpoint: { from: 0, to: 768 },
          run: () => {
            //console.log("RUNNING closeHamburgerMenu");
            mobileMenuToggle.trigger("click");
          }
        })
      : null;
  };

  const isSticky = () => element.hasClass(sticky);

  runAtBrowserViewport({
    breakpoint: { from: 992, to: 1135 },
    run: displayMobileLabel,
    otherwise: displayDesktopLabel,
    onResize: true
  });

  let ss = SS(navEl, closeHamburgerMenu);

  return {
    onScroll: () =>
      runAtBoolean(
        isScrollingPast(getAboveTheFold() - 100),
        setSticky,
        unStick,
        isSticky
      ),
    defineDropdownType: deviceInfo => defineDropdownType(deviceInfo),
    smoothScroll: deviceInfo => ss.smoothScroll(deviceInfo)
  };
}
// run: () =>{if(!isSticky()){setSticky()}}
