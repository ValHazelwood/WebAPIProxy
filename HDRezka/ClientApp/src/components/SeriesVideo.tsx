import React, { useState, useEffect, useRef, useContext } from "react";
import useEventListener from '@use-it/event-listener';
import { MediaData } from "../store/types";
import ActionService from "../store/ActionService";
import MediaService from "../store/MediaService";
import { ContextApp } from "../store/reducer";

interface SeriesVideoProps {
    data: MediaData;
    streamUrl: string
}

const SeriesVideo = ({ data, streamUrl }: SeriesVideoProps) => {

    console.log("SeriesVideo rendered");

    const countdownTimeout: number = 10;

    const countdownStartTimeout: number = 30;

    const videoRef = useRef<HTMLVideoElement>(null);

    const { dispatch } = useContext(ContextApp);

    const [currentPositionUpdated, setCurrentPositionUpdated] = useState<boolean>(false);

    const [videoOverlayVisible, setVideoOverlayVisible] = useState<boolean>(false);

    const [countDown, setCountDown] = useState<number>(countdownTimeout);

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

    const exitFullScreen = () => {
        if (document.webkitIsFullScreen && document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    const refreshLinksHandler = () => {
        setUpdateEnabled(false);
        if (data.media.currentSeason && data.media.currentEpisode) {
            ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, data.media.currentEpisode, data, dispatch, true);
        }
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

    const videoPlayDelayHandler = (data: MediaData, action: (data: MediaData, dispatch: React.Dispatch<any>) => void) => {

        let countdownInterval = setInterval(() => { setCountDown(countDown => countDown - 1) }, 1000);

        setVideoOverlayVisible(true);
        setTimeout(() => {
            action(data, dispatch);
            setVideoOverlayVisible(false);
            clearInterval(countdownInterval);
            setCountDown(countdownTimeout);
        }, countdownTimeout * 1000);

    }

    const nextVideoPlayHandler = () => {

        let translation = data.media.translations.find(x => x.id === data.media.currentTranslationId);

        let season = translation?.seasons?.find(x => x.id === data.media.currentSeason);

        if (data.media.currentEpisode !== season?.episodes[season.episodes.length - 1]) {

            videoPlayDelayHandler(data, MediaService.nextEpisodeSelectedHandler);

        } else {

            videoPlayDelayHandler(data, MediaService.nextSeasonSelectedHandler);
        }

    }

    const onTimeUpdatedHandler = (e: React.SyntheticEvent) => {

        if (videoRef.current && currentPositionUpdated) {
            data.media.currentTime = videoRef.current.currentTime;

            if (!videoOverlayVisible && (videoRef.current.duration - videoRef.current.currentTime) < countdownStartTimeout) {
                exitFullScreen();
                nextVideoPlayHandler();
            }
        }
    }

    const onCanPlayHandler = (e: React.SyntheticEvent) => {
        if (videoRef.current && !currentPositionUpdated) {
            videoRef.current.currentTime = data.media.currentTime;
            setCurrentPositionUpdated(true);
            setUpdateEnabled(true);
        }
    }

    const fullScreenHandler = (e: React.MouseEvent) => {
        setFullScreen();
        setVideoOverlayVisible(false);
    }

    const onErrorHandler = (e: React.SyntheticEvent) => {

        if (videoRef.current?.networkState === 3) {
            refreshLinksHandler();
        }
    }

    return (<React.Fragment>
        <span className="video-buttons">
            <button onClick={fullScreenHandler}>Full screen (A)</button>&nbsp;<button onClick={refreshLinksHandler}>Refresh (B)</button>
        </span>
        <div className="video-container">
            <video className="video" ref={videoRef} autoPlay onCanPlay={onCanPlayHandler} onTimeUpdate={onTimeUpdatedHandler} onError={onErrorHandler} controls src={streamUrl}>
                <source src={streamUrl} type="video/mp4" />
            </video>
            {videoOverlayVisible && <div className="video-overlay">Next video will start in {countDown} seconds...</div>}
        </div>
    </React.Fragment>);
}

export default SeriesVideo;