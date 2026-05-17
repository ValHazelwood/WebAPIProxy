using HDRezka.Helpers;
using HDRezka.Types;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController(PuppeteerM3U8Service puppeteerM3U8Service) : ControllerBase
    {
        private readonly PuppeteerM3U8Service _puppeteerM3U8Service = puppeteerM3U8Service;

        [HttpPost]
        public async Task<IEnumerable<CDNStream>> Post(MovieRequest request)
        {
            var result = (await _puppeteerM3U8Service.FindM3U8UrlsAsync(request.Url)).ToList();

            return [
                    new()
                    {
                        Quality = "480p",
                        URL1 = result[0],
                        URL2 = result[1]
                    }
            ];
        }
    }
}