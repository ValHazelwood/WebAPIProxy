const puppeteer = require('puppeteer');

// Simple delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getCurrentlySelected(page) {
  // Find currently selected season - element with background-color rgb(0, 173, 239)
  const selectedSeason = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('hdvbplayer *'));
    for (const el of elements) {
      const text = el.textContent.trim();
      const computedStyle = window.getComputedStyle(el);
      if (text.startsWith('Сезон ') && computedStyle.backgroundColor === 'rgb(0, 173, 239)') {
        return text;
      }
    }
    return null;
  });

  // Find currently selected episode - element with background-color rgb(0, 173, 239)
  const selectedEpisode = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('hdvbplayer *'));
    for (const el of elements) {
      const text = el.textContent.trim();
      const computedStyle = window.getComputedStyle(el);
      if (text.match(/^\d+ серия/) && computedStyle.backgroundColor === 'rgb(0, 173, 239)') {
        return text;
      }
    }
    return null;
  });

  return { selectedSeason, selectedEpisode };
}

async function selectSeasonAndEpisode(url, season, episode) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

 await page.setRequestInterception(true);
  page.on('request', (request) => {
    request.continue();
  });

  const m3u8Urls = [];

  // Log network responses
  page.on('response', async (response) => {
    const url = response.url();
    //console.log(url);
    if (url.endsWith('.m3u8')) {
      m3u8Urls.push(url);
      //console.log("\x1b[32mFound .m3u8 URL:\x1b[0m", url); // Green text for found URL
    }
  });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for the player to load
    await page.waitForSelector('hdvbplayer', { timeout: 10000 });

    // Select season - find element by text content
    const seasonText = `Сезон ${season}`;
    const seasonElement = await page.evaluateHandle((text) => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.find(el => el.textContent.trim() === text);
    }, seasonText);

    if (seasonElement) {
   const text = await seasonElement.evaluate(el => el.textContent);
    console.log(text);
      await seasonElement.evaluate(el => el.click());
      await delay(1500); // Wait for season selection to process
    } else {
      throw new Error(`Season element not found: "${seasonText}"`);
    }

    // Select episode - find element by text content
    const episodeText = `${episode} серия`;
    const episodeElement = await page.evaluateHandle((text) => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.find(el => el.textContent.trim() === text);
    }, episodeText);

    if (episodeElement) {
   const text = await episodeElement.evaluate(el => el.textContent);
    console.log(text);
      await episodeElement.evaluate(el => el.click());
      await delay(1500); // Wait for episode selection to process
    } else {
      throw new Error(`Episode element not found: "${episodeText}"`);
    }

    console.log(`Successfully selected Season ${season}, Episode ${episode}`);
    const lastM3u8Url = m3u8Urls.length > 0 ? m3u8Urls[m3u8Urls.length - 1] : null;
    console.log('Last M3U8 URL:', lastM3u8Url);

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

async function getCurrentSelection(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
      request.continue();
    });

    const m3u8Urls = [];

    // Log network responses
    page.on('response', async (response) => {
      const url = response.url();
      if (url.endsWith('.m3u8')) {
        m3u8Urls.push(url);
        //console.log("\x1b[32mFound .m3u8 URL:\x1b[0m", url);
      }
    });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for the player to load
    await page.waitForSelector('hdvbplayer', { timeout: 10000 });

    // Wait a bit for M3U8 URLs to be captured
    await delay(2000);

    const { selectedSeason, selectedEpisode } = await getCurrentlySelected(page);

    const lastM3u8Url = m3u8Urls.length > 0 ? m3u8Urls[m3u8Urls.length - 1] : null;

    console.log('Selected Season:', selectedSeason);
    console.log('Selected Episode:', selectedEpisode);
    console.log('Last M3U8 URL:', lastM3u8Url);

    return { selectedSeason, selectedEpisode, lastM3u8Url };

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 1) {
  // Only URL provided - get current selection
  const url = args[0];
  getCurrentSelection(url)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (args.length === 3) {
  // URL, season, and episode provided - select season and episode
  const [url, season, episode] = args;
  selectSeasonAndEpisode(url, parseInt(season), parseInt(episode))
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  console.error('Usage: node select-season-episode.js <url> [season] [episode]');
  console.error('Examples:');
  console.error('  node select-season-episode.js "https://example.com"');
  console.error('  node select-season-episode.js "https://example.com" 1 5');
  process.exit(1);
}
