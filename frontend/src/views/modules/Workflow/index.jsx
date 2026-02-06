import { FlowChartWithState } from "@mrblenny/react-flow-chart";
import React, { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";
import { cloneDeep, mapValues } from "lodash";

import {
  FlowChart,
  actions,
  REACT_FLOW_CHART,
} from "@mrblenny/react-flow-chart";
import { Tooltip } from "@material-ui/core";

const PortDefaultOuter = {
  width: "24px",
  height: "24px",
  background: "cornflowerblue",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const InnerDefault = {
  width: "200px",
  height: "100px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const PortCustom = (props) => (
  <div style={PortDefaultOuter}>
    {props.port && props.port.value === "accept" && (
      <Tooltip title="accept">
        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
          <path
            fill="white"
            d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
          />
        </svg>
      </Tooltip>
    )}
    {props.port && props.port.value === "revise" && (
      <Tooltip title="revise">
        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
          <path
            fill="white"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </Tooltip>
    )}
    {props.port && props.port.value === "defer" && (
      <Tooltip title="defer">
        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
          <path
            fill="white"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </Tooltip>
    )}
    {props.port && props.port.value === "decline" && (
      <Tooltip title="decline">
        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
          <path
            fill="white"
            d="M231.298,17.068c-57.746-0.156-113.278,22.209-154.797,62.343V17.067C76.501,7.641,68.86,0,59.434,0
              S42.368,7.641,42.368,17.067v102.4c-0.002,7.349,4.701,13.874,11.674,16.196l102.4,34.133c8.954,2.979,18.628-1.866,21.606-10.82
              c2.979-8.954-1.866-18.628-10.82-21.606l-75.605-25.156c69.841-76.055,188.114-81.093,264.169-11.252
              s81.093,188.114,11.252,264.169s-188.114,81.093-264.169,11.252c-46.628-42.818-68.422-106.323-57.912-168.75
              c1.653-9.28-4.529-18.142-13.808-19.796s-18.142,4.529-19.796,13.808c-0.018,0.101-0.035,0.203-0.051,0.304
              c-2.043,12.222-3.071,24.592-3.072,36.983C8.375,361.408,107.626,460.659,230.101,460.8
              c122.533,0.331,222.134-98.734,222.465-221.267C452.896,117,353.832,17.399,231.298,17.068z"
          />
        </svg>
      </Tooltip>
    )}
    {!props.port && (
      <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
        <path
          fill="white"
          d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
        />
      </svg>
    )}
  </div>
);

const NodeInnerCustom = ({ node, config }) => {
  if (node.type === "output-only") {
    return (
      <div style={InnerDefault}>
        <p>Use Node inner to customise the content of the node</p>
      </div>
    );
  } else {
    return (
      <div style={InnerDefault}>
        <p>{node && node.properties && node.properties.label}</p>
      </div>
    );
  }
};

const chartSimple = {
  offset: {
    x: 0,
    y: 0,
  },
  nodes: {},
  links: {},
  //   nodes: {
  //     node1: {
  //       id: "node1",
  //       type: "output-only",
  //       properties: {
  //         label: "dsfsdf",
  //       },
  //       position: {
  //         x: 300,
  //         y: 100,
  //       },
  //       ports: {
  //         port1: {
  //           id: "port1",
  //           type: "output",
  //           properties: {
  //             value: "yes",
  //           },
  //         },
  //         port2: {
  //           id: "port2",
  //           type: "output",
  //           properties: {
  //             value: "no",
  //           },
  //         },
  //       },
  //     },
  //     node2: {
  //       id: "node2",
  //       type: "input-output",
  //       position: {
  //         x: 300,
  //         y: 300,
  //       },
  //       ports: {
  //         port1: {
  //           id: "port1",
  //           type: "input",
  //         },
  //         port2: {
  //           id: "port2",
  //           type: "output",
  //         },
  //       },
  //     },
  //   },
  //   links: {
  //     link1: {
  //       id: "link1",
  //       from: {
  //         nodeId: "node1",
  //         portId: "port2",
  //       },
  //       to: {
  //         nodeId: "node2",
  //         portId: "port1",
  //       },
  //     },
  //   },
  selected: {},
  hovered: {},
};

const chartSimple2 = {
  offset: {
    x: 0,
    y: 0,
  },
  nodes: {
    node1: {
      id: "node1",
      type: "output-only",
      properties: {
        label: "dsfsdf",
      },
      position: {
        x: 300,
        y: 100,
      },
      ports: {
        port1: {
          id: "port1",
          type: "output",
          properties: {
            value: "yes",
          },
        },
        port2: {
          id: "port2",
          type: "output",
          properties: {
            value: "no",
          },
        },
      },
    },
    node2: {
      id: "node2",
      type: "input-output",
      position: {
        x: 300,
        y: 300,
      },
      ports: {
        port1: {
          id: "port1",
          type: "input",
        },
        port2: {
          id: "port2",
          type: "output",
        },
      },
    },
  },
  links: {
    link1: {
      id: "link1",
      from: {
        nodeId: "node1",
        portId: "port2",
      },
      to: {
        nodeId: "node2",
        portId: "port1",
      },
    },
  },
  selected: {},
  hovered: {},
};

export default function WorkflowChart() {
  const [data, setData] = useState(cloneDeep(chartSimple));
  const [isLoaded, setIsLoaded] = useState(false);
  const dataProvider = useDataProvider();

  function formatPorts(array) {
    const result = {};
    array.forEach((item) => {
      result["port_" + item] = {
        id: item,
        type: "output",
        properties: {
          value: "yes",
        },
      };
    });
    return result;
  }

  function formatDataSet(items) {
    const nodes = {};
    items.forEach((item, idx) => {
      nodes["node_" + item.id] = {
        id: "node_" + item.id,
        type: "input-output",
        position: {
          x: 300,
          y: 100 * (idx + 1.5) + 100,
        },
        ports: formatPorts(item.actions),
      };
    });

    return { nodes, links: {} };
  }

  useEffect(() => {
    dataProvider
      .getListOfAll("workflows", { sort_field: "id" })
      .then((response) => {
        setData({ ...data, ...formatDataSet(response.data) });
      });
  }, []);

  const stateActions = mapValues(
    actions,
    (func) =>
      (...args) =>
        setData(func(...args))
  );

  return (
    <div>
      <div onClick={() => setIsLoaded(true)}>Button </div>
      {isLoaded && <Chart data={data} />}
    </div>
  );
}

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = cloneDeep(chartSimple);
  }

  componentDidMount() {
    this.setState({
      nodes: this.props.data.nodes,
      links: this.props.data.links,
    });
  }

  render() {
    const chart = this.state;

    const stateActions = mapValues(
      actions,
      (func) =>
        (...args) =>
          this.setState(func(...args), () => {})
    );

    return chart ? (
      <FlowChart
        config={{
          snapToGrid: true,
          smartRouting: true,
        }}
        chart={chart}
        callbacks={stateActions}
        Components={{
          Port: PortCustom,
          NodeInner: NodeInnerCustom,
        }}
      />
    ) : null;
  }
}
