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
    public class RezkaFetch
    {
        const string SEARCH_URL = @"https://rezka.ag/engine/ajax/search.php";
        const string CDN_SERIES_URL = @"https://rezka.ag/ajax/get_cdn_series/?t=";

        private readonly IHttpClientFactory _clientFactory;

        public RezkaFetch(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HtmlDocument> GetMediaHtmlDocument(string url)
        {
            var uri = new Uri(url);

            var httpClient = _clientFactory.CreateClient("rezka");

            var response = await httpClient.GetAsync(uri);

            var resultString = await response.Content.ReadAsStringAsync();

            var htmlDoc = new HtmlDocument();

            htmlDoc.LoadHtml(resultString);

            return htmlDoc;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public async Task<string> GetSearchHtml(string text)
        {
            var uri = new Uri(SEARCH_URL);

            var httpClient = _clientFactory.CreateClient("rezka");

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
        public async Task<string> GetCDNSeries(MediaRequest request)
        {
            var timestamp = (int)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

            var uri = new Uri(CDN_SERIES_URL + timestamp);

            var httpClient = _clientFactory.CreateClient("rezka");

            var content = GetHttpContent(request);

            var response = await httpClient.PostAsync(uri, content);

            var result = await response.Content.ReadAsStringAsync();

            return result;
        }

        private static HttpContent GetHttpContent(MediaRequest request)
        {
            string actionType = SeriesActionType.GetEpisodes;

            var fields = new List<KeyValuePair<string, string>>()
            {
                    new KeyValuePair<string, string>("id", request.Id.ToString()),
                    new KeyValuePair<string, string>("translator_id", request.TranslationId.ToString()),
                    new KeyValuePair<string, string>("favs", request.FavsId)
            };

            if (request is CDNSeriesRequest seriesRequest)
            {
                actionType = SeriesActionType.GetStream;

                var extraFields = new List<KeyValuePair<string, string>>()
                {
                    new KeyValuePair<string, string>("season", seriesRequest.Season.ToString()),
                    new KeyValuePair<string, string>("episode", seriesRequest.Episode.ToString())
                };

                fields.AddRange(extraFields);
            }

            if (request is MovieRequest movieRequest)
            {
                actionType = SeriesActionType.GetMovie;

                var extraFields = new List<KeyValuePair<string, string>>()
                {
                    new KeyValuePair<string, string>("is_camrip", movieRequest.IsCamRip.ToString()),
                    new KeyValuePair<string, string>("is_ads", movieRequest.IsAds.ToString()),
                    new KeyValuePair<string, string>("is_director", movieRequest.IsDirector.ToString())
                };

                fields.AddRange(extraFields);
            }

            fields.Add(new KeyValuePair<string, string>("action", actionType));

            var content = new FormUrlEncodedContent(fields);

            return content;
        }
    }
}
