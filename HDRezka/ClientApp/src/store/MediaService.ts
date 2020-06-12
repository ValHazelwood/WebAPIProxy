import ActionService from "./ActionService";
import { MediaData } from "./types";

const MediaService = {
  nextSeasonSelectedHandler: (
    data: MediaData,
    dispatch: React.Dispatch<any>
  ) => {
    if (data.media.currentSeason) {
      let translation = data.media.translations.find(
        (x) => x.id === data.media.currentTranslationId
      );

      let currentSeasonIndex = translation?.seasons?.findIndex(
        (x) => x.id === data.media.currentSeason
      );

      if (
        typeof currentSeasonIndex === "number" &&
        currentSeasonIndex >= 0 &&
        translation &&
        translation.seasons
      ) {
        let nextSeason = translation.seasons[currentSeasonIndex + 1].id;

        let queryEpisode = translation?.seasons?.find(
          (x) => x.id === nextSeason
        )?.episodes[0];

        if (typeof queryEpisode === "number" && queryEpisode >= 0) {
          ActionService.selectSeriesEpisodeHandler(
            data.media.id,
            data.media.currentTranslationId,
            nextSeason,
            queryEpisode,
            data,
            dispatch
          );
        }
      }
    }
  },
  nextEpisodeSelectedHandler: (
    data: MediaData,
    dispatch: React.Dispatch<any>
  ) => {
    if (data.media.currentSeason && data.media.currentEpisode) {
      let translation = data.media.translations.find(
        (x) => x.id === data.media.currentTranslationId
      );

      let season = translation?.seasons?.find(
        (x) => x.id === data.media.currentSeason
      );

      let currentEpisodeIndex = season?.episodes.findIndex(
        (x) => x === data.media.currentEpisode
      );

      if (typeof currentEpisodeIndex === "number" && currentEpisodeIndex >= 0) {
        let nextEpisode = season?.episodes[currentEpisodeIndex + 1];

        if (typeof nextEpisode === "number" && nextEpisode >= 0) {
          ActionService.selectSeriesEpisodeHandler(
            data.media.id,
            data.media.currentTranslationId,
            data.media.currentSeason,
            nextEpisode,
            data,
            dispatch
          );
        }
      }
    }
  },
  prevSeasonSelectedHandler: (
    data: MediaData,
    dispatch: React.Dispatch<any>
  ) => {
    if (data.media.currentSeason) {
      let translation = data.media.translations.find(
        (x) => x.id === data.media.currentTranslationId
      );

      let currentSeasonIndex = translation?.seasons?.findIndex(
        (x) => x.id === data.media.currentSeason
      );

      if (
        typeof currentSeasonIndex === "number" &&
        currentSeasonIndex >= 0 &&
        translation &&
        translation.seasons
      ) {
        let prevSeason = translation.seasons[currentSeasonIndex - 1].id;

        let queryEpisode = translation?.seasons?.find(
          (x) => x.id === prevSeason
        )?.episodes[0];

        if (typeof queryEpisode === "number" && queryEpisode >= 0) {
          ActionService.selectSeriesEpisodeHandler(
            data.media.id,
            data.media.currentTranslationId,
            prevSeason,
            queryEpisode,
            data,
            dispatch
          );
        }
      }
    }
  },
  prevEpisodeSelectedHandler: (
    data: MediaData,
    dispatch: React.Dispatch<any>
  ) => {
    if (data.media.currentSeason && data.media.currentEpisode) {
      let translation = data.media.translations.find(
        (x) => x.id === data.media.currentTranslationId
      );

      let season = translation?.seasons?.find(
        (x) => x.id === data.media.currentSeason
      );

      let currentEpisodeIndex = season?.episodes.findIndex(
        (x) => x === data.media.currentEpisode
      );

      if (typeof currentEpisodeIndex === "number" && currentEpisodeIndex >= 0) {
        let prevEpisode = season?.episodes[currentEpisodeIndex - 1];

        if (typeof prevEpisode === "number" && prevEpisode >= 0) {
          ActionService.selectSeriesEpisodeHandler(
            data.media.id,
            data.media.currentTranslationId,
            data.media.currentSeason,
            prevEpisode,
            data,
            dispatch
          );
        }
      }
    }
  },
};

export default MediaService;
