import React, { useReducer } from "react";
import "../App.css";
import Search from "./Search";
import SearchList from "./SearchList";
import spinner from "../ajax-loader.gif";
import { initialState, reducer } from "../store/reducer";
import ActionService from "../store/ActionService";
import Movie from "./Movie";
import Series from "./Series";

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { loading, results, errorMessage, mediaMode, mediaData } = state;

  let search = (input: string) => {
    ActionService.search(input, dispatch);
  };

  let selectSearchResultHandler = (selectedItemUrl: string) => {
    ActionService.selectSearchResultHandler(selectedItemUrl, results, dispatch);
  };

  let selectSeriesTranslationHandler = (id: number, translationId: number) => {
    if (mediaData) {
      ActionService.selectSeriesTranslationHandler(id, translationId, mediaData, dispatch);
    }
  };

  let selectSeriesEpisodeHandler = (id: number, translationId: number, season: number, episode: number) => {
    if (mediaData) {
      ActionService.selectSeriesEpisodeHandler(id, translationId, season, episode, mediaData, dispatch);
    }
  };

  let displayResults;

  if (loading && !errorMessage) {
    displayResults = <img className="spinner" src={spinner} alt="Loading..." />;
  } else if (errorMessage) {
    displayResults = <div className="errorMessage">{errorMessage}</div>;
  } else if (mediaMode && mediaData?.media.type === 0) {
    displayResults = <Movie data={mediaData} />;
  } else if (mediaMode && mediaData?.media.type === 1) {
    displayResults = <Series data={mediaData} selectSeriesTranslation={selectSeriesTranslationHandler} selectSeriesEpisode={selectSeriesEpisodeHandler} />;
  } else if (!mediaMode) {
    displayResults = <SearchList results={results} selectHandler={selectSearchResultHandler} />;
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
