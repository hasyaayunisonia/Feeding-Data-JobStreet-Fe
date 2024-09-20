// src/components/__tests__/Dashboard.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../Dashboard";
import axios from "axios";
import { describe, it, expect, vi } from "vitest";

// Mocking matchMedia
vi.stubGlobal("matchMedia", () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
}));

// Mock axios
vi.mock("axios");
const mockedAxios = axios;

describe("Dashboard Component", () => {
  it("should render dashboard with header and buttons", () => {
    render(<Dashboard />);

    // Memeriksa apakah header dan tombol ditampilkan
    expect(screen.getByText("Job Vacancy")).toBeInTheDocument();
    expect(screen.getByText("Generate Data")).toBeInTheDocument();
    expect(screen.getByText("Export Excel")).toBeInTheDocument();
    expect(screen.getByText("+ Add Job")).toBeInTheDocument();
  });

  it("should fetch and display job data", async () => {
    // Mocking the axios GET request
    mockedAxios.get.mockResolvedValue({
      data: [{ id: 1, title: "React Developer", company_name: "Tech Co." }],
    });

    render(<Dashboard />);

    // Memastikan bahwa fetchData dipanggil dan data ditampilkan
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3000/search?keyword=All",
        { headers: { "Cache-Control": "no-cache" } }
      );
    });

    expect(screen.getByText("React Developer")).toBeInTheDocument();
  });

  it("should handle Generate Data button click", async () => {
    render(<Dashboard />);

    // Mocking axios GET request for generate data
    mockedAxios.get.mockResolvedValue({ data: {} });

    // Simulating button click
    fireEvent.click(screen.getByText("Generate Data"));

    // Verifying modal visibility
    expect(
      screen.getByText("Generate job data based on a tag")
    ).toBeInTheDocument();
  });

  //   it("should open the Add Job modal when + Add Job button is clicked", async () => {
  //     render(<Dashboard />);

  //     // Simulate clicking the "+ Add Job" button
  //     fireEvent.click(screen.getByText("Add Job"));

  //     // Check if the Add Job modal is opened
  //     await waitFor(() => {
  //       expect(screen.getByText("Add Job")).toBeInTheDocument(); // Adjust the text as necessary
  //     });
  //   });

  //   it("should call handleExportExcel function when Export Excel button is clicked", async () => {
  //     // Create a mock for handleExportExcel
  //     const mockHandleExportExcel = vi.fn();

  //     // Render the component with the mocked function
  //     render(<Dashboard />);

  //     // Override the original handleExportExcel function with the mock
  //     // Note: Since we're dealing with functional components, we should mock axios requests and check if they are called

  //     // Simulating button click
  //     fireEvent.click(screen.getByText("Export Excel"));

  //     // Verify if axios was called
  //     await waitFor(() => {
  //       expect(axios.get).toHaveBeenCalledWith(
  //         "http://localhost:3000/export-excel",
  //         {
  //           responseType: "blob",
  //         }
  //       );
  //     });
  //   });
});
