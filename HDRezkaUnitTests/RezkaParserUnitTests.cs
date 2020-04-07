using HDRezka;
using HDRezka.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;

namespace HDRezkaUnitTests
{
    [TestClass]
    public class RezkaParserUnitTests
    {
        [TestMethod]
        public void GetMediaFromJS_Returns_Valid_Data_For_Movie()
        {
            var mockInput = @"$(function () { sof.tv.initCDNMoviesEvents(33703, 0, 'rezka.ag', false, {'id':'cdnplayer','streams':'[360p]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/240.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/b3e04764bde7b7657dc7e1bcf353f2da:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/240.mp4,[480p]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/360.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/d79d1496cc57d2000fbf00b7f993736d:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/360.mp4,[720p]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/480.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/313e7aea979f7fe9e7830f87c526364a:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/480.mp4,[1080p]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/720.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/f02335870d7abea63ebb1a3a9c0f211a:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/720.mp4,[1080p Ultra]https:\/\/load.hdrezka-ag.net\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/deae4e32ca81c3cb79a1111fe3e519f3:2020040721\/1080.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/8599895da0e7d16c7802f46e13a5ee28:2020040721\/movies\/98309768fbe048b649d8e3071540d84cdf90aaab\/1080.mp4','default_quality':'480p','hlsconfig':{'maxBufferLength':180,'maxMaxBufferLength':600,'maxBufferSize':33554432000},'geo_ip':'104.42.145.67','geo_iso':'us','preroll':'https:\/\/franecki.net\/assets\/vendor\/3736f6ea7b7e115cbb4f5c2ea8f5f2df.xml?v=3.0 and https:\/\/franecki.net\/assets\/vendor\/49ae0420d7a42849fd13a5e3ae4fc009.xml?v=3.0'}); }); $(function () { sof.tv.initWatchingEvents(33703); }); (function () { $(function () { var comment_id = 0, match = window.location.hash.match(/comment(\d+)/i), ws_usage = 5, show_mode = 0, enabled_mode = 1, callback = function () {}; if (match !== null) { comment_id = match[1]; } callback = function (last_update_id) { if (comment_id > 0) { setTimeout(function () { var comment = $('#comments-tree-item-'+ comment_id +' > div:not(:animated)'); comment.addClass('now-added'); sof.helper.scrollTo($('#comments-tree-item-'+ comment_id), 15, 300, function () { comment.animate({backgroundColor: 'transparent'}, 2000, function () { comment.removeClass('now-added').removeAttr('style'); }); }); }, 200); } if (ws_usage < 50) { sof.comments.initWSComments('wss://hdrezka.ws', 33703, 0, last_update_id, null); } }; if (enabled_mode == 1 && (show_mode == 0 || ws_usage < 5)) { sof.comments.loadComments(33703, 1, true, 0, comment_id, callback); } }); } ());";

            var result = RezkaParser.GetMediaFromJS(mockInput);

            Assert.AreEqual(33703, result.Id);

            Assert.AreEqual(0, result.CurrentTranslationId);

            Assert.AreEqual(MediaType.Movies, result.Type);

            Assert.AreEqual(0, result.Translations[0].TranslationId);

            Assert.AreEqual("360p", result.Translations[0].CDNStreams[0].Quality);

            Assert.AreEqual("https://load.hdrezka-ag.net/b3e04764bde7b7657dc7e1bcf353f2da:2020040721/movies/98309768fbe048b649d8e3071540d84cdf90aaab/240.mp4", result.Translations[0].CDNStreams[0].URL2);

            Assert.AreEqual("1080p Ultra", result.Translations[0].CDNStreams[4].Quality);

            Assert.AreEqual("https://load.hdrezka-ag.net/8599895da0e7d16c7802f46e13a5ee28:2020040721/movies/98309768fbe048b649d8e3071540d84cdf90aaab/1080.mp4", result.Translations[0].CDNStreams[4].URL2);
        }

