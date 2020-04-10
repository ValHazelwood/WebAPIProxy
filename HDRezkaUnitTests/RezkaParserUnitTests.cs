using HDRezka;
using HDRezka.Helpers;
using HtmlAgilityPack;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
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

            Assert.AreEqual(0, result.Translations[0].Id);

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

            Assert.AreEqual(1, result.CurrentEpisode);

            Assert.AreEqual(1, result.CurrentSeason);

            Assert.AreEqual(13, result.Translations[0].Id);

            Assert.AreEqual("360p", result.Translations[0].CDNStreams[0].Quality);

            Assert.AreEqual("https://load.hdrezka-ag.net/adc0a6b582709a57e32af304d326352a:2020040920/tvseries/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d/240.mp4", result.Translations[0].CDNStreams[0].URL2);

            Assert.AreEqual("1080p", result.Translations[0].CDNStreams[3].Quality);

            Assert.AreEqual("https://load.hdrezka-ag.net/ff09fd32196ac1174e01d31f28e97548:2020040920/tvseries/35f9a26c7f3ed3f0ddc121ba7cc417db7f52a10d/720.mp4", result.Translations[0].CDNStreams[3].URL2);
        }

        [TestMethod]
        public void GetSearchResult_Returns_Valid_Data()
        {
            var mockInput = @"<div class='b-search__live_section'><ul class='b-search__section_list'><li><a href='https://rezka.ag/series/thriller/1931-proslushka-2016-01-28-55.html'><span class='enty'>���������</span> (The Wire, ������, 2002-2008)<span class='rating'><i class='hd-tooltip rating-green-string' title='������� ���������� �� ������ 17536 �������'>8.45</i></span></a></li><li><a href='https://rezka.ag/films/documentary/6412-kanatohodec-2007.html'><span class='enty'>����������� / ������� �� ���������</span> (Man on Wire, 2007)<span class='rating'><i class='hd-tooltip rating-green-string' title='������� ���������� �� ������ 3648 �������'>7.65</i></span></a></li><li><a href='https://rezka.ag/films/comedy/7296-ptichka-na-provode-1990.html'><span class='enty'>������ �� �������</span> (Bird on a Wire, 1990)<span class='rating'><i class='hd-tooltip rating-green-string' title='������� ���������� �� ������ 11733 �������'>7.28</i></span></a></li><li><a href='https://rezka.ag/films/action/8807-ne-nazyvay-menya-malyshkoy-1996.html'><span class='enty'>�� ������� ���� ��������</span> (Barb Wire, 1996)<span class='rating'><i class='hd-tooltip rating-red-string' title='������� ���������� �� ������ 2350 �������'>4.73</i></span></a></li><li><a href='https://rezka.ag/films/action/18840-provod-pod-tokom-1992.html'><span class='enty'>������ ��� �����</span> (Live Wire, 1992)<span class='rating'><i class='hd-tooltip rating-grey-string' title='������� ���������� �� ������ 494 �������'>6.33</i></span></a></li></ul></div><a class='b-search__live_all' href='https://rezka.ag/index.php?do=search&amp;subaction=search&amp;q=wire'>�������� ��� ���������� (��� 1 ����������)</a>";

            var result = RezkaParser.GetSearchResult(mockInput);

            Assert.AreEqual("https://rezka.ag/series/thriller/1931-proslushka-2016-01-28-55.html", result[0].URL);
            Assert.AreEqual("���������", result[0].Name);
            Assert.AreEqual(" (The Wire, ������, 2002-2008)", result[0].Text);
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

        [TestMethod]
        public void GetTranslations_Returns_Valid_Data()
        {
            var mockInput = @"<div class='b-translators__block'> <div class='b-translators__title'>� ������� ������� ��:</div> <ul id='translators-list' class='b-translators__list'><li title='������������ ����������' class='b-translator__item active' data-id='6756' data-translator_id='59' data-cdn_url='[360p]https://load.hdrezka-ag.net/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/5a9c4ec19ee23def3a7801f9cab474fb:2020041119/240.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/cea26433650e118f7b590ca058510c48:2020041119/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/240.mp4,[480p]https://load.hdrezka-ag.net/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/5a9c4ec19ee23def3a7801f9cab474fb:2020041119/360.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/5e87941ba90f7bbcb14a7d2ed0acac12:2020041119/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/360.mp4,[720p]https://load.hdrezka-ag.net/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/5a9c4ec19ee23def3a7801f9cab474fb:2020041119/480.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/a72595d54d06de2a37c3326dc76d997c:2020041119/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/480.mp4,[1080p]https://load.hdrezka-ag.net/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/5a9c4ec19ee23def3a7801f9cab474fb:2020041119/720.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/ce236caacc278be9294e53d5c919e036:2020041119/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/720.mp4' data-cdn_quality='480p'>������������ ����������</li><li title='��������' class='b-translator__item' data-id='6756' data-translator_id='53' data-cdn_url='[360p]https://load.hdrezka-ag.net/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/41d89734fed5e966629d31d247a312b7:2020041119/240.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/b06e126e3e3285171f952dbd655045e3:2020041119/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/240.mp4,[480p]https://load.hdrezka-ag.net/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/41d89734fed5e966629d31d247a312b7:2020041119/360.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/94694024f7829dac43ab64c44b7f7265:2020041119/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/360.mp4,[720p]https://load.hdrezka-ag.net/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/41d89734fed5e966629d31d247a312b7:2020041119/480.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/28b22714824f84d7330b06e7c0d293b4:2020041119/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/480.mp4,[1080p]https://load.hdrezka-ag.net/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/41d89734fed5e966629d31d247a312b7:2020041119/720.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/ebe243a091d8ede6e892acaa41874adf:2020041119/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/720.mp4,[1080p Ultra]https://load.hdrezka-ag.net/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/41d89734fed5e966629d31d247a312b7:2020041119/1080.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/17c51e06f2af1e88045f80d12905055a:2020041119/movies/e9cad78488be7d26ca0392f75bd2e745ff6b943c/1080.mp4' data-cdn_quality='480p'>��������</li><li title='��������' class='b-translator__item' data-id='6756' data-translator_id='65' data-cdn_url='[360p]https://load.hdrezka-ag.net/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/7160a1d805a154ff83d3dc0bb4be328e:2020041119/240.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/2cc5c184997c67e2743933ef6ff87e18:2020041119/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/240.mp4,[480p]https://load.hdrezka-ag.net/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/7160a1d805a154ff83d3dc0bb4be328e:2020041119/360.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/3177efe8759d072f725a81f4d6f1e134:2020041119/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/360.mp4,[720p]https://load.hdrezka-ag.net/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/7160a1d805a154ff83d3dc0bb4be328e:2020041119/480.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/97b1f8a008f369789358bdc732919291:2020041119/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/480.mp4,[1080p]https://load.hdrezka-ag.net/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/7160a1d805a154ff83d3dc0bb4be328e:2020041119/720.mp4:hls:manifest.m3u8 or https://load.hdrezka-ag.net/1b18ae107eb5faee00854c4cade17e44:2020041119/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/720.mp4' data-cdn_quality='480p'>��������</li></ul> </div>";

            var htmlDoc = new HtmlDocument();

            htmlDoc.LoadHtml(mockInput);

            var result = RezkaParser.GetTranslations(htmlDoc);

            Assert.AreEqual(59,result[0].Id);

            Assert.AreEqual("������������ ����������", result[0].Name);

            Assert.AreEqual("https://load.hdrezka-ag.net/cea26433650e118f7b590ca058510c48:2020041119/movies/5e8e2ce0bbd8dbcf7d91863019af6b1531bddcad/240.mp4", result[0].CDNStreams[0].URL2);

            Assert.AreEqual(65, result[2].Id);

            Assert.AreEqual("��������", result[2].Name);

            Assert.AreEqual("https://load.hdrezka-ag.net/1b18ae107eb5faee00854c4cade17e44:2020041119/movies/b21ec9e28f8cfb29317886eda66b0588036ad8f3/720.mp4", result[2].CDNStreams[3].URL2);
        }

        [TestMethod]
        public void GetTranslations_With_Empty_Div_Returns_Empty_Array()
        {
            var mockInput = @"<div class='b-translators__block'></div>";

            var htmlDoc = new HtmlDocument();

            htmlDoc.LoadHtml(mockInput);

            var result = RezkaParser.GetTranslations(htmlDoc);

            Assert.AreEqual(0, result.Length);
        }

        [TestMethod]
        public void GetSeasons_Returns_Valid_Data()
        {
            var mockInput = @"{'success':true,'message':'','seasons':'\u003Cli class=\'b-simple_season__item active\' data-autoswitch=\'1\' data-tab_id=\'1\'\u003E\u0421\u0435\u0437\u043e\u043d 1\u003C\/li\u003E\u003Cli class=\'b-simple_season__item\' data-autoswitch=\'1\' data-tab_id=\'2\'\u003E\u0421\u0435\u0437\u043e\u043d 2\u003C\/li\u003E\u003Cli class=\'b-simple_season__item\' data-autoswitch=\'1\' data-tab_id=\'3\'\u003E\u0421\u0435\u0437\u043e\u043d 3\u003C\/li\u003E','episodes':'\u003Cul id=\'simple-episodes-list-1\' class=\'b-simple_episodes__list clearfix\'\u003E\u003Cli class=\'b-simple_episode__item active\' data-autoswitch=\'1\' data-cdn_url=\'[360p]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/240.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/fd4c88cf72020e1c110eab4bdc27b629:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/240.mp4,[480p]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/360.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/05c9fa20cac42167ab5ba5ec630243ed:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/360.mp4,[720p]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/480.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/43f902b266992ed550c05ed2ae6977b2:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/480.mp4,[1080p]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/720.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/553bfe1417b7ba53246e2dc9ed154c49:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/720.mp4,[1080p Ultra]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/1080.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/f59fb4da3f852daebdb363f2777decf4:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/1080.mp4\' data-cdn_quality=\'480p\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'1\'\u003E\u0421\u0435\u0440\u0438\u044f 1\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'2\'\u003E\u0421\u0435\u0440\u0438\u044f 2\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'3\'\u003E\u0421\u0435\u0440\u0438\u044f 3\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'4\'\u003E\u0421\u0435\u0440\u0438\u044f 4\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'5\'\u003E\u0421\u0435\u0440\u0438\u044f 5\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'6\'\u003E\u0421\u0435\u0440\u0438\u044f 6\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'7\'\u003E\u0421\u0435\u0440\u0438\u044f 7\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'8\'\u003E\u0421\u0435\u0440\u0438\u044f 8\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'9\'\u003E\u0421\u0435\u0440\u0438\u044f 9\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'1\' data-episode_id=\'10\'\u003E\u0421\u0435\u0440\u0438\u044f 10\u003C\/li\u003E\u003C\/ul\u003E\u003Cul id=\'simple-episodes-list-2\' class=\'b-simple_episodes__list clearfix\' style=\'display: none;\'\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'1\'\u003E\u0421\u0435\u0440\u0438\u044f 1\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'2\'\u003E\u0421\u0435\u0440\u0438\u044f 2\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'3\'\u003E\u0421\u0435\u0440\u0438\u044f 3\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'4\'\u003E\u0421\u0435\u0440\u0438\u044f 4\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'5\'\u003E\u0421\u0435\u0440\u0438\u044f 5\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'6\'\u003E\u0421\u0435\u0440\u0438\u044f 6\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'7\'\u003E\u0421\u0435\u0440\u0438\u044f 7\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'8\'\u003E\u0421\u0435\u0440\u0438\u044f 8\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'9\'\u003E\u0421\u0435\u0440\u0438\u044f 9\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'2\' data-episode_id=\'10\'\u003E\u0421\u0435\u0440\u0438\u044f 10\u003C\/li\u003E\u003C\/ul\u003E\u003Cul id=\'simple-episodes-list-3\' class=\'b-simple_episodes__list clearfix\' style=\'display: none;\'\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'3\' data-episode_id=\'1\'\u003E\u0421\u0435\u0440\u0438\u044f 1\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'3\' data-episode_id=\'2\'\u003E\u0421\u0435\u0440\u0438\u044f 2\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'3\' data-episode_id=\'3\'\u003E\u0421\u0435\u0440\u0438\u044f 3\u003C\/li\u003E\u003Cli class=\'b-simple_episode__item\' data-autoswitch=\'1\' data-cdn_url=\'null\' data-cdn_quality=\'null\' data-id=\'11658\' data-season_id=\'3\' data-episode_id=\'4\'\u003E\u0421\u0435\u0440\u0438\u044f 4\u003C\/li\u003E\u003C\/ul\u003E','url':'[360p]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/240.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/fd4c88cf72020e1c110eab4bdc27b629:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/240.mp4,[480p]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/360.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/05c9fa20cac42167ab5ba5ec630243ed:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/360.mp4,[720p]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/480.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/43f902b266992ed550c05ed2ae6977b2:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/480.mp4,[1080p]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/720.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/553bfe1417b7ba53246e2dc9ed154c49:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/720.mp4,[1080p Ultra]https:\/\/load.hdrezka-ag.net\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/e219be1d8c58ae31128cacf99c066c0a:2020041221\/1080.mp4:hls:manifest.m3u8 or https:\/\/load.hdrezka-ag.net\/f59fb4da3f852daebdb363f2777decf4:2020041221\/tvseries\/0f0d00f1f7b57c0d5a9e6dcb9979c4c430420328\/1080.mp4','quality':'480p'}";

            var result = RezkaParser.GetSeasons(mockInput);

            Assert.AreEqual(3, result.Seasons.Length);

            Assert.AreEqual(10, result.Seasons.Single(x => x.Id == 1).Episodes.Length);

            Assert.AreEqual(10, result.Seasons.Single(x => x.Id == 2).Episodes.Length);

            Assert.AreEqual(4, result.Seasons.Single(x => x.Id == 3).Episodes.Length);

            Assert.AreEqual(1, result.CurrentSeason);

            Assert.AreEqual(1, result.CurrentEpisode);

            Assert.IsTrue(result.CDNStreams.Length > 0);
        }
    }
}
