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
    public class SeasonsController : ControllerBase
    {
        private readonly ILogger<SeasonsController> _logger;
        private readonly RezkaFetch _rezkaFetch;

        public SeasonsController(ILogger<SeasonsController> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _rezkaFetch = new RezkaFetch(clientFactory);
        }

        [HttpPost]
        public async Task<SeasonsData> Post(MediaRequest request)
        {
            var response = await _rezkaFetch.GetCDNSeries(request);

            return RezkaParser.GetSeasons(response);
        }

    }
}