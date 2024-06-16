import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "../SignUp";
import "@testing-library/jest-dom/extend-expect";
import api from "../Services/api";

jest.mock("../Services/api");

describe("SignUp Component", () => {
  beforeEach(() => {
    api.post.mockClear();
  });

  test("renders SignUp component", () => {
    render(<SignUp />);
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  test("shows validation errors when form is submitted with empty fields", async () => {
    render(<SignUp />);

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(screen.getByLabelText(/First Name/i)).toHaveErrorMessage(
      "First Name is required"
    );
    expect(screen.getByLabelText(/Last Name/i)).toHaveErrorMessage(
      "Last Name is required"
    );
    expect(screen.getByLabelText(/Your Email/i)).toHaveErrorMessage(
      "Email is required"
    );
    expect(screen.getByLabelText(/User Name/i)).toHaveErrorMessage(
      "User Name is required"
    );
    expect(screen.getByLabelText(/Password/i)).toHaveErrorMessage(
      "Password is required"
    );
  });

  test("submits form with valid data", async () => {
    api.post.mockResolvedValue({ data: { success: true } });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Your Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/User Name/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(api.post).toHaveBeenCalledWith("/Auth/CreateNewUser", {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      userName: "johndoe",
      password: "password",
    });
  });

  test("resets form fields on successful submission", async () => {
    api.post.mockResolvedValue({ data: { success: true } });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Your Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/User Name/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(screen.getByLabelText(/First Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Your Email/i)).toHaveValue("");
    expect(screen.getByLabelText(/User Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Password/i)).toHaveValue("");
  });

  test("shows error message on API error", async () => {
    api.post.mockRejectedValue(new Error("Failed to create user"));

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Your Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/User Name/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(screen.getByText(/Failed to create user/i)).toBeInTheDocument();
  });
});
