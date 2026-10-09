import { render, screen, waitFor } from "@testing-library/react";
import EditAccountModal from "../components/edit-account-modal";
import UserAgent from "@testing-library/user-event"
import { FetchAccountCategories, UpdateAccount, FetchAccounts } from "@/lib/supabase/actions/database";

const chosenAccount = 
    {
        id: "1", category_id: { id: "1" }, name: "BPI", description: "Sample description", amount: "1220"
    }

const mockCategories = [
  { name: "Accounts", created_at: "1", user_id: "1", id: "1" },
  { name: "Savings", created_at: "2", user_id: "2", id: "2" },
];

jest.mock("@/lib/supabase/actions/database", () => ({
    FetchAccountCategories: jest.fn().mockResolvedValue({
        success: true,
        data: [{ id: "1", category_id: { id: "1" }, name: "BPI", description: "Sample description"}],
    }),
    FetchAccounts: jest.fn(),
    UpdateAccount: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    (FetchAccountCategories as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCategories,
    });
    (UpdateAccount as jest.Mock).mockResolvedValue({
        success: true,
        data: { id: "1" }
    })
})

describe("Test account editing feature", () => {
    const setup = async () => {
        const user = UserAgent.setup();
        const onOpen = jest.fn();
        const onCancel = jest.fn();
        render(<EditAccountModal icon={""} onOpen={onOpen} onCancel={onCancel} chosenAccount={chosenAccount}/>);
        return {
            user,
            onOpen,
            onCancel,
            description: await screen.findByLabelText(/description/i),
            name: await screen.findByLabelText(/name/i),
            category: await screen.findByRole("combobox", { name: /category/i }),
            getBackButton: () => screen.getByLabelText("close"),
            getEditAccountButton: () => screen.getByRole("button", { name: "edit-account"}),
        }
    }

    it("Render form fields", async () => {
        const { name, description, category } = await setup();

        expect(name).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(category).toBeInTheDocument();
    })

    it("Test if user can edit account name", async () => {
        const { user, name } = await setup();

        expect(name).toHaveValue("BPI");
        await user.clear(name);
        await user.type(name, "BPI - Sample");
        expect(name).toHaveValue("BPI - Sample"); 
    });

    it("Test if user can edit description name", async () => {
        const { user, description } = await setup();

        expect(description).toHaveValue("Sample description");
        await user.clear(description),
        await user.type(description, "Non sample description");
        expect(description).toHaveValue("Non sample description");
    });

    it("Test if user can edit account category", async () => {
        const { user, category } = await setup();

        expect(category).toHaveValue("1");
        await user.selectOptions(category, "Savings");
        expect(category).toHaveValue("2");
    });

    it("Test if user can edit an existing account", async () => {
        const { user, getEditAccountButton, name, description, category, onCancel } = await setup();

        await user.clear(name);
        await user.type(name, "BPI - Sample edit");
        await user.clear(description);
        await user.type(description, "Edited description to savings");
        await user.selectOptions(category, "2");

        await user.click(getEditAccountButton());

        await waitFor(() => {
            expect(UpdateAccount).toHaveBeenCalledWith("1", {
                name: "BPI - Sample edit",
                description: "Edited description to savings",
                category_id: "2",
                id: "1",
            });
            expect(onCancel).toHaveBeenCalled();
        });
    });

    it("Test if user can go back from the modal", async () => {
        const { user, getBackButton } = await  setup();

        expect(getBackButton()).toBeInTheDocument();
        await user.click(getBackButton());
        expect(UpdateAccount).not.toHaveBeenCalled();
    });
})