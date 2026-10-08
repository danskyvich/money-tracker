import userEvent from "@testing-library/user-event";
import ProfilePage from "../profile-page";
import { deleteUser, getUser, getUserAuthenticationAssuranceLevel, listUserMfaFactors, signOut, unenrollFactor } from "@/lib/supabase/actions/auth";
import { render, screen, waitFor } from "@testing-library/react";

const mockAuthenticationLevels = {
    currentLevel: "aal1",
    nextLevel: "aal2",
    currentAuthenticationMethods: [
        {
            "method": "password",
            "timestamp": 1672514024
        }
    ]
};

jest.mock("@/lib/supabase/actions/auth", () => ({
  getUser: jest.fn(),
  getUserAuthenticationAssuranceLevel: jest.fn(),
  listUserMfaFactors: jest.fn(),
  signOut: jest.fn(),
  unenrollFactor: jest.fn(),
  deleteUser: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null,
            push: mockPush,
        };
    },
    usePathname() {
        return "/profile"
    },
    useSearchParams() {
        return new URLSearchParams(`query=test`)
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
    (getUser as jest.Mock).mockResolvedValue({
        user: "1",
    });
    (getUserAuthenticationAssuranceLevel as jest.Mock).mockResolvedValue({
        success: true,
        data: mockAuthenticationLevels,
    });
    (listUserMfaFactors as jest.Mock).mockResolvedValue({
        success: true,
        all: [],
        totp: [],
        phone: [],
    });
    (signOut as jest.Mock).mockResolvedValue({
        success: true,
    });
    (deleteUser as jest.Mock).mockResolvedValue({
        success: true,
    });
});

const setup = async () => {
    const user = userEvent.setup();
    render(<ProfilePage mfaActive={false}/>);
    await waitFor(() => expect(listUserMfaFactors).toHaveBeenCalled());
    return {
        user,
        getSignOutButton: () => screen.getByRole("button", { name: /Sign out/i }),
        getDeleteAccountButton: () => screen.getByRole("button", { name: /Delete account/i}),
    }
}

describe("Check if profile buttons redirect users to where they were supposed to go", () => {
    it("Render fields", async () => {
        const { getSignOutButton, getDeleteAccountButton } = await setup();

        expect(getSignOutButton()).toBeInTheDocument();
        expect(getDeleteAccountButton()).toBeInTheDocument();
    });

    it("Check if sign-out button works", async () => {
        const { user, getSignOutButton } = await setup();

        expect(getSignOutButton()).toBeInTheDocument();
        await user.click(getSignOutButton());
        expect(
          screen.getByText(
            "Are you sure you want to sign out of your account?",
          ),
        ).toBeInTheDocument();
        expect(signOut).not.toHaveBeenCalled();
    });

    it("Check if delete-account button works", async () => {
        const { user, getDeleteAccountButton } = await setup();

        expect(getDeleteAccountButton()).toBeInTheDocument();
        await user.click(getDeleteAccountButton());
        expect(
          screen.getByText(
            "Are you sure you want to delete your account? This will delete everything including your data and existing configurations.",
          ),
        ).toBeInTheDocument();
        expect(deleteUser).not.toHaveBeenCalled();
    });

    it("Mock sign-out occurrence", async () => {
        const { user, getSignOutButton } = await setup();

        expect(getSignOutButton()).toBeInTheDocument();
        await user.click(getSignOutButton());

        expect(
          screen.getByText(
            "Are you sure you want to sign out of your account?",
          ),
        ).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Yes, sign me out" })).toBeInTheDocument();
        await user.click(
          screen.getByRole("button", { name: "Yes, sign me out" }),
        );
        await waitFor(() => {
            expect(signOut).toHaveBeenCalled();
        });
    });

    it("Check if going back from sign-out modal works", async () => {
        const { user, getSignOutButton } = await setup();

         expect(getSignOutButton()).toBeInTheDocument();
         await user.click(getSignOutButton());

         expect(
           screen.getByText(
             "Are you sure you want to sign out of your account?",
           ),
         ).toBeInTheDocument();

         expect(
           screen.getByRole("button", { name: "No, go back" }),
         ).toBeInTheDocument();
         await user.click(screen.getByRole("button", { name: "No, go back" }));
         expect(
           screen.queryByText(
             "Are you sure you want to sign out of your account?",
           ),
         ).not.toBeInTheDocument();
         expect(signOut).not.toHaveBeenCalled();
    });

    it("Check if going back from delete-account modal works", async () => {
        const { user, getDeleteAccountButton } = await setup();

        expect(getDeleteAccountButton()).toBeInTheDocument();
        await user.click(getDeleteAccountButton());
        expect(
          screen.getByText(
            "Are you sure you want to delete your account? This will delete everything including your data and existing configurations.",
          ),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "No, go back"})).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "No, go back" }));
        expect(
          screen.queryByText(
            "Are you sure you want to delete your account? This will delete everything including your data and existing configurations.",
          ),
        ).not.toBeInTheDocument();
        expect(deleteUser).not.toHaveBeenCalled();
    });

    it("Mock account deletion occurrence", async () => {
        const { user, getDeleteAccountButton } = await setup();

        expect(getDeleteAccountButton()).toBeInTheDocument();
        await user.click(getDeleteAccountButton());
        expect(
          screen.getByText(
            "Are you sure you want to delete your account? This will delete everything including your data and existing configurations.",
          ),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Yes, delete my account"})).toBeInTheDocument();
        await user.click(
          screen.getByRole("button", { name: "Yes, delete my account" }),
        );
        await waitFor(() => {
            expect(deleteUser).toHaveBeenCalled();
        });
    })
})