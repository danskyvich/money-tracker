'use client'

import ErrorModal from "@/components/layout/error-modal";
import LoadingModal from "@/components/layout/loading-modal";
import Modal from "@/components/layout/modal";
import { exportAllTablesCsv, ExportAllTablesToJSON, ImportFromCSV, ImportFromJSON, parseZipToTables, validateImportShape } from "@/lib/supabase/actions/backup";
import { ArrowRight, FileSpreadsheet, MoveDownLeft, MoveUpRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function BackupPage() {
    useEffect(() => {
        document.title = "Your backup"
    }, []);

    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dates, setDates] = useState({
      startDate: '',
      endDate: '',
    })

    // export to csv
    const [exportAllData, setExportAllData] = useState<boolean>(false);
    const [exportError, setExportError] = useState<string | null>(null);

    const backup = [
      {
        item: "Export data to JSON",
        value: "Export as a JSON file",
        icon: <MoveUpRight size={15} />,
        onClick: () => setActiveItem("json"),
      },
      {
        item: "Export data to Excel",
        value: "Export data as a CSV file",
        icon: <MoveUpRight size={15} />,
        onClick: () => setActiveItem("csv"),
      },
      {
        item: "Import from an Excel file",
        value: "Import a CSV file",
        icon: <MoveDownLeft size={15} />,
        onClick: () => setActiveItem("csv-import"),
      },
      {
        item: "Import from a JSON file",
        value: "Import a JSON file",
        icon: <MoveDownLeft size={15} />,
        onClick: () => setActiveItem("json-import"),
      },
    ];

    const getTodayString = () => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    };
    const [dateNow, setDateNow] = useState(getTodayString());

    useEffect(() => {
      setDateNow(getTodayString());
    }, [])

    // Export to CSV
    const handleExportToCSV = async () => {
      setLoading(true);

      try {
        await exportAllTablesCsv({
          exportAll: exportAllData,
          startDate: dates.startDate,
          endDate: dates.endDate,
        });
      } catch (err) {
        setExportError(String(err));
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    // Export to JSON
    const handleExportToJSON = async () => {
      setLoading(true)

      try {
        await ExportAllTablesToJSON({
          exportAll: exportAllData,
          startDate: dates.startDate,
          endDate: dates.endDate,
        });
      } catch (err) {
        setExportError(String(err));
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    const handleImportFromJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);

      try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        if (!validateImportShape(parsed)) throw new Error("File is missing expected shape.");

        await ImportFromJSON(parsed);
        setActiveItem(null);
      } catch (err) {
        setExportError(String(err));
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    const handleImportFromCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);

      try {
         const parsed = await parseZipToTables(file);
         
         if (!validateImportShape(parsed)) throw new Error("File is missing expected tables");
         await ImportFromCSV(parsed);
         setActiveItem(null);
      } catch (err) {
        setExportError(String(err));
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    return (
      <>
        {loading && (
          <div className="fixed inset-0 z-50 bg-black/50 flex w-full h-full items-center justify-center">
            <LoadingModal message="Preparing a backup for your data"/>
          </div>
        )}
        {exportError && <ErrorModal message={exportError} />}
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex w-full h-full items-center justify-center">
            {/* Export to CSV */}
            {activeItem === "csv" && (
              <Modal
                open
                onOpen={() => setActiveItem(null)}
                message="Export your data to CSV for you to view, share, and edit
                      using spreadsheet apps."
                header="Export to CSV"
                onCancel={() => setActiveItem(null)}
                onConfirm={() => {
                  handleExportToCSV();
                  setActiveItem(null);
                }}
                loading={loading}
                icon={<FileSpreadsheet size={20} />}
                yesButtonText={loading ? "Exporting data..." : "Export to CSV"}
                noButtonText="No, don't export"
              >
                <div className="flex flex-col w-full h-fit items-center font-display gap-2">
                  <div className="flex w-full items-center gap-2">
                    <input
                      type="date"
                      value={dates.startDate || dateNow}
                      disabled={exportAllData}
                      onChange={(e) =>
                        setDates((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className={`${exportAllData && "text-(--color-text-secondary) pointer-none border-(--color-border-subtle)"} flex cursor-pointer px-3 py-1 border border-(--color-border-default) rounded-lg text-[0.9rem]`}
                    />
                    <ArrowRight size={15} />
                    <input
                      type="date"
                      value={dates.endDate || dateNow}
                      onChange={(e) =>
                        setDates((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      disabled={exportAllData}
                      className={`${exportAllData && "text-(--color-text-secondary) pointer-none border-(--color-border-subtle)"} flex cursor-pointer px-3 py-1 border border-(--color-border-default) rounded-lg text-[0.9rem]`}
                    />
                  </div>

                  <div className="flex w-full gap-2">
                    <input
                      id="allData"
                      type="checkbox"
                      checked={exportAllData}
                      onChange={(e) => setExportAllData((prev) => !prev)}
                      className="border border-(--color-border-default) rounded-md cursor-pointer"
                    />
                    <label htmlFor="allData">Export all data instead</label>
                  </div>
                </div>
              </Modal>
            )}

            {/* Export to JSON */}
            {activeItem === "json" && (
              <Modal
                open
                onOpen={() => setActiveItem(null)}
                message="Export your data to JSON as a backup measure and save the file in your device"
                header="Export to JSON"
                onCancel={() => setActiveItem(null)}
                onConfirm={() => {
                  handleExportToJSON();
                  setActiveItem(null);
                }}
                loading={loading}
                icon={<FileSpreadsheet size={20} />}
                yesButtonText="Export to JSON"
                noButtonText="No, don't export"
              >
                <div className="flex flex-col w-full h-fit items-center font-display gap-2">
                  <div className="flex w-full items-center gap-2">
                    <input
                      type="date"
                      value={dates.startDate || dateNow}
                      disabled={exportAllData}
                      onChange={(e) =>
                        setDates((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className={`${exportAllData && "text-(--color-text-secondary) pointer-none border-(--color-border-subtle)"} flex cursor-pointer px-3 py-1 border border-(--color-border-default) rounded-lg text-[0.9rem]`}
                    />
                    <ArrowRight size={15} />
                    <input
                      type="date"
                      value={dates.endDate || dateNow}
                      onChange={(e) =>
                        setDates((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      disabled={exportAllData}
                      className={`${exportAllData && "text-(--color-text-secondary) pointer-none border-(--color-border-subtle)"} flex cursor-pointer px-3 py-1 border border-(--color-border-default) rounded-lg text-[0.9rem]`}
                    />
                  </div>

                  <div className="flex w-full gap-2">
                    <input
                      id="allData"
                      type="checkbox"
                      checked={exportAllData}
                      onChange={(e) => setExportAllData((prev) => !prev)}
                      className="border border-(--color-border-default) rounded-md cursor-pointer"
                    />
                    <label htmlFor="allData">Export all data instead</label>
                  </div>
                </div>
              </Modal>
            )}

            {/* Import from JSON */}
            {activeItem === "json-import" && (
              <Modal
                open
                onOpen={() => setActiveItem(null)}
                message="Import your JSON file to restore your previous data to Money Tracker"
                header="Import data from JSON"
                onCancel={() => setActiveItem(null)}
                icon={<FileSpreadsheet size={20} />}
                noButtonText="No, go back"
                loading={loading}
              >
                <input
                  onChange={handleImportFromJSON}
                  accept=".json"
                  type="file"
                  className="flex w-full h-fit border border-(--color-border-subtle) cursor-pointer hover:bg-(--color-bg-subtle) rounded-lg px-3 py-1"
                />
              </Modal>
            )}

            {/* Import from CSV */}
            {activeItem === "csv-import" && (
              <Modal
                open
                onOpen={() => setActiveItem(null)}
                message="Import your CSV file from a spreadsheet app to restore your previous data to Money Tracker"
                header="Import a CSV file"
                onCancel={() => setActiveItem(null)}
                icon={<FileSpreadsheet size={20} />}
                noButtonText="No, go back"
                loading={loading}
              >
                <input
                  onChange={handleImportFromCSV}
                  type="file"
                  accept=".zip"
                  className="flex w-full h-fit border border-(--color-border-subtle) cursor-pointer hover:bg-(--color-bg-subtle) rounded-lg px-3 py-1"
                  />
              </Modal>
            )}
          </div>
        )}
        <div className="flex flex-col w-full h-full">
          <p className="font-semibold text-3xl pb-5">Backup</p>
          <div className="flex flex-col border border-(--color-border-default) h-full rounded-lg shadow-md">
            {backup.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_1fr] w-full h-fit items-center text-[0.9rem] px-5 py-2"
                key={index}
              >
                <p>{item.item}</p>

                <button
                  className="flex w-fit h-fit cursor-pointer ring ring-inset ring-(--color-brand-green) items-center justify-center hover:text-white active:bg-emerald-600 active:text-white whitespace-nowrap rounded-lg gap-1 justify-self-end shadow-md px-5 py-1 hover:bg-(--color-brand-green) text-[0.9rem]"
                  onClick={item.onClick}
                >
                  {item.icon}
                  <p>{item.value}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
}