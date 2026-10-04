import userEvent from "@testing-library/user-event";
import VerifyEmailPage from "../components/verify-email-page";
import { render, screen } from "@testing-library/react";

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: mockPush,
      replace: jest.fn(),
      back: mockBack,
    };
  },
}));

beforeEach(() => {
    jest.clearAllMocks();
})

// RememberMe is false until a hotfix update patches it up.
describe("Verify email page", () => {
    const setup = () => {
        const user = userEvent.setup();
        render(<VerifyEmailPage email="droidnautica@gmail.com" rememberMe={false} />)
        return {
            user,
            input: screen.getByPlaceholderText(/000000/i),
            submitButton: screen.getByRole("button", { name: /Verify email/i} ),
            backButton: screen.getByRole("button", { name: /Back/i }),
        };
    };

    it("Render verify-email-page.", () => {
        const { input, submitButton, backButton } = setup();

        expect(input).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(backButton).toBeInTheDocument();
    });

    it("Verify if back button works", async () => {
        const { user, backButton } = setup();

        await user.click(backButton);
        expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("Verify if the OTP input is invalid", async () => {
        const { user, input, submitButton } = setup();

        await user.type(input, "321");
        
    })
});