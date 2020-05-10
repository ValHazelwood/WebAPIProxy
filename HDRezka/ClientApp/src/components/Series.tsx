import React, { useState, useEffect, useRef } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

interface SeriesProps {
    data: MediaData;
    updateMediaData: (data: MediaData) => void;
    selectSeriesTranslation: (id: number, translationId: number) => void;
    selectSeriesEpisode: (id: number, translationId: number, season: number, episode: number) => void;
    loading: boolean;
}

const Series = ({ data, updateMediaData, selectSeriesTranslation, selectSeriesEpisode, loading }: SeriesProps) => {

    const videoRef = useRef<HTMLVideoElement>(null);

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

    if (loading) {
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

                    selectSeriesTranslation(data.media.id, parseInt(option.value));
                }

                const onSeasonSelected = (option: Option) => {

                    let queryEpisode = translation?.seasons?.find(x => x.id === parseInt(option.value))?.episodes[0];
                    if (queryEpisode) {
                        selectSeriesEpisode(data.media.id, data.media.currentTranslationId, parseInt(option.value), queryEpisode);
                    }
                }

                const onEpisodeSelected = (option: Option) => {

                    if (data.media.currentSeason) {
                        selectSeriesEpisode(data.media.id, data.media.currentTranslationId, data.media.currentSeason, parseInt(option.value));
                    }
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

                const fullScreenHandler = (e: React.MouseEvent) => {
                    if (videoRef.current && videoRef.current.webkitRequestFullScreen) {
                        videoRef.current.webkitRequestFullScreen();
                    } else if (videoRef.current && videoRef.current.requestFullscreen) {
                        videoRef.current.requestFullscreen();
                    }
                }

                return (<React.Fragment><Header title={data.searchResult.name} />
                    <div className="mediaInfo">
                        <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating} &nbsp;<button onClick={fullScreenHandler}>Full screen</button></p>
                        <p>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} /> ( {translationsList.map(x => x.label).join(', ').toString()} )</p>
                        <p>Season: <Dropdown className="seasonSelect" options={seasonsList} onChange={onSeasonSelected} value={seasonDefaultOption} /> ( {seasonsList.map(x => x.label).join(', ').toString()} )</p>
                        <p>Episode: <Dropdown className="episodeSelect" options={episodesList} onChange={onEpisodeSelected} value={episodeDefaultOption} /> ( {episodesList.map(x => x.label).join(', ').toString()} )</p>
                        <p>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} /> ( {qualityList.map(x => x.label).join(', ').toString()} )</p>
                        <video ref={videoRef} onCanPlay={onCanPlayHandler} onTimeUpdate={onTimeUpdatedHandler} controls src={stream.urL2}> <source src={stream.urL2} type="video/mp4" /></video>
                    </div>
                </React.Fragment>);
            }
        }
    }

    return <Header title="No series data" />;

};

export default Series;