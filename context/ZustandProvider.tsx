import React, { PropsWithChildren, useEffect, useState } from 'react';
import requestApi from '~/lib/requestApi';
import { UserDto } from '~/types/user';
import useCurrentUser from '../store/useCurrentUser';

interface Props extends PropsWithChildren {}

const ZustandProvider: React.FC<Props> = ({ children }) => {
    const { setUser, clearUser, setLoading } = useCurrentUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                setLoading(true);
                const response = await requestApi<any, UserDto>('/api/user/current-user', 'get');
                setUser({
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    image: response.data.image,
                });
            } catch (error) {
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
        setIsLoading(false);
    }, [setUser]);

    if (isLoading) return <></>;
    return <>{children}</>;
};

export default ZustandProvider;
