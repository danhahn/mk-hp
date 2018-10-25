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
      const photoGroup = createPhotoGroup(section);
      sections = [...sections, photoGroup]
    });
    return sections;
  });

  console.dir(homePageData);
  await browser.close();
})();

