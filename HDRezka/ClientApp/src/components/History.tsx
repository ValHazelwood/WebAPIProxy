import React, { useContext, MouseEvent } from "react";
import { ContextApp } from "../store/reducer";
import Header from "./Header";

const History = () => {

    let title: string;
    let outputList;

    const { state } = useContext(ContextApp);

    const { history } = state;

    console.log("History rendered");

    const onClickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

    };

    if (history.length) {
        outputList = history.map((item, index) => (
            <li key={index}>
                <a href={item.searchResult.url} onClick={onClickHandler}>{item.searchResult.name} {item.searchResult.text} {item.searchResult.rating}</a>
            </li>
        ));

        title = "View history";

    } else {

        title = "No history";
    }

    return (<React.Fragment><Header title={title} /><ul className="history">{outputList}</ul></React.Fragment>);
};

export default History;
