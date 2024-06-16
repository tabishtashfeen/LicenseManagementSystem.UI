import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignIn from "../SignIn";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import api from "../Services/api";

jest.mock("../Services/api");

describe("SignIn Component", () => {
  test("renders SignIn component", () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    api.post.mockResolvedValue({
      data: {
        success: true,
        result: {
          token: "test-token",
          userData: { id: 1, role: "Admin" },
        },
      },
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Enter Your Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(api.post).toHaveBeenCalledWith("/Auth/AuthenticateUser", {
      email: "test@example.com",
      password: "password",
    });
  });

  test("shows validation errors when form is submitted with empty fields", () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(screen.getByLabelText(/Enter Your Email/i)).toHaveAttribute(
      "required"
    );
    expect(screen.getByLabelText(/Password/i)).toHaveAttribute("required");
  });
});
