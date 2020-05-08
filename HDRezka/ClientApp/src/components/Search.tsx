import React, { useRef, MouseEvent } from "react";

type SearchProps = {
  searchHandler: (input: string) => void;
};

const Search = ({ searchHandler }: SearchProps) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const callSearchFunction = (e: MouseEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value.length > 0) {
      searchHandler(inputRef.current.value);
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
