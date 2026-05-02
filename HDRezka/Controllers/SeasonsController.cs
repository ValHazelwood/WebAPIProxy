using HDRezka.Helpers;
using HDRezka.Types;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeasonsController(IHttpClientFactory clientFactory) : ControllerBase
    {
        private readonly RezkaFetch _rezkaFetch = new(clientFactory);

        [HttpPost]
        public async Task<SeasonsData> Post(MediaRequest request)
        {
            var response = await _rezkaFetch.GetCDNSeries(request);

            return RezkaParser.GetSeasons(response);
        }

    }
}