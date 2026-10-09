import userEvent from "@testing-library/user-event";
import BackupPage from "../backup-page";
import { render, screen } from "@testing-library/react";

const setup = () => {
    const user = userEvent.setup();
    render(<BackupPage/>);
    return {
        user,
        getExportToJson: () => screen.getByRole("button", { name: "Export as a JSON file"}),
        getExportToCsv: () => screen.getByRole("button", { name: "Export as a CSV file"}),
        getImportFromJson: () => screen.getByRole("button", { name: "Import a JSON file"}),
        getImportFromCsv: () => screen.getByRole("button", { name: "Import a CSV file"}),
        exportToJson: () => screen.getByRole("button", { name: "Export to JSON"}),
        exportToCsv: () => screen.getByRole("button", { name: "Export to CSV"}),
    }
}

describe("Test all backup actions (import and export)", () => {
    it("Render the main page and each modal", async () => {
        const { user, getExportToJson, getExportToCsv, getImportFromCsv, getImportFromJson, exportToCsv, exportToJson } = setup();

        expect(getExportToCsv()).toBeInTheDocument();
        expect(getExportToJson()).toBeInTheDocument();
        expect(getImportFromJson()).toBeInTheDocument();
        expect(getImportFromCsv()).toBeInTheDocument();
    });
})