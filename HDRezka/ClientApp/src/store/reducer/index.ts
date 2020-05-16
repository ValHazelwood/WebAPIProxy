import { createContext } from "react";

import { SearchResult, MediaData } from "../types";

type ApplicationState = {
  loading: boolean;
  seriesLoading: boolean;
  results: SearchResult[];
  errorMessage: string;
  mediaMode: boolean;
  mediaData?: MediaData;
  history: MediaData[];
};

type Action =
  | { type: "SEARCH_REQUEST" }
  | { type: "MEDIA_REQUEST" }
  | { type: "SERIES_REQUEST" }
  | { type: "SEARCH_SUCCESS"; results: SearchResult[] }
  | { type: "MEDIA_SUCCESS"; media: MediaData }
  | { type: "SERIES_SUCCESS"; media: MediaData }
  | { type: "SEARCH_FAILURE"; error: string }
  | { type: "MEDIA_FAILURE"; error: string }
  | { type: "MEDIA_UPDATE"; media: MediaData }
  | { type: "HISTORY_UPDATE"; media: MediaData }
  | { type: "SERIES_FAILURE"; error: string };

const initialState: ApplicationState = {
  loading: false,
  seriesLoading: false,
  results: [],
  errorMessage: "",
  mediaMode: false,
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
        mediaMode: false,
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
        mediaMode: true,
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
        mediaMode: true,
        mediaData: action.media,
      };
    case "SERIES_FAILURE":
      return { ...state, seriesLoading: false, errorMessage: action.error };
    case "MEDIA_UPDATE":
      return {
        ...state,
        mediaData: action.media,
      };
    case "HISTORY_UPDATE":
      let { history } = state;

      if (history.length > 9) {
        history = history.slice(0, -1);
      }

      return {
        ...state,
        history: [action.media, ...history],
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
