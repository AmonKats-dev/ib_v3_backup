import './styles.scss';

import { API_URL, EXPORT_TYPES, PAP_DEPARTMENT_USERS, PROJECT_PHASES, DEFAULT_SORTING } from '../../constants/common';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import {
    Datagrid,
    Filter,
    FunctionField,
    List,
    ReferenceField,
    ReferenceInput,
    Responsive,
    SelectInput,
    SimpleList,
    TextField,
    TextInput,
} from 'react-admin';
import React, { Component, Fragment } from 'react';
import { billionsFormatter, costSumFormatterReports } from '../ProjectDetailShow/helpers';
import { dateFormatter, getCurrentPhaseId } from '../Projects/helpers';
import { exportTable, exportTableToCSV, exporter } from './helpers';

import { AppSwitch } from '@coreui/react'
import BarChart from './BarChart';
import Close from '@material-ui/icons/Close';
import CustomMap from '../../components/customMap';
import HelpOutline from '@material-ui/icons/HelpOutline';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switches from '../Base/Switches/Switches';
import Tooltip from '@material-ui/core/Tooltip';
import dataProvider from '../../providers/dataProvider';
import { getFiscalYearValue } from '../../helpers/formatters';
import lodash from 'lodash';
import moment from 'moment';

const RANK_TYPES = [
    { id: 'enpv', name: 'ENPV'},
    { id: 'fnpv', name: 'FNPV'},
    { id: 'irr', name: 'IRR'},
    { id: 'err', name: 'ERR'},
];

const RANK_SORT_TYPES = [
    { id: 'sector', name: 'Sector'},
    { id: 'vote', name: 'Vote'},
]

const tableStyle = {
    column: {
        textAlign: 'center',
        verticalAlign: 'middle'
    },
    row: {
        textAlign: 'center',
    },
    totalRow: {
        fontWeight: 'bold'
    },
    totalColumn: {
        fontWeight: 'bold'
    }
}

const chartStyle = {
    position: 'relative',
    padding: '20px 30px',
    margin: '15px auto'
}

const iconStyle = {
    cursor: 'pointer',
    fontSize: '20px'
}

const filterStyle = {
    position: 'absolute',
    top: '20px',
    right: '120px'
}

