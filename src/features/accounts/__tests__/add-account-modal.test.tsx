import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddAccountModal from "../components/add-account-modal";
import userEvent from "@testing-library/user-event";
import { InsertAccount } from "@/lib/supabase/actions/database";
import { getUser } from "@/lib/supabase/actions/auth";

const categories = [
  { name: "Accounts", created_at: "1", user_id: "1", id: "1" },
  { name: "Savings", created_at: "2", user_id: "2", id: "2" },
];

jest.mock("@/lib/supabase/actions/database", () => ({
  InsertAccount: jest.fn(),
}));

jest.mock("@/lib/supabase/actions/auth", () => ({
  getUser: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (InsertAccount as jest.Mock).mockResolvedValue({
    error: null,
    data: { id: "1" }
  });
  (getUser as jest.Mock).mockResolvedValue({
    user_id: "1",
  });
});

describe("Test adding account actions", () => {
  const setup = () => {
    const refresh = jest.fn();
    const onOpen = jest.fn();
    render(
      <AddAccountModal
        open={true}
        onOpen={onOpen}
        refresh={refresh}
        accountCategoriesData={categories}
      />,
    );
    const user = userEvent.setup();
    return {
      user,
      onOpen,
      refresh,
      nameInput: screen.getByLabelText(/Name/i),
      typeSelect: screen.getByRole("combobox", { name: /Type/i }),
      descriptionInput: screen.getByLabelText(/Description*/i),
      getAddAccountButton: () =>
        screen.getByRole("button", { name: /add-account/i }),
      getBackButton: () => screen.getByLabelText("close"),
    };
  };

  it("Render all modal elements", () => {
    const { nameInput, typeSelect, descriptionInput } = setup();

    expect(nameInput).toBeInTheDocument();
    expect(typeSelect).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it("Test if name input accepts anything", async () => {
    const { user, nameInput } = setup();

    await user.type(nameInput, "abcABCD1234/&&*");
    expect(nameInput).toHaveValue("abcABCD1234/&&*");
  });

  it("Test if account categories accept an existing value", async () => {
    const { user, typeSelect } = setup();

    await user.selectOptions(typeSelect, "Accounts");
    expect(typeSelect).toHaveValue("1");
  });

  it("Test if description textarea accepts input", async () => {
    const { user, descriptionInput } = setup();

    await user.type(descriptionInput, "nfsjdfnjfndkcnckmx234/*_%$--..");
    expect(descriptionInput).toHaveValue("nfsjdfnjfndkcnckmx234/*_%$--..");
  });

  it("Test if adding an account works", async () => {
    const {
      user,
      typeSelect,
      nameInput,
      descriptionInput,
      getAddAccountButton,
      refresh,
      onOpen
    } = setup();

    await user.type(nameInput, "BDO");
    await user.selectOptions(typeSelect, "Savings");
    await user.type(descriptionInput, "For additional savings");
    await user.click(getAddAccountButton());

    await waitFor(() => {
      expect(InsertAccount).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledTimes(1);
    });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(InsertAccount).toHaveBeenCalledWith("BDO", "For additional savings", "2")
  });

  it("Test if going back works", async () => {
    const {
        user,
        getBackButton,
        onOpen
    } = setup();

    expect(getBackButton()).toBeInTheDocument();
    await user.click(getBackButton());
    expect(InsertAccount).not.toHaveBeenCalled();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