        [TestMethod]
        public void GetMediaFromJS_Returns_Valid_Data_For_Series()
        {  
            var mockInput = @" $(function () { sof.tv.initCDNSeriesEvents(1931, 13, 1, 1, false, 'rezka.ag', false, {'id':'cdnplayer','streams':'[360p]https:\/\/load.hdrezka-ag.net\/tvseries\/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d\/8f33fb24ebee420fe8322acb5cabfe7c:2020040920\/240.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/adc0a6b582709a57e32af304d326352a:2020040920\/tvseries\/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d\/240.mp4,[480p]https:\/\/load.hdrezka-ag.net\/tvseries\/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d\/8f33fb24ebee420fe8322acb5cabfe7c:2020040920\/360.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/3e8b1d1452cce378a6ee8c62db3ae658:2020040920\/tvseries\/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d\/360.mp4,[720p]https:\/\/load.hdrezka-ag.net\/tvseries\/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d\/8f33fb24ebee420fe8322acb5cabfe7c:2020040920\/480.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/7ae4005c0713ca5a86ff84e208a712e9:2020040920\/tvseries\/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d\/480.mp4,[1080p]https:\/\/load.hdrezka-ag.net\/tvseries\/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d\/8f33fb24ebee420fe8322acb5cabfe7c:2020040920\/720.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/ff09fd32196ac1174e01d31f28e97548:2020040920\/tvseries\/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d\/720.mp4','default_quality':'480p','hlsconfig':{'maxBufferLength':180,'maxMaxBufferLength':600,'maxBufferSize':33554432000},'geo_ip':'62.210.110.54','geo_iso':'fr','preroll':'https:\/\/franecki.net\/assets\/vendor\/3736f6ea7b7e115cbb4f5c2ea8f5f2df.xml?v=3.0 and https:\/\/franecki.net\/assets\/vendor\/49ae0420d7a42849fd13a5e3ae4fc009.xml?v=3.0'}); }); $(function () { sof.tv.initWatchingEvents(1931); }); (function () { $(function () { var comment_id = 0, match = window.location.hash.match(/comment(\d+)/i), ws_usage = 5, show_mode = 0, enabled_mode = 1, callback = function () {}; if (match !== null) { comment_id = match[1]; } callback = function (last_update_id) { if (comment_id > 0) { setTimeout(function () { var comment = $('#comments-tree-item-'+ comment_id +' > div:not(:animated)'); comment.addClass('now-added'); sof.helper.scrollTo($('#comments-tree-item-'+ comment_id), 15, 300, function () { comment.animate({backgroundColor: 'transparent'}, 2000, function () { comment.removeClass('now-added').removeAttr('style'); }); }); }, 200); } if (ws_usage < 50) { sof.comments.initWSComments('wss://hdrezka.ws', 1931, 0, last_update_id, null); } }; if (enabled_mode == 1 && (show_mode == 0 || ws_usage < 5)) { sof.comments.loadComments(1931, 1, true, 0, comment_id, callback); } }); } ());";

            var result = RezkaParser.GetMediaFromJS(mockInput);

            Assert.AreEqual(1931, result.Id);

            Assert.AreEqual(13, result.CurrentTranslationId);

            Assert.AreEqual(MediaType.Series, result.Type);

            Assert.AreEqual(1, result.Episode);

            Assert.AreEqual(1, result.Season);

            Assert.AreEqual(13, result.Translations[0].TranslationId);

            Assert.AreEqual("360p", result.Translations[0].CDNStreams[0].Quality);

            Assert.AreEqual("https://load.hdrezka-ag.net/adc0a6b582709a57e32af304d326352a:2020040920/tvseries/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d/240.mp4", result.Translations[0].CDNStreams[0].URL2);

            Assert.AreEqual("1080p", result.Translations[0].CDNStreams[3].Quality);

            Assert.AreEqual("https://load.hdrezka-ag.net/ff09fd32196ac1174e01d31f28e97548:2020040920/tvseries/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d/720.mp4", result.Translations[0].CDNStreams[3].URL2);
        }

