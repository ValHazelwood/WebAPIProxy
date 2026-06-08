using HDRezka.Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController(PuppeteerM3U8Service puppeteerM3U8Service) : ControllerBase
    {
        private readonly PuppeteerM3U8Service _puppeteerM3U8Service = puppeteerM3U8Service;

        [HttpPost]
        public async Task<Media> Post([FromBody] string url)
        {
            if (string.IsNullOrEmpty(url)) return null;

            var result = (await _puppeteerM3U8Service.FindM3U8UrlsAsync(url)).ToList();

            var m3u8Urls = result.Where(x => x.EndsWith(".m3u8")).ToList();

            return new Media
            {
                Id = 1,
                Type = MediaType.Movies,
                CurrentTranslationId = 0,
                Translations =
                [
                    new Translation {
                        Id = 0,
                        Name = "Default",
                        CDNStreams =
                        [
                            new() {
                                Quality = "480p",
                                URL1 = m3u8Urls[0],
                                URL2 = m3u8Urls.Count > 1 ? m3u8Urls[1] : m3u8Urls[0]
                            }
                        ]
                    }
                ]
            };
        }
    }
}