import React from "react";
import { MediaData } from "../store/types";
import Header from "./Header";

interface MediaTypes {
    selectedMedia: MediaData | undefined
}

const MediaInfo = ({ selectedMedia }: MediaTypes) => {

    let title: string;
    let output;

    if (selectedMedia && selectedMedia.searchResult) {
        title = selectedMedia.searchResult.name;

        output = <video controls><source src={selectedMedia.media.translations[0].cdnStreams[3].urL2} type="video/mp4" /></video>;

    } else {
        title = "No media information";
    }

    console.log(selectedMedia);

    return (<React.Fragment><Header title={title} />{output}</React.Fragment>);
};

export default MediaInfo;