using HDRezka.Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly PuppeteerSearchService _puppeteerSearchService;

        public SearchController(PuppeteerSearchService puppeteerSearchService)
        {
            _puppeteerSearchService = puppeteerSearchService;
        }

        [HttpPost]
        public async Task<IEnumerable<SearchResult>> Post([FromBody] string q)
        {
            if (string.IsNullOrEmpty(q)) return null;

            return await _puppeteerSearchService.SearchAsync(q);
        }
    }
}