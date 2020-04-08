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
            var media = GetMedia(jsText);

            media.Translations[0].CDNStreams = GetCDNUrlsText(jsText).Select(x => GetCDNStream(x)).ToArray();

            return media;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="htmlText"></param>
        /// <returns></returns>
        public static SearchResult[] GetSearchResult(string htmlText)
        {
            var htmlDoc = new HtmlDocument();

            htmlDoc.LoadHtml(htmlText);

            return htmlDoc.DocumentNode.SelectNodes("//ul/li/a")
                .Select(x => new SearchResult
                {
                    Name = x.ChildNodes.First(x => x.Name == "span").InnerText,
                    Text = x.ChildNodes.First(x => x.Name == "#text").InnerText,
                    Rating = x.ChildNodes.Last(x => x.Name == "span").InnerText,
                    URL = x.Attributes.Single(x => x.Name == "href").Value

                }).ToArray();

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

            return jObject["url"].ToString().Split(',').Select(x => GetCDNStream(x)).ToArray();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="htmlDoc"></param>
        /// <returns></returns>
        public static Translation[] GetTranslations(HtmlDocument htmlDoc)
        {
            var translatorsBlock = htmlDoc.DocumentNode.SelectSingleNode("//div[contains(@class, 'b-translators__block')]");

            if (translatorsBlock != null && translatorsBlock.ChildNodes.Count > 0)
            {
                var translatorsList = translatorsBlock.SelectNodes("ul/li");

                return translatorsList
                .Select(x => new Translation
                {
                    Id = Convert.ToInt32(x.Attributes.Single(x => x.Name == "data-translator_id").Value),
                    Name = x.InnerText,
                    CDNStreams = GetCDNStreamsFromDataAttribute(x)

                }).ToArray();
            }
            else
            {
                return new Translation[0];
            }
        }

        private static CDNStream[] GetCDNStreamsFromDataAttribute(HtmlNode htmlNode)
        {
            var dataAttribute = htmlNode.Attributes.SingleOrDefault(k => k.Name == "data-cdn_url");

            if (dataAttribute == null)
            {
                return new CDNStream[0];
            }

            return dataAttribute.Value.Split(",").Select(t => GetCDNStream(t)).ToArray();
        }

        private static Media GetMedia(string jsText)
        {
            var idRegExp = new Regex(ID_REGEXP);

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
                        Id = translationId,
                        Name = "Default"
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
        private static CDNStream GetCDNStream(string cdnUrl)
        {
            var urlRegExp = new Regex(URLS_REGEXP);

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
