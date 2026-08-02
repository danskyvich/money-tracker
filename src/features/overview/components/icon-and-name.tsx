import { iconMap } from "@/lib/Icons";
import { useEffect, useState } from "react";

export default function OverviewHeader() {
  const [time, setTime] = useState<string>("");

  // get current time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const getTime = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTime(getTime);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  //get icon from overview icons
  const getOverviewIcon = ({ time }: { time: string }) => {
    const hour = parseInt(time.split(":")[0], 10);
    return (
      iconMap.find(({ range }) => hour >= range[0] && hour < range[1])
        ?.icon ?? (
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 15 15"
          fill="currentColor"
          className="text-primary"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.66077 11.3619C2.09296 11.4524 2.54093 11.5 3.00002 11.5C6.58987 11.5 9.50002 8.58987 9.50002 5.00002C9.50002 3.25482 8.81224 1.67027 7.69295 0.502625C11.4697 0.604839 14.5 3.69855 14.5 7.50002C14.5 11.366 11.366 14.5 7.49999 14.5C5.06138 14.5 2.91401 13.253 1.66077 11.3619Z"
            stroke="currentColor"
            strokeLinejoin="round"
          />
        </svg>
      )
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5 text-xl text-primary">
        {getOverviewIcon({ time })}
        <div className="flex flex-col justify-center">
          <p className="flex font-mono text-[1.5rem]">Welcome, Juan!</p>
        </div>
      </div>
    </div>
  );
}
