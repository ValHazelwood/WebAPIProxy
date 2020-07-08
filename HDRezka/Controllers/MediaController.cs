using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using HtmlAgilityPack;
using HDRezka.Helpers;
using System.Threading.Tasks;
using System.Net.Http;
using System.Linq;
using HDRezka.Types;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly ILogger<MediaController> _logger;
        private readonly RezkaFetch _rezkaFetch;

        public MediaController(ILogger<MediaController> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _rezkaFetch = new RezkaFetch(clientFactory);
        }

        [HttpPost]
        public async Task<Media> Post([FromBody] string url)
        {
            if (string.IsNullOrEmpty(url)) return null;

            var htmlDocument = await _rezkaFetch.GetMediaHtmlDocument(url);

            var jsText = RezkaParser.GetCDNScriptText(htmlDocument);

            var media = RezkaParser.GetMediaFromJS(jsText);

            var translations = RezkaParser.GetTranslations(htmlDocument);

            media.Translations = media.Translations.Union(translations.Where(x => x.Id != media.CurrentTranslationId)).ToArray();

            var defaultTranslation = translations.SingleOrDefault(x => x.Id == media.CurrentTranslationId);

            if (defaultTranslation != null)
            {
                media.Translations[0].Name = defaultTranslation.Name;
            }

            if (media.Type == MediaType.Series)
            {
                var seriesJsText = await _rezkaFetch.GetCDNSeries(new MediaRequest { Id = media.Id, TranslationId = media.CurrentTranslationId });

                media.Translations[0].Seasons = RezkaParser.GetSeasons(seriesJsText).Seasons;
            }

            return media;
        }
    }
}