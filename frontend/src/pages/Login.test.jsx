
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

vi.mock("../api", () => ({
  default: { post: mockPost },
}));

vi.mock("../i18n/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key) => key,
  }),
}));

describe("SARVASETU Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the login form correctly", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: "Welcome back" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("prevents submission when required fields are empty", () => {
    render(<Login />);

    const email = screen.getByLabelText(/email address/i);
    const password = screen.getByLabelText(/password/i);

    expect(email).toBeRequired();
    expect(password).toBeRequired();
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("shows an error when the login response has no token", async () => {
    const user = userEvent.setup();

    mockPost.mockResolvedValue({
      data: {
        user: {
          _id: "test-user-123",
          name: "Test User",
        },
      },
    });

    render(<Login />);

    await user.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "TestPassword123"
    );

    await user.click(
      screen.getByRole("button", { name: /sign in/i })
    );

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "TestPassword123",
      });
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Login response is incomplete. Please try again."
    );

    expect(localStorage.getItem("token")).toBeNull();
  });

  it("displays the backend error message when login fails", async () => {
    const user = userEvent.setup();

    mockPost.mockRejectedValue({
      response: {
        data: {
          message: "Invalid email or password",
        },
      },
    });

    render(<Login />);

    await user.type(
      screen.getByLabelText(/email address/i),
      "wrong@example.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "WrongPassword"
    );

    await user.click(
      screen.getByRole("button", { name: /sign in/i })
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Invalid email or password"
      );
    });

    expect(localStorage.getItem("token")).toBeNull();
  });
});
