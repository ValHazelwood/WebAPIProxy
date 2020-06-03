import React, { useState, useEffect, useRef, useContext } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import useEventListener from '@use-it/event-listener';

interface SeriesProps {
    data: MediaData;
}

const Series = ({ data }: SeriesProps) => {

    const countdownTimeout: number = 10;

    const countdownStartTimeout: number = 30;

    const videoRef = useRef<HTMLVideoElement>(null);

    const { state, dispatch } = useContext(ContextApp);

    const { seriesLoading } = state;

    const [currentQualityId, setCurrentQualityId] = useState<string>(data.media.currentQualityId);

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

    useEventListener('keydown', (event: React.KeyboardEvent) => {
        switch (event.which) {
            case 403:
                setFullScreen();
                break;

            case 404:
                setUpdateEnabled(false);
                if (data.media.currentSeason && data.media.currentEpisode) {
                    ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, data.media.currentEpisode, data, dispatch);
                }
                break;

            default:
                break;
        }
    });

    if (seriesLoading) {
        return <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
        />
    }

    console.log("Series rendered");

    console.log(data);

    let translation = data.media.translations.find(x => x.id === data.media.currentTranslationId);

    let translationsList = data.media.translations.map(x => ({ value: x.id.toString(), label: x.name }));

    let translationDefaultOption = translationsList.find(x => x.value === data.media.currentTranslationId.toString());

    if (translation && translation.seasons) {

        let seasonsList = translation.seasons.map(x => ({ value: x.id.toString(), label: x.id.toString() }));

        let seasonDefaultOption = seasonsList.find(x => x.value === data.media.currentSeason?.toString());

        let season = translation.seasons.find(x => x.id === data.media.currentSeason);

        if (season) {

            let episodesList = season.episodes.map(x => ({ value: x.toString(), label: x.toString() }));

            let episodeDefaultOption = episodesList.find(x => x.value === data.media.currentEpisode?.toString());

            let stream = translation.cdnStreams.find(x => x.quality === currentQualityId);

            let qualityList = translation.cdnStreams.map(x => ({ value: x.quality, label: x.quality }));

            let qualityDefaultOption = qualityList.find(x => x.value === currentQualityId);

            if (stream) {

                const onTranslationSelected = (option: Option) => {

                    ActionService.selectSeriesTranslationHandler(data.media.id, parseInt(option.value), data, dispatch);
                }

                const onSeasonSelected = (option: Option) => {

                    let queryEpisode = translation?.seasons?.find(x => x.id === parseInt(option.value))?.episodes[0];
                    if (queryEpisode) {
                        ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, parseInt(option.value), queryEpisode, data, dispatch);
                    }
                }

                const prevSeasonSelected = (e: React.MouseEvent) => {

                    if (data.media.currentSeason) {
                        let currentSeasonIndex = seasonsList.findIndex(x => parseInt(x.value) === data.media.currentSeason);

                        let prevSeason = seasonsList[currentSeasonIndex - 1].value;

                        let queryEpisode = translation?.seasons?.find(x => x.id === parseInt(prevSeason))?.episodes[0];

                        if (queryEpisode) {
                            ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, parseInt(prevSeason), queryEpisode, data, dispatch);
                        }
                    }
                }

                const nextSeasonSelectedHandler = () => {

                    if (data.media.currentSeason) {

                        let currentSeasonIndex = seasonsList.findIndex(x => parseInt(x.value) === data.media.currentSeason);

                        let nextSeason = seasonsList[currentSeasonIndex + 1].value;

                        let queryEpisode = translation?.seasons?.find(x => x.id === parseInt(nextSeason))?.episodes[0];

                        if (queryEpisode) {
                            ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, parseInt(nextSeason), queryEpisode, data, dispatch);
                        }
                    }
                }

                const onEpisodeSelected = (option: Option) => {

                    if (data.media.currentSeason) {
                        ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, parseInt(option.value), data, dispatch);
                    }
                }

                const prevEpisodeSelected = (e: React.MouseEvent) => {
                    if (data.media.currentSeason && data.media.currentEpisode) {

                        let currentEpisodeIndex = episodesList.findIndex(x => parseInt(x.value) === data.media.currentEpisode);

                        let prevEpisode = episodesList[currentEpisodeIndex - 1].value;

                        ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, parseInt(prevEpisode), data, dispatch);
                    }
                }

                const nextEpisodeSelectedHandler = () => {
                    if (data.media.currentSeason && data.media.currentEpisode) {
                        let currentEpisodeIndex = episodesList.findIndex(x => parseInt(x.value) === data.media.currentEpisode);
                        let nextEpisode = episodesList[currentEpisodeIndex + 1].value;
                        ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, parseInt(nextEpisode), data, dispatch);
                    }
                }

                const onQualitySelected = (option: Option) => {

                    data.media.currentQualityId = option.value;
                    setCurrentQualityId(option.value);
                }

                const videoPlayDelayHandler = (action: () => void) => {

                    let countdownInterval = setInterval(() => { setCountDown(countDown => countDown - 1) }, 1000);

                    setVideoOverlayVisible(true);
                    setTimeout(() => {
                        action();
                        setVideoOverlayVisible(false);
                        clearInterval(countdownInterval);
                        setCountDown(countdownTimeout);
                    }, countdownTimeout * 1000);

                }

                const nextVideoPlayHandler = () => {

                    if (data.media.currentEpisode !== parseInt(episodesList[episodesList.length - 1].value)) {

                        videoPlayDelayHandler(nextEpisodeSelectedHandler);

                    } else {

                        videoPlayDelayHandler(nextSeasonSelectedHandler);
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
                        setUpdateEnabled(false);
                        if (data.media.currentSeason && data.media.currentEpisode) {
                            ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, data.media.currentEpisode, data, dispatch);
                        }
                    }
                }

                return (<React.Fragment><Header title={data.searchResult.name} />
                    <div className="mediaInfo">
                        <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating} &nbsp;<button onClick={fullScreenHandler}>Full screen</button></p>
                        <span>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} />&nbsp;
                        ( {translationsList.map(x => x.label).join(', ').toString()} )
                        </span>
                        <span>Season: <button onClick={prevSeasonSelected} disabled={data.media.currentSeason === parseInt(seasonsList[0].value)}>&lt;</button>&nbsp;
                            <Dropdown className="seasonSelect" options={seasonsList} onChange={onSeasonSelected} value={seasonDefaultOption} />&nbsp;
                            <button onClick={() => nextSeasonSelectedHandler()} disabled={data.media.currentSeason === parseInt(seasonsList[seasonsList.length - 1].value)}>&gt;</button>&nbsp;
                        ( {seasonsList.map(x => x.label).join(', ').toString()} )
                        </span>
                        <span>Episode: <button onClick={prevEpisodeSelected} disabled={data.media.currentEpisode === parseInt(episodesList[0].value)}>&lt;</button>&nbsp;
                            <Dropdown className="episodeSelect" options={episodesList} onChange={onEpisodeSelected} value={episodeDefaultOption} />&nbsp;
                            <button onClick={() => nextEpisodeSelectedHandler()} disabled={data.media.currentEpisode === parseInt(episodesList[episodesList.length - 1].value)}>&gt;</button>&nbsp;
                        ( {episodesList.map(x => x.label).join(', ').toString()} )
                        </span>
                        <span>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} />&nbsp;
                        ( {qualityList.map(x => x.label).join(', ').toString()} )
                        </span>
                        <div className="video-container">
                            <video className="video" ref={videoRef} autoPlay onCanPlay={onCanPlayHandler} onTimeUpdate={onTimeUpdatedHandler} onError={onErrorHandler} controls src={stream.urL2}>
                                <source src={stream.urL2} type="video/mp4" />
                            </video>
                            {videoOverlayVisible && <div className="video-overlay">Next video will start in {countDown} seconds...</div>}
                        </div>

                    </div>
                </React.Fragment>);
            }
        }
    }

    return <Header title="No series data" />;

};

export default Series;

