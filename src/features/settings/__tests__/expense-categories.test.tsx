import { FetchExpenseCategories } from "@/lib/supabase/actions/database";
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import ExpenseCategories from "../components/expense-categories";

const mockExpenseCategories = [
    { id: "1", name: "Entertainment" },
    { id: "2", name: "Food" },
];

jest.mock("@/lib/supabase/actions/database", () => ({
    FetchExpenseCategories: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    (FetchExpenseCategories as jest.Mock).mockResolvedValue({
        success: true,
        data: mockExpenseCategories,
    });
});

describe("Test elements inside the expense categories modal", () => {
    const setup = async () => {
        const user = userEvent.setup();
        render(<ExpenseCategories open onOpen={jest.fn()}/>);
        await screen.findByText("Entertainment");
        return {
            user,
            getAddButton: () => screen.getByText("Add an expense category"),
            getNameInput: () => screen.getByPlaceholderText("eg. Entertainment"),
        };
    };

    it("Render the elements into view", async () => {
        const { user, getAddButton, getNameInput } = await setup();

        expect(getAddButton()).toBeInTheDocument();
        await user.click(getAddButton());
        await screen.findByText("Name the expense category");
        expect(getNameInput()).toBeInTheDocument();
    });

    it("Check if the name input accepts value", async () => {
        const { user, getAddButton, getNameInput } = await setup();

        expect(getAddButton()).toBeInTheDocument();
        await user.click(getAddButton());
        await screen.findByText("Name the expense category");
        expect(getNameInput()).toBeInTheDocument();

        await user.type(getNameInput(), "Credit loans");
        expect(getNameInput()).toHaveValue("Credit loans");
    });
})
