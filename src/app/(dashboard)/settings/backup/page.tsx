import SettingItem from "@/components/layout/SettingItem";
import Button from "@/components/ui/Button";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useState } from "react";

export default function Backup() {
  return (
    <div className="flex flex-col w-full h-full py-5 px-9 gap-1">
      <SettingItem label="Export as JSON">
        <Button
          text="Export to JSON"
          link="/"
          className="px-5"
          variant="ghost"
        />
      </SettingItem>

      <SettingItem label="Export data to Excel">
        <Button
          text="Export to Excel"
          link="/"
          className="px-5"
          variant="ghost"
        />
      </SettingItem>

      <SettingItem label="Backup/restore on device">
        <Button
          text="Backup or restore"
          link="/"
          className="px-5"
          variant="ghost"
        />
      </SettingItem>

      <SettingItem label="Import from Excel file">
        <Button
          text="Import from Excel"
          link="/"
          className="px-5"
          variant="ghost"
        />
      </SettingItem>

      <div className="flex flex-col mt-10 mb-2">
        <p className="text-[1.3rem] font-light font-mono">Reset</p>
        <hr className="border-(--color-border-strong) w-full my-2" />
      </div>

      <SettingItem
        label="Reset everything"
        icon={<CircleQuestionMarkIcon size={20} />}
        tooltip="This will delete all your data permanently"
      >
        <Button text="Reset" link="/" className="px-5" variant="danger" />
      </SettingItem>

      <SettingItem label="Reset only the contents">
        <Button
          text="Reset contents"
          link="/"
          className="px-5"
          variant="ghost"
        />
      </SettingItem>
    </div>
  );
}
