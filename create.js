const puppeteer = require('puppeteer');

createPhotoGroup = (elements) => {
  return {
    type: "flagshipFullBanner",
    media: "//digital.michaelkors.com/refreshes/2018/fall/refresh4/global/mobile/homepage/HP_PROMO_1.jpg",
    link: "/women/_/N-28ee",
    title: "DARK GLAMOUR",
    cta: {
      label: "SHOP MICHAEL MICHAEL KORS",
      className: "type-cta-1 wpCta"
    },
    headline: {
      label: "DARK GLAMOUR",
      className: "type-headline-mmk-1 wpHeadline type-padding-bottom"
    }
  }
}

let bookingUrl = 'https://int-2.michaelkors.com/';
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(bookingUrl);

  // get hotel details
  let homePageData = await page.evaluate(() => {
    let sections = [];
    // get the hotel elements
    let sectionElements = document.querySelectorAll(".mkwp");
    // get the hotel data
    sectionElements.forEach((section) => {
      let sectionJson = {};
      try {
        sectionJson.name = section.querySelector('h2').innerText;
        sectionJson.url = section.querySelector('a').href;
        sectionJson.src = section.querySelector('.mkwp picture source[media*="767"]').srcset;
        // hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
        // hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
        // if (hotelelement.querySelector('strong.price')) {
        //   hotelJson.price = hotelelement.querySelector('strong.price').innerText;
        // }
      }
      catch (exception) {

      }
      sections.push(sectionJson);
    });
    return sections;
  });

  console.dir(homePageData);
  await browser.close();
})();

