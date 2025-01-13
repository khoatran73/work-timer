import { notification } from 'antd';
import * as React from 'react';

export default class NotifyUtil {
    static success(message: string, description: string) {
        notification.success({
            message: message,
            description: description,
        });
    }

    static error(message: string, description: string) {
        notification.error({
            message: message,
            description: description,
        });
    }

    static warn(message: string, description: string) {
        notification.warning({
            message: message,
            description: description,
        });
    }

    static info(message: string, description: string) {
        notification.info({
            message: message,
            description: description,
        });
    }
}
