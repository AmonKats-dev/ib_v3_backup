import React from 'react';
import HTML2React from 'html2react'
import { useTranslate } from 'react-admin';

const DetailedAnalysysForOptions = props => {
    const translate = useTranslate();
    const { customRecord } = props;
        const { project_options } = customRecord;
        const option_modules = [
            {
                name: translate('resources.project_options.fields.building_blocks.modules.demand_module'),
                id: 'demand_module'
            },
            {
                name: translate('resources.project_options.fields.building_blocks.modules.technical_module'),
                id: 'technical_module'
            },
            {
                name: translate('resources.project_options.fields.building_blocks.modules.environmental_module'),
                id: 'environmental_module'
            },
            {
                name: translate('resources.project_options.fields.building_blocks.modules.hr_module'),
                id: 'hr_module'
            },
            {
                name: translate('resources.project_options.fields.building_blocks.modules.legal_module'),
                id: 'legal_module'
            },
        ]
        
        if (!customRecord) {
            return null;
        }
    
        return(
        <div className="Section2">
            <div className="content-area">
                {
                    project_options &&
                    customRecord.project_options
                        .map((option) =>
                        <div>
                            <h2><strong>{`${translate('printForm.options.detailed_analysis')} ${option.name}`}</strong></h2>
                            {
                                option_modules.map((modul) =>
                                    <div>
                                        <div><strong>{modul.name}</strong></div>
                                        {
                                            option[modul.id] &&
                                            <ul>
                                                <li>
                                                    <p className="content-area_subtitle">{translate('printForm.options.description')}:</p>
                                                    {HTML2React(option[modul.id].description)}
                                                </li>
                                                <li>
                                                    <p className="content-area_subtitle">{translate('printForm.options.advantage')}:</p>
                                                    {HTML2React(option[modul.id].advantage)}
                                                </li>
                                                <li>
                                                    <p className="content-area_subtitle">{translate('printForm.options.disadvantage')}:</p>
                                                    {HTML2React(option[modul.id].disadvantage)}
                                                </li>
                                            </ul>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
            </div>
        )
};

export default DetailedAnalysysForOptions;
