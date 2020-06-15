import React, { useState, useContext } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import MediaService from "../store/MediaService";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Video from "./Video";
import Translation from "./Translation";
import Quality from "./Quality";
import SeriesNav from "./SeriesNav";
import MediaInfo from "./MediaInfo";

interface SeriesProps {
    data: MediaData;
}

const Series = ({ data }: SeriesProps) => {

    const countdownTimeout: number = 10;

    const countdownStartTimeout: number = 30;

    const { state, dispatch } = useContext(ContextApp);

    const { seriesLoading } = state;

    const [currentQualityId, setCurrentQualityId] = useState<string>(data.media.currentQualityId);

    const [videoOverlayVisible, setVideoOverlayVisible] = useState<boolean>(false);

    const [countDown, setCountDown] = useState<number>(countdownTimeout);

    if (seriesLoading) {
        return <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
        />
    }

    console.log("Series rendered");

    const onTranslationSelected = (value: string) => {

        ActionService.selectSeriesTranslationHandler(data.media.id, parseInt(value), data, dispatch);
    }

    const onQualitySelected = (value: string) => {

        data.media.currentQualityId = value;
        setCurrentQualityId(value);
    }

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

    const exitFullScreen = () => {
        if (document.webkitIsFullScreen && document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    const startCountDownHandler = (videoRef: React.RefObject<HTMLVideoElement>) => {

        if (videoRef && videoRef.current) {
            if (!videoOverlayVisible && (videoRef.current.duration - videoRef.current.currentTime) < countdownStartTimeout) {
                exitFullScreen();
                nextVideoPlayHandler();
            }
        }
    }

    const refreshLinks = () => {
        if (data.media.currentSeason && data.media.currentEpisode) {
            ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, data.media.currentEpisode, data, dispatch, true);
        }
    }

    let translation = data.media.translations.find(x => x.id === data.media.currentTranslationId);

    if (translation && translation.seasons) {

        let season = translation.seasons.find(x => x.id === data.media.currentSeason);

        if (season) {

            let stream = translation.cdnStreams.find(x => x.quality === currentQualityId);

            if (stream) {

                return (<React.Fragment><Header title={data.searchResult.name} />
                    <div className="mediaInfo">
                        <MediaInfo info={data.searchResult} />
                        <Translation data={data} translationSelected={onTranslationSelected} />
                        <SeriesNav data={data} />
                        <Quality translation={translation} currentQualityId={currentQualityId} qualitySelected={onQualitySelected} />
                        <Video data={data} streamUrl={stream.urL2} startCountDownHandler={startCountDownHandler} setVideoOverlayVisible={setVideoOverlayVisible} refreshLinks={refreshLinks} >
                            {videoOverlayVisible && <div className="video-overlay">Next video will start in {countDown} seconds...</div>}
                        </Video>
                    </div>
                </React.Fragment>);
            }
        }
    }

    return <Header title="No series data" />;

};

export default Series;

