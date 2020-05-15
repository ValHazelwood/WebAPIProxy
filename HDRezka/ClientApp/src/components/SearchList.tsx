import React, { useContext, MouseEvent } from "react";
import Header from "./Header";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";

const SearchList = () => {

    let title: string;
    let outputList;

    const { state, dispatch } = useContext(ContextApp);

    const { results } = state;

    const onClickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        ActionService.selectSearchResultHandler(e.currentTarget.href, results, dispatch);
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