import React, { useRef, MouseEvent, useContext } from "react";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import { useHistory } from "react-router-dom";

const Search = () => {

  const inputRef = useRef<HTMLInputElement>(null);

  const { state, dispatch } = useContext(ContextApp);

  const { mediaData } = state;

  let history = useHistory();

  const callSearchFunction = (e: MouseEvent) => {
    e.preventDefault();
    if (inputRef.current && /\S/.test(inputRef.current.value)) {

      if (mediaData) {
        ActionService.push2History(mediaData, dispatch);
      }

      history.push("/");

      ActionService.search(inputRef.current.value, dispatch);
    }
  };

  console.log("Search rendered");

  return (
    <header className="App-header">
      <div className="buttons" >
        <button onClick={() => { history.push("/"); }} >Home</button>
        <button onClick={() => { history.push("/history"); }} >History</button>
        <form className="search">
          <input ref={inputRef} type="text"
          />
          <input onClick={callSearchFunction} type="submit" value="SEARCH" />
        </form>
      </div>
    </header>
  );
};

export default Search;
