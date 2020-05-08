import React, { MouseEvent } from "react";
import { SearchResult } from "../store/types";
import Header from "./Header";

interface SearchListType {
    results: SearchResult[];
    selectHandler: (selectedItemUrl: string) => void;
}

const SearchList = ({ results, selectHandler }: SearchListType) => {

    let title: string;
    let outputList;

    const onClickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        selectHandler(e.currentTarget.href);
    };

    if (results.length) {
        outputList = results.map((item, index) => (
            <p key={index}>
                <a href={item.url} onClick={onClickHandler}>{item.name} {item.text} {item.rating}</a>
            </p>
        ));

        title = "Search results";

    } else {

        title = "No results yet";
    }

    return (<React.Fragment><Header title={title} />{outputList}</React.Fragment>);
};

export default SearchList;