using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using HtmlAgilityPack;

namespace HDRezka.Helpers
{
    public static class RezkaParser
    {
        /// <summary>
        /// Node content:  
        /// $(function () { sof.tv.initCDNMoviesEvents(33703, 0, 'rezka.ag', false, {"id":"cdnplayer","streams":"[360p]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/240.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/b3e04764bde7b7657dc7e1bcf353f2da:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/240.mp4,[480p]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/360.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/d79d1496cc57d2000fbf00b7f993736d:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/360.mp4,[720p]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/480.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/313e7aea979f7fe9e7830f87c526364a:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/480.mp4,[1080p]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/720.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/f02335870d7abea63ebb1a3a9c0f211a:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/720.mp4,[1080p Ultra]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/1080.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/8599895da0e7d16c7802f46e13a5ee28:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/1080.mp4","default_quality":"480p","hlsconfig":{"maxBufferLength":180,"maxMaxBufferLength":600,"maxBufferSize":33554432000},"geo_ip":"104.42.145.67","geo_iso":"us","preroll":"https:\/\/franecki.net\/assets\/vendor\/3736f6ea7b7e115cbb4f5c2ea8f5f2df.xml?v=3.0 and https:\/\/franecki.net\/assets\/vendor\/49ae0420d7a42849fd13a5e3ae4fc009.xml?v=3.0"}); }); $(function () { sof.tv.initWatchingEvents(33703); }); (function () { $(function () { var comment_id = 0, match = window.location.hash.match(/comment(\d+)/i), ws_usage = 5, show_mode = 0, enabled_mode = 1, callback = function () {}; if (match !== null) { comment_id = match[1]; } callback = function (last_update_id) { if (comment_id > 0) { setTimeout(function () { var comment = $('#comments-tree-item-'+ comment_id +' > div:not(:animated)'); comment.addClass('now-added'); sof.helper.scrollTo($('#comments-tree-item-'+ comment_id), 15, 300, function () { comment.animate({backgroundColor: 'transparent'}, 2000, function () { comment.removeClass('now-added').removeAttr('style'); }); }); }, 200); } if (ws_usage < 50) { sof.comments.initWSComments('wss://hdrezka.ws', 33703, 0, last_update_id, null); } }; if (enabled_mode == 1 && (show_mode == 0 || ws_usage < 5)) { sof.comments.loadComments(33703, 1, true, 0, comment_id, callback); } }); } ());
        /// </summary>
        /// <returns></returns>
        public static Media GetMediaFromJS(string jsText)
        {
            const string START_TEXT = "streams";
            const string END_TEXT = "default_quality";
            const string URLS_REGEXP = @"^\[(\d+p.*)\](https:.+)\s+or\s+(https:.+)$";
            const string ID_REGEXP = @"^.+Events\((\d+),\s(\d+),.+$";

            var idRegExp = new Regex(ID_REGEXP);

            var idMatches = idRegExp.Match(jsText);

            var startIndex = jsText.IndexOf(START_TEXT) + START_TEXT.Length + 3;

            var endIndex = jsText.IndexOf(END_TEXT) - 3;

            var cdnUrls = jsText[startIndex..endIndex];

            var cdnUrlsArray = cdnUrls.Split(',');

            var urlRegExp = new Regex(URLS_REGEXP);

            var streams = new List<CDNStream>();

            var media = new Media {
                
                Id = Convert.ToInt32(idMatches.Groups[1].Value),

                TranslationId = Convert.ToInt32(idMatches.Groups[2].Value)
            };

            foreach (var cdnUrl in cdnUrlsArray)
            {
                var matches = urlRegExp.Matches(Regex.Unescape(cdnUrl));

                var stream = new CDNStream { 

                    Quality = matches[0].Groups[1].Value, 

                    URL1 = matches[0].Groups[2].Value, 

                    URL2 = matches[0].Groups[3].Value 
                };

                streams.Add(stream);
            }

            media.CDNStreams = streams.ToArray();

            return media;
        }
               
        /// <summary>
        /// <div class="b-search__live_section">
        /// <ul class="b-search__section_list">
        /// <li><a href = "https://rezka.ag/series/thriller/1931-proslushka-2016-01-28-55.html" >
        /// <span class="enty">Прослушка</span>(The Wire, сериал, 2002-2008)<span class="rating"><i class="hd-tooltip rating-green-string" title="Рейтинг Кинопоиска на основе 17536 голосов">8.45</i></span></a></li>
        /// <li><a href = "https://rezka.ag/films/documentary/6412-kanatohodec-2007.html" >< span class="enty">Канатоходец / Человек на проволоке</span>(Man on Wire, 2007)
        /// <span class="rating"><i class="hd-tooltip rating-green-string" title="Рейтинг Кинопоиска на основе 3648 голосов">7.65</i></span></a></li>
        /// <li><a href = "https://rezka.ag/films/comedy/7296-ptichka-na-provode-1990.html"><span class="enty">Птичка на проводе</span>(Bird on a Wire, 1990)
        /// <span class="rating"><i class="hd-tooltip rating-green-string" title="Рейтинг Кинопоиска на основе 11733 голосов">7.28</i></span></a></li>
        /// <li><a href = "https://rezka.ag/films/action/8807-ne-nazyvay-menya-malyshkoy-1996.html" >< span class="enty">Не называй меня малышкой</span> (Barb Wire, 1996)
        /// <span class="rating"><i class="hd-tooltip rating-red-string" title="Рейтинг Кинопоиска на основе 2350 голосов">4.73</i></span></a></li>
        /// <li><a href = "https://rezka.ag/films/action/18840-provod-pod-tokom-1992.html" ><span class="enty">Провод под током</span>(Live Wire, 1992)
        /// <span class="rating"><i class="hd-tooltip rating-grey-string" title="Рейтинг Кинопоиска на основе 494 голосов">6.33</i></span></a></li>
        /// </ul></div>
        /// <a class="b-search__live_all" href="https://rezka.ag/index.php?do=search&amp;subaction=search&amp;q=wire">Смотреть все результаты(еще 1 совпадение)</a>
        /// </summary>
        /// <param name="text"></param>
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
    }
}
