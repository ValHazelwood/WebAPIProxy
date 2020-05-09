export type SearchResult = {
  name: string;
  text: string;
  rating: string;
  url: string;
};

export type Stream = {
  quality: string;
  urL1: string;
  urL2: string;
};

export type Season = {
  id: number;
  episodes: number[];
};

export type Translation = {
  id: number;
  name: string;
  seasons: Season[] | null | undefined;
  cdnStreams: Stream[];
};

export type Media = {
  id: number;
  currentTranslationId: number;
  type: number;
  currentSeason: number | null | undefined;
  currentEpisode: number | null | undefined;
  translations: Translation[];
  currentQualityId: string;
  currentTime?: number;
};

export type SeasonData = {
  currentSeason: number;
  currentEpisode: number;
  seasons: Season[];
  cdnStreams: Stream[];
};

export type MediaData = {
  searchResult: SearchResult;
  media: Media;
};
