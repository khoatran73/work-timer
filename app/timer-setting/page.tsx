'use client'

import { Divider, Input } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { ButtonBase } from '~/components/ButtonBase';
import FormBase, { FormBaseRef } from '~/components/FormBase';
import Container from '~/layouts/Container';
import PageContainer from '~/layouts/PageContainer';

export interface Props {}

const TimerSettingPage: React.FC<Props> = (props) => {
    const formRef = useRef<FormBaseRef>(null);

    return (
        <PageContainer>
            <Container className="flex items-center justify-center">
                <div className="w-[400px] rounded-xl p-4 bg-white shadow">
                    <div className="mb-6">
                        <div className="text-2xl font-bold">Timer Setting</div>
                    </div>
                    <FormBase
                    ref={formRef}
                    formBaseItems={[
                        {
                            name: 'username',
                            children: <Input placeholder="Nhập tài khoản..." />,
                            // rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                        {
                            name:'password',
                            children: <Input.Password placeholder="Nhập mật khẩu..." />,
                            // rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                    ]}
                    labelAlign="left"
                    labelCol={0}
                    className={'w-full flex items-center justify-center flex-col'}
                    width={'100%'}
                    renderBtnBottom={() => {
                        return (
                            <div className="w-full">
                                <div
                                    className="w-full h-10 rounded bg-[#fe9900] cursor-pointer flex items-center justify-center text-white text-base uppercase"
                                    // onClick={() => onLogin()}
                                >
                                    Đăng nhập
                                </div>
                                <div className="w-full text-center mt-2">
                                    <a
                                        href="/forgot-password"
                                        className="text-[#38699f] hover:text-[#38699f] hover:underline text-xs"
                                    >
                                        Bạn quên mật khẩu?
                                    </a>
                                </div>
                                <div className="text-xs text-center">
                                    Chưa có tài khoản?{' '}
                                    <a
                                        href="/register"
                                        className="text-[#38699f] hover:text-[#38699f] hover:underline text-xs"
                                    >
                                        Đăng ký ngay
                                    </a>
                                </div>
                            </div>
                        );
                    }}
                />
                </div>
            </Container>
        </PageContainer>
    );
};

export default TimerSettingPage;
