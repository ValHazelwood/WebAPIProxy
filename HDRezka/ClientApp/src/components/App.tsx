import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../App.css";
import Search from "./Search";
import SearchList from "./SearchList";
import { ContextApp } from "../store/reducer";
import Movie from "./Movie";
import Series from "./Series";
import History from "./History";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {

  const { state } = useContext(ContextApp);

  const { loading, errorMessage, mediaMode, mediaData } = state;

  let displayResults: JSX.Element;

  if (loading && !errorMessage) {
    displayResults = <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />;
  } else if (errorMessage) {
    displayResults = <div className="errorMessage">{errorMessage.toString()}</div>;
  } else if (mediaMode && mediaData) {
    displayResults = mediaData.media.type === 0 ? <Movie data={mediaData} /> : <Series data={mediaData} />;
  } else if (!mediaMode) {
    displayResults = <SearchList />;
  }

  console.log("App rendered");

  return (
    <div className="App">
      <Router>
        <Search />
        <Switch>
          <Route path="/history" component={History} />
          <Route component={() => displayResults} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
