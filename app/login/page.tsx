'use client';

import { Button, Divider, Input } from 'antd';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Box from '~/components/Box';
import FormBase from '~/components/FormBase';
import { NotificationConstant } from '~/constants/NotificationConstant';
import Container from '~/layouts/Container';

const LoginPage: React.FC = () => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            redirect('/');
        }
    }, [session]);

    const login = (type: 'normal' | 'google') => {
        if (type === 'normal') {
            //TODO: add later
            return;
        }

        signIn('google');
    };

    if (session) return null;

    return (
        <div className="w-screen h-screen" style={{ background: 'var(--background)' }}>
            <Container>
                <div className="w-full h-full flex items-center justify-center select-none">
                    <Box>
                        <div className="h-fit" style={{ width: 400 }}>
                            <h1 className="mb-6">Login</h1>
                            <FormBase
                                formBaseItems={[
                                    {
                                        name: 'email',
                                        children: <Input type="Email" placeholder="Email" />,
                                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                                        label: 'Email',
                                    },
                                    {
                                        name: 'password',
                                        children: <Input type="Password" placeholder="Password" />,
                                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                                        label: 'Password',
                                    },
                                ]}
                                layout="horizontal"
                                labelAlign="left"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                className={'w-full flex items-center justify-center flex-col'}
                                width={'100%'}
                                renderBtnBottom={() => {
                                    return (
                                        <div className="w-full flex flex-col">
                                            <Button type="primary" onClick={() => login('normal')} block>
                                                Login
                                            </Button>
                                            <Divider
                                                style={{
                                                    margin: '8px 0',
                                                    fontSize: 14,
                                                    color: 'var(--text-secondary)',
                                                    fontWeight: 400,
                                                }}
                                            >
                                                or
                                            </Divider>
                                            <Button
                                                icon={<FcGoogle />}
                                                iconPosition="start"
                                                onClick={() => login('google')}
                                                block
                                            >
                                                Login with Google
                                            </Button>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </Box>
                </div>
            </Container>
        </div>
    );
};

export default LoginPage;
