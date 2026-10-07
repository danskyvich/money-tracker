import userEvent from "@testing-library/user-event";
import ModifyAccountCategoriesModal from "../components/modify-account-categories-modal";
import { render, screen } from "@testing-library/react";
import { FetchAccountCategories, UpdateAccountCategoryName } from "@/lib/supabase/actions/database";
import { useState } from "react";

jest.mock("@/lib/supabase/actions/database", () => ({
    UpdateAccountCategoryName: jest.fn(),
}))

const Wrapper = () => {
    const [name, setName] = useState("Savings");
    return (
      <ModifyAccountCategoriesModal
        fetch={jest.fn()}
        open={true}
        onClose={jest.fn()}
        onOpen={jest.fn()}
        accountCategoryName={name}
        uuid="1"
        setAccountCategoryName={setName}
      />
    );
}

describe("Test account category elements", () => {
    const setup = () => {
       const user = userEvent.setup();
       render(<Wrapper/>);
       return { user, input: screen.getByRole("textbox")};
    }

    it("Render form fields", () => {
        const { input } = setup();
        expect(input).toBeInTheDocument();
    });

    it("Check if existing category name is editable", async () => {
        const { user, input } = setup();

        expect(input).toHaveValue("Savings");
        await user.clear(input);
        await user.type(input, "Savings sample");
        expect(input).toHaveValue("Savings sample");
    });
})