const ProjectsFilter = props => (
    <Filter {...props}>
        <TextInput label="Project Number" source="project_no" alwaysOn />
        <TextInput label="Project Title" source="title" alwaysOn />

        <ReferenceInput sort={DEFAULT_SORTING} perPage={-1} source="sector_id" reference="sectors" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput sort={DEFAULT_SORTING} perPage={-1} source="department_id" reference="departments" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput sort={DEFAULT_SORTING} perPage={-1} source="vote_id" reference="votes" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

export class ReportsList extends Component {
    state = {
        isFetching: false,
        data: [],
        report: this.props.location.pathname
            .slice(this.props.location.pathname.lastIndexOf('/') + 1, this.props.location.pathname.length),
        filterValues: [],
        selectedRankType: 'enpv',
        rankFilters: {
            sector: null,
            vote: null
        },
        references: {
            sectors: [],
            votes: []
        },
        sectorId: '',
        voteId: ''
    }

    componentDidMount() {
        this.setState({ isFetching: true, data: [] })

        dataProvider('GET_ONE', 'reports', { id: this.state.report })
            .then(response => {
                if (response && response.data) {
                    this.setState({ 
                        data: response.data, 
                        isFetching: false, 
                        filterValues: lodash.isObject(response.data) 
                            ? lodash.keys(response.data)
                            : [] 
                    })
                }
            })
            .catch((err) => {
                this.setState({ isFetching: false })
            })

        dataProvider('GET_MANY', 'sectors', { ids: [] }).then(
            response => {
                if (response && response.data) {
                    this.setState({
                        references: {
                            ...this.state.references,
                            'sectors': lodash.sortBy(response.data, 'code'),
                        },
                    });
                }
            },
        );
        dataProvider('GET_MANY', 'votes', { ids: [] }).then(
            response => {
                if (response && response.data) {
                    this.setState({
                        references: {
                            ...this.state.references,
                            'votes': lodash.sortBy(response.data, 'code'),
                        },
                    });
                }
            },
        );
    }

    componentWillReceiveProps(nextProps) {
        if (!lodash.isEqual(nextProps.location, this.props.location)) {
            this.setState({ isFetching: true, data: [] })
            const report = nextProps.location.pathname
                .slice(nextProps.location.pathname.lastIndexOf('/') + 1, nextProps.location.pathname.length);
            this.setState({ report }, () => {
                dataProvider('GET_ONE', 'reports', { id: this.state.report })
                    .then(response => {
                        if (response && response.data) {
                            this.setState({ 
                                data: response.data, 
                                isFetching: false, 
                                filterValues: lodash.isObject(response.data) 
                                    ? lodash.keys(response.data)
                                    : [] 
                            })
                        }
                    });
            })
        }
    }

    renderPIP() {
        const groupedDataSectors = this.state.data.length !== 0 &&  //comment for review 
            lodash.groupBy(this.state.data, (item) => item.sector && item.sector.name);
        const { translate } = this.props;

        return (
            <div>
                <h4 >{`${translate('resources.reports.pipeline.name')}`} </h4>
                {this.renderExportButtons(translate('resources.reports.pipeline.name'))}
                <br />
                {
                    this.state.data.length === 0 //comment for review 
                        ?   this.state.isFetching ? <h5>{translate('resources.reports.loading')}</h5> : <h5>{translate('resources.reports.no_data')}</h5>
                        :   
                        <Table id="report_table" responsive>
                                 <tbody style={{ textAlign: 'center' }}>
                                    {
                                        lodash.keys(groupedDataSectors).map((sector) => {
                                            const sectorsData = groupedDataSectors[sector];
                                            const groupedSubSectors = lodash.groupBy(sectorsData, (item) => item.vote && item.vote.name);
                                            const rows = [];
                                            rows.push(
                                                <tr style={{ textAlign: 'center' }}>
                                                    <td colSpan="6"><h5 style={{ textAlign: 'center' }}>{sector}</h5></td>
                                                </tr>
                                            )
                                            rows.push( lodash.keys(groupedSubSectors).map((subSector) => 
                                                [
                                                    <tr style={{ textAlign: 'center' }}>
                                                        <td colSpan="6">{subSector}</td>
                                                    </tr>,
                                                    <tr>
                                                        <th style={tableStyle.column}>
                                                        {translate(
                                                            'resources.reports.pipeline.header.id',
                                                        )}
                                                        </th>
                                                        <th style={tableStyle.column}>
                                                            {translate(
                                                                'resources.reports.pipeline.header.title',
                                                            )}
                                                        </th>
                                                        <th style={tableStyle.column}>
                                                            {translate(
                                                                'resources.reports.pipeline.header.cost',
                                                            )} ({translate('titles.currency')})
                                                        </th>
                                                        <th style={tableStyle.column}>
                                                            {translate(
                                                                'resources.reports.pipeline.header.start_date',
                                                            )}
                                                        </th>
                                                        <th style={tableStyle.column}>
                                                            {translate(
                                                                'resources.reports.pipeline.header.duration',
                                                            )}
                                                        </th>
                                                        <th style={tableStyle.column}>
                                                            {translate(
                                                                'resources.reports.pipeline.header.enter_date',
                                                            )}
                                                        </th>
                                                    </tr>,
                                                        groupedSubSectors[subSector].map((item) =>
                                                        <tr>
                                                            <td>{item.project_no}</td>
                                                            <td><a href={`#/projects/${item.id}/show/${item.phase_id}`}>{item.title}</a></td>
                                                            <td>{billionsFormatter(item.investment_cost)}</td>
                                                            <td>
                                                                { getFiscalYearValue(item.start_date).name }
                                                            </td>
                                                            <td>{moment(item.end_date).diff(item.start_date, 'years')}</td>
                                                            <td> 
                                                                {
                                                                    moment(item.pip_entrance_date).format('YYYY-MM-DD')
                                                                }
                                                            </td>
                                                        </tr>
                                                    )]
                                            ));
                                            return rows;
                                        })
                                    }
                                </tbody>
                            </Table>
                }
            </div>
        )
    }

    renderFL() {
        const { translate } = this.props;
        const currentYear = moment();
        const years = [];

        for (let index = 1; index < 6; index++) {
            years.push(currentYear.clone().add(index, 'years'));
        }

        return (
            <div>
                <h4>{`${translate('resources.reports.fiscal_load')}`}</h4>
                <br />
                <h5>{translate('resources.reports.no_data')}</h5>
                {/* {
                    this.state.data.length === 0
                        ?   this.state.isFetching ? <h5>Data is Loading, please wait...</h5> : <h5>No Data Available</h5>
                        :    <Table responsive>
                                <thead>
                                    <th>Sector</th>
                                    {
                                        years.map((item) => <th>{`FY${item.format('YYYY')}`}</th>)
                                    }
                                    <th>Remaining Cost</th>
                                </thead>
                            </Table>
                } */}
            </div>
        )
    }

    renderStatus = (record) => {
        const { permissions, translate } = this.props;
        const role = permissions && JSON.parse(permissions.role);
        const roleType = lodash.first(lodash.keys(role));

        let workflowStatus = record.workflow.status;

        if ( getCurrentPhaseId(record) !== record.phase_id){
            workflowStatus = `${translate(`timeline.hidden_phase_status`)} ${translate(`resources.phases.phase_${getCurrentPhaseId(record)}`)}`;
        }
        
        if (record.workflow.in_pap && !PAP_DEPARTMENT_USERS.includes(roleType)) {
            workflowStatus = translate(`timeline.not_pap_status`) 
        }
            
        return record.status === 'rejected' || record.status === 'completed' 
            ? translate(`timeline.${record.status}`) 
            : workflowStatus
    }

    renderPCE() {
        const { translate } = this.props;
        return (
            <div>
                <h4>{`${translate('resources.reports.cost_evolution')}`}</h4>
                <br />
                <List
                    {...this.props}
                    resource="projects"
                    bulkActionButtons={false}
                    filters={<ProjectsFilter />}
                    exporter={exporter}
                >
                    <Responsive
                        small={
                            <SimpleList
                                linkType={false}
                                primaryText={record => <b>{record.title}</b>}
                                secondaryText={record => {
                                    return (
                                        <span className="small-list-item">
                                            <span>{translate(`resources.projects.fields.project_no`)}: {`${record.project_no}`}</span>
                                            <span>{translate(`resources.projects.fields.created_at`)}: {`${dateFormatter(record.created_at)}`}</span>
                                            <span>{translate(`resources.projects.fields.phase_id`)}: {translate(`resources.phases.phase_${record.phase_id}`)}</span>
                                            <span>{translate(`resources.projects.fields.status`)}: {translate(`timeline.${record.status}`)}</span>
                                            <span><b>{this.renderStatus(record)}</b></span>
                                        </span>
                                    )
                                }}
                            />
                        }
                        medium={
                            <Datagrid expand={<BarChart {...this.props}/>}>
                                <TextField source="project_no" />
                                <TextField source="title" />
                                <TextField source="created_at" />
                                <FunctionField
                                    source="status"
                                    label="Status"
                                    render={record =>
                                        translate(`timeline.${record.status}`)
                                    }
                                />
                                <ReferenceField
                                    addLabel={false}
                                    source="phase_id"
                                    reference="phases"
                                    linkType={null}
                                >
                                    <FunctionField
                                        label="Phase"
                                        render={record =>
                                            translate(
                                                `resources.phases.phase_${record.id}`,
                                            )
                                        }
                                    />
                                </ReferenceField>
                                <FunctionField
                                    source="current_step"
                                    label={translate(
                                        `resources.projects.fields.workflow.status`,
                                    )}
                                    render={record => this.renderStatus(record)}
                                />
                            </Datagrid>
                        }
                    />
                    </List>
            </div>
        )
    }

    renderPDC = (isCost) => {     
        const { translate } = this.props;

        const grouppedDataBySector = lodash.groupBy(this.state.data, 'sector_name');
        const grouppedDataByPhase = lodash.groupBy(this.state.data, 'phase_id');
        let totalAllCounts = 0;
        let totalAllCosts = 0;
        const title = isCost 
            ? translate('resources.reports.projects_by_cycles') 
            : translate('resources.reports.projects_by_cycles_counts');

        return (
            <div id="report_table_container">
                 <h4>{title}</h4>
                 {this.renderExportButtons(title)}
                <br />
                {
                    this.state.data.length === 0
                        ? this.state.isFetching ? <h5>{translate('resources.reports.loading')}</h5> : <h5>{translate('resources.reports.no_data')}</h5>
                        : <Table id="report_table" responsive bordered>
                            <thead>
                                <tr style={tableStyle.totalRow}>
                                    <th rowspan="2" style={{ verticalAlign: 'middle' }}>{translate('resources.sectors.fields.name')}</th>
                                    {
                                        lodash.keys(grouppedDataByPhase).map((phase) => 
                                            <th colspan="2" style={tableStyle.column}>{PROJECT_PHASES[phase]}</th>)
                                    }
                                    <th colspan="2" style={{...tableStyle.column, ...tableStyle.totalColumn}}>Total</th>
                                </tr>
                                <tr>
                                    {
                                        lodash.keys(grouppedDataByPhase).map((phase) => 
                                            [
                                                <th>Count</th>,
                                                <th style={tableStyle.column}>Cost ({translate('titles.currency')})</th>
                                            ]
                                        )
                                    }
                                    <th>Count</th>
                                    <th style={tableStyle.column}>Cost ({translate('titles.currency')})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    lodash.keys(grouppedDataBySector).map((sector) => {
                                        const total_count = lodash.sumBy(grouppedDataBySector[sector], 'total_count');
                                        const total_cost = lodash.sumBy(grouppedDataBySector[sector], 'total_cost');

                                        return (
                                            <tr>
                                                <td>{sector}</td>
                                                {
                                                    grouppedDataBySector[sector].map((item) =>
                                                    [
                                                    <td style={tableStyle.column}>
                                                        {item.total_count && parseInt(item.total_count)}
                                                    </td>,
                                                    <td style={tableStyle.column}>
                                                        {item.total_cost && billionsFormatter(item.total_cost.toFixed(2))}
                                                    </td>
                                                    ]
                                                    )
                                                }
                                                <td style={{...tableStyle.column, ...tableStyle.totalColumn }}>
                                                    {total_count && parseInt(total_count)}
                                                </td>
                                                <td style={{...tableStyle.column, ...tableStyle.totalColumn }}>
                                                    {total_cost && billionsFormatter(total_cost.toFixed(2))}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr style={tableStyle.totalRow}>
                                    <td>Total {isCost && `(${translate('titles.currency')})`}</td>
                                    {
                                        lodash.keys(grouppedDataByPhase).map((phase) => {
                                            const total_count = lodash.sumBy(grouppedDataByPhase[phase], 'total_count');
                                            const total_cost = lodash.sumBy(grouppedDataByPhase[phase], 'total_cost');

                                            totalAllCounts += total_count;
                                            totalAllCosts += total_cost;

                                            return ( 
                                                [<td style={tableStyle.column}>
                                                    {total_count && parseInt(total_count)}
                                                </td>,
                                                <td style={tableStyle.column}>
                                                    {total_cost && billionsFormatter(total_cost.toFixed(2))}
                                                </td>]
                                            )
                                        })
                                    }
                                    <td style={tableStyle.column}>
                                        {totalAllCounts && parseInt(totalAllCounts)}
                                    </td>
                                    <td style={tableStyle.column}>
                                        {totalAllCosts && billionsFormatter(totalAllCosts.toFixed(2))}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                }
            </div>
        )
    }

    handleSelectRankType = (event) => {
        this.setState({ selectedRankType: event.target.value })
    }

    handleSetFilter = (filter) => (event) => {
        if (filter === 'sector') {
            const rankFilters = {
                vote: null,
                sector: event.target.value
            };

            this.setState({ rankFilters })
        } else {
            this.setState({ rankFilters: {
                ...this.state.rankFilters,
                [filter]: event.target.value
            } })
        }
    }

    getFilteredVotes = () => {
        const votes = lodash.uniqBy(this.state.data, (item) => item.vote_id)
            .map((item) => ({ id: item.vote.id, name: item.vote.name, sector_id: item.vote.sector_id }));

        if (this.state.rankFilters.sector) {
            return votes.filter((item) => item.sector_id === this.state.rankFilters.sector)
        }

        return votes;
    }

    getSectorsForFilter = () => 
        lodash.uniqBy(this.state.data, (item) => item.sector_id)
            .map((item) => ({ id: item.sector_id, name: item.sector }))


    handleClearFilter = (filter) => () => {
        this.setState({ rankFilters: {
            ...this.state.rankFilters,
            [filter]: null
        } })
    }

    renderRank(){
        const { selectedRankType,  } = this.state;
        const { translate } = this.props;
        const defaultColumns = ['sector', 'title', 'vote', 'cost', selectedRankType, 'rank'];
        const costValues= ['cost', 'enpv', 'fnpv', 'err', 'irr'];
        const sectors = this.getSectorsForFilter();
        const votes = this.getFilteredVotes();
        let sortedTypeData = lodash.cloneDeep(this.state.data);

        if (this.state.rankFilters.sector) {
            sortedTypeData = sortedTypeData.filter((item) => item.sector_id === this.state.rankFilters.sector ) 
        }
        if (this.state.rankFilters.vote) {
            sortedTypeData = sortedTypeData.filter((item) => item.vote.id === this.state.rankFilters.vote ) 
        }

        const sortedData = lodash.sortBy(sortedTypeData, (item) => Number(item[selectedRankType])).reverse();
        const rankedData = sortedData.map((item, idx) => {
            item.rank = idx + 1;
            return item;
        });
        
        return (
            <div>
                <h4>{`${translate('resources.reports.ranking.name')}`} by 
                    <Select
                        value={this.state.selectedRankType}
                        onChange={this.handleSelectRankType}
                        label={"Ranking Type"}
                        style={{width: '30px', marginLeft: '10px'}}
                    >
                        {
                            RANK_TYPES.map(item => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </h4>
                    <div style={filterStyle}>
                            <span>Sector</span>
                            <Select
                                value={this.state.rankFilters.sector}
                                onChange={this.handleSetFilter('sector')}
                                label={"Sorting Type sector"}
                                style={{width: '30px', marginLeft: '10px'}}
                                displayEmpty
                            >
                                {
                                    sectors.map(item => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))
                                }
                            </Select>
                            {
                                this.state.rankFilters.sector && <Close style={iconStyle} onClick={this.handleClearFilter('sector')}/>
                            }
                            <span style={{ marginLeft: '10px' }}>Vote</span>
                            <Select
                                value={this.state.rankFilters.vote}
                                onChange={this.handleSetFilter('vote')}
                                label={"Sorting Type vote"}
                                style={{width: '30px', marginLeft: '10px'}}
                                displayEmpty
                            >
                                {
                                    votes.map(item => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))
                                }
                            </Select>
                            {
                                this.state.rankFilters.vote && <Close style={iconStyle} onClick={this.handleClearFilter('vote')}/>
                            }

                    </div>
                    {this.renderExportButtons(translate('resources.reports.ranking.name'))}
                <br/>
                
                {
                    this.state.data.length === 0
                        ?   this.state.isFetching ? <h5>{translate('resources.reports.loading')}</h5> : <h5>{translate('resources.reports.no_data')}</h5>
                        :   <Table id="report_table" responsive bordered>
                                <thead style={{ textAlign: 'center' }}>
                                    <tr>
                                        <th style={{...tableStyle.column}}>
                                            {translate(
                                                'resources.reports.ranking.header.sector',
                                            )}
                                        </th>
                                        <th style={{...tableStyle.column}}>
                                            {translate(
                                                'resources.reports.ranking.header.title',
                                            )}
                                        </th>
                                        <th style={{...tableStyle.column}}>
                                            {translate(
                                                'resources.reports.ranking.header.vote',
                                            )} 
                                        </th>
                                        <th style={{...tableStyle.column}}>
                                            {translate(
                                                'resources.reports.ranking.header.cost',
                                            )}
                                        </th>
                                        <th style={{...tableStyle.column}}>
                                            {translate(
                                                `resources.reports.ranking.header.${this.state.selectedRankType}`,
                                            )}
                                        </th>
                                        <th style={{...tableStyle.column}}>
                                            {translate(
                                                'resources.reports.ranking.header.rank',
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rankedData.map((itemData) => 
                                            <tr>
                                                {
                                                defaultColumns.map((phase, idx) => 
                                                    <td style={{ 
                                                        textAlign: phase === 'title'
                                                            ? 'left' 
                                                            : 'center', 
                                                        fontWeight: phase === 'rank' ? 'bold' : 'normal'
                                                    }}>
                                                        { 
                                                            costValues.includes(phase) 
                                                                ? billionsFormatter(itemData[phase])
                                                                : phase === 'vote' 
                                                                    ? itemData[phase].name 
                                                                    : itemData[phase]
                                                        }
                                                    </td>)
                                                }
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                }
            </div>
        )
    }

    handleChangeFilter = (key) => (event) => {
        let filteredPhases = [];

        if (!event.target.checked){
            filteredPhases = this.state.filterValues.filter(item => Number(item) !== Number(key))
        } else {
            if (!this.state.filterValues.includes(key)) {
                filteredPhases = [...this.state.filterValues, key];
            }
        }
        
        this.setState({ filterValues: filteredPhases })
    }

    handleSelectSector = (event) => {
        this.setState({ sectorId: event.target.value })
    }

    handleSelectVote= (event) => {
        this.setState({ voteId: event.target.value })
    }

    getFilteredProjects = (projects) => {
        const { sectorId, voteId } = this.state;

        if (!voteId) {
            return projects.filter((item) => sectorId ? 
                Number(item.sector_id) === Number(sectorId) : true);
        }

        if (sectorId || voteId) {
            return projects.filter((item) => voteId ? 
                Number(item.vote_id) === Number(voteId) : true);
        }

        return projects;
    }

    handleExport = (exportType, reportName) => (event) => {
        switch (exportType) {
            case EXPORT_TYPES.XLS.id:
                exportTableToCSV(`${reportName}.${exportType}`, 'report_table')
                break;
            case EXPORT_TYPES.PDF.id:
                exportTable(reportName, 'report_table', exportType)
                break;
            case EXPORT_TYPES.WORD.id:
                exportTable(reportName, 'report_table', exportType)
                break;
            default:
                break;
        }
    }

    renderLocation() {
        const { translate } = this.props;
        const { data, filterValues } = this.state;
        const projects = {};
        const filteredProjects = {};

        lodash.keys(data).forEach((phase_id) => {
            const projectsByPhases = lodash.keys(data[phase_id]).map((item) => {
                const project = lodash.cloneDeep(data[phase_id][item]);
                
                try {
                    project.markers = JSON.parse(project.geo_location)
                      .map((item) => ({ lng: String(item.lng), lat: String(item.lat) }))
                  } catch (error) {
                    console.log(error);
                    project.markers = [];
                  }
                return project;
            });
            projects[phase_id] = projectsByPhases;

            if (filterValues.includes(phase_id)){
                filteredProjects[phase_id] = this.getFilteredProjects(projectsByPhases);
            }
        })

        return (
            <div>
                <h4>{`${translate(
                    'resources.reports.projects_by_location',
                )}`}</h4>
                <br />
                
                <Card>
                    <CardHeader>
                        <span style={{ marginRight: '10px' }}>{translate(`resources.reports.filters`)}</span> 
                        <Tooltip title={translate(`tooltips.resources.reports.projects_by_location_filters`)} placement="right">
                            <HelpOutline />
                        </Tooltip>
                    </CardHeader>
                    <CardBody style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px' }}>{translate(`resources.sectors.name`, { smart_count: 1 })}</span>
                        <Select
                            value={this.state.sectorId}
                            onChange={this.handleSelectSector}
                            label={"Sector"}
                            style={{ width: '40%' }}
                        >
                            {
                                this.state.references.sectors.map(item => (
                                    <MenuItem value={item.id}>{`${item.code}-${item.name}`}</MenuItem>
                                ))
                            }
                        </Select>
                        <span style={{ marginLeft: '10px' }}>{translate(`resources.votes.name`, { smart_count: 1 })}</span>
                        <Select
                            value={this.state.voteId}
                            onChange={this.handleSelectVote}
                            label={"Vote"}
                            style={{ width: '40%', marginLeft: '15px'}}
                        >
                            {
                                this.state.references.votes
                                    .filter((item) => this.state.sectorId ? 
                                        Number(item.sector_id) === Number(this.state.sectorId) : true)
                                    .map(item => (
                                        <MenuItem value={item.id}>{`${item.code}-${item.name}`}</MenuItem>
                                    ))
                            }
                        </Select>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <span style={{ marginRight: '10px' }}>{translate(`resources.reports.phases_title`)}</span> 
                        <Tooltip title={translate(`tooltips.resources.reports.projects_by_location_help`)} placement="right">
                            <HelpOutline />
                        </Tooltip>
                    </CardHeader>
                    <CardBody style={{ display: 'flex' }}>
                        {
                            lodash.keys(PROJECT_PHASES).map(key =>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '0 15px' }}>
                                        <AppSwitch 
                                            className={'mx-1'} 
                                            variant={'3d'} 
                                            color={'primary'} 
                                            checked={this.state.filterValues.includes(key)}
                                            onChange={this.handleChangeFilter(key)}
                                        />  
                                        <span>{translate(`resources.phases.phase_${key}`)}</span>
                                    </div>
                                
                            )
                        }
                    </CardBody>
                </Card>
                <CustomMap
                    isReport
                    data={filteredProjects}
                    height={"600px"}
                />

            </div>
        )
    }

    renderContent() {
        switch (this.state.report) {
            case 'pip':
                return this.renderPIP()
            case 'fl':
                return this.renderFL()
            case 'pce':
                return this.renderPCE()
            case 'project-by-sectors':
                return this.renderPDC(true)
            case 'project-count-by-sectors':
                return this.renderPDC()
            case 'project-ranking':
                return this.renderRank()
            case 'project-geo-by-phases':
                return this.renderLocation()
            default:
                break;
        }
    }
    renderExportButtons = (reportName) => 
        <div className="export-buttons-container">
            <i className="fa fa-file-pdf-o fa-lg mt-4" onClick={this.handleExport(EXPORT_TYPES.PDF.id, reportName)}/>
            <i className="fa fa-file-word-o fa-lg mt-4" onClick={this.handleExport(EXPORT_TYPES.WORD.id, reportName)}/>
            <i className="fa fa-file-excel-o fa-lg mt-4" onClick={this.handleExport(EXPORT_TYPES.XLS.id, reportName)}/>
        </div>

    render() {
        return (
            <div style={chartStyle}>
                <div>
                    {
                        this.renderContent()
                    }
                </div>
            </div>
        );
    }
}
