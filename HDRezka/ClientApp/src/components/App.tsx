import React, { useReducer, useEffect } from "react";
import "../App.css";
import Header from "./Header";
import Search from "./Search";
import spinner from "../ajax-loader.gif";
import { initialState, reducer } from "../store/reducer";

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
    console.log("search:" + input);
    dispatch({
      type: "SEARCH_REQUEST",
    });

    setTimeout(() => {
      dispatch({
        type: "SEARCH_SUCCESS",
        results: testResults,
      });
    }, 2000);

    setTimeout(() => {
      dispatch({
        type: "MEDIA_REQUEST",
      });
    }, 4000);

    setTimeout(() => {
      dispatch({
        type: "MEDIA_SUCCESS",
        media: { id: 123 },
      });
    }, 6000);
  };

  const { loading, results, errorMessage, mediaMode, media } = state;

  const displayMedia = () => {
    if (media)
      return (
        <React.Fragment>
          <h1>Media info</h1>
          <pre>{media.id}</pre>
        </React.Fragment>
      );
  };

  const displaySearch = () => {
    if (results.length) {
      let output = results.map((item, index) => (
        <p key={index}>
          {item.name} {item.text} {item.rating} {item.url}
        </p>
      ));

      return <React.Fragment>
        <h1>Search results</h1>
        {output}
      </React.Fragment>
    }
  };

  const displayResults =
    loading && !errorMessage ? (
      <img className="spinner" src={spinner} alt="Loading..." />
    ) : errorMessage ? (
      <div className="errorMessage">{errorMessage}</div>
    ) : (mediaMode ? (<div className="media" >{displayMedia()}</div>) : (<div className="results">{displaySearch()}</div>));

  console.log("App rendered");

  return (
    <div className="App">
      <Header title="Test" />
      <Search searchHandler={search} />
      {displayResults}
    </div>
  );
}

export default App;
