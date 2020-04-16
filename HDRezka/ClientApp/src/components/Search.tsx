import React, { useRef } from "react";

type SearchProps = {
  searchHandler: (input: string) => void;
};

const Search = ({ searchHandler }: SearchProps) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const setSearchValue = (input: string) => {
    if (inputRef.current) {
      inputRef.current.value = input;
    }
  };

  const callSearchFunction = (e: any) => {
    e.preventDefault();
    if (inputRef.current) {
      searchHandler(inputRef.current.value);
      setSearchValue("");
    }
  };

  console.log("Search rendered");

  return (
    <header className="App-header">
      <form className="search">
        <input ref={inputRef} onChange={(e) => setSearchValue(e.target.value)} type="text"
        />
        <input onClick={callSearchFunction} type="submit" value="SEARCH" />
      </form>
    </header>
  );
};

export default Search;