        [TestMethod]
        public void GetSearchResult_Returns_Valid_Data()
        {
            var mockInput = @"<div class='b-search__live_section'><ul class='b-search__section_list'><li><a href='https://rezka.ag/series/thriller/1931-proslushka-2016-01-28-55.html'><span class='enty'>Прослушка</span> (The Wire, сериал, 2002-2008)<span class='rating'><i class='hd-tooltip rating-green-string' title='Рейтинг Кинопоиска на основе 17536 голосов'>8.45</i></span></a></li><li><a href='https://rezka.ag/films/documentary/6412-kanatohodec-2007.html'><span class='enty'>Канатоходец / Человек на проволоке</span> (Man on Wire, 2007)<span class='rating'><i class='hd-tooltip rating-green-string' title='Рейтинг Кинопоиска на основе 3648 голосов'>7.65</i></span></a></li><li><a href='https://rezka.ag/films/comedy/7296-ptichka-na-provode-1990.html'><span class='enty'>Птичка на проводе</span> (Bird on a Wire, 1990)<span class='rating'><i class='hd-tooltip rating-green-string' title='Рейтинг Кинопоиска на основе 11733 голосов'>7.28</i></span></a></li><li><a href='https://rezka.ag/films/action/8807-ne-nazyvay-menya-malyshkoy-1996.html'><span class='enty'>Не называй меня малышкой</span> (Barb Wire, 1996)<span class='rating'><i class='hd-tooltip rating-red-string' title='Рейтинг Кинопоиска на основе 2350 голосов'>4.73</i></span></a></li><li><a href='https://rezka.ag/films/action/18840-provod-pod-tokom-1992.html'><span class='enty'>Провод под током</span> (Live Wire, 1992)<span class='rating'><i class='hd-tooltip rating-grey-string' title='Рейтинг Кинопоиска на основе 494 голосов'>6.33</i></span></a></li></ul></div><a class='b-search__live_all' href='https://rezka.ag/index.php?do=search&amp;subaction=search&amp;q=wire'>Смотреть все результаты (еще 1 совпадение)</a>";

            var result = RezkaParser.GetSearchResult(mockInput);

            Assert.AreEqual("https://rezka.ag/series/thriller/1931-proslushka-2016-01-28-55.html", result[0].URL);
            Assert.AreEqual("Прослушка", result[0].Name);
            Assert.AreEqual(" (The Wire, сериал, 2002-2008)", result[0].Text);
            Assert.AreEqual("8.45", result[0].Rating);
        }

        [TestMethod]
        public void GetCDNStreams_Returns_Valid_Data()
        {
            var mockInput = @"{'success':true,'message':'','url':'[360p]https:\/\/load.hdrezka-ag.net\/tvseries\/a17e9f9fe955f32942c96e0e581ba72d2d7bd920\/96017f0571adb0a66d1e3f26147217ce:2020041100\/240.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/fe088672471c26588147deee924efc4b:2020041100\/tvseries\/a17e9f9fe955f32942c96e0e581ba72d2d7bd920\/240.mp4,[480p]https:\/\/load.hdrezka-ag.net\/tvseries\/a17e9f9fe955f32942c96e0e581ba72d2d7bd920\/96017f0571adb0a66d1e3f26147217ce:2020041100\/360.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/3b529f82ca5928786e988a0f4d147a49:2020041100\/tvseries\/a17e9f9fe955f32942c96e0e581ba72d2d7bd920\/360.mp4,[720p]https:\/\/load.hdrezka-ag.net\/tvseries\/a17e9f9fe955f32942c96e0e581ba72d2d7bd920\/96017f0571adb0a66d1e3f26147217ce:2020041100\/480.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/101c9d76f6f06da7cf1e985849bccc94:2020041100\/tvseries\/a17e9f9fe955f32942c96e0e581ba72d2d7bd920\/480.mp4,[1080p]https:\/\/load.hdrezka-ag.net\/tvseries\/a17e9f9fe955f32942c96e0e581ba72d2d7bd920\/96017f0571adb0a66d1e3f26147217ce:2020041100\/720.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/6136628d535d0e5235107a8424886817:2020041100\/tvseries\/a17e9f9fe955f32942c96e0e581ba72d2d7bd920\/720.mp4','quality':'480p'}";

            var result = RezkaParser.GetCDNStreams(mockInput);

            Assert.AreEqual("360p", result[0].Quality);

            Assert.AreEqual("https://load.hdrezka-ag.net/fe088672471c26588147deee924efc4b:2020041100/tvseries/a17e9f9fe955f32942c96e0e581ba72d2d7bd920/240.mp4", result[0].URL2);

            Assert.AreEqual("1080p", result[3].Quality);

            Assert.AreEqual("https://load.hdrezka-ag.net/6136628d535d0e5235107a8424886817:2020041100/tvseries/a17e9f9fe955f32942c96e0e581ba72d2d7bd920/720.mp4", result[3].URL2);
        }
    }
}
