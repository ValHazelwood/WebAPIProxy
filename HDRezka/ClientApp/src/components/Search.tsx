import React, { useState } from "react";

type SearchProps = {
  searchHandler: (input: string) => void;
};

const Search = ({ searchHandler }: SearchProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChanges = (e: any) => {
    setSearchValue(e.target.value);
  };

  const resetInputField = () => {
    setSearchValue("");
  };

  const callSearchFunction = (e: any) => {
    e.preventDefault();
    searchHandler(searchValue);
    resetInputField();
  };

  console.log("Search rendered");

  return (
    <form className="search">
      <input
        value={searchValue}
        onChange={handleSearchInputChanges}
        type="text"
      />
      <input onClick={callSearchFunction} type="submit" value="SEARCH" />
    </form>
  );
};

export default Search;
