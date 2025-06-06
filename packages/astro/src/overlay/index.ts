import type { DevOverlayPlugin } from "astro";

import * as Spotlight from "@spotlightjs/spotlight";

const sentryLogo = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="256" height="256" fill="none"/>
<path d="M121.678 68.6777C140.081 50.2742 169.919 50.2742 188.322 68.6777C206.726 87.0811 206.726 116.919 188.322 135.322C169.919 153.726 140.081 153.726 121.678 135.322C120.734 134.378 119.733 133.525 118.686 132.764C108.865 124.59 94.2507 125.11 85.0381 134.322L57.5381 161.822C47.775 171.585 47.775 187.415 57.5381 197.178C67.3012 206.941 83.1303 206.941 92.8934 197.178L104.862 185.209C142.205 207.751 191.449 202.907 223.678 170.678C261.607 132.748 261.607 71.252 223.678 33.3223C185.748 -4.60732 124.252 -4.60732 86.3223 33.3223C77.5523 42.0923 70.7787 52.1712 66.0472 62.9564C60.5003 75.6003 66.2535 90.3468 78.8974 95.8938C91.5413 101.441 106.288 95.6875 111.835 83.0436C114.109 77.8604 117.374 72.9809 121.678 68.6777Z" fill="currentColor"/>
<path d="M59 224C59 238.359 47.3594 250 33 250C18.6406 250 7 238.359 7 224C7 209.641 18.6406 198 33 198C47.3594 198 59 209.641 59 224Z" fill="currentColor"/>
<path d="M155 130C170.464 130 183 117.464 183 102C183 86.536 170.464 74 155 74C139.536 74 127 86.536 127 102C127 117.464 139.536 130 155 130Z" fill="currentColor"/>
</svg>`;

export default {
  id: "spotlight-plugin",
  name: "Spotlight by Sentry",
  icon: sentryLogo,
  init(_canvas, app) {
    // When there is an error already on the page, Spotlight will pop open
    // before the app is initialized so update the state for the button
    if (document.body.classList.contains(Spotlight.SPOTLIGHT_OPEN_CLASS_NAME)) {
      app.toggleState({ state: true });
      app.toggleNotification({ state: false });
    }

    const clearNotification = () =>
      setTimeout(() => {
        app.toggleNotification({ state: false });
      }, 500);

    app.onToggled(({ state }) => {
      clearNotification();
      if (state) {
        Spotlight.openSpotlight();
      } else {
        Spotlight.closeSpotlight();
      }
    });

    Spotlight.onClose(() => {
      app.toggleState({ state: false });
      clearNotification();
    });

    Spotlight.onOpen(() => {
      app.toggleState({ state: true });
      clearNotification();
    });

    Spotlight.onSevereEvent(() => {
      app.toggleNotification({ state: true, level: "error" });
    });
  },
} satisfies DevOverlayPlugin;
