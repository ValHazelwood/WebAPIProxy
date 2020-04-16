import React from "react";
import { Media } from "../store/types";
import Header from "./Header";

interface MediaTypes {
    selectedMedia: Media | undefined
}

const MediaInfo = ({ selectedMedia }: MediaTypes) => {

    let title: string;
    let output;

    if (selectedMedia) {
        title = "Media info";
        output = <pre>{selectedMedia.text} {selectedMedia.url}</pre>;
    } else {
        title = "No media information";
    }

    return (<React.Fragment><Header title={title} />{output}</React.Fragment>);
};

export default MediaInfo;