import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import HTML2React from 'html2react';
import React from 'react';
import lodash from 'lodash';
import { romanize } from '../../../../../helpers/formatters';
import { useTranslate } from 'react-admin';

export const ExPostEvaluation = (props) => {
  const { record } = props;
  const translate = useTranslate();

  const counter = props.counter || 1;

  if (!record) return null;
  if (record && !record.post_evaluation) return null;
  if (record && lodash.isEmpty(record.post_evaluation)) return null;

  return (
    <div className='Section2'>
      <div className='content-area'>
        <h2>{romanize(counter)}. Ex-Post Evaluation</h2>
        <TableContainer>
        <Table size='small'>
          <TableBody>
            <TableRow>
              <TableCell>i. Did the project achieve the outcome</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{HTML2React(record.post_evaluation.achieved_outcomes)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ii. Reasons for deviations</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{HTML2React(record.post_evaluation.deviation_reasons)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>iii. Corrective measures taken</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{HTML2React(record.post_evaluation.measures)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>iv. Lessons learned</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{HTML2React(record.post_evaluation.lessons_learned)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </TableContainer>
      </div>
    </div>
  );
};
