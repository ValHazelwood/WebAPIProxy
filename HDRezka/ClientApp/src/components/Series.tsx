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
import Dropdown, { Option } from 'react-dropdown';

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

        let seasonsList = translation.seasons.map(x => ({ value: x.id.toString(), label: x.id.toString() }));

        let seasonDefaultOption = seasonsList.find(x => x.value === data.media.currentSeason?.toString());

        let season = translation.seasons.find(x => x.id === data.media.currentSeason);

        if (season) {

            let episodesList = season.episodes.map(x => ({ value: x.toString(), label: x.toString() }));

            let episodeDefaultOption = episodesList.find(x => x.value === data.media.currentEpisode?.toString());

            let stream = translation.cdnStreams.find(x => x.quality === currentQualityId);

            if (stream) {

                const onSeasonSelected = (option: Option) => {

                    let queryEpisode = translation?.seasons?.find(x => x.id === parseInt(option.value))?.episodes[0];
                    if (queryEpisode) {
                        ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, parseInt(option.value), queryEpisode, data, dispatch);
                    }
                }

                const onEpisodeSelected = (option: Option) => {

                    if (data.media.currentSeason) {
                        ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, parseInt(option.value), data, dispatch);
                    }
                }

                return (<React.Fragment><Header title={data.searchResult.name} />
                    <div className="mediaInfo">
                        <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating} </p>
                        <Translation data={data} translationSelected={onTranslationSelected} />
                        <span>Season: <button onClick={() => MediaService.prevSeasonSelectedHandler(data, dispatch)} disabled={data.media.currentSeason === parseInt(seasonsList[0].value)}>&lt;</button>&nbsp;
                            <Dropdown className="seasonSelect" options={seasonsList} onChange={onSeasonSelected} value={seasonDefaultOption} />&nbsp;
                            <button onClick={() => MediaService.nextSeasonSelectedHandler(data, dispatch)} disabled={data.media.currentSeason === parseInt(seasonsList[seasonsList.length - 1].value)}>&gt;</button>&nbsp;
                        ( {seasonsList.map(x => x.label).join(', ').toString()} )
                        </span>
                        <span>Episode: <button onClick={() => MediaService.prevEpisodeSelectedHandler(data, dispatch)} disabled={data.media.currentEpisode === parseInt(episodesList[0].value)}>&lt;</button>&nbsp;
                            <Dropdown className="episodeSelect" options={episodesList} onChange={onEpisodeSelected} value={episodeDefaultOption} />&nbsp;
                            <button onClick={() => MediaService.nextEpisodeSelectedHandler(data, dispatch)} disabled={data.media.currentEpisode === parseInt(episodesList[episodesList.length - 1].value)}>&gt;</button>&nbsp;
                        ( {episodesList.map(x => x.label).join(', ').toString()} )
                        </span>
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

