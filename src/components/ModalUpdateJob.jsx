import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Space,
  notification,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";

const ModalUpdateJob = ({ open, loading, handleOk, handleCancel, jobId }) => {
  const [form] = Form.useForm();
  const [job, setJob] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  // const job = { "id": 1, "tag": "Java Spring", "company_name": "PT Akar Inti Teknologi", "job_location": "Jakarta Raya", "title": "BackEnd Developers (Java) - Mid and Senior Engineers", "classification": "Teknologi Informasi & Komunikasi", "subclassification": "Developer/Programmer", "salary": "", "work_type": "Kontrak", "teaser": "We are hiring for Java developer position who familiar with the front-end design &amp; development, and strong expertise with back-end...", "work_arrangements": "Kantor", "other_info": "Java, Springboot, Microservices", "date": "2024-09-09T01:50:02.000Z" }
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${jobId}`
      ); // Pastikan endpoint sesuai
      setJob(response.data); // Ambil data dari response.data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  useEffect(() => {
    if (open && job) {
      const otherInfoArray = job.other_info
        ? job.other_info.split(",").map((item) => item.trim())
        : [];
      const work_arrangementsArray = job.work_arrangements
        ? job.work_arrangements.split(",").map((item) => item.trim())
        : [];
      form.setFieldsValue({
        ...job,
        work_arrangements: work_arrangementsArray.map((info) => ({
          data: info,
        })),
        other_info: otherInfoArray.map((info) => ({ data: info })),
      });
      // form.setFieldsValue({
      //     ...job,
      //     work_arrangements: [{ data: job.work_arrangements }],
      //     other_info: [{ data: job.other_info }],
      // });
    }
  }, [open, job, form]);

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

    const updatedJob = {
      ...values,
      other_info: otherInfoString,
      work_arrangements: workArrangementsString,
      date: job.date,
    };

    console.log(updatedJob);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/${jobId}`,
        updatedJob
      );
      openNotificationWithIcon("success", "Data updated successfully");
      handleOk();
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
      openNotificationWithIcon("error", "Failed to update data");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        visible={open}
        title="Update Job"
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
                  style={{ width: 200 }}
                  placeholder="Search or Search Tag"
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
                    message: "Please input your Title!",
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
                  autoSize={{ minRows: 3, maxRows: 5 }}
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
                <Form.List name="work_arrangements">
                  {(subFields, subOpt) => (
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
                <Form.List name="other_info">
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
                            style={{ cursor: "pointer" }}
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

export default ModalUpdateJob;
