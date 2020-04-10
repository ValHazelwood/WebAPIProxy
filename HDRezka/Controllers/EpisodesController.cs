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
    public class EpisodesController : ControllerBase
    {
        private readonly ILogger<EpisodesController> _logger;
        private readonly RezkaFetch _rezkaFetch;

        public EpisodesController(ILogger<EpisodesController> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _rezkaFetch = new RezkaFetch(clientFactory);
        }

        [HttpPost]
        public async Task<IEnumerable<Season>> Post(EpisodesRequest request)
        {
            var response = await _rezkaFetch.GetCDNSeries(request);

            return RezkaParser.GetSeasons(response);
        }

    }
}