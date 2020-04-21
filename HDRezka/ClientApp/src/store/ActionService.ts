import FetchService from "./FetchService";
import {
  SearchResult,
  Media,
  MediaData,
  SeasonData,
  Translation,
  Stream,
} from "./types";

const ActionService = {
  search: function (input: string, dispatch: React.Dispatch<any>) {
    console.log("search: " + input);
    dispatch({
      type: "SEARCH_REQUEST",
    });

    FetchService.post("search", JSON.stringify(input))
      .then((response) => response.json() as Promise<SearchResult[]>)
      .then((result) => {
        dispatch({
          type: "SEARCH_SUCCESS",
          results: result,
        });
      })
      .catch((error) => {
        dispatch({
          type: "SEARCH_FAILURE",
          error: error,
        });
      });
  },
  selectSearchResultHandler: function (
    selectedItemUrl: string,
    results: SearchResult[],
    dispatch: React.Dispatch<any>
  ) {
    let selectedItem = results.find((x) => x.url === selectedItemUrl);

    if (selectedItem) {
      dispatch({
        type: "MEDIA_REQUEST",
      });

      FetchService.post("media", JSON.stringify(selectedItemUrl))
        .then((response) => response.json() as Promise<Media>)
        .then((result) => {
          if (selectedItem) {
            dispatch({
              type: "MEDIA_SUCCESS",
              media: {
                searchResult: selectedItem,
                media: result,
              },
            });
          }
        })
        .catch((error) => {
          dispatch({
            type: "MEDIA_FAILURE",
            error: error,
          });
        });
    }
  },
  selectSeriesTranslationHandler: function (
    id: number,
    translationId: number,
    mediaData: MediaData,
    dispatch: React.Dispatch<any>
  ) {
    dispatch({
      type: "MEDIA_REQUEST",
    });

    FetchService.post(
      "seasons",
      `{ "id":${id}, "translationId":${translationId} }`
    )
      .then((response) => response.json() as Promise<SeasonData>)
      .then((result) => {
        let translationName = mediaData.media.translations.find(
          (x) => x.id === translationId
        )?.name;
        let translations: Translation[] = [
          ...mediaData.media.translations.filter((x) => x.id !== translationId),
          {
            id: translationId,
            name: translationName ? translationName : "Default",
            seasons: result.seasons,
            cdnStreams: result.cdnStreams,
          },
        ];

        let media: Media = {
          id: id,
          currentTranslationId: translationId,
          type: 1,
          currentSeason: result.currentSeason,
          currentEpisode: result.currentEpisode,
          translations: translations,
        };

        dispatch({
          type: "MEDIA_SUCCESS",
          media: { searchResult: mediaData.searchResult, media: media },
        });
      })
      .catch((error) => {
        dispatch({
          type: "MEDIA_FAILURE",
          error: error,
        });
      });
  },
  selectSeriesEpisodeHandler: function (
    id: number,
    translationId: number,
    season: number,
    episode: number,
    mediaData: MediaData,
    dispatch: React.Dispatch<any>
  ) {
    dispatch({
      type: "MEDIA_REQUEST",
    });

    FetchService.post(
      "series",
      `{ "id":${id}, "translationId":${translationId}, "season":${season}, "episode":${episode} }`
    )
      .then((response) => response.json() as Promise<Stream[]>)
      .then((result) => {
        let translation = mediaData.media.translations.find(
          (x) => x.id === translationId
        );

        let translations: Translation[] = mediaData.media.translations.filter(
          (x) => x.id !== translationId
        );

        if (translation) {
          translation.cdnStreams = result;
          translations.push(translation);
        }

        let media: Media = {
          id: id,
          currentTranslationId: translationId,
          type: 1,
          currentSeason: season,
          currentEpisode: episode,
          translations: translations,
        };

        dispatch({
          type: "MEDIA_SUCCESS",
          media: { searchResult: mediaData.searchResult, media: media },
        });
      })
      .catch((error) => {
        dispatch({
          type: "MEDIA_FAILURE",
          error: error,
        });
      });
  },
};

export default ActionService;
