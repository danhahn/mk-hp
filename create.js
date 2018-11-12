const puppeteer = require("puppeteer");
const fs = require('fs');
const moment = require('moment');

createPhotoGroup = elements => {
  // return {
  //   type: "flagshipFullBanner",
  //   media: "//digital.michaelkors.com/refreshes/2018/fall/refresh4/global/mobile/homepage/HP_PROMO_1.jpg",
  //   link: "/women/_/N-28ee",
  //   title: "DARK GLAMOUR",
  //   cta: {
  //     label: "SHOP MICHAEL MICHAEL KORS",
  //     className: "type-cta-1 wpCta"
  //   },
  //   headline: {
  //     label: "DARK GLAMOUR",
  //     className: "type-headline-mmk-1 wpHeadline type-padding-bottom"
  //   }
  // }
  return "something";
};

let url = "https://int-4.michaelkors.com/";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(url);

  // get hotel details
  let homePageData = await page.evaluate(() => {
    const pageJson = {};

    const pph = {};
    pphData = document.querySelector(".pphMessageContent");
    const message = pphData.innerHTML.split(".")[0];
    pph.title = message + ".";
    pph.cta = {
      url: pphData.querySelector('a').href,
      label: pphData.querySelector('a').innerText
    }

    pageJson.pph = pph;

    let sections = [];
    // get the hotel elements
    let sectionElements = document.querySelectorAll(".mkwp");
    // get the hotel data
    sectionElements.forEach(section => {
      let sectionJson = {};
      try {
        sectionJson.type = section.querySelector(".mkwp--wrapper").classList[3];
        sectionJson.media = section.querySelector(
          '.mkwp picture source[media*="767"]'
        ).srcset;
        sectionJson.link = section.querySelector("a").href;
        sectionJson.title = section.querySelector("[class*=headline]").innerText;
        // hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
        // hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
        // if (hotelelement.querySelector('strong.price')) {
        //   hotelJson.price = hotelelement.querySelector('strong.price').innerText;
        // }
        const allCTAs = [];
        document.querySelectorAll(".wpCta").forEach(item => {
          const cta = {
            label: item.querySelector("a").innerText,
            className: Array.from(item.classList).join(" "),
            url: item.querySelector("a").href,
          };
          console.log(cta)
          allCTAs.push(cta);
        })
        sectionJson.links = allCTAs;
        console.log(allCTAs);

        const cta = {
          label: section.querySelector(".wpCta a").innerText,
          className: Array.from(section.querySelector(".wpCta").classList).join(
            " "
          )
        };
        const headline = {
          label: section.querySelector("h2").innerText,
          className: Array.from(section.querySelector("h2").classList).join(" ")
        };
        sectionJson.cta = cta;
        sectionJson.headline = headline;
        const gallery = [];
        const promos = section
          .querySelectorAll(".carousel .promo")
          .forEach(item => {
            const galleryItem = {
              media: item.querySelector('.mkwp picture source[media*="767"]')
                .srcset,
              link: item.querySelector("a").href,
              title: item.querySelector("h2").innerText,
              ctaLabel: item.querySelector(".wpCta a").innerText,
              label: item.querySelector('[data-icid]').dataset.icid
            };
            gallery.push(galleryItem);
          });

        sectionJson.gallery = gallery;
      } catch (exception) {}
      sections.push(sectionJson);
    });
    pageJson.section = sections;
    return pageJson;
  });

  var regex = /(https:\/\/)([\w-]*)(.michaelkors.com\/)/g;
  cleanHomepageData = JSON.stringify(homePageData, null, 2).replace(regex, '$1www$3')

  fs.writeFile(
    `./homepage-${moment().format('M-DD-YYYY_H-mm-ss')}.json`,
    cleanHomepageData,
    err => {
      if (err) {
        return console.log(err);
      }
      // console.log(JSON.stringify(homePageData, null, 2));
      console.log("The file was saved!");
    }
  );
  await browser.close();
})();
