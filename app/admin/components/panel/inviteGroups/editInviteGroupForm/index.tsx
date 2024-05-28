import {Button, Checkbox, Form, FormProps, Input, Select} from 'antd';
import {ChangedGuests, CreateOrEditInviteGroup, InviteGroup} from "@/types/inviteGroups.type";
import {useEffect, useState} from "react";
import {getAllGuestsWithoutInviteGroup} from "@api";
import {useAdminAccessToken} from "@hooks";


const onFinishFailed: FormProps<CreateOrEditInviteGroup>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const TransportsFrom = [
    {label: 'Mosty', value: 'mosty'},
    {label: 'Shchuchyn', value: 'shchuchyn'},
]

export const CreateOrEditInviteGroupForm = ({editInviteGroup, handleSubmitForm}: {
    editInviteGroup?: InviteGroup,
    handleSubmitForm: (editedInviteGroup: CreateOrEditInviteGroup) => void
}) => {
    const [form] = Form.useForm();
    const accessToken = useAdminAccessToken();
    const [guestsWithoutInviteGroup, setGuestsWithoutInviteGroup] = useState([...(editInviteGroup?.guests || [])])

    useEffect(() => {
        const getGuestsWithoutInviteGroup = async () => {
            const res = (await getAllGuestsWithoutInviteGroup(accessToken) || [])
            setGuestsWithoutInviteGroup(guests => [...guests, ...res])
        };
        getGuestsWithoutInviteGroup();
    }, [])
    const onFinish: FormProps<CreateOrEditInviteGroup>['onFinish'] = (values) => {
        values.updateGuests = {
            ...values.guests.reduce((acum, item) => {
                acum[item] = true
                return acum
            }, {} as ChangedGuests),
            ...editInviteGroup?.guests.filter(({id}) => !values.guests.includes(id)).reduce((acum, {id}) => {
                acum[id] = false
                return acum
            }, {} as ChangedGuests)
        };
        handleSubmitForm(values);
    }

    let handleGuestsChange = (values: string[], options: { value: string; label: string; } | {
        value: string;
        label: string;
    }[]) => {
        if (!editInviteGroup && values.length === 1 && !form.getFieldValue('groupName') && Array.isArray(options)) {
            form.setFieldsValue({groupName: options[0]?.label})
        }
    };

    return (
        <Form<CreateOrEditInviteGroup>
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            style={{maxWidth: 600}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
            autoComplete="off"
        >
            <Form.Item<CreateOrEditInviteGroup>
                initialValue={editInviteGroup?.groupName}
                label="group Name"
                name="groupName"
                rules={[{required: true, message: 'Please input your group name!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item<CreateOrEditInviteGroup>
                label="Guests"
                name="guests"
                rules={[{required: true, message: 'Please input guests!'}]}
                initialValue={editInviteGroup?.guests.map(item => item.id)}
            >
                <Select
                    mode="multiple"
                    allowClear
                    onChange={handleGuestsChange}
                    options={guestsWithoutInviteGroup.map(item => ({
                        value: item.id,
                        label: `${item.lastName} ${item.firstName} `
                    }))}/>
            </Form.Item>
            <Form.Item<CreateOrEditInviteGroup>
                label="Transfer From"
                name={['invitation', 'transportFrom']}
                rules={[{required: true, message: 'Please input city from!'}]}
                initialValue={editInviteGroup?.invitation.transportFrom}
            >
                <Select
                    allowClear
                    options={TransportsFrom}/>
            </Form.Item>
            <Form.Item<CreateOrEditInviteGroup>
                name={['invitation', 'checkSlip']}
                wrapperCol={{offset: 8, span: 16}}
                initialValue={editInviteGroup?.invitation.checkSlip}
                valuePropName="checked"
            >
                <Checkbox>Guest need a place to sleep</Checkbox>
            </Form.Item>
            <Form.Item<CreateOrEditInviteGroup>
                name={['invitation', 'checkTransport']}
                wrapperCol={{offset: 8, span: 16}}
                initialValue={editInviteGroup?.invitation.checkTransport}
                valuePropName="checked"
            >
                <Checkbox>Guest need a transport</Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}
