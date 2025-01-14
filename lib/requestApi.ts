import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const requestApi = async <TRequest extends Record<string, any>, TResponse>(
    url: string,
    method: 'get' | 'post' | 'put' | 'delete',
    data?: TRequest,
    config?: AxiosRequestConfig<TRequest>,
): Promise<AxiosResponse<TResponse>> => {
    switch (method) {
        case 'get':
            return await axios.get(url, {
                ...config,
                params: data,
            });

        case 'post':
            return await axios.post(url, data, config);
        case 'put':
            return await axios.put(url, data, config);
        case 'delete':
            return await axios.delete(url, config);
        default:
            return await axios.get(url, {
                ...config,
                params: data,
            });
    }
};

export const convertToFormData = (data: any): FormData => {
    const formData = new FormData();

    function appendToFormData(key: string, value: any) {
        if (value instanceof File) {
            if (value != null && value != undefined) formData.append(key, value, value.name);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const keyPath = item instanceof File ? key : `${key}[${index}]`;
                appendToFormData(keyPath, item);
            });
        } else if (value instanceof Object && !(value instanceof Date)) {
            Object.keys(value).forEach(prop => appendToFormData(`${key}.${prop}`, value[prop]));
        } else {
            if (value != null && value != undefined) formData.append(key, value);
        }
    }
    Object.keys(data).forEach(key => appendToFormData(key, data[key]));

    return formData;
};

export default requestApi;
