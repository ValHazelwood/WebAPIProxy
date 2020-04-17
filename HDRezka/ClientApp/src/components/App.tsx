import React, { useReducer } from "react";
import "../App.css";
import Search from "./Search";
import SearchList from "./SearchList";
import MediaInfo from "./MediaInfo";
import spinner from "../ajax-loader.gif";
import { initialState, reducer } from "../store/reducer";
import FetchService from "../store/FetchService";
import { SearchResult, Media } from "../store/types";

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { loading, results, errorMessage, mediaMode, media } = state;

  let search = (input: string) => {
    console.log("search: " + input);
    dispatch({
      type: "SEARCH_REQUEST",
    });

    FetchService.search(input)
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
  };

  let selectHandler = (selectedItemUrl: string) => {

    let selectedItem = results.find(x => x.url === selectedItemUrl);

    if (selectedItem) {
      dispatch({
        type: "MEDIA_REQUEST",
      });

      FetchService.media(selectedItemUrl)
        .then((response) => response.json() as Promise<Media>)
        .then((result) => {
          dispatch({
            type: "MEDIA_SUCCESS",
            media: {
              searchResult: selectedItem,
              media: result
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "MEDIA_FAILURE",
            error: error,
          });
        });
    }

  };

  let displayResults;

  if (loading && !errorMessage) {
    displayResults = <img className="spinner" src={spinner} alt="Loading..." />;
  } else if (errorMessage) {
    displayResults = <div className="errorMessage">{errorMessage}</div>;
  } else if (mediaMode) {
    displayResults = <MediaInfo selectedMedia={media} />;
  } else if (!mediaMode) {
    displayResults = <SearchList results={results} selectHandler={selectHandler} />;
  }

  console.log("App rendered");

  return (
    <div className="App">
      <Search searchHandler={search} />
      {displayResults}
    </div>
  );
}

export default App;
