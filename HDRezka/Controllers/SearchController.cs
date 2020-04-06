using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;
using HDRezka.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace HDRezka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ILogger<SearchController> _logger;
        
        public SearchController(ILogger<SearchController> logger)
        {
            _logger = logger;                      
        }

        [HttpGet]
        public async Task<IEnumerable<SearchResult>> Get(string q)
        {
            if (string.IsNullOrEmpty(q)) return null;

            var htmlText =  await RezkaFetch.GetSearchHtml(q);

            return RezkaParser.GetSearchResult(htmlText);
        }
    }
}