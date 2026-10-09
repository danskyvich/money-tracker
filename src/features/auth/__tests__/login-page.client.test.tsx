import LoginPage from "../components/login-page";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { generalSignIn } from "@/lib/supabase/actions/auth";

// next/navigation
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            prefetch: () => null,
            push: jest.fn(),
            replace: jest.fn(),
            back: jest.fn(),
        };
    },
    usePathname: () => "/login",
    useSearchParams: () => new URLSearchParams(),
}));

// recaptcha
const mockUseRecaptcha = jest.fn();
jest.mock("react-google-recaptcha-v3", () => ({
    useGoogleReCaptcha: () => mockUseRecaptcha()
}));

// cookies
const mockCookies = jest.fn();
jest.mock("next/headers", () => ({
    cookies: jest.fn( async() => ({ set: mockCookies }))
}))

// 
jest.mock("./../../../lib/supabase/actions/auth", () => ({
    generalSignIn: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockUseRecaptcha.mockReturnValue({
        executeRecaptcha: jest.fn().mockResolvedValue("fake-token"),
    });
    (generalSignIn as jest.Mock).mockResolvedValue({ 
        error: null,
    });
});

describe("Test all possible inputs", () => {
    const setup = () => {
        const user = userEvent.setup();
        render(<LoginPage/>);
        return {
            user,
            email: screen.getByLabelText(/email/i),
            submitButton: screen.getByRole("button", { name: /sign in/i}),
        }
    }

    it("Render the form fields", () => {
        const { email, submitButton } = setup();

        expect(email).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    })

    it("Enter an invalid input without the '@' character", async () => {
        const { user, email, submitButton } = setup();
        await user.type(email, "qwerty.fsrt5fe");
        expect(email).toHaveValue("qwerty.fsrt5fe");
        await user.click(submitButton);
        expect(email).toBeInvalid();
        expect(generalSignIn).not.toHaveBeenCalledWith("qwerty.fsrt5fe");
    }); 

    it("Enter a valid input", async () => {
        const { user, email, submitButton} = setup();
        await user.type(email, "droidnautica@gmail.com");
        expect(email).toHaveValue("droidnautica@gmail.com");
        await user.click(submitButton);
        expect(email).toBeValid();

        // mock response here
        await waitFor(() => {
            expect(generalSignIn).toHaveBeenCalledWith(
                "droidnautica@gmail.com",
                "fake-token",
            );
        });
    });
})