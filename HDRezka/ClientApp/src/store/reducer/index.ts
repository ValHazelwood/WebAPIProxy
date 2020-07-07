import { createContext } from "react";

import { SearchResult, MediaData, Mode } from "../types";

type ApplicationState = {
  loading: boolean;
  seriesLoading: boolean;
  results: SearchResult[];
  errorMessage: string;
  mode: Mode;
  mediaData?: MediaData;
  history: MediaData[];
};

type Action =
  | { type: "SEARCH_REQUEST" }
  | { type: "MEDIA_REQUEST" }
  | { type: "SERIES_REQUEST" }
  | { type: "MOVIE_REQUEST" }
  | { type: "SEARCH_SUCCESS"; results: SearchResult[] }
  | { type: "MEDIA_SUCCESS"; media: MediaData }
  | { type: "SERIES_SUCCESS"; media: MediaData }
  | { type: "MOVIE_SUCCESS"; media: MediaData }
  | { type: "SEARCH_FAILURE"; error: string }
  | { type: "MEDIA_FAILURE"; error: string }
  | { type: "MEDIA_UPDATE"; media: MediaData }
  | { type: "MEDIA_REFRESH_SUCCESS"; media: MediaData }
  | { type: "HISTORY_UPDATE"; media: MediaData }
  | { type: "FROM_HISTORY"; media: MediaData }
  | { type: "CHANGE_MODE"; mode: Mode }
  | { type: "HISTORY_CLEAR" }
  | { type: "SERIES_FAILURE"; error: string }
  | { type: "MOVIE_FAILURE"; error: string };

const initialState: ApplicationState = {
  loading: false,
  seriesLoading: false,
  results: [],
  errorMessage: "",
  mode: Mode.Result,
  history: [],
};

function reducer(state: ApplicationState, action: Action): ApplicationState {
  switch (action.type) {
    case "SEARCH_REQUEST":
      return { ...state, loading: true };
    case "SEARCH_SUCCESS":
      return {
        ...state,
        loading: false,
        results: action.results,
        mode: Mode.Result,
        errorMessage: "",
      };
    case "SEARCH_FAILURE":
      return { ...state, loading: false, errorMessage: action.error };
    case "MEDIA_REQUEST":
      return { ...state, loading: true };
    case "MEDIA_SUCCESS":
      return {
        ...state,
        loading: false,
        mode: Mode.Media,
        mediaData: action.media,
      };
    case "MEDIA_REFRESH_SUCCESS":
      return {
        ...state,
        loading: false,
        mode: Mode.Media,
        mediaData: action.media,
      };
    case "MEDIA_FAILURE":
      return { ...state, loading: false, errorMessage: action.error };
    case "SERIES_REQUEST":
      return { ...state, seriesLoading: true };
    case "SERIES_SUCCESS":
      return {
        ...state,
        seriesLoading: false,
        mode: Mode.Media,
        mediaData: action.media,
      };
    case "SERIES_FAILURE":
      return { ...state, seriesLoading: false, errorMessage: action.error };
    case "MOVIE_REQUEST":
      return { ...state, seriesLoading: true };
    case "MOVIE_SUCCESS":
      return {
        ...state,
        seriesLoading: false,
        mode: Mode.Media,
        mediaData: action.media,
      };
    case "MOVIE_FAILURE":
      return { ...state, seriesLoading: false, errorMessage: action.error };
    case "MEDIA_UPDATE":
      return {
        ...state,
        mediaData: action.media,
      };
    case "HISTORY_UPDATE":
      let { history } = state;

      if (!history) {
        history = [];
      }

      if (history.length > 9) {
        history = history.slice(0, -1);
      }

      return {
        ...state,
        history: [action.media, ...history],
      };
    case "FROM_HISTORY":
      return {
        ...state,
        mediaData: action.media,
        loading: false,
        seriesLoading: false,
        mode: Mode.Media,
      };
    case "HISTORY_CLEAR":
      return {
        ...state,
        history: [],
        loading: false,
        seriesLoading: false,
      };
    case "CHANGE_MODE":
      return {
        ...state,
        loading: false,
        seriesLoading: false,
        mode: action.mode,
      };
    default:
      return state;
  }
}

const ContextApp = createContext({
  state: initialState,
  dispatch: (value: any) => {},
});

export { reducer, initialState, ContextApp };
