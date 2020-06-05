import React, { useState, useRef, useEffect, useContext } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import useEventListener from '@use-it/event-listener';

interface MovieProps {
    data: MediaData;
}

const Movie = ({ data }: MovieProps) => {

    const videoRef = useRef<HTMLVideoElement>(null);

    const { dispatch } = useContext(ContextApp);

    const [currentTranslationId, setCurrentTranslationId] = useState<number>(data.media.currentTranslationId);

    const [currentQualityId, setCurrentQualityId] = useState<string>(data.media.currentQualityId);

    const [currentPositionUpdated, setCurrentPositionUpdated] = useState<boolean>(false);

    const [updateEnabled, setUpdateEnabled] = useState<boolean>(true);

    useEffect(() => {
        const interval = setInterval(() => {

            if (updateEnabled) {
                ActionService.updateMediaDataHandler(data, dispatch);
            }

        }, 30000);

        return () => {
            clearInterval(interval);
        };
    }, [data, dispatch, updateEnabled]);


    const setFullScreen = () => {
        if (videoRef.current && videoRef.current.webkitRequestFullScreen) {
            videoRef.current.webkitRequestFullScreen();
        } else if (videoRef.current && videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    }

    useEventListener('keydown', (event: React.KeyboardEvent) => {

        switch (event.which) {
            case 403:
                setFullScreen();
                break;

            case 404:
                setUpdateEnabled(false);
                ActionService.selectSearchResultHandler(data.searchResult, dispatch);
                break;

            default:
                break;
        }
    });

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
                    setUpdateEnabled(true);
                }
            }

            const onErrorHandler = (e: React.SyntheticEvent) => {

                if (videoRef.current?.networkState === 3) {
                    setUpdateEnabled(false);
                    ActionService.mediaRefreshHandler(data, dispatch);
                }
            }

            return (<React.Fragment><Header title={data.searchResult.name} />
                <div className="mediaInfo">
                    <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating} &nbsp;<button onClick={() => setFullScreen()}>Full screen</button></p>
                    <span>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} />&nbsp;
                    ( {translationsList.map(x => x.label).join(', ').toString()} )
                    </span>
                    <span>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} />&nbsp;
                    ( {qualityList.map(x => x.label).join(', ').toString()} )
                    </span>
                    <video ref={videoRef} autoPlay onCanPlay={onCanPlayHandler} onTimeUpdate={onTimeUpdatedHandler} onError={onErrorHandler} controls src={stream.urL2}>
                        <source src={stream.urL2} type="video/mp4" />
                    </video>
                </div>
            </React.Fragment >);
        }
    }

    return <Header title="No movie information" />;

};

export default Movie;