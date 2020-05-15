import React, { useRef, MouseEvent, useContext } from "react";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";

const Search = () => {

  const inputRef = useRef<HTMLInputElement>(null);

  const { dispatch } = useContext(ContextApp);

  const callSearchFunction = (e: MouseEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value.length > 0) {
      ActionService.search(inputRef.current.value, dispatch);
    }
  };

  console.log("Search rendered");

  return (
    <header className="App-header">
      <form className="search">
        <input ref={inputRef} type="text"
        />
        <input onClick={callSearchFunction} type="submit" value="SEARCH" />
      </form>
    </header>
  );
};

export default Search;
