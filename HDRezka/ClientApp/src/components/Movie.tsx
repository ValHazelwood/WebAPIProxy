import React, { useState } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';

interface MovieProps {
    data: MediaData
}

const Movie = ({ data }: MovieProps) => {

    const [currentTranslationId, setCurrentTranslationId] = useState<number>(data.media.currentTranslationId);

    const [currentQualityId, setCurrentQualityId] = useState<string>(data.media.currentQualityId);

    console.log("Movie rendered");

    console.log(data);

    let translation = data.media.translations.find(x => x.id === currentTranslationId);

    let translationsList = data.media.translations.map(x => ({ value: x.id.toString(), label: x.name }));

    let translationDefaultOption = translationsList.find(x => x.value === currentTranslationId?.toString());

    if (translation) {
        let stream = translation.cdnStreams.find(x => x.quality === currentQualityId);

        let qualityList = translation.cdnStreams.map(x => ({ value: x.quality, label: x.quality }));

        let qualityDefaultOption = qualityList.find(x => x.value === currentQualityId);

        if (stream) {

            const onTranslationSelected = (option: Option) => {

                setCurrentTranslationId(parseInt(option.value));
            }

            const onQualitySelected = (option: Option) => {

                data.media.currentQualityId = option.value;
                setCurrentQualityId(option.value);
            }

            return (<React.Fragment><Header title={data.searchResult.name} />
                <div className="mediaInfo">
                    <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating}</p>
                    <p>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} /> ( {translationsList.map(x => x.label).join(', ').toString()} )</p>
                    <p>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} /> ( {qualityList.map(x => x.label).join(', ').toString()} )</p>
                    <video controls src={stream.urL2}> <source src={stream.urL2} type="video/mp4" /></video>
                </div>
            </React.Fragment>);
        }
    }

    return <Header title="No movie information" />;

};

export default Movie;