type ApplicationState = {
  loading: boolean;
  results: SearchResult[];
  errorMessage: string;
  mediaMode: boolean;
  media?: Media;
};

type Media = {
  id: number;
};

type SearchResult = {
  name: string;
  text: string;
  rating: string;
  url: string;
};

type Action =
  | { type: "SEARCH_REQUEST" }
  | { type: "MEDIA_REQUEST" }
  | { type: "SEARCH_SUCCESS"; results: SearchResult[] }
  | { type: "MEDIA_SUCCESS"; media: Media }
  | { type: "SEARCH_FAILURE"; error: string }
  | { type: "MEDIA_FAILURE"; error: string };

const initialState: ApplicationState = {
  loading: false,
  results: [],
  errorMessage: "",
  mediaMode: false,
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
      };
    case "SEARCH_FAILURE":
      return { ...state, loading: false, errorMessage: action.error };
    case "MEDIA_REQUEST":
      return { ...state, loading: true };
    case "MEDIA_SUCCESS":
      return { ...state, loading: false, mediaMode: true, media: action.media };
    case "MEDIA_FAILURE":
      return { ...state, loading: false, errorMessage: action.error };
    default:
      return state;
  }
}

export { reducer, initialState };
