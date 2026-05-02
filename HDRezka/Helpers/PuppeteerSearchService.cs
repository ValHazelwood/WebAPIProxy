using PuppeteerSharp;
using PuppeteerSharp.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HDRezka.Helpers
{
    public class PuppeteerSearchService(PuppeteerBrowserService browserService)
    {
        private const string DefaultUrl = "https://hdrezka.inc";
        private const string SearchInputSelector = "input.js-lightsearch-input.lightsearch-input";
        private const string ResultsSelector = ".lSerachResults.d-flex .sliderItem";

        public async Task<IEnumerable<SearchResult>> SearchAsync(string searchPhrase, string targetUrl = null)
        {
            if (string.IsNullOrEmpty(searchPhrase))
            {
                throw new ArgumentException("Search phrase is required.", nameof(searchPhrase));
            }

            await using var page = await browserService.NewPageAsync();

            var url = targetUrl ?? DefaultUrl;
            await page.GoToAsync(url, WaitUntilNavigation.Networkidle2);

            await page.WaitForSelectorAsync(SearchInputSelector, new WaitForSelectorOptions { Timeout = 10000 });

            await page.ClickAsync(SearchInputSelector, new ClickOptions { Count = 3 });
            await page.Keyboard.PressAsync("Backspace");

            await page.TypeAsync(SearchInputSelector, searchPhrase, new TypeOptions { Delay = 400 });

            await page.WaitForNetworkIdleAsync();

            try
            {
                await page.WaitForSelectorAsync(ResultsSelector, new WaitForSelectorOptions { Timeout = 5000 });
            }
            catch
            {
                return [];
            }

            var results = await page.EvaluateFunctionAsync<SearchResult[]>(@"
                    () => {
                        const items = document.querySelectorAll('.sliderItem');
                        return Array.from(items).map((item) => {
                            const linkElement = item.querySelector('.slide.postItem-title a');
                            let url = linkElement ? linkElement.getAttribute('href') : null;

                            if (!url) {
                                const coverDiv = item.querySelector('.postItem-cover');
                                url = coverDiv ? coverDiv.getAttribute('data-link') : null;
                            }

                            const nameElement = item.querySelector('.sliderTitle');
                            const name = nameElement ? nameElement.innerText.trim() : '';

                            const descElement = item.querySelector('.sliderMisc');
                            const text = descElement ? descElement.innerText.trim() : '';

                            return { url, name, text };
                        });
                    }
                ");

            foreach (SearchResult result in results)
            {
                result.URL = DefaultUrl + result.URL;
            }

            return results.Skip(16);
        }
    }
}
