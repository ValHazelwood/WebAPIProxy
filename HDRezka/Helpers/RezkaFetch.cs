using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace HDRezka.Helpers
{
    public static class RezkaFetch
    {
        const string SEARCH_URL = @"https://rezka.ag/engine/ajax/search.php";

        const string MOVIE_SCRIPT_SEARCH_PATTERN = "//script[contains(., 'initCDNMoviesEvents')]";

        const string SERIES_SCRIPT_SEARCH_PATTERN = "//script[contains(., 'initCDNSeriesEvents')]";

        public static async Task<string> GetCDNScript(string url)
        {
            HtmlWeb web = new HtmlWeb();

            var htmlDoc = await web.LoadFromWebAsync(url);

            var node = htmlDoc.DocumentNode.SelectSingleNode(MOVIE_SCRIPT_SEARCH_PATTERN);

            if (node == null)
            {
                node = htmlDoc.DocumentNode.SelectSingleNode(SERIES_SCRIPT_SEARCH_PATTERN);
            }

            return node.InnerText;
        }

        public static async Task<string> GetSearchHtml(string text)
        {
            var uri = new Uri(SEARCH_URL);

            var handler = new HttpClientHandler
            {
                AutomaticDecompression = DecompressionMethods.GZip
                                     | DecompressionMethods.Deflate
            };

            using var httpClient = new HttpClient(handler) { BaseAddress = new Uri(uri.GetLeftPart(UriPartial.Authority)) };

            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
            httpClient.DefaultRequestHeaders.Add("X-Requested-With", "XMLHttpRequest");
            httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:33.0) Gecko/20100101 Firefox/33.0");
            httpClient.DefaultRequestHeaders.Add("Referer", uri.GetLeftPart(UriPartial.Authority));
            httpClient.DefaultRequestHeaders.Add("Pragma", "no-cache");
            httpClient.DefaultRequestHeaders.Add("Connection", "keep-alive");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8");
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept", "text/html, */*; q=0.01");

            HttpContent content = new FormUrlEncodedContent(new[]
            {
                    new KeyValuePair<string, string>("q", text)
            });

            var response = await httpClient.PostAsync(uri, content);

            var result = await response.Content.ReadAsStringAsync();

            return result;
        }

    }
}
