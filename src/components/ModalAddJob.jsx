import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Col,
  Row,
  notification,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ModalAddJob = ({ open, loading, handleOk, handleCancel }) => {
  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message: message,
    });
  };

  const onFinish = async (values) => {
    const otherInfoString = values.other_info
      ? values.other_info.map((info) => info.data).join(", ")
      : "";
    const workArrangementsString = values.work_arrangements
      ? values.work_arrangements.map((info) => info.data).join(", ")
      : "";
    const now = new Date();
    // Menambahkan offset +7 jam untuk WIB (UTC+7)
    const jakartaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    // Konversi ke format ISO tanpa Z di akhir (karena sudah diubah ke WIB)
    const isoDateWIB = jakartaTime.toISOString();

    const createJob = {
      ...values,
      other_info: otherInfoString,
      work_arrangements: workArrangementsString,
      date: isoDateWIB,
    };

    console.log(createJob);
    axios
      .post(`${import.meta.env.VITE_API_URL}`, createJob) // Menggunakan return untuk memastikan promise ditangani dengan benar
      .then((response) => {
        console.log("Item posted:", response);
        openNotificationWithIcon("success", "Data added successfully");
        handleOk();
        form.resetFields();
      })
      .catch((error) => {
        console.error("Error posting item:", error);
        openNotificationWithIcon("error", "Failed to add data");
      });
  };
  return (
    <>
      {contextHolder}
      <Modal
        visible={open}
        title="Add Job"
        onOk={() => form.submit()}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form
          form={form}
          name="form_item_path"
          layout="vertical"
          onFinish={onFinish}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                name="tag"
                label="Select or Search Tag"
                rules={[
                  {
                    required: true,
                    message: "Please select your Tag!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select or Search Tag"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.value ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.value ?? "").toLowerCase())
                  }
                  options={[
                    { value: "Java Spring", label: "Java Spring" },
                    { value: "Python Django", label: "Python Django" },
                    { value: "Python Flask", label: "Python Flask" },
                    { value: "NodeJs Express", label: "NodeJs Express" },
                    { value: "NodeJs Nest", label: "NodeJs Nest" },
                    { value: ".Net Core", label: ".Net Core" },
                    { value: "Angular", label: "Angular" },
                    { value: "Reactjs", label: "Reactjs" },
                    { value: "React Native", label: "React Native" },
                    { value: "Flutter", label: "Flutter" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="job_location"
                label="Location"
                rules={[
                  {
                    required: true,
                    message: "Please input your Job Location!",
                  },
                ]}
              >
                <Input placeholder="Enter Job Location" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="company_name"
                label="Company Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Company Name!",
                  },
                ]}
              >
                <Input placeholder="Enter Company Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  {
                    required: true,
                    message: "Please input your Job Title!",
                  },
                ]}
              >
                <Input.TextArea autoSize placeholder="Enter Job Title" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="teaser" label="Teaser">
                <Input.TextArea
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                  placeholder="Enter Teaser Information"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item name="work_type" label="Work Type">
                <Input placeholder="Ex: Full Time, Casual, etc" />
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={12}>
              <Form.Item name="salary" label="Salary">
                <Input.TextArea
                  autoSize
                  placeholder="Enter Salary (Optional)"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Work Place">
                <Form.List name={["work_arrangements"]}>
                  {(subFields, subOpt) => (
                    // <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 16,
                      }}
                    >
                      {subFields.map((subField) => (
                        <Space key={subField.key}>
                          <Form.Item noStyle name={[subField.name, "data"]}>
                            <Input.TextArea
                              autoSize
                              placeholder="Enter Work Place"
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => {
                              subOpt.remove(subField.name);
                            }}
                          />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block>
                        + Add Work Place
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="classification" label="Classification">
                <Input.TextArea
                  autoSize
                  placeholder="Enter Job Classification"
                />
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={11}>
              {" "}
              <Form.Item name="subclassification" label="Subclassification">
                <Input.TextArea
                  autoSize
                  placeholder="Enter Job Subclassification"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="other_info" label="Other Info">
                <Form.List name={["other_info"]}>
                  {(subFields, subOpt) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 16,
                      }}
                    >
                      {subFields.map((subField) => (
                        <div
                          key={subField.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Form.Item
                            noStyle
                            name={[subField.name, "data"]}
                            style={{ flex: 1 }}
                          >
                            <Input.TextArea
                              autoSize
                              placeholder="Enter Additional Info"
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => {
                              subOpt.remove(subField.name);
                            }}
                          />
                        </div>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block>
                        + Add Other Info
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalAddJob;
