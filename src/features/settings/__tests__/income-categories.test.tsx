import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { IncomeCategories } from "../components/income-categories";
import { AddIncomeCategory, CountTransactionsWithCategory, DeleteCategory, FetchIncomeCategories } from "@/lib/supabase/actions/database";

let categories: typeof mockIncomeCategories;

const mockIncomeCategories = [
  { id: "1", name: "Allowances" },
  { id: "2", name: "Spare cash" },
];

jest.mock("@/lib/supabase/actions/database", () => ({
  FetchIncomeCategories: jest.fn(),
  DeleteCategory: jest.fn(),
  CountTransactionsWithCategory: jest.fn(),
  AddIncomeCategory: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  categories = [...mockIncomeCategories];
  (FetchIncomeCategories as jest.Mock).mockImplementation( async () => ({
    success: true,
    data: [...categories],
  }));
  (DeleteCategory as jest.Mock).mockImplementation(async (id: string) => {
    categories = categories.filter((c) => c.id !== id)
    return {
      success: true
    }
  });
  (AddIncomeCategory as jest.Mock).mockImplementation(async (name: string, id: string) => {
    categories = id ? categories.map(c => (c.id === id ? {...c, name} : c)) 
    : [...categories, {id: "3", name}]
    return {
      success: true
    }
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
        getDeleteButton: () => screen.getByLabelText("Delete Allowances"),
        finalizeAddButton: () => screen.getByRole("button", { name: /Add category/i}),
        getNameInput: () => screen.getByPlaceholderText("eg. Savings"),
        finalizeDeleteButton: () =>
          screen.getByRole("button", {
            name: /Delete category/i }),
        finalizeModifyButton: () => screen.getByRole("button", { name: /Rename category/i}),
        getModifyButton: () => screen.getByLabelText("Rename Allowances"),
      };
    };

  it("Render elements into view", async () => {
    const { user, getAddButton, getNameInput } = await setup();

   await user.click(getAddButton());

   expect(await screen.findByText("Add income category")).toBeInTheDocument();
   expect(getNameInput()).toBeInTheDocument();
  });

  it("Add value to name category name input", async () => {
   const { user, getAddButton, getNameInput } = await setup();

    await user.click(getAddButton());

   expect(
     await screen.findByText("Add income category"),
   ).toBeInTheDocument();

   await user.type(getNameInput(), "Coffee dates");
   expect(getNameInput()).toHaveValue("Coffee dates");
  });

  it("Test if income category deletion works", async () => {
    (CountTransactionsWithCategory as jest.Mock).mockResolvedValue({
      success: true,
      count: 3,
    });

    const { user, finalizeDeleteButton, getDeleteButton } = await setup();

    await user.click(getDeleteButton());

    expect(CountTransactionsWithCategory).toHaveBeenCalledWith("1");
    expect(await screen.findByText(/3 transactions will be affected/i)).toBeInTheDocument();

    await user.click(finalizeDeleteButton());

    await waitFor(() => {
      expect(DeleteCategory).toHaveBeenCalledWith("1");
      expect(screen.queryByText("Alliwances")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Spare cash")).toBeInTheDocument();
  });

  it("Test if adding category works", async () => {
    const { user, getAddButton, finalizeAddButton, getNameInput } = await setup();

    expect(screen.getByText("Allowances")).toBeInTheDocument();

    await user.click(getAddButton());
    expect(screen.getByText("Add income category")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    await user.type(getNameInput(), "Investments"); // name input feature already tested on prev assertions
    await user.click(finalizeAddButton());

    await waitFor(() => {
      expect(AddIncomeCategory).toHaveBeenCalledWith("Investments");
    });

    expect(await screen.findByText("Investments")).toBeInTheDocument();
  });

  it("Test if existing income modification works", async () => {
    const { user, getModifyButton, getNameInput, finalizeModifyButton } = await setup();

    expect(screen.getByText("Allowances")).toBeInTheDocument();
    await user.click(getModifyButton());

    expect(screen.getByText("Rename income category")).toBeInTheDocument();
    expect(getNameInput()).toHaveValue("Allowances");

    await user.clear(getNameInput());
    await user.type(getNameInput(), "Allowances - sample lang");

    expect(getNameInput()).toHaveValue("Allowances - sample lang");

    await user.click(finalizeModifyButton());
    await waitFor(() => {
      expect(AddIncomeCategory).toHaveBeenCalledWith("Allowances - sample lang", "1");
      expect(screen.queryByText("Allowances")).not.toBeInTheDocument();
    });

    expect(await screen.findByText("Allowances - sample lang")).toBeInTheDocument();
  });
});
