import { useQueryWithStore } from 'react-admin';

export default (reference) => {
    const { loaded } = useQueryWithStore({
        type: 'getList',
        resource: reference,
        payload: {
            pagination: { page: 1, perPage: -1 },
            sort: {},
            filter: {},
        },
    });

    return loaded;
};