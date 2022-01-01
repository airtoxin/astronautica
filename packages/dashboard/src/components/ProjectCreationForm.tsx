import { useMemo, useState, VoidFunctionComponent } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

export type FormState = {
  name: string;
  apiKeyDescription?: string;
  expiration?: Date | null;
};
type Props = {
  onSubmit: (values: FormState) => Promise<void>;
};
export const ProjectCreationForm: VoidFunctionComponent<Props> = ({
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [withApiKey, setWithApiKey] = useState(false);
  const [expiration, setExpiration] = useState<Date | null>(
    addDays(new Date(), 30)
  );
  const expirationText = useMemo(() => {
    if (expiration == null) return "API key never expires";
    return `API key will expires on ${format(expiration, "yyyy-MM-dd")}`;
  }, [expiration]);
  return (
    <Form<FormState>
      form={form}
      name="basic"
      layout="vertical"
      onFinish={(values) =>
        onSubmit(withApiKey ? { ...values, expiration } : values).then(() => {
          form.resetFields([
            "name",
            "createApiKey",
            "apiKeyDescription",
            "expiration",
          ]);
          setWithApiKey(false);
        })
      }
    >
      <Form.Item
        label="Project name"
        name="name"
        rules={[{ required: true, message: "Can't be blank" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Checkbox
          checked={withApiKey}
          onChange={() => setWithApiKey((s) => !s)}
        >
          Also create new API key
        </Checkbox>
      </Form.Item>

      {withApiKey && (
        <>
          <Form.Item
            label="API key description"
            name="apiKeyDescription"
            rules={[{ required: true, message: "Can't be blank" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Expiration">
            <Row>
              <Col style={{ height: "2rem", marginRight: "1rem" }}>
                <Form.Item
                  name="expiration"
                  rules={[{ required: true, message: "Select expiration" }]}
                  initialValue={"30"}
                >
                  <Select
                    style={{ width: "8rem" }}
                    onSelect={(value) =>
                      setExpiration(
                        value === "none"
                          ? null
                          : typeof value === "string"
                          ? addDays(new Date(), Number.parseInt(value, 10))
                          : new Date()
                      )
                    }
                  >
                    <Select.Option value="7">7 days</Select.Option>
                    <Select.Option value="30">30 days</Select.Option>
                    <Select.Option value="60">60 days</Select.Option>
                    <Select.Option value="90">90 days</Select.Option>
                    <Select.Option value="none">No expiration</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "2rem",
                }}
              >
                <Typography.Text type="secondary">
                  {expirationText}
                </Typography.Text>
              </Col>
            </Row>
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create project
        </Button>
        <Button type="text" htmlType="button" style={{ marginLeft: "1rem" }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};
