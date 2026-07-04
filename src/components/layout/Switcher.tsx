import { useState } from "react";

export default function Switcher() {

    const [isSwitched, setSwitched] = useState<boolean>(false);
    
    return (
      <div
        className={`flex border-(--color-brand-green) border w-[50px] h-[25px] rounded-xl hover:cursor-pointer ${isSwitched === true ? "bg-(--color-border-strong)" : null}`}
        onClick={() => setSwitched((prev) => !prev)}
      >
        <div
          className={`flex ring-(--color-border-strong) ring ring-inset bg-(--color-brand-green) w-[25px] h-full rounded-xl hover:cursor-pointer duration-100 transition-all ${isSwitched === true ? "translate-x-6.25" : "translate-x-0"}`}
        ></div>
      </div>
    );
}