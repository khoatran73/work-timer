import { useEffect, useState } from 'react';
import { ApiStatus } from '~/constants/ApiConstant';
import requestApi from '~/lib/requestApi';

interface State<TData> {
    entity: TData | null;
    isInitialLoading: boolean;
    isRefetching: boolean;
}

const useDetail = <TData, TRequest extends Record<string, any> = Record<string, any>>(
    url: string,
    request?: TRequest,
) => {
    const [state, setState] = useState<State<TData>>({
        entity: null,
        isInitialLoading: true,
        isRefetching: false,
    });

    const fetchDetail = async () => {
        const response = await requestApi<TRequest, TData>(url, 'get', request);
        if (response.status === ApiStatus.SUCCESS) {
            setState(pre => ({
                ...pre,
                entity: response.data,
                isInitialLoading: false,
            }));
            return;
        }

        setState(pre => ({
            ...pre,
            isInitialLoading: false,
        }));
    };

    useEffect(() => {
        fetchDetail();
    }, []);

    return {
        ...state,
        refetch: async () => {
            setState(pre => ({
                ...pre,
                isRefetching: true,
            }));
            await fetchDetail();
            setState(pre => ({
                ...pre,
                isRefetching: false,
            }));
        },
    } as const;
};

export default useDetail;
