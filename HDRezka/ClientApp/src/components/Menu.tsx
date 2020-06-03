import React, { useContext } from "react";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import { Mode } from "../store/types";
import Search from "./Search";

const Menu = () => {

    const { dispatch } = useContext(ContextApp);

    console.log("Menu rendered");

    return (
        <header className="App-header">
            <div className="buttons" >
                <button onClick={() => { ActionService.changeMode(Mode.Result, dispatch) }} >Search results</button>
                <button onClick={() => { ActionService.changeMode(Mode.Media, dispatch) }} >Watch</button>
                <button onClick={() => { ActionService.changeMode(Mode.History, dispatch) }} >History</button>
                <Search />
            </div>
        </header>
    );
};

export default Menu;
