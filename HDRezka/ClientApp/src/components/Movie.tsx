import React, { useState, useRef, useEffect } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';

interface MovieProps {
    data: MediaData;
    updateMediaData: (data: MediaData) => void;
}

const Movie = ({ data, updateMediaData }: MovieProps) => {

    const videoRef = useRef<HTMLVideoElement>(null);

    const [currentTranslationId, setCurrentTranslationId] = useState<number>(data.media.currentTranslationId);

    const [currentQualityId, setCurrentQualityId] = useState<string>(data.media.currentQualityId);

    const [currentPositionUpdated, setCurrentPositionUpdated] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            updateMediaData(data);
        }, 30000);

        return () => {
            clearInterval(interval);
        };
    }, [data, updateMediaData]);

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

            const onTimeUpdatedHandler = (e: React.SyntheticEvent) => {

                if (videoRef.current && currentPositionUpdated) {
                    data.media.currentTime = videoRef.current.currentTime;
                }
            }

            const onCanPlayHandler = (e: React.SyntheticEvent) => {
                if (videoRef.current && !currentPositionUpdated) {
                    videoRef.current.currentTime = data.media.currentTime;
                    setCurrentPositionUpdated(true);
                }
            }

            const onPlayHandler = (e: React.SyntheticEvent) => {
                if (videoRef.current && videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                }
            }

            return (<React.Fragment><Header title={data.searchResult.name} />
                <div className="mediaInfo">
                    <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating}</p>
                    <p>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} /> ( {translationsList.map(x => x.label).join(', ').toString()} )</p>
                    <p>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} /> ( {qualityList.map(x => x.label).join(', ').toString()} )</p>
                    <video ref={videoRef} onPlay={onPlayHandler} onCanPlay={onCanPlayHandler} onTimeUpdate={onTimeUpdatedHandler} controls src={stream.urL2}> <source src={stream.urL2} type="video/mp4" /></video>
                </div>
            </React.Fragment>);
        }
    }

    return <Header title="No movie information" />;

};

export default Movie;