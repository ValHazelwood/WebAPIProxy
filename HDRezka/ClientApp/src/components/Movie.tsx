import React, { useState, useContext } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import Translation from "./Translation";
import Quality from "./Quality";
import Video from "./Video";
import MediaInfo from "./MediaInfo";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Hls from "hls.js";

interface MovieProps {
    data: MediaData;
}

const Movie = ({ data }: MovieProps) => {

    const { state, dispatch } = useContext(ContextApp);

    const { seriesLoading } = state;

    const [currentQualityId, setCurrentQualityId] = useState<string>(data.media.currentQualityId);

    if (seriesLoading) {
        return <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
        />
    }

    console.log("Movie rendered");

    const onTranslationSelected = (value: string) => {

        ActionService.selectMovieTranslationHandler(data.media.id, parseInt(value), data, dispatch);
    }

    const onQualitySelected = (value: string) => {

        data.media.currentQualityId = value;
        setCurrentQualityId(value);
    }

    const refreshLinks = () => {
        ActionService.selectMovieTranslationHandler(data.media.id, data.media.currentTranslationId, data, dispatch, true);
    }

    let translation = data.media.translations.find(x => x.id === data.media.currentTranslationId);

    if (translation) {
        let stream = translation.cdnStreams.find(x => x.quality === currentQualityId);

        if (stream) {

            return (<React.Fragment><Header title={data.searchResult.name} />
                <div className="mediaInfo">
                    <MediaInfo info={data.searchResult} />
                    <Translation data={data} translationSelected={onTranslationSelected} />
                    <Quality translation={translation} currentQualityId={currentQualityId} qualitySelected={onQualitySelected} />
                    {Hls.isSupported() && <span><a download href={stream.urL2}>MP4 version</a></span>}
                    <Video data={data} streamUrl={Hls.isSupported() ? stream.urL1 : stream.urL2} refreshLinks={refreshLinks} />
                </div>
            </React.Fragment >);
        }
    }

    return <Header title="No movie information" />;

};

export default Movie;