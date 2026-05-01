using PuppeteerSharp;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HDRezka.Helpers
{
    public class PuppeteerM3U8Service
    {
        private readonly BrowserFetcher _browserFetcher;

        public PuppeteerM3U8Service()
        {
            _browserFetcher = new BrowserFetcher();
        }

        public async Task<IEnumerable<string>> FindM3U8UrlsAsync(string targetUrl)
        {
            if (string.IsNullOrEmpty(targetUrl))
            {
                throw new ArgumentException("Target URL is required.", nameof(targetUrl));
            }

            await _browserFetcher.DownloadAsync();

            await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
            {
                Headless = true,
                Args = new[] { "--no-sandbox", "--disable-setuid-sandbox" }
            });

            await using var page = await browser.NewPageAsync();

            var m3u8Urls = new List<string>();

            page.Response += (sender, e) =>
            {
                var url = e.Response.Url;
                if (url.EndsWith(".m3u8"))
                {
                    m3u8Urls.Add(url);
                }
            };

            try
            {
                await page.GoToAsync(targetUrl, WaitUntilNavigation.Networkidle2);

                await page.SetViewportAsync(new ViewPortOptions
                {
                    Width = 1980,
                    Height = 1080
                });

                await AutoScrollAsync(page);

                await Task.Delay(15000);
            }
            finally
            {
                await browser.CloseAsync();
            }

            return m3u8Urls;
        }

        private static async Task AutoScrollAsync(IPage page)
        {
            await page.EvaluateFunctionAsync(@"async () => {
                await new Promise((resolve) => {
                    var totalHeight = 0;
                    var distance = 100;
                    var timer = setInterval(() => {
                        var scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= scrollHeight - window.innerHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            }");
        }
    }
}
