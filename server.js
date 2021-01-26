const express = require("express");
// const stream = require('./stream')
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());
app.use(express.static('public'))


app.post("/api", async (req, res) => {
   const { name, year } = req.body

   const stream = async (name_with_space, year) => {
    const name = name_with_space.replace(/ /g, '-')
    const browser = await puppeteer.launch({ headless: false });
    const pageYts = await browser.newPage();
    await pageYts.setRequestInterception(true);
    pageYts.on("request", (req) => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image" ||
        req.resourceType() == "script"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
    await pageYts.goto(`https://yts.mx/movies/${name}-${year}`);
    const magnet = await pageYts.evaluate(
      () =>
        document.querySelector(
          `a[class="magnet-download download-torrent magnet"]`
        ).href
    );
    await pageYts.close()
    const page = await browser.newPage();
    await page.goto("https://webtor.io/", { waitUntil: "networkidle0" });
  
    await page.focus(`input[type="text"]`);
    await page.keyboard.sendCharacter(magnet);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().startsWith("https://abra--")) {
        request.abort();
        res.send({URL: request.url()})
      } else request.continue();
    });
    await page.keyboard.press("Enter");
    await page.waitForSelector(
      `div[class="mejs__button mejs__download-button"]>button`
    );
    const btn = await page.$(
      `div[class="mejs__button mejs__download-button"]>button`
    );
    await btn.click();
    await browser.close();
  };
  await stream(name, year)
});

// PORT
const PORT = 3000;

app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});
