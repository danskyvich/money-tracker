import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TransactionModal from "../components/transaction-modal";
import UserAgent from "@testing-library/user-event"
import { createClient } from "@/lib/supabase/clients/client";
import { InsertTransaction } from "@/lib/supabase/actions/database";
import { getUser } from "@/lib/supabase/actions/auth";

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
    category_id: { id: "1" },
    created_at: "2026-08-28T15:13",
    user_id: "1",
    description: "",
  },
  {
    id: "3",
    name: "Homewallet",
    category_id: { id: "1" },
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
  {
    id: "3",
    name: "Food",
    type: "Expense",
    created_at: "2026-08-14T08:25",
    user_id: "1",
  },
];

const mockTransactions = [
  {
    id: "1",
    created_at: "2026-08-25T04:31",
    from_account_id: "Homebook",
    category_id: "1",
    amount: "15",
    to_account_id: null,
    type: "income",
    user_id: "1",
    date_time: "2026-08-25T04:31",
    description: "Set aside money to homebook",
  },
  {
    id: "2",
    created_at: "2026-08-27T12:05",
    from_account_id: "Wallet",
    category_id: "3",
    amount: "100",
    to_account_id: null,
    type: "expense",
    user_id: "1",
    date_time: "2026-08-25T12:05",
    description: "Tomo coffee - Iced Spanish Latte",
  },
];

let transactions: typeof mockTransactions = [];

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
    DeleteTransaction: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    transactions = [...mockTransactions];
    (getUser as jest.Mock).mockResolvedValue({ id: "1" });
    (createClient as jest.Mock).mockResolvedValue({
        from: (table: string) => ({
            select: () => 
                Promise.resolve({
                    data: table === "accounts" ? mockAccounts: mockCategories,
                    error: null,
                }),
        }),
    });
    (InsertTransaction as jest.Mock).mockImplementation( async (input: any[]) => {
        transactions.push(...input)
        return {
            success: true,
            data: input,
        };
    })
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
      addTransactionButton: screen.getByRole("button", {
        name: /Add transaction/i,
      }),
      incomeButton: screen.getByRole("button", { name: /income/i}),
      expenseButton: screen.getByRole("button", { name: /expense/i}),
      transferButton: screen.getByRole("button", { name: /transfer/i}),
    };
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
    });

    //INSERT
    it("Test insert income transaction action", async () => {
        const { user, dateTime, amount, category, account, description, addTransactionButton, incomeButton } = await setup();

        await user.click(incomeButton);
        fireEvent.change(dateTime, { target: { value: "2026-08-28T20:45"}});
        await user.clear(amount);
        await user.type(amount, "125");
        await user.selectOptions(category, "Accounts");
        await user.selectOptions(account, "Homewallet");
        await user.type(description, "Allowances");

        await user.click(addTransactionButton);
        
        await waitFor(() => expect(InsertTransaction).toHaveBeenCalledTimes(1));

        expect(InsertTransaction).toHaveBeenCalledWith([
          expect.objectContaining({
            type: "income",
            date_time: "2026-08-28T20:45",
            amount: "125",
            category_id: "1",
            account_id: "3",
            to_account_id: null,
            description: "Allowances",
            user_id: "1",
          }),
        ]);

        expect(transactions).toHaveLength(mockTransactions.length + 1);

    })

});