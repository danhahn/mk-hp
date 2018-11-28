const puppeteer = require("puppeteer");
const fs = require('fs');
const moment = require('moment');

let url = "https://www.michaelkors.com/";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 500 });
  await page.goto(url);

  // get hotel details
  let homePageData = await page.evaluate(() => {
    let pageObj = {}
    let pageJson = {
      items: [pageObj]
    };
    const topBannerDOM = document.querySelector('.flagshipSaleBanner');
    const topBanner = {
      "banner_url": topBannerDOM.querySelector('a').href,
      "banner_img": `https:${topBannerDOM.querySelector('[srcset*=mobile]').srcset}`,
      "banner_img_height": "358",
      "banner_img_width": "388",
      "caption--headline": topBannerDOM.querySelector('h2').textContent.trim(),
      "font_family": "Caslon",
      "font_weight": "italic",
      "captio_text": topBannerDOM.querySelector('.caption--text').textContent.trim(),
      "caption_ctas": [...topBannerDOM.querySelectorAll('.wpCta:not(.hide-tablet-only) a')].map(item => {
        return {
          "cta_text": item.textContent,
          "cta_url": item.href
        }
      }),
      "bottom_line-text": topBannerDOM.querySelector('.promo--legal').innerHTML.split('<')[0].trim(),
      "bottom_line_url_text": topBannerDOM.querySelector('.promo--legal a').textContent.trim(),
      "bottom_line_url": topBannerDOM.querySelector('.promo--legal a').href
    }
    const richContent = [...document.querySelectorAll('.mkwp[id]')].map(item => {
      return {
        "mmk_url": item.querySelector('a').href,
        "mmk_img": item.querySelector("[srcset *= 'mobile']").srcset,
        "mmk_img_width": "320",
        "mmk_img_height": "320",
        "mmk_Headline": item.querySelector('.caption--headline').textContent.trim(),
        "font_family": [...item.querySelector('.caption').classList].join(' '),
        "mmk_subtext": item.querySelector('.caption--headline + div').textContent.trim()
      }
    });
    const slider = [...document.querySelector('.carousel').querySelectorAll('figure.promo')].map(item => {
      return {
        "slider_img": item.querySelector("[srcset *= 'mobile']").srcset,
        "slider_img_height": "320",
        "slider_img_width": "320",
        "slider_caption": item.querySelector('.caption--ctas').textContent.trim(),
        "slider_url": item.querySelector('a').href,
        "slider_text": item.querySelector('.wpHeadline').textContent.trim()
      }
    });
    pageObj['top_banner'] = [topBanner];
    pageObj['rich_content'] = richContent;
    pageObj['slider'] = slider;
    pageObj['slider_item_count'] = slider.length;
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
  console.log(JSON.stringify(homePageData, null, 2));
  await browser.close();
})();
