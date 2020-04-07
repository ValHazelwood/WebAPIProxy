using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using HtmlAgilityPack;
using HDRezka.Helpers;
using System.Threading.Tasks;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly ILogger<MediaController> _logger;

        public MediaController(ILogger<MediaController> logger)
        {
            _logger = logger;
        }
                
        [HttpGet]
        public async Task<Media> Get(string url)
        {
            if (string.IsNullOrEmpty(url)) return null;

            var htmlDocument = await RezkaFetch.GetMediaHtmlDocument(url);

            var jsText = RezkaParser.GetCDNScriptText(htmlDocument);

            return RezkaParser.GetMediaFromJS(jsText);
        }
    }
}