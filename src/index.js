import "./scss/main.scss";
require("./scripts/utils.js");
import {
  getImageSrc,
  setBgImage,
  requireAll,
  detectIE,
  getUrlParams,
  getCookie,
  daysCreator,
  runCallbacks,
  runAtBrowserViewport,
  months
} from "./scripts/helpers.js";
import { NavInit } from "./scripts/components/Nav.js";
import { ContactForm } from "./scripts/components/Contact.js";
import { FooterInit } from "./scripts/components/Footer.js";
import { QWDTyped } from "./scripts/animations/Typed.js";
import { ConfigureTheme } from "./scripts/theme/Theme.js";
import { SocialSharing } from "./scripts/components/SocialSharing";
import { ArticlesConfig } from "./scripts/components/Articles";

requireAll(require.context("./assets/images/", true));

$(function() {
  // init vars
  let app = {
    themeOptions: ["sky__theme--food-truck", "sky__theme--storefront"],
    urlParams: {},
    page: document.body.classList[0],
    pageShareable: Boolean($(".main-container").data("shareable")),
    body: $("body"),
    globals: {
      navSelector: "#qwdNav",
      footerSelector: "#footer",
      bgImageHolder: $(".background-image-holder"),
      toggleLink: $("[data-toggle-class]"),
      portfolioThumb: $(".project-thumb"),
      gradient: $("[data-gradient-bg]"),
      featureBox: $(".feature.boxed")
    },
    home: {
      services: $("#services"),
    },
    thankYou: {
      title:"Thank you for your interest in working with us.", 
      copy:"We will be in touch shortly. In the meantime, check out some of our website resources and articles for small businesses."
    }
  };
  if($(window).width() > 767){
    app.theme = getCookie("theme", app.themeOptions); // for get theme from cookie
  } else {
    app.theme = "sky__theme--storefront"; // hard coding theme 
  }
  
  // window.app = () => app;
  if (detectIE()) {
    app.browser = "ie";
  } else {
    app.browser = "not-ie";
    app.urlParams = getUrlParams("all");
  }
  app.body.addClass(app.browser);

  if(app.page === "article" || app.pageShareable){
    SocialSharing().init();
    // ArticlesConfig().updateArticleDate()
  }
  //if thank/article list page
  if(app.page === "thankyou-article-list"){
    thankYouArticlePage(app.thankYou)
  }

 

  function thankYouArticlePage({title, copy}){
    if(Boolean(app.urlParams["leadGen"])){
      $("h1").text(title)
      $("#hero p.lead").text(copy);
      $("p.lead.cta").addClass("hidden")
    }
    setTimeout(() => $("#hero").css("visibility", "visible"), 0)
  }

  function setDeviceInfo(...cbs) {
    if ($(window).width() > 1024) {
      app.device = {
        type: "desktop",
        bodyClass: "dropdowns--hover",
        dropDownBehavior: "hover"
      };
    } else {
      app.device = {
        type: "mobile",
        bodyClass: "dropdowns--click",
        dropDownBehavior: "click"
      };
    }
    app.body.removeClass(["dropdowns--hover", "dropdowns--click"]);
    app.body.addClass(app.device.bodyClass);

    const deviceInfoCbs = cbs.map(cb => () => cb(app.device));

    runCallbacks({ name: "app.device", stack: deviceInfoCbs });
  }

  /* Set Bg Image Sections*/
  function bgImageHolder() {
    app.globals.bgImageHolder.each(function() {
      //  console.log($(this).children("img, div[data-theme]"));
      const assetTypes = $(this).children("img, div[data-theme]");
      const assetsArray = [].slice.call(assetTypes);

      let src;
      // if section has multiple <img> tags
      if (assetsArray.length) {
        // console.log({ assetTypes: assetTypes.length });
        assetsArray.forEach(function(asset, i) {
          let $asset = $(asset);
          // if <img> tag is theme specific
          if ($asset.data("theme") === app.theme || assetsArray.length === 1) {
            // console.log("bgImageHolder(): " + app.theme);
            // if asset is an image
            if ($asset.attr("src")) {
              src = getImageSrc($asset);
            } else {
              // not a img (div)
              let div = "div[data-theme=" + app.theme + "]";
              let img = $(div).find("img");

              $(div).show();

              if (img.length === 1 && img.hasClass("background-image")) {
                // use as src as css bg img
                src = getImageSrc(img);
              } else {
                img.css("display", "block"); // show <img>
              }
            }
          }
        });
      }
      if (src) {
        setBgImage($(this), src);
      }
      $(this).css("opacity", "1");
    });
  }

  /* Hide Show toggle (mobile nav hamburger) */
  app.globals.toggleLink.each(function() {
    const values = $(this)
        .attr("data-toggle-class")
        .split(";"),
      target = $(values[0]),
      classes = values[1].split(" ");

    $(this).on("click", function(e) {
      classes.forEach(function(c) {
        target.hasClass(c) ? target.removeClass(c) : target.addClass(c);
      });
    });
  });

  /* Set Portfolio Thumbnail href links (Large Images) */
  app.globals.portfolioThumb.each(function() {
    const imgSrc = $(this)
      .find("img")
      .attr("src")
      .split(".");
    imgSrc[0] += (app.page !== "mobile-app") ? "-large." : "."
    $(this)
      .find("a")
      .attr("href", imgSrc.join(""));
  });

  /* Gradient Animation */
  app.globals.gradient.each(function(i, gradient) {
    const colors = $(this)
      .data("gradient-bg")
      .split("|");
  
    const stops = colors.map(function(stop) {
      return stop.split(",");
    });

    const id = "gradient-" + i;
    $(gradient).prepend("<canvas id=" + id + "></canvas>");

    return new Granim({
      element: "#gradient-" + i,
      direction: "left-right",
      isPausedWhenNotInView: true,
      states: {
        "default-state": {
          gradients: stops
        }
      }
    });
  });
 
 
  // const articleTitle = $(".article__title h1").text().split(" ")[0];
  //   $(".sidebar .articles-list > li > a").each((i, el) => {
  //     console.log($(el).text(), articleTitle);
  //      if($(el).text().split(" ")[0] === articleTitle){
  //        $(el).parent().hide();
  //      }
  //   })

  // Make all services boxes same height
  // (function(heights) {
  //   app.home.services.each((i, feature) => heights.push($(feature).height()));
  //   app.home.services.height(Math.max.apply(null, heights));
  // })([]);
  function featureBoxHeight(equalizeHeights = true) {
    let heights = [];
    const section = app.globals.featureBox.parents("section");
    const featureBoxes = section.find(app.globals.featureBox);

    const setToLargest = () => {
      featureBoxes.each((i, feature) => {
        featureBoxes.css({ height: "" });
        heights.push($(feature).height());
      });
      return Math.max.apply(null, heights);
    };
    // console.log({ heights });

    featureBoxes.css({ height: equalizeHeights ? setToLargest() : "auto" });
  }

  // events
  const events = scrollObjs => {
    if (scrollObjs.length) {
      $(window).scroll(e => onUserScroll(...scrollObjs));
    }

    const onUserScroll = (...components) => {
      // console.log({ components });
      components
        .filter(c => c !== undefined && c["onScroll"])
        .filter(c => typeof c.expired !== "function" || !c.expired()) // does object have an 'expired' flag?
        .map(c => {
          let scrollFn = c["onScroll"].bind(c);
          scrollFn();
        });
    };

    // Define DropDown Behavior on resize
    runAtBrowserViewport({
      breakpoint: 1,
      run: () =>
        setDeviceInfo(app.nav.defineDropdownType, app.nav.smoothScroll),
      onResize: true
    });

    runAtBrowserViewport({
      breakpoint: 768,
      run: featureBoxHeight,
      otherwise: () => featureBoxHeight(false),
      onResize: true
    });
  };

  app.nav = NavInit(app.globals.navSelector, app.page);
  app.contact = ContactForm();
  app.footer = FooterInit(app.globals.footerSelector);
  app.typed = QWDTyped();

  const initComponents = (fns = [], scrollObjs = []) => {
    // init callabcks  after theme is set
    let initalizers = [bgImageHolder, app.typed.init];
    app.inits = [...initalizers, ...fns, () => events(scrollObjs)];
    runCallbacks({ name: "app.inits", stack: app.inits });
  };

  if (app.page === "home") {
    ConfigureTheme({ app })
      .then(value => {
        // console.log({ value });
        app = { ...app, ...value };
        const scrollObjs = [app.nav, app.flicker, app.typed, app.taxi];
        initComponents(value.inits, scrollObjs);
      })
      .catch(error =>
        console.error("ConfigureTheme in index.js threw:", error)
      );
  } 
  else {
    initComponents();
  }

  // var hash = document.querySelector(getURLHash());
  // console.log(hash);
  // setTimeout(function(){
  //     scroll.animateScroll(hash);
  // }, 2000)
});
