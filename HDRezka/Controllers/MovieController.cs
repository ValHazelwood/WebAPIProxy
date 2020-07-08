using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using HDRezka.Helpers;
using HDRezka.Types;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly ILogger<MovieController> _logger;
        private readonly RezkaFetch _rezkaFetch;

        public MovieController(ILogger<MovieController> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _rezkaFetch = new RezkaFetch(clientFactory);
        }

        [HttpPost]
        public async Task<IEnumerable<CDNStream>> Post(MovieRequest request)
        {
            var response = await _rezkaFetch.GetCDNSeries(request);

            return RezkaParser.GetCDNStreams(response);
        }

    }
}