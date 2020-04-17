import React from "react";
import { MediaData } from "../store/types";
import Header from "./Header";

interface MediaTypes {
    data: MediaData | undefined
}

const MediaInfo = ({ data }: MediaTypes) => {

    console.log(data);
    if (data && data.searchResult) {
        return (<React.Fragment><Header title={data.searchResult.name} />
            <div className="mediaInfo">
                <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating}</p>
                <video controls> <source src={data.media.translations[0].cdnStreams[3].urL2} type="video/mp4" /></video>
            </div>
        </React.Fragment>);
    }

    return (<React.Fragment><Header title="No media information" /></React.Fragment>);
};

export default MediaInfo;