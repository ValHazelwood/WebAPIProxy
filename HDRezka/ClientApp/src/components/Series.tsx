import React, { useState } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

interface SeriesProps {
    data: MediaData;
    selectSeriesTranslation: (id: number, translationId: number) => void;
}

const Series = ({ data, selectSeriesTranslation }: SeriesProps) => {

    const [currentTranslationId, setCurrentTranslationId] = useState<number>(data.media.currentTranslationId);

    const [currentSeason, setCurrentSeason] = useState<number | undefined | null>(data.media.currentSeason);

    const [currentEpisode, setCurrentEpisode] = useState<number | undefined | null>(data.media.currentEpisode);

    const [currentQualityId, setCurrentQualityId] = useState<string>("480p");

    console.log("Series rendered");

    console.log(data);

    let translation = data.media.translations.find(x => x.id === currentTranslationId);

    let translationsList = data.media.translations.map(x => ({ value: x.id.toString(), label: x.name }));

    let translationDefaultOption = translationsList.find(x => x.value === currentTranslationId?.toString());

    if (translation && translation.seasons) {

        if (data.media.currentSeason !== currentSeason) {
            setCurrentSeason(data.media.currentSeason);
        }

        let seasonsList = translation.seasons.map(x => ({ value: x.id.toString(), label: x.id.toString() }));

        let seasonDefaultOption = seasonsList.find(x => x.value === currentSeason?.toString());

        let season = translation.seasons.find(x => x.id === currentSeason);

        if (season) {

            if (data.media.currentEpisode !== currentEpisode) {
                setCurrentEpisode(data.media.currentEpisode);
            }

            let episodesList = season.episodes.map(x => ({ value: x.toString(), label: x.toString() }));

            let episodeDefaultOption = episodesList.find(x => x.value === currentEpisode?.toString());

            let stream = translation.cdnStreams.find(x => x.quality === currentQualityId);

            let qualityList = translation.cdnStreams.map(x => ({ value: x.quality, label: x.quality }));

            let qualityDefaultOption = qualityList.find(x => x.value === currentQualityId);

            if (stream) {

                const onTranslationSelected = (option: any) => {

                    setCurrentTranslationId(parseInt(option.value));

                    selectSeriesTranslation(data.media.id, parseInt(option.value));
                }

                const onSeasonSelected = (option: any) => {

                    setCurrentSeason(parseInt(option.value));
                }

                const onEpisodeSelected = (option: any) => {

                    setCurrentEpisode(parseInt(option.value));
                }

                const onQualitySelected = (option: any) => {

                    setCurrentQualityId(option.value);
                }

                return (<React.Fragment><Header title={data.searchResult.name} />
                    <div className="mediaInfo">
                        <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating}</p>
                        <p>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} /></p>
                        <p>Season: <Dropdown className="seasonSelect" options={seasonsList} onChange={onSeasonSelected} value={seasonDefaultOption} /></p>
                        <p>Episode: <Dropdown className="episodeSelect" options={episodesList} onChange={onEpisodeSelected} value={episodeDefaultOption} /></p>
                        <p>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} /></p>
                        <video controls src={stream.urL2}> <source src={stream.urL2} type="video/mp4" /></video>
                    </div>
                </React.Fragment>);
            }
        }
    }

    return <Header title="No series data" />;

};

export default Series;