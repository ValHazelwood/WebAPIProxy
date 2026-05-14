using PuppeteerSharp;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace HDRezka.Helpers
{
    public class PuppeteerBrowserService : IDisposable
    {
        private readonly string _chromePath;
        private static readonly object _lock = new();
        private static IBrowser _browser;
        private static bool _disposed;

        public PuppeteerBrowserService(IConfiguration configuration)
        {
            _chromePath = configuration["ChromePath"] ?? "/usr/bin/chromium-browser";
        }

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
                                ExecutablePath = _chromePath,
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
