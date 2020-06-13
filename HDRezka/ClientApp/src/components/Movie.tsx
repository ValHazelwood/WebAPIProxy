import React, { useState, useRef, useEffect, useContext } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import useEventListener from '@use-it/event-listener';
import Translation from "./Translation";
import Quality from "./Quality";

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

    const refreshLinksHandler = () => {
        setUpdateEnabled(false);
        ActionService.mediaRefreshHandler(data, dispatch);
    }

    useEventListener('keydown', (event: React.KeyboardEvent) => {

        switch (event.which) {
            case 403:
                setFullScreen();
                break;

            case 404:
                refreshLinksHandler();
                break;

            default:
                break;
        }
    });

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
                    refreshLinksHandler();
                }
            }

            return (<React.Fragment><Header title={data.searchResult.name} />
                <div className="mediaInfo">
                    <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating} </p>
                    <Translation data={data} translationSelected={onTranslationSelected} />
                    <Quality translation={translation} currentQualityId={currentQualityId} qualitySelected={onQualitySelected} />
                    <span>
                        <button onClick={() => setFullScreen()}>Full screen (A)</button>&nbsp;<button onClick={refreshLinksHandler}>Refresh (B)</button>
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