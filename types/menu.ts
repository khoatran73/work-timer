import type { MenuProps } from 'antd';
import { IconType } from 'react-icons';

type MenuItem = Required<MenuProps>['items'][number];

export type DashboardMenuItem = MenuItem & {
    // permission: string;
path: string;
children?: DashboardMenuItem[];

};

// name: string;
// route: string;
// level: number;
// Icon?: IconType;
// key: string;
// isGroup?:boolean;
// parentKey?: string;
// permissions?: string;
// isDisplay?: boolean;
// breadcrumbs?: Array<string>;
// isLeaf?: boolean;
// hasPermissionToAccess?: boolean;
