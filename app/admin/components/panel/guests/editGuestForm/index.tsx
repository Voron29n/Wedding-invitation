import {CreateOrEditGuest, Guest, GuestGender, GuestSide} from "@types";
import {Button, Checkbox, Form, FormProps, Input, Radio} from 'antd';


const onFinishFailed: FormProps<CreateOrEditGuest>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const DEFAULT_GUEST = {isAdult: false} as Guest;

export const EditGuestForm = ({editGuest, handleSubmitForm}: {
    editGuest?: Guest,
    handleSubmitForm: (editedGuest: CreateOrEditGuest) => void
}) => {
    const onFinish: FormProps<CreateOrEditGuest>['onFinish'] = (values) => {
        handleSubmitForm(values);
    }

    return (
        <Form
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            style={{maxWidth: 600}}
            initialValues={editGuest || DEFAULT_GUEST}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<CreateOrEditGuest>
                label="First name"
                name="firstName"
                rules={[{required: true, message: 'Please input your first name!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item<CreateOrEditGuest>
                label="Last name"
                name="lastName"
                rules={[{required: true, message: 'Please input your last name!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item<CreateOrEditGuest>
                name="isAdult"
                valuePropName="checked"
                wrapperCol={{offset: 8, span: 16}}
            >
                <Checkbox>Guest is adult 18+</Checkbox>
            </Form.Item>
            <Form.Item label="Guest side" name="side">
                <Radio.Group>
                    <Radio.Button value={GuestSide.husband}>Husband</Radio.Button>
                    <Radio.Button value={GuestSide.wife}>Wife</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Gender" name="gender">
                <Radio.Group>
                    <Radio.Button value={GuestGender.male}>Male</Radio.Button>
                    <Radio.Button value={GuestGender.female}>Female</Radio.Button>
                </Radio.Group>
            </Form.Item>


            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}
