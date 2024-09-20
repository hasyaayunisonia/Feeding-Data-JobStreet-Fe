import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Space,
  Button,
  Tag,
  Table,
  Modal,
  Spin,
  Flex,
  notification,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import ModalDetailJob from "./ModalDetailJob";
import ModalUpdateJob from "./ModalUpdateJob";

export const TableJob = ({ data, loading, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingTable, setLoadingTable] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Jumlah item per halaman
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [updateData, setUpdateData] = useState(false);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showModal = (id) => {
    setSelectedJobId(id);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModalUpdate = (id) => {
    setSelectedJobId(id);
    setOpenUpdate(true);
  };
  const handleOkUpdate = async () => {
    setLoadingUpdate(true);
    // onRefresh();
    // Simulasikan API update
    setTimeout(() => {
      setLoadingUpdate(false);
      onRefresh(); // Refresh data setelah update
      setOpenUpdate(false);
    }, 800);
  };
  const handleCancelUpdate = () => {
    setOpenUpdate(false);
  };

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message: message,
    });
  };

  const showConfirm = async (id) => {
    Modal.confirm({
      title: "Do you want to delete this item?",
      icon: <ExclamationCircleFilled />,
      onOk: async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`);
          console.log("Item deleted");
          openNotificationWithIcon("success", "Data deleted successfully");
          onRefresh();
        } catch (error) {
          console.error("Error deleting item:", error);
          openNotificationWithIcon("error", "Failed to delete data");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "No",
      key: "no",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1, // Perhitungan no urut
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Location",
      dataIndex: "job_location",
      key: "job_location",
    },
    {
      title: "Tag",
      key: "tag",
      dataIndex: "tag",
      // render: (_, { tags }) => (
      //     <>
      //         {tags.map((tag) => {
      //             let color = tag.length > 5 ? 'geekblue' : 'green';
      //             if (tag === 'loser') {
      //                 color = 'volcano'
      //             }
      //             return (
      //                 <Tag color={color} key={tag}>
      //                     {tag.toUpperCase()}
      //                 </Tag>
      //             );
      //         })}
      //     </>
      // ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" ghost onClick={() => showModal(record.id)}>
            Detail
          </Button>
          <Button
            type="primary"
            ghost
            style={{ color: "#FFA500", borderColor: "#FFA500" }}
            onClick={() => showModalUpdate(record.id)}
          >
            Update
          </Button>
          <Button
            type="primary"
            danger
            ghost
            onClick={() => showConfirm(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ marginBottom: "16px" }}>
        {`${(currentPage - 1) * pageSize + 1}-${Math.min(
          currentPage * pageSize,
          data.length
        )} of ${data.length} items`}
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data.length,
          showSizeChanger: true, // Untuk memungkinkan perubahan pageSize
        }}
      />
      <ModalDetailJob
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        jobId={selectedJobId}
      />
      <ModalUpdateJob
        open={openUpdate}
        loading={loadingUpdate}
        handleOk={handleOkUpdate}
        handleCancel={handleCancelUpdate}
        jobId={selectedJobId}
      ></ModalUpdateJob>
    </>
  );
};
