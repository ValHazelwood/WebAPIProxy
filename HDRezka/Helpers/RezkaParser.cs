using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Newtonsoft.Json.Linq;

namespace HDRezka.Helpers
{
    public static class RezkaParser
    {
        const string MOVIE_SCRIPT_SEARCH_PATTERN = "//script[contains(., 'initCDNMoviesEvents')]";

        const string SERIES_SCRIPT_SEARCH_PATTERN = "//script[contains(., 'initCDNSeriesEvents')]";

        const string URLS_REGEXP = @"^\[(\d+p.*)\](https:.+)\s+or\s+(https:.+)$";

        const string ID_REGEXP = @"^.+initCDN(Series|Movies)Events\((\d+),\s(\d+),.+$";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="jsText"></param>
        /// <returns></returns>
        public static Media GetMediaFromJS(string jsText)
        {
            var idRegExp = new Regex(ID_REGEXP);

            var media = GetMedia(jsText, idRegExp);

            var cdnUrlsArray = GetCDNUrlsText(jsText);

            var streams = new List<CDNStream>();

            var urlRegExp = new Regex(URLS_REGEXP);

            foreach (var cdnUrl in cdnUrlsArray)
            {
                CDNStream stream = GetCDNStream(urlRegExp, cdnUrl);

                streams.Add(stream);
            }

            media.Translations[0].CDNStreams = streams.ToArray();

            return media;
        }
                
        /// <summary>
        /// 
        /// </summary>
        /// <param name="htmlText"></param>
        /// <returns></returns>
        public static SearchResult[] GetSearchResult(string htmlText)
        {
            var result = new List<SearchResult>();

            var htmlDoc = new HtmlDocument();

            htmlDoc.LoadHtml(htmlText);

            var nodes = htmlDoc.DocumentNode.SelectNodes("//ul/li/a");

            foreach (var node in nodes)
            {
                var url = node.Attributes.Single(x => x.Name == "href").Value;

                var name = node.ChildNodes.First(x => x.Name == "span").InnerText;

                var text = node.ChildNodes.First(x => x.Name == "#text").InnerText;

                var rating = node.ChildNodes.Last(x => x.Name == "span").InnerText;

                result.Add(new SearchResult { Name = name, Text = text, Rating = rating, URL = url });
            }

            return result.ToArray();
        }
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="htmlDoc"></param>
        /// <returns></returns>
        public static string GetCDNScriptText(HtmlDocument htmlDoc)
        {
            var node = htmlDoc.DocumentNode.SelectSingleNode(MOVIE_SCRIPT_SEARCH_PATTERN);

            if (node == null)
            {
                node = htmlDoc.DocumentNode.SelectSingleNode(SERIES_SCRIPT_SEARCH_PATTERN);
            }

            return node.InnerText;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="jsText"></param>
        /// <returns></returns>
        public static CDNStream[] GetCDNStreams(string jsText)
        {
            var jObject = JObject.Parse(jsText);

            var cdnUrlsArray = jObject["url"].ToString().Split(',');

            var streams = new List<CDNStream>();

            var urlRegExp = new Regex(URLS_REGEXP);

            foreach (var cdnUrl in cdnUrlsArray)
            {
                CDNStream stream = GetCDNStream(urlRegExp, cdnUrl);

                streams.Add(stream);
            }

            return streams.ToArray();
        }

        private static Media GetMedia(string jsText, Regex idRegExp)
        {
            var idMatches = idRegExp.Match(jsText);

            var translationId = Convert.ToInt32(idMatches.Groups[3].Value);

            var id = Convert.ToInt32(idMatches.Groups[2].Value);

            var mediaType = ParseEnum<MediaType>(idMatches.Groups[1].Value);

            var media = new Media
            {
                Id = id,

                CurrentTranslationId = translationId,

                Type = mediaType,

                Translations = new[] {
                    new Translation {
                        TranslationId = translationId
                    }
                }
            };

            if (mediaType == MediaType.Series)
            {
                media.Season = 1;

                media.Episode = 1;
            }

            return media;
        }
        private static CDNStream GetCDNStream(Regex urlRegExp, string cdnUrl)
        {
            var matches = urlRegExp.Matches(Regex.Unescape(cdnUrl));

            var stream = new CDNStream
            {
                Quality = matches[0].Groups[1].Value,

                URL1 = matches[0].Groups[2].Value,

                URL2 = matches[0].Groups[3].Value
            };
            return stream;
        }
        private static string[] GetCDNUrlsText(string jsText)
        {
            const string START_TEXT = "streams";
            const string END_TEXT = "default_quality";

            var startIndex = jsText.IndexOf(START_TEXT) + START_TEXT.Length + 3;

            var endIndex = jsText.IndexOf(END_TEXT) - 3;

            var cdnUrls = jsText[startIndex..endIndex];

            var cdnUrlsArray = cdnUrls.Split(',');

            return cdnUrlsArray;
        }
        private static T ParseEnum<T>(string value)
        {
            return (T)Enum.Parse(typeof(T), value, true);
        }
    }
}
