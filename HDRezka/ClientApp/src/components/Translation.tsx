import React from "react";
import Dropdown, { Option } from 'react-dropdown';
import { MediaData } from "../store/types";

interface TranslationProps {
    data: MediaData;
    translationSelected: (value: string) => void;
}

const Translation = ({ data, translationSelected }: TranslationProps) => {

    console.log("Translation rendered");

    let translationsList = data.media.translations.map(x => ({ value: x.id.toString(), label: x.name }));

    let translationDefaultOption = translationsList.find(x => x.value === data.media.currentTranslationId.toString());

    const onTranslationSelected = (option: Option) => {

        translationSelected(option.value);
    }

    return (<React.Fragment>
        <span>Translation: <Dropdown className="translationSelect" options={translationsList} onChange={onTranslationSelected} value={translationDefaultOption} />&nbsp;
        ( {translationsList.map(x => x.label).join(', ').toString()} )
        </span>
    </React.Fragment>);
}

export default Translation;