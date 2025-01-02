import { Form, FormInstance } from 'antd';
import { FormItemInputProps } from 'antd/es/form/FormItemInput';
import { FormItemLabelProps } from 'antd/es/form/FormItemLabel';
import { NamePath } from 'antd/lib/form/interface';
import clsx from 'clsx';
import React, { useImperativeHandle, useRef } from 'react';
// import './styles/FormBase.scss';

export interface FormBaseProps {
    initialValues?: Record<string, any>;
    labelCol?: number;
    layout?: 'horizontal' | 'inline' | 'vertical';
    labelAlign?: 'left' | 'right';
    disabled?: boolean;
    formBaseItems?: FormBaseItem[];
    className?: string;
    width?: number | string;
    renderBtnBottom?: () => React.ReactNode;
}

export type FormBaseItem = Partial<FormItemInputProps & FormItemLabelProps> & {
    name?: string;
    rules?: Array<Record<string, any>>;
    initialValue?: any;
    valuePropName?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    withoutFormItem?: boolean;
};

export interface FieldData {
    name: NamePath;
    value: any;
}

export interface FormBaseRef {
    getFieldsValue: () => Record<string, any>;
    getFieldValue: (fieldName: string) => Record<string, any>;
    isFieldsValidate: () => Promise<boolean | undefined>;
    resetFields: (fields?: NamePath[]) => void;
    setFields: (fields: FieldData[]) => void;
    setFieldValue: (name: NamePath, value: any) => void;
    setFieldsValue: (values: any) => void;
    onSubmit: () => void;
}

const FormBase = React.forwardRef<FormBaseRef, FormBaseProps>((props, ref) => {
    const formRef = useRef<FormInstance>(null);

    useImperativeHandle(ref, () => ({
        getFieldsValue: () => formRef.current?.getFieldsValue(true),
        getFieldValue: (fieldName: string) => formRef.current?.getFieldValue(fieldName),
        isFieldsValidate: async () => {
            return await formRef.current
                ?.validateFields()
                .then(() => true)
                .catch(() => false);
        },
        resetFields: (fields?: NamePath[]) => formRef.current?.resetFields(fields),
        setFields: (fields: FieldData[]) => formRef.current?.setFields(fields),
        setFieldValue: (name: NamePath, value: any) => formRef.current?.setFieldValue(name, value),
        setFieldsValue: (values: any) => formRef.current?.setFieldsValue(values),
        onSubmit: () => formRef.current?.submit(),
    }));

    return (
        <div className={clsx('w-full h-full base-form', props.className)}>
            <Form
                labelCol={{ span: props.labelCol ?? 6 }}
                wrapperCol={{ span: 24 - Number(props.labelCol ?? 6) }}
                initialValues={props.initialValues}
                autoComplete="off"
                ref={formRef}
                labelAlign={props.labelAlign}
                layout={props.layout}
                disabled={props.disabled}
                style={{
                    width: props.width,
                }}
            >
                {props.formBaseItems?.map(item => {
                    if (item.withoutFormItem) {
                        return item.children;
                    }

                    return (
                        <Form.Item key={item.name} {...item}>
                            {item.children}
                        </Form.Item>
                    );
                })}
            </Form>
            {props.renderBtnBottom?.()}
        </div>
    );
});

export default FormBase;
