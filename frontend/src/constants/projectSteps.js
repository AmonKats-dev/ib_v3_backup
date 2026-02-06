// import { PROJECT_FORMS, PROJECT_STEPS } from './common';

// export const stepsConfig = [
//   {
//     label: PROJECT_STEPS.SUMMARY,
//     visibility: [0, 1, 2, 3, 4, 5],
//   },
//   {
//     label: PROJECT_STEPS.RESPONSIBLE_OFFICER,
//     visibility: [1, 2, 3, 4, 5],
//   },
//   {
//     label: PROJECT_STEPS.PROJECT_BACKGROUND,
//     visibility: [1, 2, 3, 4, 5],
//   },
//   {
//     label: PROJECT_STEPS.INTRODUCTION,
//     visibility: [2, 3],
//   },
//   {
//     label: PROJECT_STEPS.OPTIONS_ANALYSIS,
//     visibility: [2, 3],
//   },
//   {
//     label: PROJECT_STEPS.OM_COSTS,
//     visibility: [3, 4, 5],
//   },
//   {
//     label: PROJECT_STEPS.RESULT_MATRIX,
//     visibility: [1, 2, 3, 4, 5],
//   },
//   {
//     label: PROJECT_STEPS.ADDITIONAL_INFO,
//     visibility: [1, 2, 3, 4, 5],
//   },
//   {
//     label: PROJECT_STEPS.EX_POST_EVALUATION,
//     visibility: [6],
//   },
// ];

// export const stepsContentByPhase = {
//   0: [PROJECT_FORMS.SUMMARY],
//   1: [
//     PROJECT_FORMS.SUMMARY,
//     PROJECT_FORMS.RESPONSIBLE_OFFICER,
//     PROJECT_FORMS.PROJECT_BACKGROUND,
//     PROJECT_FORMS.RESULT_MATRIX,
//     PROJECT_FORMS.ADDITIONAL_INFO,
//   ],
//   2: [
//     PROJECT_FORMS.SUMMARY,
//     PROJECT_FORMS.RESPONSIBLE_OFFICER,
//     PROJECT_FORMS.PROJECT_BACKGROUND,
//     PROJECT_FORMS.INTRODUCTION,
//     PROJECT_FORMS.OPTIONS_APPRAISAL,
//     PROJECT_FORMS.RESULT_MATRIX,
//     PROJECT_FORMS.ADDITIONAL_INFO,
//   ],
//   3: [
//     PROJECT_FORMS.SUMMARY,
//     PROJECT_FORMS.RESPONSIBLE_OFFICER,
//     PROJECT_FORMS.PROJECT_BACKGROUND,
//     PROJECT_FORMS.INTRODUCTION,
//     PROJECT_FORMS.OPTIONS_APPRAISAL,
//     PROJECT_FORMS.OM_COSTS,
//     PROJECT_FORMS.RESULT_MATRIX,
//     PROJECT_FORMS.ADDITIONAL_INFO,
//   ],
//   4: [
//     PROJECT_FORMS.SUMMARY,
//     PROJECT_FORMS.RESPONSIBLE_OFFICER,
//     PROJECT_FORMS.PROJECT_BACKGROUND,
//     PROJECT_FORMS.OM_COSTS,
//     PROJECT_FORMS.RESULT_MATRIX,
//     PROJECT_FORMS.ADDITIONAL_INFO,
//   ],
//   5: [
//     PROJECT_FORMS.SUMMARY,
//     PROJECT_FORMS.RESPONSIBLE_OFFICER,
//     PROJECT_FORMS.PROJECT_BACKGROUND,
//     PROJECT_FORMS.OM_COSTS,
//     PROJECT_FORMS.RESULT_MATRIX,
//     PROJECT_FORMS.ADDITIONAL_INFO,
//   ],
//   6: [PROJECT_FORMS.EX_POST_EVALUATION],
// };

import { PROJECT_STEPS, PROJECT_FORMS } from './common';

export const stepsConfig = [
    {
        label: PROJECT_STEPS.SUMMARY,
        visibility: [0, 1, 2, 3, 4, 5],
    },
    {
        label: PROJECT_STEPS.RESPONSIBLE_OFFICER,
        visibility: [1, 2, 3, 4, 5],
    },
    {
        label: PROJECT_STEPS.PROJECT_BACKGROUND,
        visibility: [1, 2, 3, 4, 5],
    },
    {
        label: PROJECT_STEPS.INTRODUCTION,
        visibility: [2, 3, 4, 5], //TODO: remove 2 step
    },
    {
        label: PROJECT_STEPS.OPTIONS_ANALYSIS,
        visibility: [3, 4, 5],
    },
    {
        label: PROJECT_STEPS.OM_COSTS,
        visibility: [4, 5],
    },
    {
        label: PROJECT_STEPS.RESULT_MATRIX,
        visibility: [1, 2, 3, 4, 5],
    },
    {
        label: PROJECT_STEPS.ADDITIONAL_INFO,
        visibility: [1, 2, 3, 4, 5],
    },
];

export const stepsContentByPhase = {
    0: [PROJECT_FORMS.SUMMARY],
    1: [
        PROJECT_FORMS.SUMMARY,
        PROJECT_FORMS.RESPONSIBLE_OFFICER,
        PROJECT_FORMS.PROJECT_BACKGROUND,
        PROJECT_FORMS.RESULT_MATRIX,
        PROJECT_FORMS.ADDITIONAL_INFO,
    ],
    2: [
        PROJECT_FORMS.SUMMARY,
        PROJECT_FORMS.RESPONSIBLE_OFFICER,
        PROJECT_FORMS.PROJECT_BACKGROUND,
        PROJECT_FORMS.INTRODUCTION, //TODO remove after end config
        PROJECT_FORMS.RESULT_MATRIX,
        PROJECT_FORMS.ADDITIONAL_INFO,
    ],
    3: [
        PROJECT_FORMS.SUMMARY,
        PROJECT_FORMS.RESPONSIBLE_OFFICER,
        PROJECT_FORMS.PROJECT_BACKGROUND,
        PROJECT_FORMS.INTRODUCTION,
        PROJECT_FORMS.OPTIONS_APPRAISAL,
        PROJECT_FORMS.RESULT_MATRIX,
        PROJECT_FORMS.ADDITIONAL_INFO,
    ],
    4: [
        PROJECT_FORMS.SUMMARY,
        PROJECT_FORMS.RESPONSIBLE_OFFICER,
        PROJECT_FORMS.PROJECT_BACKGROUND,
        PROJECT_FORMS.INTRODUCTION,
        PROJECT_FORMS.OPTIONS_APPRAISAL,
        PROJECT_FORMS.OM_COSTS,
        PROJECT_FORMS.RESULT_MATRIX,
        PROJECT_FORMS.ADDITIONAL_INFO,
    ],
    5: [
        PROJECT_FORMS.SUMMARY,
        PROJECT_FORMS.RESPONSIBLE_OFFICER,
        PROJECT_FORMS.PROJECT_BACKGROUND,
        PROJECT_FORMS.INTRODUCTION,
        PROJECT_FORMS.OPTIONS_APPRAISAL,
        PROJECT_FORMS.OM_COSTS,
        PROJECT_FORMS.RESULT_MATRIX,
        PROJECT_FORMS.ADDITIONAL_INFO,
    ],
};

