import React, { useContext } from "react";
import Dropdown, { Option } from 'react-dropdown';
import { ContextApp } from "../store/reducer";
import ActionService from "../store/ActionService";
import MediaService from "../store/MediaService";
import { MediaData } from "../store/types";

interface SeriesNavProps {
    data: MediaData;
}

const SeriesNav = ({ data }: SeriesNavProps) => {

    console.log("SeriesNav rendered");

    const { dispatch } = useContext(ContextApp);

    const onSeasonSelected = (option: Option) => {

        let translation = data.media.translations.find(x => x.id === data.media.currentTranslationId);

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

    let translation = data.media.translations.find(x => x.id === data.media.currentTranslationId);

    let seasonsList = translation?.seasons?.map(x => ({ value: x.id.toString(), label: x.id.toString() })) || [];

    let seasonDefaultOption = seasonsList.find(x => x.value === data.media.currentSeason?.toString());

    let season = translation?.seasons?.find(x => x.id === data.media.currentSeason);

    let episodesList = season?.episodes.map(x => ({ value: x.toString(), label: x.toString() })) || [];

    let episodeDefaultOption = episodesList.find(x => x.value === data.media.currentEpisode?.toString());

    return (<React.Fragment>
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
    </React.Fragment>);
}

export default SeriesNav;