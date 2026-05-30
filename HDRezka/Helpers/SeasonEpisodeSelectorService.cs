using PuppeteerSharp;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HDRezka.Helpers
{
    public class SeasonEpisodeSelectorService(PuppeteerBrowserService browserService) : IDisposable
    {
        private readonly PuppeteerBrowserService _browserService = browserService ?? throw new ArgumentNullException(nameof(browserService));
        private bool _disposed;

        public async Task<(bool success, string lastM3u8Url)> SelectSeasonAndEpisodeAsync(string url, int season, int episode)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("URL cannot be null or empty", nameof(url));

            await using var page = await _browserService.NewPageAsync();
            var m3u8Urls = new List<string>();
            await SetupPageEvents(page, m3u8Urls);

            await page.GoToAsync(url, WaitUntilNavigation.Networkidle0);
            await page.WaitForSelectorAsync("hdvbplayer", new WaitForSelectorOptions { Timeout = 10000 });

            // Select season
            const string seasonText = "Сезон {0}";
            var seasonHandle = await page.EvaluateFunctionHandleAsync(
                @"(text) => {
                    const elements = Array.from(document.querySelectorAll('*'));
                    return elements.find(el => el.textContent.trim() === text);
                }",
                string.Format(seasonText, season));
            var seasonElement = seasonHandle as ElementHandle;

            if (seasonElement != null)
            {
                var text = await seasonElement.EvaluateFunctionAsync<string>("el => el.textContent");
                Console.WriteLine(text);
                await seasonElement.ClickAsync();
                await Task.Delay(1500);
            }
            else
            {
                throw new Exception($"Season element not found: \"{string.Format(seasonText, season)}\"");
            }

            // Select episode
            const string episodeText = "{0} серия";
            var episodeHandle = await page.EvaluateFunctionHandleAsync(
                @"(text) => {
                    const elements = Array.from(document.querySelectorAll('*'));
                    return elements.find(el => el.textContent.trim() === text);
                }",
                string.Format(episodeText, episode));
            var episodeElement = episodeHandle as ElementHandle;

            if (episodeElement != null)
            {
                var text = await episodeElement.EvaluateFunctionAsync<string>("el => el.textContent");
                Console.WriteLine(text);
                await episodeElement.ClickAsync();
                await Task.Delay(1500);
            }
            else
            {
                throw new Exception($"Episode element not found: \"{string.Format(episodeText, episode)}\"");
            }

            Console.WriteLine($"Successfully selected Season {season}, Episode {episode}");
            string lastM3u8Url = m3u8Urls.Count > 0 ? m3u8Urls[m3u8Urls.Count - 1] : null;
            Console.WriteLine($"Last M3U8 URL: {lastM3u8Url}");

            return (true, lastM3u8Url);
        }

        public async Task<(string selectedSeason, string selectedEpisode, string lastM3u8Url)> GetCurrentSelectionAsync(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("URL cannot be null or empty", nameof(url));

            await using var page = await _browserService.NewPageAsync();
            var m3u8Urls = new List<string>();
            await SetupPageEvents(page, m3u8Urls);

            await page.GoToAsync(url, WaitUntilNavigation.Networkidle0);
            await page.WaitForSelectorAsync("hdvbplayer", new WaitForSelectorOptions { Timeout = 10000 });

            await Task.Delay(2000); // Wait for M3U8 URLs to be captured

            var result = await page.EvaluateFunctionAsync<dynamic>(@"
                return {
                    selectedSeason: (() => {
                        const elements = Array.from(document.querySelectorAll('hdvbplayer *'));
                        for (const el of elements) {
                            const text = el.textContent.trim();
                            const computedStyle = window.getComputedStyle(el);
                            if (text.startsWith('Сезон ') && computedStyle.backgroundColor === 'rgb(0, 173, 239)') {
                                return text;
                            }
                        }
                        return null;
                    })(),
                    selectedEpisode: (() => {
                        const elements = Array.from(document.querySelectorAll('hdvbplayer *'));
                        for (const el of elements) {
                            const text = el.textContent.trim();
                            const computedStyle = window.getComputedStyle(el);
                            if (text.match(/^\d+ серия/) && computedStyle.backgroundColor === 'rgb(0, 173, 239)') {
                                return text;
                            }
                        }
                        return null;
                    })()
                };
            ");

            string selectedSeason = result?.selectedSeason;
            string selectedEpisode = result?.selectedEpisode;
            string lastM3u8Url = m3u8Urls.Count > 0 ? m3u8Urls[m3u8Urls.Count - 1] : null;

            Console.WriteLine($"Selected Season: {selectedSeason}");
            Console.WriteLine($"Selected Episode: {selectedEpisode}");
            Console.WriteLine($"Last M3U8 URL: {lastM3u8Url}");

            return (selectedSeason, selectedEpisode, lastM3u8Url);
        }

        private static async Task SetupPageEvents(IPage page, List<string> m3u8Urls)
        {
            await page.SetRequestInterceptionAsync(true);
            page.Request += (sender, e) => e.Request.ContinueAsync();
            page.Response += (sender, e) =>
            {
                var response = e.Response;
                if (response != null && response.Url.EndsWith(".m3u8", StringComparison.OrdinalIgnoreCase))
                {
                    lock (m3u8Urls)
                    {
                        m3u8Urls.Add(response.Url);
                    }
                }
            };
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            _disposed = true;
            // Note: We do not dispose the browserService here as it is likely shared and managed elsewhere.
            // The PuppeteerBrowserService is designed to be a singleton/reused service.
        }
    }
}