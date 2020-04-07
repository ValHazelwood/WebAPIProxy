using HDRezka.Types;
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
        const string CDN_SERIES_URL = @"https://rezka.ag/ajax/get_cdn_series/?t=";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static async Task<HtmlDocument> GetMediaHtmlDocument(string url)
        {
            HtmlWeb web = new HtmlWeb();

            var htmlDoc = await web.LoadFromWebAsync(url);

            return htmlDoc;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static async Task<string> GetCDNSeries(CDNSeriesRequest request)
        {
            var timestamp = (int)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

            var uri = new Uri(CDN_SERIES_URL + timestamp);

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
            httpClient.DefaultRequestHeaders.Add("Accept", "application/json, text/javascript, */*; q=0.01");
                        
            HttpContent content = new FormUrlEncodedContent(new[]
            {
                    new KeyValuePair<string, string>("id", request.Id.ToString()),
                    new KeyValuePair<string, string>("translator_id", request.TranslationId.ToString()),
                    new KeyValuePair<string, string>("season", request.Season.ToString()),
                    new KeyValuePair<string, string>("episode", request.Episode.ToString()),
                    new KeyValuePair<string, string>("action", "get_stream")
            });

            var response = await httpClient.PostAsync(uri, content);

            var result = await response.Content.ReadAsStringAsync();

            return result;
        }

    }
}
