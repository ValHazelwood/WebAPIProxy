using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using HDRezka.Types;
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

        const string EPISODE_SERIES_REGEXP = @"^.+initCDNSeriesEvents\(\d+,\s\d+,\s(\d+),\s(\d+),.+$";

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

            return DecodeCDNStreams(jObject["url"].ToString()).Split(',').Select(x => GetCDNStream(x)).ToArray();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="jsText"></param>
        /// <returns></returns>
        public static SeasonsData GetSeasons(string jsText)
        {
            var jObject = JObject.Parse(jsText);

            var htmlEpisodes = jObject["episodes"].ToString();

            var htmlEpisodesDoc = new HtmlDocument();

            htmlEpisodesDoc.LoadHtml(htmlEpisodes);

            var episodesList = htmlEpisodesDoc.DocumentNode.SelectNodes("//ul/li");

            var seasons = new Dictionary<int, List<int>>();

            var seasonsData = new SeasonsData();

            foreach (var item in episodesList)
            {
                var seasonId = Convert.ToInt32(item.Attributes.Single(x => x.Name == "data-season_id").Value);

                var episodeId = Convert.ToInt32(item.Attributes.Single(x => x.Name == "data-episode_id").Value);

                var cdnUrl = item.Attributes.Single(x => x.Name == "data-cdn_url").Value;

                if (!string.IsNullOrEmpty(cdnUrl) && cdnUrl != "null")
                {
                    seasonsData.CDNStreams = GetCDNStreamsFromDataAttribute(item);

                    seasonsData.CurrentSeason = seasonId;

                    seasonsData.CurrentEpisode = episodeId;
                }

                if (!seasons.ContainsKey(seasonId))
                {
                    seasons.Add(seasonId, new List<int>() { episodeId } );
                }
                else
                {
                    seasons[seasonId].Add(episodeId);
                }
            }

            seasonsData.Seasons = seasons.Select(x => new Season { Id = x.Key, Episodes = x.Value.ToArray() }).ToArray();
            
            return seasonsData;
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
                var episodeSeriesRegex = new Regex(EPISODE_SERIES_REGEXP);

                var episodeSeriesMatchs = episodeSeriesRegex.Match(jsText);

                media.CurrentSeason = Convert.ToInt32(episodeSeriesMatchs.Groups[1].Value);

                media.CurrentEpisode = Convert.ToInt32(episodeSeriesMatchs.Groups[2].Value);
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

            var cdnUrlsArray = DecodeCDNStreams(cdnUrls).Split(',');

            return cdnUrlsArray;
        }
        private static T ParseEnum<T>(string value)
        {
            return (T)Enum.Parse(typeof(T), value, true);
        }

        private static string DecodeCDNStreams(string encodedStr)
        {
            const string bk0 = @"$$#!!@#!@##";
            const string bk1 = @"^^^!@##!!##";
            const string bk2 = @"####^!!##!@@";
            const string bk3 = @"@@@@@!##!^^^";
            const string bk4 = @"$$!!@$$@^!@#$$@";
            const string file3Separator = @"//_//";

            var bkArray = new string[] { bk0, bk1, bk2, bk3, bk4 };

            var result = Regex.Unescape(encodedStr[2..]);

            for (var i = 4; i > -1; i--)
            {
                result = result.Replace(file3Separator + (bkArray[i]).EncodeBase64(), "");
            }

            result = result.DecodeBase64();           

            return result;
        }
    }

    public static class ExtensionMethods
    {
        public static string EncodeBase64(this string value)
        {
            var valueBytes = Encoding.UTF8.GetBytes(value);
            return Convert.ToBase64String(valueBytes);
        }

        public static string DecodeBase64(this string value)
        {
            var valueBytes = System.Convert.FromBase64String(value);
            return Encoding.UTF8.GetString(valueBytes);
        }
    }
}
