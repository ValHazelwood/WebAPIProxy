using HDRezka.Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController(PuppeteerM3U8Service puppeteerM3U8Service, SeasonEpisodeSelectorService seasonEpisodeSelectorService) : ControllerBase
    {
        private readonly PuppeteerM3U8Service _puppeteerM3U8Service = puppeteerM3U8Service;
        private readonly SeasonEpisodeSelectorService _seasonEpisodeSelectorService = seasonEpisodeSelectorService;

        [HttpPost]
        public async Task<Media> Post([FromBody] string url)
        {
            if (string.IsNullOrEmpty(url)) return null;

            var result = (await _puppeteerM3U8Service.FindM3U8UrlsAsync(url)).ToList();

            var playUrl = result.FirstOrDefault(x => x.EndsWith("kinogo.bi"));

            var m3u8Urls = result.Where(x => x.EndsWith(".m3u8")).ToList();

            if (url.Contains("serialy"))
            {
                var (selectedSeason, selectedEpisode, lastM3u8Url) = await _seasonEpisodeSelectorService.GetCurrentSelectionAsync(playUrl);

                if (!string.IsNullOrEmpty(selectedSeason) && !string.IsNullOrEmpty(selectedEpisode))
                {
                    return new Media
                    {
                        Id = 1,
                        Type = MediaType.Series,
                        CurrentTranslationId = 0,
                        CurrentSeason = GetNumber(selectedSeason),
                        CurrentEpisode = GetNumber(selectedEpisode),
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
                                        URL2 = m3u8Urls[1]
                                    }
                                ]
                            }
                        ]
                    };
                }
            }

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
                                URL2 = m3u8Urls[1]
                            }
                        ]
                    }
                ]
            };
        }

        private static int? GetNumber(string text)
        {
            var match = Regex.Match(text, @"\d+");

            if (match.Success)
            {
                return int.Parse(match.Value);
            }

            return null;
        }
    }
}