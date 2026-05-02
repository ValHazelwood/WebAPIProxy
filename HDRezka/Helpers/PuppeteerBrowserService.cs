using PuppeteerSharp;
using System;
using System.Threading.Tasks;

namespace HDRezka.Helpers
{
    public class PuppeteerBrowserService : IDisposable
    {
        private const string ChromePath = "/usr/bin/chromium-browser"; //@"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe";
        private static readonly object _lock = new();
        private static IBrowser _browser;
        private static bool _disposed;

        public async Task<IPage> NewPageAsync()
        {
            if (!_disposed)
            {
                if (_browser == null || !_browser.IsConnected)
                {
                    lock (_lock)
                    {
                        if (_browser == null || !_browser.IsConnected)
                        {
                            var launchTask = Puppeteer.LaunchAsync(new LaunchOptions
                            {
                                Headless = true,
                                ExecutablePath = ChromePath,
                                Args = ["--no-sandbox", "--disable-setuid-sandbox"]
                            });

                            launchTask.Wait();
                            _browser = launchTask.Result;
                        }
                    }
                }

                return await _browser.NewPageAsync();
            }

            throw new ObjectDisposedException(nameof(PuppeteerBrowserService));
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            _disposed = true;

            lock (_lock)
            {
                if (_browser != null && _browser.IsConnected)
                {
                    _browser.CloseAsync().Wait();
                    _browser = null;
                }
            }
        }
    }
}
