import { VoidFunctionComponent } from "react";
import { Alert, Form, Input, Select } from "antd";

export const AddNewApiKey: VoidFunctionComponent = () => {
  return (
    <Form>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Description can't be blank" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Expiration"
        name="expiresAt"
        rules={[{ required: true, message: "Description can't be blank" }]}
      >
        <Select>
          <Select.Option value="7">7days</Select.Option>
          <Select.Option value="30">30days</Select.Option>
          <Select.Option value="60">60days</Select.Option>
          <Select.Option value="90">90days</Select.Option>
          <Select.Option value="custom">Custom</Select.Option>
          <Select.Option value="none">No expiration</Select.Option>
        </Select>
        <Alert
          message="Astronautica strongly recommends that you set an expiration date for your token to help keep your information secure."
          type="warning"
        />
      </Form.Item>
    </Form>
  );
};
