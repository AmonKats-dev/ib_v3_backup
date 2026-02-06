import React, { Component } from 'react';

import {Bar} from 'react-chartjs-2';
import dataProvider from '../../providers/dataProvider';
import lodash from 'lodash';
import { billionsFormatter } from '../ProjectDetailShow/helpers';

export class BarChart extends Component {
    state = {
        isFetching: false,
        data: {}
    }
    componentDidMount() {
        const { id, translate } = this.props;

        this.setState({ isFetching: true, data: {} })
        dataProvider('GET_ONE', 'reports', { id: `${id}/cost-evaluation` })
            .then(response => {
                if (response && response.data) {
                    const dataSet = {
                        labels: response.data.map((item) => 
                          translate(`resources.phases.phase_${item.phase_id}`)
                        ),
                        datasets: [
                          {
                            label: `Cost (${translate('titles.currency')})`,
                            backgroundColor: 'rgba(0,104,255,0.2)',
                            borderColor: 'rgba(0,104,255,1)',
                            borderWidth: 1,
                            hoverBackgroundColor: 'rgba(0,104,255,0.4)',
                            hoverBorderColor: 'rgba(0,104,255,1)',
                            data: response.data.map((item) => item.total)
                          }
                        ]
                    };
                  
                    this.setState({ data: dataSet, isFetching: false })
                }
            })
            .catch((err) => { 
                this.setState({ isFetching: false})
            })
    }
  render() {
    return (
      <div style={{ width: '100%', height: '200px', marginBottom: '5%', marginTop: '2%'}}>
        <h2>{`${this.props.record && this.props.record.title || '-'} (${translate('titles.currency')})`}</h2>
        {
            this.state.isFetching && <h5>Data is Loading, please wait...</h5>
        }
        {
            !lodash.isEmpty(this.state.data) &&
            <Bar
                data={this.state.data}
                width={100}
                height={50}
                options={{
                  scales: {
                    yAxes: [{
                      ticks: {
                        callback: function(value, index, values) {
                            return billionsFormatter(value);
                        }
                    }
                    }]
                  },
                  tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var label = data.datasets[tooltipItem.datasetIndex].label || '';
        
                            if (label) {
                                label += ': ';
                            }
                            label += billionsFormatter(Math.round(tooltipItem.yLabel * 100) / 100);
                            return label;
                        }
                      }
                  },
                  maintainAspectRatio: false
                }}
            />
        }
        
      </div>
    );
  }
}

export default BarChart;