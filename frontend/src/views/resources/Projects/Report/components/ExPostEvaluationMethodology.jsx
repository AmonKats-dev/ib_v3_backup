import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import HTML2React from 'html2react';
import React from 'react';
import lodash from 'lodash';
import { romanize } from '../../../../../helpers/formatters';
import { useTranslate } from 'react-admin';

export const ExPostEvaluationMethodology = (props) => {
  const { record } = props;
  const translate = useTranslate();

  const counter = props.counter || 1;

  if (!record) return null;
  if (record && !record.post_evaluation) return null;
  if (record && lodash.isEmpty(record.post_evaluation)) return null;

  return (
    <div className='Section2'>
      <div className='content-area'>
        <h2>{romanize(counter)}. Evaluation methodology</h2>
        <p>{HTML2React(record.post_evaluation.evaluation_methodology)}</p>
      </div>
    </div>
  );
};
