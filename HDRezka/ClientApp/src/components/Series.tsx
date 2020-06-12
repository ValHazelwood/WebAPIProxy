import React, { useState, useContext } from "react";
import { MediaData } from "../store/types";
import Header from "./Header";
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import MediaService from "../store/MediaService";
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import SeriesVideo from "./SeriesVideo";

interface SeriesProps {
    data: MediaData;
}

const Series = ({ data }: SeriesProps) => {

    const { state, dispatch } = useContext(ContextApp);

    const { seriesLoading } = state;

    const [currentQualityId, setCurrentQualityId] = useState<string>(data.media.currentQualityId);

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

                const onEpisodeSelected = (option: Option) => {

                    if (data.media.currentSeason) {
                        ActionService.selectSeriesEpisodeHandler(data.media.id, data.media.currentTranslationId, data.media.currentSeason, parseInt(option.value), data, dispatch);
                    }
                }

                const onQualitySelected = (option: Option) => {

                    data.media.currentQualityId = option.value;
                    setCurrentQualityId(option.value);
                }

                return (<React.Fragment><Header title={data.searchResult.name} />
                    <div className="mediaInfo">
                        <p>{data.searchResult.name} {data.searchResult.text} rating: {data.searchResult.rating} </p>
                        <span>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} />&nbsp;
                        ( {translationsList.map(x => x.label).join(', ').toString()} )
                        </span>
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
                        <span>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} />&nbsp;
                        ( {qualityList.map(x => x.label).join(', ').toString()} )
                        </span>
                        <SeriesVideo data={data} streamUrl={stream.urL2} />
                    </div>
                </React.Fragment>);
            }
        }
    }

    return <Header title="No series data" />;

};

export default Series;

