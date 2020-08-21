import { Storefront } from "./Storefront.js";
import { random, runAtBrowserViewport, createCookie } from "../helpers.js";

export function ConfigureTheme(config) {
  let { theme, themeOptions, urlParams, body, home, globals, device } = config.app;
  let storefrontEl = globals.bgImageHolder;
  // console.log(home.services);
  let sections = [home.services];
  const themeCookie = { name: "theme", days: 7 };

  const getRandomTheme = cb => {
    const randomTheme = themeOptions[random(themeOptions.length - 1, 0)];
    // console.log("GENERATING RANDOM THEME...");
    document.cookie = createCookie(
      themeCookie.name,
      randomTheme,
      themeCookie.days
    );
    // console.log("SETTING THEME TO COOKIE...");
    return randomTheme;
  };

  const applyThemeToApp = (t, klass) => {
    theme = t;
    body.addClass(theme);
    sections.forEach(sec => sec.addClass(klass));
    // console.log("APPLYING THEME TO APP...");
  };

  const themePromise = new Promise((resolve, reject) => {
    const resolver = (value = {}) => {
      // console.log({ theme });
      resolve({
        ...value,
        theme,
        urlParams,
        cookie: { theme },
        inits: value.inits ? value.inits : []
      });
    };

    const themeRules = t => {
      switch (t) {
        case "sky__theme--food-truck":
          // console.log("THEME HAS FOUND A MATCH");
          applyThemeToApp(t, "bg--lightGray");
          resolver();
          break;

        case "sky__theme--storefront":
          // console.log("THEME HAS FOUND A MATCH");
          applyThemeToApp(t, "bg--gray");
          runAtBrowserViewport({
            breakpoint: 768,
            run: () => {
              Storefront(storefrontEl)
                .then(({ flicker, taxi }) =>
                  resolver({ flicker, taxi, inits: [flicker.init, taxi.init] })
                )
                .catch(error => {
                  reject({ status: "Storefront() promise failed" });
                  // console.error(error);
                });
            },
            otherwise: () => resolver()
          });
          break;

        default:
          // console.log(
          //   `THEME MOST LIKELY HAS NO VALUE OR SLIGHT CHANCE IT DOESN'T MATCH ANY THEME OPTIONS VIA AN INCORRECT QUERY STRING`
          // );
          urlParams["theme"] = null;
          themeRules(getRandomTheme());
          // console.log("NOW GETTING RANDOM THEME...");
          break;
      }
    };

    if (urlParams["theme"]) {
      // If user came in from query string use that theme
      // console.log("Checking THEME FROM urlParams: ", urlParams["theme"]);
      themeRules(urlParams["theme"]);
    } else {
      // Try using the value of app.theme
      // console.log("NO QUERY STRING, PERHAPS THEME IS COOKIED...");
      themeRules(theme);
    }
  });

  return themePromise;
}
