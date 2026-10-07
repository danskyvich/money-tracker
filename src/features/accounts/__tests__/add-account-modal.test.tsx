import { render, screen } from "@testing-library/react";
import AddAccountModal from "../components/add-account-modal";
import userEvent from "@testing-library/user-event";

const categories = [
  { name: "Accounts", created_at: "1", user_id: "1", id: "1" },
  { name: "Savings", created_at: "2", user_id: "2", id: "2" },
];

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Test adding account actions", () => {
    const setup = () => {
        render(<AddAccountModal open={true} onOpen={jest.fn()} refresh={jest.fn()} accountCategoriesData={categories}/>);
        const user = userEvent.setup();
        return {
          user,
          nameInput: screen.getByLabelText(/Name/i),
          typeSelect: screen.getByRole("combobox",{ name: /Type/i} ),
          descriptionInput: screen.getByLabelText(/Description*/i),

        };
    }

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
})