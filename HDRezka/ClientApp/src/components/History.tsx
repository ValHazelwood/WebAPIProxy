import React, { useContext, MouseEvent } from "react";
import { ContextApp } from "../store/reducer";
import Header from "./Header";
import ActionService from "../store/ActionService";
import { Mode } from "../store/types";

const History = () => {

    let title: string;
    let outputList;

    const { state, dispatch } = useContext(ContextApp);

    const { mediaData, history } = state;

    console.log("History rendered");

    const onClickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        let selectedItem = history.find((x) => x.searchResult.url === e.currentTarget.href);

        if (selectedItem) {

            if (mediaData) {
                ActionService.push2History(mediaData, dispatch);
            }

            ActionService.fromHistory(selectedItem, dispatch);

            ActionService.changeMode(Mode.Media, dispatch)
        }
    };

    if (history && history.length) {
        outputList = history.map((item, index) => (
            <li key={index}>
                <a href={item.searchResult.url} onClick={onClickHandler}>{item.searchResult.name} {item.searchResult.text} {item.searchResult.rating}</a>
            </li>
        ));

        title = "View history";

    } else {

        title = "No history";
    }

    return (<React.Fragment>
        <div className="history-buttons">
            <Header title={title} />
            <button onClick={() => { ActionService.clearHistory(dispatch); }} >Clear History</button>
        </div>
        <div>
            <ul className="history">{outputList}</ul>
        </div>
    </React.Fragment>);
};

export default History;
