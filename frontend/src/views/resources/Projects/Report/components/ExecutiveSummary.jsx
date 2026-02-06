import React from 'react';
import HTML2React from 'html2react'
import { romanize } from '../../../../../helpers/formatters';
import { useTranslate } from 'react-admin';

export const ExecutiveSummary = props => {
    const { customRecord, counter = 1 } = props;
    const translate = useTranslate();

    return(
        <div className="Section2">
        <div className="content-area">
            <h2 className="content-area_title">{romanize(counter)}.   {translate('printForm.project_info.executive_summary')}</h2>
            {HTML2React(customRecord.exec_management_plan)}
        </div>
        </div>
    )
};
