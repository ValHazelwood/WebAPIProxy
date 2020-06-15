import React from "react";
import { SearchResult } from "../store/types";

interface MediaInfoProps {
    info: SearchResult;
}

const MediaInfo = ({ info }: MediaInfoProps) => {

    console.log("MediaInfo rendered");

    return (<React.Fragment><p>{info.name} {info.text} rating: {info.rating} </p></React.Fragment>);
}

export default MediaInfo;