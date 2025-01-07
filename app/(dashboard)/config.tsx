import _ from 'lodash';
import { MdDashboard, MdManageHistory, MdNotifications } from 'react-icons/md';
import { DashboardMenuItem } from '~/types/menu';

export const DASHBOARD_MENU_LIST: DashboardMenuItem[] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: (
            <span className="icon">
                <MdDashboard />
            </span>
        ),
        type: 'item',
    },
    {
        key: 'setting',
        label: 'Setting',
        path: '/setting',
        type: 'group',
        children: [
            {
                key: 'timer-setting',
                label: 'Timer',
                path: '/setting/timer',
                icon: (
                    <span className="icon">
                        <MdManageHistory />
                    </span>
                ),
            },
            {
                key: 'notification',
                label: 'Notification',
                path: '/setting/notification',
                icon: (
                    <span className="icon">
                        <MdNotifications />
                    </span>
                ),
            },
            // {
            //     key: 'a',
            //     label: 'A',
            //     path: '/setting/a',
            //     icon: (
            //         <span className="icon">
            //             <MdNotifications />
            //         </span>
            //     ),
            //     type:'submenu',
            //     children: [
            //         {
            //             key: 'b',
            //             label: 'B',
            //             path: '/setting/a/b',
            //             icon: (
            //                 <span className="icon">
            //                     <MdNotifications />
            //                 </span>
            //             ),
            //         }
            //     ]
            // },
        ],
    },
];

const flattenArray = (array: DashboardMenuItem[]): DashboardMenuItem[] => {
    return _.flatMap(array, item => {
        const currentItem: DashboardMenuItem[] = [{ ...item }];
        return item.children ? currentItem.concat(flattenArray(item.children)) : currentItem;
    });
};

export const FLAT_DASHBOARD_MENU_LIST = flattenArray(DASHBOARD_MENU_LIST);
