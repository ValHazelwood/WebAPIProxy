import React from "react";
import Dropdown, { Option } from 'react-dropdown';
import { Translation } from "../store/types";

interface QualityProps {
    translation: Translation;
    currentQualityId: string;
    qualitySelected: (value: string) => void;
}

const Quality = ({ translation, currentQualityId, qualitySelected }: QualityProps) => {

    console.log("Quality rendered");

    const onQualitySelected = (option: Option) => {
        qualitySelected(option.value);
    }

    let qualityList = translation.cdnStreams.map(x => ({ value: x.quality, label: x.quality }));

    let qualityDefaultOption = qualityList.find(x => x.value === currentQualityId);

    return (<React.Fragment>
        <span>Quality: <Dropdown className="qualitySelect" options={qualityList} onChange={onQualitySelected} value={qualityDefaultOption} />&nbsp;
        ( {qualityList.map(x => x.label).join(', ').toString()} )
        </span>
    </React.Fragment>);
}

export default Quality;