using PuppeteerSharp;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HDRezka.Helpers
{
    public class PuppeteerM3U8Service(PuppeteerBrowserService browserService)
    {
        public async Task<IEnumerable<string>> FindM3U8UrlsAsync(string targetUrl)
        {
            if (string.IsNullOrEmpty(targetUrl))
            {
                throw new ArgumentException("Target URL is required.", nameof(targetUrl));
            }

            await using var page = await browserService.NewPageAsync();

            var m3u8Urls = new List<string>();

            page.Response += (sender, e) =>
            {
                var url = e.Response.Url;
                if (url.EndsWith(".m3u8") || url.EndsWith("kinogo.bi"))
                {
                    m3u8Urls.Add(url);
                }
            };

            await page.GoToAsync(targetUrl, WaitUntilNavigation.Networkidle2);

            await page.SetViewportAsync(new ViewPortOptions
            {
                Width = 1980,
                Height = 1080
            });

            await AutoScrollAsync(page);

            await Task.Delay(15000);

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
