using HDRezka.Helpers;
using HDRezka.Types;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeriesController(IHttpClientFactory clientFactory) : ControllerBase
    {
        private readonly RezkaFetch _rezkaFetch = new(clientFactory);

        [HttpPost]
        public async Task<IEnumerable<CDNStream>> Post(CDNSeriesRequest request)
        {
            var response = await _rezkaFetch.GetCDNSeries(request);

            return RezkaParser.GetCDNStreams(response);
        }
    }
}