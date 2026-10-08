import { DeleteTransaction } from "@/lib/supabase/actions/database";
import DeleteTransactionModal from "../components/delete-transaction-modal";
import { getUser } from "@/lib/supabase/actions/auth";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

const mockTransaction = {
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
};

jest.mock("@/lib/supabase/actions/database", () => ({
    DeleteTransaction: jest.fn(),
}));

jest.mock("@/lib/supabase/actions/auth", () => ({
    getUser: jest.fn(), 
}));

beforeEach(() => {
    jest.clearAllMocks();
    (getUser as jest.Mock).mockResolvedValue({
        id: "1",
    });
    (DeleteTransaction as jest.Mock).mockResolvedValue({ success: true })
});

const setup = () => {
    const user = userEvent.setup();
    const refetch = jest.fn();
    const onOpen = jest.fn();
    const onCancel = jest.fn();
    render(<DeleteTransactionModal open onOpen={onOpen} refetch={refetch} id={mockTransaction.id} onCancel={onCancel}/>);
    return {
        user,
        refetch,
        onOpen,
        onCancel,
        getBackButton: () => screen.getByRole("button", { name: "No"}),
        getDeleteButton: () => screen.getByRole("button", { name: "Delete transaction"}),
    };
}

describe("Test delete transaction component and its action", () => {
    it("Render the modal component", () => {
        const { getBackButton, getDeleteButton } =  setup();
        expect(getBackButton()).toBeInTheDocument();
        expect(getDeleteButton()).toBeInTheDocument();
    });

    it("Check if transaction deletion works", async () => {
        const { user, refetch, getDeleteButton } = setup();

        expect(
          screen.getByText(
            "Are you sure you want to delete this transaction? This action is irreversible.",
          ),
        );
        await user.click(getDeleteButton());
        await waitFor(() => {
            expect(DeleteTransaction).toHaveBeenCalledTimes(1);
        });
        expect(DeleteTransaction).toHaveBeenCalledWith(mockTransaction.id);
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("Check if going back works", async () => {
        const { user, onCancel, getBackButton } = setup();

        await user.click(getBackButton());
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(DeleteTransaction).not.toHaveBeenCalled();
    });
})

