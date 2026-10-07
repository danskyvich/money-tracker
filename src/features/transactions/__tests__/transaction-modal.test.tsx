import { fireEvent, render, screen } from "@testing-library/react";
import TransactionModal from "../components/transaction-modal";
import UserAgent from "@testing-library/user-event"
import { createClient } from "@/lib/supabase/clients/client";

const mockAccounts = [
  {
    id: "1",
    name: "BPI",
    category_id: { id: "1" },
    created_at: "2026-08-27T09:45",
    user_id: "1",
    description: "bla bla bla",
  },
  {
    id: "2",
    name: "Chinabank",
    category_id: { id: "2" },
    created_at: "2026-08-28T15:13",
    user_id: "1",
    description: "",
  },
];

const mockCategories = [
  {
    id: "1",
    name: "Accounts",
    type: "Income",
    created_at: "2026-08-14T07:45",
    user_id: "1",
  },
  {
    id: "2",
    name: "Loans",
    type: "Income",
    created_at: "2026-08-14T08:15",
    user_id: "1",
  },
];

// mock the supabase's server client
jest.mock("@/lib/supabase/clients/client", () => ({
    createClient: jest.fn(),
}));

// mock user retrieval from supabase auth
jest.mock("@/lib/supabase/actions/auth", () => ({
    getUser: jest.fn(),
}));

// mock two database actions (INSERT and UPDATE)
jest.mock("@/lib/supabase/actions/database", () => ({
    InsertTransaction: jest.fn(),
    UpdateTransaction: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
        from: (table: string) => ({
            select: () => 
                Promise.resolve({
                    data: table === "accounts" ? mockAccounts: mockCategories,
                    error: null,
                }),
        }),
    });
});

const setup = async () => {
    const user = UserAgent.setup();
    render(
      <TransactionModal
        open={true}
        onOpen={jest.fn()}
        onCancel={jest.fn()}
        modalType="add"
        fetch={jest.fn()}
      />,
    );

    await screen.findByRole("option", { name: "Accounts"});
    return {
        user,
        dateTime: screen.getByLabelText(/Date and Time/i),
        amount: screen.getByLabelText(/amount/i),
        category: screen.getByRole("combobox", { name: /category/i }),
        account: screen.getByRole("combobox", { name: /account/i }),
        description: screen.getByLabelText(/description/i),
    }
}

describe("Test the add transaction feature", () => {
   

    it("Render all form fields", async () => {
        const { dateTime, amount, category, account, description } = await setup();
        expect(dateTime).toBeInTheDocument();
        expect(amount).toBeInTheDocument();
        expect(category).toBeInTheDocument();
        expect(account).toBeInTheDocument();
        expect(description).toBeInTheDocument();
    });

    it("Check if amount is modifiable", async () => {
        const { user, amount } = await setup();
        
        expect(amount).toHaveValue("0");
        await user.clear(amount);
        await user.type(amount, "1200");
        expect(amount).toHaveValue("1200");
    });

    it("Check if description is editable", async () => {
        const { user, description } = await setup();

        expect(description).toHaveValue("");
        await user.type(description, "Sample description lang po");
        expect(description).toHaveDisplayValue("Sample description lang po");
    })

    it("Check if dateTime is modifiable", async () => {
        const { dateTime } = await setup();

        fireEvent.change(dateTime, { target: { value: "2026-10-05T12:45" }});
        expect(dateTime).toHaveValue("2026-10-05T12:45");
    });

    it("Check if categories is modifiable", async () => {
        const { user, category } = await setup();

        expect(category).toHaveValue("1");
        await user.selectOptions(category, "Loans");
        expect(category).toHaveValue("2");
    });

    it("Check if accounts is modifiable", async () => {
        const { user, account } = await setup();

        expect(account).toHaveValue("1"),
        await user.selectOptions(account, "Chinabank");
        expect(account).toHaveValue("2");
    })

});