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
import navigation from './navigation';
import validationFields from './validationFields'

const translations = {
  common: {
    home: 'Home',
    avatar: {
      loadingPrimary: 'Loading',
      loadingSecondary: 'The avatar is loading, just a moment please',
    },
  },
  ra: {
    false: 'false',
    undefined: 'undefined',
    'Source of funding identified': 'Source of funding identified',
    'You have new messages': 'You have new messages'
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
  ...projectSteps,
  ...navigation,
  ...validationFields
};

export default translations;
