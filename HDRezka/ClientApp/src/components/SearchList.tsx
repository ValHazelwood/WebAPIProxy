import React from "react";
import { SearchResult } from "../store/types";
import Header from "./Header";

interface SearchListType {
    results: SearchResult[];
    selectHandler: (text: string, url: string) => void;
}

const SearchList = ({ results, selectHandler }: SearchListType) => {

    let title: string;
    let outputList;

    const onClickHandler = (e: any) => {
        e.preventDefault();
        console.log(e.currentTarget.text);
        console.log(e.currentTarget.href);
        selectHandler(e.currentTarget.text, e.currentTarget.href);
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