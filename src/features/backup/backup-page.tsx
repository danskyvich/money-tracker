'use client'

import Modal from "@/components/layout/modal";
import { DatabaseBackup, FileSpreadsheet, MoveDownLeft, MoveUpRight } from "lucide-react"
import Image from "next/image";
import { useEffect, useState } from "react"

export default function BackupPage() {
    useEffect(() => {
        document.title = "Your backup"
    });

    const [activeItem, setActiveItem] = useState<string | null>(null);

    const backup = [
      {
        item: "Export data to JSON",
        value: "Export to JSON",
        icon: <MoveUpRight size={15} />,
        onClick: () => setActiveItem("json"),
      },
      {
        item: "Export data to Excel",
        value: "Export to Excel",
        icon: <MoveUpRight size={15} />,
        onClick: () => setActiveItem("csv"),
      },
      {
        item: "Import from an Excel file",
        value: "Import from excel",
        icon: <MoveDownLeft size={15} />,
        onClick: () => setActiveItem("csv-import"),
      },
      {
        item: "Import from a JSON file",
        value: "Import from JSON",
        icon: <MoveDownLeft size={15} />,
        onClick: () => setActiveItem("json-import"),
      },
    ];

    const handleExportToCSV = () => {

    }

    return (
      <>
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex w-full h-full items-center justify-center">
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
                icon={<FileSpreadsheet size={20} />}
                yesButtonText="Export to CSV"
                noButtonText="No, don't export"
              />
            )}
            {activeItem === "json" && (
              <Modal
                open
                onOpen={() => setActiveItem(null)}
                message="Export your data to JSON as a backup measure and save the file in your device"
                header="Export to JSON"
                onCancel={() => setActiveItem(null)}
                onConfirm={() => {
                  handleExportToCSV();
                  setActiveItem(null);
                }}
                icon={<FileSpreadsheet size={20} />}
                yesButtonText="Export to JSON"
                noButtonText="No, don't export"
              />
            )}
            {activeItem === "json-import" && (
              <Modal
                open
                onOpen={() => setActiveItem(null)}
                message="Import your JSON file to restore your previous data to Money Tracker"
                header="Import data from JSON"
                onCancel={() => setActiveItem(null)}
                onConfirm={() => {
                  handleExportToCSV();
                  setActiveItem(null);
                }}
                icon={<FileSpreadsheet size={20} />}
                yesButtonText="Import data"
                noButtonText="No, don't import"
              />
            )}
            {activeItem === "csv-import" && (
              <Modal
                open
                onOpen={() => setActiveItem(null)}
                message="Import your CSV file from a spreadsheet app to restore your previous data to Money Tracker"
                header="Import a CSV file"
                onCancel={() => setActiveItem(null)}
                onConfirm={() => {
                  handleExportToCSV();
                  setActiveItem(null);
                }}
                icon={<FileSpreadsheet size={20} />}
                yesButtonText="Import data"
                noButtonText="No, don't import"
              />
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
                  className="flex w-fit h-fit cursor-pointer ring ring-inset ring-(--color-brand-green) items-center justify-center whitespace-nowrap rounded-lg gap-1 justify-self-end shadow-md px-5 py-1 hover:bg-(--color-brand-green) text-[0.9rem]"
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