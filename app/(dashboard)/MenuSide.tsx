'use client';

import { Divider, Menu, MenuProps } from 'antd';
import clsx from 'clsx';
import _ from 'lodash';
import { redirect, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { DashboardMenuItem } from '~/types/menu';
import { DASHBOARD_MENU_LIST, FLAT_DASHBOARD_MENU_LIST } from './config';
import './styles/menu-side.scss';

interface Props {}

const MenuSide: React.FC<Props> = () => {
    const pathname = usePathname();
    const [selectedKey, setSelectedKey] = useState<string | undefined>();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        const menuItem = FLAT_DASHBOARD_MENU_LIST.findLast(x => pathname.startsWith(x.path));
        if (_.isEmpty(menuItem)) return;

        setSelectedKey(`${menuItem.key}`);
    }, [pathname]);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    const getMenuItemByKey = (key: string): DashboardMenuItem | undefined => {
        const item = FLAT_DASHBOARD_MENU_LIST.find(x => x.key === key);
        return item;
    };

    const handleClick: MenuProps['onClick'] = info => {
        const menuItem = getMenuItemByKey(info.key);
        if (_.isEmpty(menuItem)) return;
        if (_.isEqual(menuItem.key, selectedKey)) return;

        redirect(menuItem.path);
    };

    const handleSelect: MenuProps['onSelect'] = info => {
        setSelectedKey(info.selectedKeys?.[0]);
    };

    if (!domLoaded) return <></>;
    return (
        <div className={clsx('h-full bg-transparent flex')}>
            <div className={clsx('h-full menu-side-wrapper', { collapsed: isCollapsed })}>
                <div className="header">
                    {/* <Image src="/app/favicon.ico" alt="logo" width={32} height={32} /> */}
                    Logo
                </div>
                <Menu
                    mode="inline"
                    theme="light"
                    defaultSelectedKeys={selectedKey ? [selectedKey] : []}
                    selectedKeys={selectedKey ? [selectedKey] : []}
                    onClick={handleClick}
                    onSelect={handleSelect}
                    inlineIndent={10}
                    className="menu-side"
                    items={DASHBOARD_MENU_LIST}
                    inlineCollapsed={isCollapsed}
                />
            </div>
            <div className="relative">
                <Divider
                    type="vertical"
                    style={{
                        height: '100%',
                        margin: '0',
                    }}
                />
                <div
                    className="w-6 h-16 my-1 flex items-center justify-center"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: -12,
                    }}
                >
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-transparent cursor-pointer"
                        style={{
                            border: '1px solid #919eab1f',
                            background: 'var(--background)',
                        }}
                        onClick={() => {
                            setIsCollapsed(pre => !pre);
                        }}
                    >
                        {isCollapsed ? <MdChevronRight fontSize={16} /> : <MdChevronLeft fontSize={16} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuSide;
