import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TableJob } from "../TableJob";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mocking matchMedia
vi.stubGlobal("matchMedia", () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
}));

// Mocking getComputedStyle
vi.stubGlobal("getComputedStyle", () => ({
  getPropertyValue: () => "",
}));

// Mock Axios
const mock = new MockAdapter(axios);

describe("TableJob Component", () => {
  const mockData = [
    {
      id: 1,
      tag: "Java",
      company_name: "PT Akar Inti Teknologi",
      job_location: "Jakarta Raya",
      title: "BackEnd Developer",
    },
    // Add more mock job objects if needed
  ];

  const onRefresh = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
    mock.reset();
  });

  it("renders TableJob component", () => {
    render(<TableJob data={mockData} loading={false} onRefresh={onRefresh} />);

    // Check if table headers are rendered
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Tag")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("pagination changes page correctly", async () => {
    // Mock data with 15 items
    const mockData = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      title: `Job Title ${index + 1}`,
      company_name: `Company ${index + 1}`,
      job_location: `Location ${index + 1}`,
      tag: `Tag ${index + 1}`,
    }));

    const onRefresh = vi.fn();

    render(<TableJob data={mockData} loading={false} onRefresh={onRefresh} />);

    // Ensure initial page 1 is displayed
    expect(screen.getByRole("listitem", { name: "1" })).toBeInTheDocument();

    // Simulate page change
    // fireEvent.click(screen.getByText("Next Page")); // Click next page button
    const nextPageButton = screen.getByRole("button", { name: /right/i });
    fireEvent.click(nextPageButton);
    // Wait for the page to update
    await waitFor(() => {
      expect(screen.getByText("11")).toBeInTheDocument(); // Check if page 2 is displayed start from row number 11
    });
  });

  //   it("should delete an item and show notification", async () => {
  //     const mockData = [
  //       {
  //         id: 1,
  //         title: "Job Title",
  //         company_name: "Company",
  //         job_location: "Location",
  //         tag: "Tag",
  //       },
  //     ];

  //     render(<TableJob data={mockData} loading={false} onRefresh={onRefresh} />);

  //     // Open the delete confirmation modal
  //     fireEvent.click(screen.getByText("Delete"));
  //     const confirmButton = screen.getByText("OK");
  //     fireEvent.click(confirmButton);
  //     // Mock the axios.delete implementation
  //     mock.onDelete("http://localhost:3000/1").reply(200);

  //     // Confirm the deletion in the modal

  //     // Wait for notifications and refresh callback
  //     await waitFor(() => {
  //       expect(axios.delete).toHaveBeenCalledWith("http://localhost:3000/1");
  //       expect(onRefresh).toHaveBeenCalled();
  //       expect(screen.getByText("Data deleted successfully")).toBeInTheDocument();
  //     });
  //   });
  //   it("handles pagination changes", () => {
  //     render(<TableJob data={mockData} loading={false} onRefresh={onRefresh} />);

  //     // Simulate page change
  //     fireEvent.change(screen.getByText("1"), { target: { value: 2 } });
  //     expect(screen.getByText("2")).toBeInTheDocument();
  //   });

  //   it("opens and closes modals", async () => {
  //     render(<TableJob data={mockData} loading={false} onRefresh={onRefresh} />);

  //     // Open detail modal
  //     fireEvent.click(screen.getByText("Detail"));
  //     expect(screen.getByText("Detail Modal Content")).toBeInTheDocument(); // Adjust based on your modal content

  //     // Close detail modal
  //     fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
  //     await waitFor(() => {
  //       expect(
  //         screen.queryByText("Detail Modal Content")
  //       ).not.toBeInTheDocument();
  //     });
  //   });

  //   it("handles delete operation", async () => {
  //     mock.onDelete("http://localhost:3000/1").reply(200);

  //     render(<TableJob data={mockData} loading={false} onRefresh={onRefresh} />);

  //     // Open confirm dialog
  //     fireEvent.click(screen.getByText("Delete"));

  //     // Confirm delete
  //     fireEvent.click(screen.getByRole("button", { name: /ok/i }));

  //     await waitFor(() => {
  //       expect(onRefresh).toHaveBeenCalled();
  //     });
  //   });

  //   it("displays success and error notifications", async () => {
  //     mock.onDelete("http://localhost:3000/1").reply(500);

  //     render(<TableJob data={mockData} loading={false} onRefresh={onRefresh} />);

  //     // Open confirm dialog
  //     fireEvent.click(screen.getByText("Delete"));

  //     // Confirm delete
  //     fireEvent.click(screen.getByRole("button", { name: /ok/i }));

  //     await waitFor(() => {
  //       expect(screen.getByText("Failed to delete data")).toBeInTheDocument();
  //     });
  //   });
});
