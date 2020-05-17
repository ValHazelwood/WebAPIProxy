import React, { useRef, MouseEvent, useContext } from "react";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import { Mode } from "../store/types";

const Search = () => {

  const inputRef = useRef<HTMLInputElement>(null);

  const { state, dispatch } = useContext(ContextApp);

  const { mediaData } = state;

  const callSearchFunction = (e: MouseEvent) => {
    e.preventDefault();
    if (inputRef.current && /\S/.test(inputRef.current.value)) {

      if (mediaData) {
        ActionService.push2History(mediaData, dispatch);
      }

      ActionService.search(inputRef.current.value, dispatch);
    }
  };

  console.log("Search rendered");

  return (
    <header className="App-header">
      <div className="buttons" >
        <button onClick={() => { ActionService.changeMode(Mode.Result, dispatch) }} >Search results</button>
        <button onClick={() => { ActionService.changeMode(Mode.Media, dispatch) }} >Watch</button>
        <button onClick={() => { ActionService.changeMode(Mode.History, dispatch) }} >History</button>
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
