import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor } from "@testing-library/react";
import { IncomeCategories } from "../components/income-categories";
import { FetchIncomeCategories } from "@/lib/supabase/actions/database";

const mockIncomeCategories = [
  { id: "1", name: "Allowances" },
  { id: "2", name: "Spare cash" },
];

jest.mock("@/lib/supabase/actions/database", () => ({
  FetchIncomeCategories: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (FetchIncomeCategories as jest.Mock).mockResolvedValue({
    success: true,
    data: mockIncomeCategories,
  });
});
describe("Test if elements in income categories modal works", () => {
    const setup = async () => {
      const user = userEvent.setup();
      render(<IncomeCategories open onOpen={jest.fn()} />);

      await screen.findByText("Allowances");

      return {
        user,
        getAddButton: () => screen.getByText("Add an income category"),
        getNameInput: () => screen.getByPlaceholderText("eg. Savings"),
      };
    };

  it("Render elements into view", async () => {
    const { user, getAddButton, getNameInput } = await setup();

   await user.click(getAddButton());

   expect(await screen.findByText("Name the income category")).toBeInTheDocument();
   expect(getNameInput()).toBeInTheDocument();
  });

  it("Add value to name category name input", async () => {
   const { user, getAddButton, getNameInput } = await setup();

    await user.click(getAddButton());

   expect(
     await screen.findByText("Name the income category"),
   ).toBeInTheDocument();

   await user.type(getNameInput(), "Coffee dates");
   expect(getNameInput()).toHaveValue("Coffee dates");
  });
});
