import OrganizationsCreate from './OrganizationsCreate';
import OrganizationsEdit from './OrganizationsEdit';
import OrganizationsList from './OrganizationsList';
import OrganizationsShow from './OrganizationsShow';
import { ShowGuesser } from 'react-admin'

export default {
    list: OrganizationsList,
    show: OrganizationsShow,
    create: OrganizationsCreate,
    edit: OrganizationsEdit,
};
