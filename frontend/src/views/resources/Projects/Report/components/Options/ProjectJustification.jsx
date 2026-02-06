import React from 'react';
import HTML2React from 'html2react'
import lodash from 'lodash';
import { useTranslate } from 'react-admin';
import { romanize } from '../../../../../../helpers/formatters';
import { Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";

const ProjectJustification = props => {
    const translate = useTranslate();

    const { customRecord, subCounter } = props;
        const { project_options } = customRecord;

        if (!project_options) {
            return null;
        }

        const bestOption = lodash.find(project_options, (option) => option.is_preferred);
        
        if (!bestOption) {
            return (
                <div className="Section2">
                    <div className="content-area">
                        <h2>{romanize(subCounter || 8)}.  {translate('printForm.options.justification.title')}</h2>
                        <h5>{translate('printForm.options.justification.best_options_empty')}</h5>
                    </div>
                </div>
            )
        }

        return(
        <div className="Section2">
            <div className="content-area">
                <h2>{romanize(subCounter || 8)}.  {translate('printForm.options.justification.title')}</h2>
                <h5>{translate('printForm.options.justification.alternative')} <b>{bestOption.name}</b> {translate('printForm.options.justification.alternative_text')}</h5>
                <br/>
                <div>
                    <h2>{romanize((subCounter || 8) + ".1.")} {translate('printForm.options.justification.description')}</h2>
                    {HTML2React(bestOption.description)}
                </div>
                <div>
                    <h2>{romanize((subCounter || 8) + ".2.")} {translate('printForm.options.justification.details')}</h2>
                    {HTML2React(bestOption.justification)}
                </div>
                <div>
                    <h2>{romanize((subCounter || 8) + ".3.")} {translate('printForm.options.justification.modality')}</h2>
                    {HTML2React(bestOption.modality_justification)}
                </div>
            </div>
        </div>
        )
};

export default ProjectJustification;

