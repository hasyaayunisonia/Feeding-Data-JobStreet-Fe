import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Typography, Row, Col, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faMoneyBill,
  faLocationDot,
  faClockRotateLeft,
  faBriefcase,
  faGears,
} from "@fortawesome/free-solid-svg-icons";

const ModalDetailJob = ({ isModalOpen, handleCancel, jobId }) => {
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(false);
  // const job = { "id": 1, "tag": "Java Spring", "company_name": "PT Akar Inti Teknologi", "job_location": "Jakarta Raya", "title": "BackEnd Developers (Java) - Mid and Senior Engineers", "classification": "Teknologi Informasi & Komunikasi", "subclassification": "Developer/Programmer", "salary": "", "work_type": "Kontrak", "teaser": "We are hiring for Java developer position who familiar with the front-end design &amp; development, and strong expertise with back-end...", "work_arrangements": "Kantor", "other_info": "Java, Springboot, Microservices", "date": "2024-09-09T01:50:02.000Z" }

  // console.log('ini jobID', jobId)

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${jobId}`
      ); // Pastikan endpoint sesuai
      setJob(response.data); // Ambil data dari response.data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]); // Menambahkan jobId ke dependency array

  useEffect(() => {
    if (isModalOpen) {
      fetchData();
    }
  }, [isModalOpen]);

  // Format the date to "Month Day, Year" format
  const formattedDate = new Date(job.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Split the other_info into an array of strings, or set to "-" if empty
  const otherInfoList = job.other_info ? job.other_info.split(", ") : ["-"];
  return (
    <Modal
      title={job.title}
      open={isModalOpen}
      onCancel={handleCancel}
      maskClosable={false} // Disable close when clicking outside
      closable={true} // Show the close button (X)
      footer={null}
    >
      <Row gutter={[8, 5]}>
        <Col span={24}>
          <Space>
            <FontAwesomeIcon
              icon={faBuilding}
              style={{ color: "rgb(164, 69, 54)", width: "14px" }}
            />
            <Typography>{job.company_name || "-"}</Typography>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <FontAwesomeIcon
              icon={faLocationDot}
              style={{ color: "rgb(164, 69, 54)", width: "14px" }}
            />
            <Typography> {job.job_location || "-"}</Typography>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <FontAwesomeIcon
              icon={faBriefcase}
              style={{ color: "rgb(164, 69, 54)", width: "14px" }}
            />
            <Typography>{job.work_arrangements || "-"}</Typography>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <FontAwesomeIcon
              icon={faGears}
              style={{ color: "rgb(164, 69, 54)", width: "14px" }}
            />
            <Typography>
              {job.classification || "-"}
              {job.subclassification ? `(${job.subclassification})` : ""}
            </Typography>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              style={{ color: "rgb(164, 69, 54)", width: "14px" }}
            />
            <Typography>{job.work_type || "-"}</Typography>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <FontAwesomeIcon
              icon={faMoneyBill}
              style={{ color: "rgb(164, 69, 54)", width: "14px" }}
            />
            <Typography>{job.salary || "-"}</Typography>
          </Space>
        </Col>
        <Col span={24}>
          <Typography style={{ color: "grey", ontSize: "10px" }}>
            Posted date {formattedDate}
          </Typography>
        </Col>
      </Row>
      <Col span={24}>
        <Typography.Title level={2} style={{ fontSize: "14px" }}>
          Teaser
        </Typography.Title>
        <div dangerouslySetInnerHTML={{ __html: job.teaser || "-" }} />
      </Col>
      <Col span={24}>
        <Typography.Title level={2} style={{ fontSize: "14px" }}>
          Other Info
        </Typography.Title>
        <ul>
          {otherInfoList.map((info, index) => (
            <li key={index}>
              <Typography>{info}</Typography>
            </li>
          ))}
        </ul>
      </Col>
    </Modal>
  );
};

export default ModalDetailJob;
