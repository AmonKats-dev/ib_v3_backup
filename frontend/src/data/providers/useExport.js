import { useMutation } from 'react-admin';

const useExport = (data, options) => {
    return useMutation({ type: 'export', resource: '', payload: { data: data } }, options);
};

export default useExport;
