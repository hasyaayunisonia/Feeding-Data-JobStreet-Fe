import React, { useState, useEffect } from "react";
import axios from "axios";
import { Breadcrumb, Layout, Button, Select, Form } from "antd";
import { Space, Table, Tag, Modal } from "antd";
import { Col, Divider, Row } from "antd";
import ModalAddJob from "./ModalAddJob";
import { TableJob } from "./TableJob";

const { Header, Content, Footer } = Layout;
const Dashboard = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedGenerateTag, setSelectedGenerateTag] = useState(null);
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openGenerateData, setOpenGenerateData] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const params = selectedTag ? selectedTag : "All";
      console.log("ini isi apa", import.meta.env.VITE_API_URL); // Periksa apakah ini menampilkan URL yang benar
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/search?keyword=${params}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      setJobData(response.data); // Simpan data dari API ke dalam state
      console.log("Data from API before:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500); // 2 seconds delay
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTag]);

  useEffect(() => {
    console.log("Data from API after:", jobData);
  }, [jobData]);

  const handleExportExcel = async () => {
    try {
      // Mengambil data Excel dengan responseType 'blob'
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/export-excel`,
        {
          responseType: "blob",
        }
      );

      // Membuat URL untuk unduhan
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "jobs-data.xlsx"); // Nama file yang akan diunduh
      document.body.appendChild(link);
      link.click(); // Mengklik link untuk memulai unduhan
      link.remove(); // Menghapus link dari DOM setelah unduhan
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  const handleTagChange = (value) => {
    setSelectedTag(value);
  };

  const showModalAdd = () => {
    setOpenAdd(true);
  };

  const handleOkAdd = () => {
    setLoadingAdd(true);
    setTimeout(() => {
      setLoadingAdd(false);
      fetchData();
      setOpenAdd(false);
    }, 800);
  };

  const handleCancelAdd = () => {
    setOpenAdd(false);
  };

  const showModalGenerateData = () => {
    setOpenGenerateData(true);
  };

  const handleOkGenerateData = async () => {
    try {
      if (!selectedGenerateTag) return; // Pastikan ada tag yang dipilih
      await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/scrape-filter-data/${selectedGenerateTag}`
      );
      // Memperbarui selectedTag untuk memicu pemanggilan API baru dan memperbarui tabel
      setSelectedTag(selectedGenerateTag);
      fetchData();
    } catch (error) {
      console.error("Error generating data:", error);
    }
    setOpenGenerateData(false);
  };

  const handleCancelGenerateData = () => {
    setOpenGenerateData(false);
  };

  const handleGenerateData = (value) => {
    setSelectedGenerateTag(value); // Simpan tag yang dipilih
  };

  // const handleGenerateData = async (value) => {
  //   try {
  //     // Memanggil API untuk menghasilkan data berdasarkan tag yang dipilih
  //     // await axios.get(
  //     //   `${import.meta.env.VITE_API_URL}/scrape-filter-data/${value}`
  //     // );
  //     // Memperbarui selectedTag untuk memicu pemanggilan API baru dan memperbarui tabel
  //     setSelectedTag(value);
  //     fetchData();
  //   } catch (error) {
  //     console.error("Error generating data:", error);
  //   }
  // };

  return (
    <Layout style={{ background: "#F8EDE3" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#C5705D",
          justifyContent: "center",
        }}
      >
        <div className="demo-logo" />
        <h1 style={{ fontSize: 20, fontStyle: "italic", color: "#fff" }}>
          Job Vacancy
        </h1>
      </Header>
      <Content
        style={{
          padding: "0 30px",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            background: "#ffff",
            minHeight: 280,
            padding: 24,
            borderRadius: 10,
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row justify="center" align="middle">
              <Col span={6} order={1}>
                <Form.Item label="Search or Select Tag" colon={false}>
                  <Select
                    showSearch
                    style={{
                      width: 200,
                    }}
                    placeholder="Search or Select Tag"
                    optionFilterProp="label"
                    onChange={handleTagChange} // Update tag saat berubah
                    value={selectedTag}
                    // filterSort={(optionA, optionB) =>
                    //     (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    // }
                    options={[
                      { value: "All", label: "All" },
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
              <Col span={12} order={2} style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                    }}
                    onClick={showModalGenerateData}
                  >
                    Generate Data
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                    }}
                    onClick={() => handleExportExcel()}
                  >
                    Export Excel
                  </Button>
                </div>
              </Col>
              <Col span={6} order={3} style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  //   style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
                  onClick={showModalAdd}
                >
                  + Add Job
                </Button>
              </Col>
            </Row>
            <TableJob data={jobData} loading={loading} onRefresh={fetchData} />
          </Space>
          <ModalAddJob
            open={openAdd}
            loading={loadingAdd}
            handleOk={handleOkAdd}
            handleCancel={handleCancelAdd}
          />
          <Modal
            visible={openGenerateData}
            title="Generate Data"
            onOk={handleOkGenerateData}
            onCancel={handleCancelGenerateData}
            // style={{ width: '50% !important' }}
            width={350}
          >
            <p>Generate job data based on a tag</p>
            <Select
              showSearch
              style={{
                width: "100%", // Menggunakan lebar penuh modal
              }}
              placeholder="Search By Tag"
              optionFilterProp="label"
              onChange={handleGenerateData} // Update tag saat berubah
              // value={selectedTag}
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
          </Modal>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: "#F8EDE3",
        }}
      >
        ©{new Date().getFullYear()} Created by Hasya Ayuni Sonia
      </Footer>
    </Layout>
  );
};
export default Dashboard;
