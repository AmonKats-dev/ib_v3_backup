import buttons from './buttons';
import englishMessages from 'ra-language-english';
import messages from './messages';
import printForm from './printForm';
import resources from './resources';
import timeline from './timeline';
import tooltips from './tooltips';
import validation from './validation';
import workflow from './workflow';
import titles from './titles';
import comments from './comments';
import projectSteps from './projectSteps';

const translations = {
  common: {
    home: 'Home',
    avatar: {
      loadingPrimary: 'Loading',
      loadingSecondary: 'The avatar is loading, just a moment please',
    },
  },
  ...englishMessages,
  ...buttons,
  ...messages,
  ...tooltips,
  ...resources,
  ...timeline,
  ...printForm,
  ...workflow,
  ...validation,
  ...titles,
  ...comments,
  ...projectSteps
};

export default translations;
