import React, { useContext } from "react";
import "../App.css";
import Search from "./Search";
import SearchList from "./SearchList";
import { ContextApp } from "../store/reducer";
import Movie from "./Movie";
import Series from "./Series";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {

  const { state } = useContext(ContextApp);

  const { loading, errorMessage, mediaMode, mediaData } = state;

  let displayResults;

  if (loading && !errorMessage) {
    displayResults = <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />;
  } else if (errorMessage) {
    displayResults = <div className="errorMessage">{errorMessage.toString()}</div>;
  } else if (mediaMode && mediaData?.media.type === 0) {
    displayResults = <Movie data={mediaData} />;
  } else if (mediaMode && mediaData?.media.type === 1) {
    displayResults = <Series data={mediaData} />;
  } else if (!mediaMode) {
    displayResults = <SearchList />;
  }

  console.log("App rendered");

  return (
    <div className="App">
      <Search />
      {displayResults}
    </div>
  );
}

export default App;
