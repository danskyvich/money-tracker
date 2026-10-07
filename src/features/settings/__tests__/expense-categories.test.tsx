import { FetchExpenseCategories, DeleteCategory, CountTransactionsWithCategory, AddExpenseCategory } from "@/lib/supabase/actions/database";
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import ExpenseCategories from "../components/expense-categories";

const mockExpenseCategories = [
    { id: "1", name: "Entertainment" },
    { id: "2", name: "Food" },
];

jest.mock("@/lib/supabase/actions/database", () => ({
    FetchExpenseCategories: jest.fn(),
    DeleteCategory: jest.fn(),
    CountTransactionsWithCategory: jest.fn(),
    AddExpenseCategory: jest.fn(),
}));

let categories: typeof mockExpenseCategories;

beforeEach(() => {
    jest.clearAllMocks();
    categories = [...mockExpenseCategories];
    (FetchExpenseCategories as jest.Mock).mockImplementation(async () => ({
        success: true,
        data: [...categories],
    }));
    (DeleteCategory as jest.Mock).mockImplementation( async (id: string) => {
        categories = categories.filter((c) => c.id !== id);
        return { success: true };
    });
    (AddExpenseCategory as jest.Mock).mockImplementation( async (name: string, id: string) => {
        categories = id ? categories.map(c => (c.id === id ? {...c, name} : c))
            : [...categories, { id: "3", name }];
        return {
            success: true
        }},
    );
});

describe("Test elements inside the expense categories modal", () => {
    const setup = async () => {
        const user = userEvent.setup();
        render(<ExpenseCategories open onOpen={jest.fn()}/>);
        await screen.findByText("Entertainment");
        return {
            user,
            getAddButton: () => screen.getByText("Add an expense category"),
            finalizeAddButton: () => screen.getByRole("button", { name: /Add category/i}),
            getDeleteButton: () => screen.getByLabelText(/Delete Entertainment/i),
            finalizeDeleteButton: () => screen.getByRole("button", { name: /Delete category/}),
            getModifyButton: () => screen.getByLabelText(/Rename Entertainment/i),
            finalizeModifyButton: () => screen.getByRole("button", { name: /Rename category/i}),
            getNameInput: () => screen.getByPlaceholderText("eg. Entertainment"),
        };
    };

    it("Render the elements into view", async () => {
        const { user, getAddButton, getNameInput } = await setup();

        expect(getAddButton()).toBeInTheDocument();
        await user.click(getAddButton());
        await screen.findByText("Add expense category");
        expect(getNameInput()).toBeInTheDocument();
    });

    it("Check if the name input accepts value", async () => {
        const { user, getAddButton, getNameInput } = await setup();

        expect(getAddButton()).toBeInTheDocument();
        await user.click(getAddButton());
        await screen.findByText("Add expense category");
        expect(getNameInput()).toBeInTheDocument();

        await user.type(getNameInput(), "Credit loans");
        expect(getNameInput()).toHaveValue("Credit loans");
    });

    it("Check if category deletion works", async () => {
        (CountTransactionsWithCategory as jest.Mock).mockResolvedValue({
            success: true,
            count: 3,
        })

        const { user, getDeleteButton, finalizeDeleteButton } = await setup();

        await user.click(getDeleteButton());
        
        expect(CountTransactionsWithCategory).toHaveBeenCalledWith("1");
        expect(await screen.findByText(/3 transactions will be affected/i)).toBeInTheDocument();

        await user.click(finalizeDeleteButton());

        await waitFor(() => {
            expect(DeleteCategory).toHaveBeenCalledWith("1");
            expect(screen.queryByText("Entertainment")).not.toBeInTheDocument();
        });
        expect(screen.getByText("Food")).toBeInTheDocument();
    });

    it("Check if adding an expense category works", async () => {
        const { user, getAddButton, finalizeAddButton, getNameInput } = await setup();

        expect(screen.getByText("Entertainment")).toBeInTheDocument();
        await user.click(getAddButton());
        expect(screen.getByText("Add expense category")).toBeInTheDocument();
        await user.type(getNameInput(), "Savings");
        expect(getNameInput()).toHaveValue("Savings");

        await user.click(finalizeAddButton());
        await waitFor(() => {
            expect(AddExpenseCategory).toHaveBeenCalledWith("Savings");
        });

        expect(await screen.findByText("Savings")).toBeInTheDocument();
    })
})
