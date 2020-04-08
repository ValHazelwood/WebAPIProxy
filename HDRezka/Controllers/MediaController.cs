using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using HtmlAgilityPack;
using HDRezka.Helpers;
using System.Threading.Tasks;
using System.Net.Http;

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
        public async Task<Media> Post([FromBody]string url)
        {
            if (string.IsNullOrEmpty(url)) return null;

            var htmlDocument = await _rezkaFetch.GetMediaHtmlDocument(url);

            var jsText = RezkaParser.GetCDNScriptText(htmlDocument);

            return RezkaParser.GetMediaFromJS(jsText);
        }
    }
}