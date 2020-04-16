import React, { useReducer } from "react";
import "../App.css";
import Search from "./Search";
import SearchList from "./SearchList";
import MediaInfo from "./MediaInfo";
import spinner from "../ajax-loader.gif";
import { initialState, reducer } from "../store/reducer";
import FetchService from "../store/FetchService";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  let testResults = [
    {
      name: "Терминатор: Да придёт спаситель",
      text: " (Terminator Salvation, 2009)",
      rating: "6.77",
      url: "file://terminator-da-pridet-spasitel-2009.html",
    },
    {
      name: "Терминатор: Генезис",
      text: " (Terminator: Genisys, 2015)",
      rating: "6.46",
      url: "file://terminator-genezis.html",
    },
    {
      name: "Терминатор",
      text: " (The Terminator, 1984)",
      rating: "7.97",
      url: "file://terminator-1984.html",
    },
    {
      name: "Терминатор 2: Судный день",
      text: " (Terminator 2: Judgment Day, 1991)",
      rating: "8.31",
      url:
        "file://terminator-2-sudnyy-den-1991.html",
    },
    {
      name: "Терминатор 3: Восстание машин",
      text: " (Terminator 3: Rise of the Machines, 2003)",
      rating: "6.78",
      url:
        "file://terminator-3-vosstanie-mashin-2003.html",
    },
  ];

  let search = (input: string) => {
    console.log("search: " + input);
    dispatch({
      type: "SEARCH_REQUEST",
    });

    FetchService.search(input);

    setTimeout(() => {
      dispatch({
        type: "SEARCH_SUCCESS",
        results: testResults,
      });
    }, 2000);
  };

  let selectHandler = (text: string, url: string) => {

    console.log("selected: " + text);

    dispatch({
      type: "MEDIA_REQUEST",
    });

    setTimeout(() => {
      dispatch({
        type: "MEDIA_SUCCESS",
        media: { id: 0, text: text, url: url },
      });
    }, 2000);

  };

  const { loading, results, errorMessage, mediaMode, media } = state;

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
