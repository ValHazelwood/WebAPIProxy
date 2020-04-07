using System.Collections.Generic;
using System.Threading.Tasks;
using HDRezka.Helpers;
using HDRezka.Types;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeriesController : ControllerBase
    {
        private readonly ILogger<SeriesController> _logger;

        public SeriesController(ILogger<SeriesController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IEnumerable<CDNStream>> Post(CDNSeriesRequest request)
        {
            var response = await RezkaFetch.GetCDNSeries(request);

            return RezkaParser.GetCDNStreams(response);
        }

    }
}