import React from "react";
import { useTranslate, ReferenceField, FunctionField } from "react-admin";
import { useSelector } from "react-redux";
import lodash from "lodash";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";


const OrgStructure = (props) => {
    const translate = useTranslate();
    const appConfig = useSelector((state) => state.app.appConfig);
    const levels = {};
  
    function findParents(item) {
      if (item && item.level){
        levels[item.level] = {
          id: item.id,
          code: item.code,
          name: item.name,
          label: appConfig[props.config][item.level].id,
        };
      }
  
      if (item && item.parent) {
        return findParents(item.parent);
      }
      return item;
    }
    
  
    if (props.project && props.project[props.field]) {
      findParents(props.project[props.field]);
    }
  
    return lodash.keys(levels).map((level) => [
      <TableRow key={`${level}-${levels[level].label}-code`}>
        <TableCell>
          {translate(`resources.projects.fields.${levels[level].label}.code`, {
            smart_count: 1,
          })}
          :{" "}
        </TableCell>
        <TableCell>{levels[level].code}</TableCell>
      </TableRow>,
      <TableRow key={`${level}-${levels[level].label}-name`}>
        <TableCell>
          {translate(`resources.projects.fields.${levels[level].label}.name`, {
            smart_count: 1,
          })}
          :{" "}
        </TableCell>
        <TableCell>{levels[level].name}</TableCell>
      </TableRow>,
    ]);
  };
  

  export default OrgStructure;
