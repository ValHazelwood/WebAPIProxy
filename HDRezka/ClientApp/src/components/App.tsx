import React, { useContext } from "react";
import "../App.css";
import Menu from "./Menu";
import SearchList from "./SearchList";
import { ContextApp } from "../store/reducer";
import Movie from "./Movie";
import Series from "./Series";
import History from "./History";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Mode } from "../store/types";

function App() {

  const { state } = useContext(ContextApp);

  const { loading, errorMessage, mode, mediaData } = state;

  let displayResults;

  if (loading && !errorMessage) {
    displayResults = <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />;
  } else if (errorMessage) {
    displayResults = <div className="errorMessage">{errorMessage.toString()}</div>;
  } else if (mode === Mode.Media && mediaData) {
    displayResults = mediaData.media.type === 0 ? <Movie data={mediaData} /> : <Series data={mediaData} />;
  } else if (mode === Mode.Result) {
    displayResults = <SearchList />;
  } else if (mode === Mode.History) {
    displayResults = <History />;
  }


  console.log("App rendered");

  return (
    <div className="App">
      <Menu />
      {displayResults}
    </div>
  );
}

export default App;
