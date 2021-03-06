import React from "react";
import { initialState, reducer, ContextApp } from "../store/reducer";
import createPersistedReducer from 'use-persisted-reducer';
import App from "./App";

const Main = () => {

    const usePersistedReducer = createPersistedReducer('state', localStorage);

    const [state, dispatch] = usePersistedReducer(reducer, initialState);

    return (<ContextApp.Provider value={{ state, dispatch }}><App /></ContextApp.Provider>);
}

export default Main;