import React, { useState, useContext } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import Translation from "./Translation";
import Quality from "./Quality";
import Video from "./Video";
import MediaInfo from "./MediaInfo";

interface MovieProps {
    data: MediaData;
}

const Movie = ({ data }: MovieProps) => {

    const { dispatch } = useContext(ContextApp);

    const [currentTranslationId, setCurrentTranslationId] = useState<number>(data.media.currentTranslationId);

    const [currentQualityId, setCurrentQualityId] = useState<string>(data.media.currentQualityId);

    console.log("Movie rendered");

    const onTranslationSelected = (value: string) => {

        setCurrentTranslationId(parseInt(value));
    }

    const onQualitySelected = (value: string) => {

        data.media.currentQualityId = value;
        setCurrentQualityId(value);
    }

    let translation = data.media.translations.find(x => x.id === currentTranslationId);

    if (translation) {
        let stream = translation.cdnStreams.find(x => x.quality === currentQualityId);

        if (stream) {

            return (<React.Fragment><Header title={data.searchResult.name} />
                <div className="mediaInfo">
                    <MediaInfo info={data.searchResult} />
                    <Translation data={data} translationSelected={onTranslationSelected} />
                    <Quality translation={translation} currentQualityId={currentQualityId} qualitySelected={onQualitySelected} />
                    <Video data={data} streamUrl={stream.urL2} refreshLinks={() => ActionService.mediaRefreshHandler(data, dispatch)} />
                </div>
            </React.Fragment >);
        }
    }

    return <Header title="No movie information" />;

};

export default Movie;