import React from "react";
import "../App.css";
import Search from "./Search";
import SearchList from "./SearchList";
import { initialState, reducer } from "../store/reducer";
import ActionService from "../store/ActionService";
import Movie from "./Movie";
import Series from "./Series";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import createPersistedReducer from 'use-persisted-reducer';

function App() {

  const usePersistedReducer = createPersistedReducer('state', localStorage);

  const [state, dispatch] = usePersistedReducer(reducer, initialState);

  const { loading, seriesLoading, results, errorMessage, mediaMode, mediaData } = state;

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
    displayResults = <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />;
  } else if (errorMessage) {
    displayResults = <div className="errorMessage">{errorMessage.toString()}</div>;
  } else if (mediaMode && mediaData?.media.type === 0) {
    displayResults = <Movie data={mediaData} />;
  } else if (mediaMode && mediaData?.media.type === 1) {
    displayResults = <Series loading={seriesLoading} data={mediaData} selectSeriesTranslation={selectSeriesTranslationHandler} selectSeriesEpisode={selectSeriesEpisodeHandler} />;
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
