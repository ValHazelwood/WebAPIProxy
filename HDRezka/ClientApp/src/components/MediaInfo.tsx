import React, { useState } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

interface MediaTypes {
    data: MediaData | undefined
}

const MediaInfo = ({ data }: MediaTypes) => {

    const [currentTranslationId, setCurrentTranslationId] = useState<number | undefined>(data?.media?.currentTranslationId);

    const [currentQualityId, setCurrentQualityId] = useState<string>("480p");

    console.log(data);

    if (data && data.searchResult && data.media) {

        if (data.media.type === 0) {

            let translationsList = data.media.translations.map(x => ({ value: x.id.toString(), label: x.name }));

            let translationDefaultOption = translationsList.find(x => x.value === currentTranslationId?.toString());

            let translation = data.media.translations.find(x => x.id === currentTranslationId);

            if (translation) {
                let quality = translation.cdnStreams.find(x => x.quality === currentQualityId);

                let qualityList = translation.cdnStreams.map(x => ({ value: x.quality, label: x.quality }));

                let qualityDefaultOption = qualityList.find(x => x.value === currentQualityId);

                if (quality) {

                    let srcUrl = quality.urL2;

                    const onTranslationSelected = (option: any) => {

                        console.log(option);

                        setCurrentTranslationId(parseInt(option.value));
                    }

                    const onQualitySelected = (option: any) => {

                        console.log(option);

                        setCurrentQualityId(option.value);
                    }

                    return (<React.Fragment><Header title={data.searchResult.name} />
                        <div className="mediaInfo">
                            <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating}</p>
                            <p>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} /></p>
                            <p>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} /></p>
                            <video controls src={srcUrl}> <source src={srcUrl} type="video/mp4" /></video>
                        </div>
                    </React.Fragment>);
                }
            }
        } else {
            return (<React.Fragment><Header title="Series information" /></React.Fragment>);
        }

    }

    return (<React.Fragment><Header title="No media information" /></React.Fragment>);

};

export default MediaInfo;