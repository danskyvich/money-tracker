"use client";

import Card from "@/components/ui/Card";
import { Envelopes } from "@/lib/mocks/mockEnvelopes";
import {
  ArrowUp,
  ChevronRight,
  CircleQuestionMarkIcon,
  Coins,
  File,
  LineChart,
  Mail,
  Plus,
  TicketSlash,
  TrendingDown,
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function Budget() {
  useEffect(() => {
    document.title = "Your budget";
  });

  const pagination = [1, 2, 3];
  const divRef = useRef<HTMLDivElement>(null);

  // Chart for monthly expenses

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <div className="flex w-full h-fit">
        <p className="text-3xl font-semibold">Budget</p>

        <div className="flex flex-auto w-auto" />

        <div className="flex w-fit h-fit px-5 py-1 items-center ring ring-inset ring-(--color-brand-green) hover:bg-(--color-brand-green) rounded-lg text-[0.9rem] gap-1 cursor-pointer transition-all duration-100">
          <File size={15} />
          <p>Export report</p>
        </div>
      </div>

      <div className="flex w-full h-full gap-5">
        {/* Left side */}
        <div className="flex flex-1 flex-col w-full h-full gap-5">
          {/* Budget amount */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Coins size={20} />
                <p>Total budget</p>
              </div>
            }
            className="flex w-full"
          >
            <div className="flex w-full">
              <div className="flex flex-1 flex-col w-full p-5 gap-4">
                <p className="font-mono text-3xl">
                  <span className="text-2xl mr-1">₱</span>
                  2,144.00
                </p>

                <div className="flex w-full items-center">
                  <ArrowUp size={20} className="text-emerald-500" />
                  <p className="text-[0.9rem] text-(--color-text-secondary)">
                    <span className="text-emerald-500">4%</span> growth rate
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col w-full items-center justify-center">
                <div className="flex w-fit h-fit px-5 py-2 items-center hover:bg-(--color-brand-green) hover:text-white rounded-lg ring ring-inset ring-(--color-brand-green) cursor-pointer transition-all duration-100 shadow-md">
                  <Plus size={20} className="mr-1" />
                  <p className="text-[0.9rem]">Set new budget</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-1 w-full h-full gap-5">
            <div className="flex flex-1 flex-col w-full h-full border border-(--color-border-default) rounded-lg shadow-md px-5 py-3">
              <div className="flex flex-0 w-full h-fit items-center gap-2">
                <TrendingDown size={20} />
                <p className="font-display text-xl font-semibold whitespace-nowrap">
                  Remaining budget
                </p>
              </div>

              <div className="flex flex-1 w-full h-full items-center ">
                <p className="font-mono text-3xl">
                  <span className="text-xl mr-1">₱</span>
                  1,455.24
                </p>
              </div>

              <div className="flex flex-0 w-full h-full">
                <p className="text-[0.9rem] text-(--color-text-secondary)">
                  <span className="font-semibold ">76%</span> of the budget
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col w-full h-full border border-(--color-border-default) rounded-lg shadow-md px-5 py-3">
              <div className="flex flex-0 w-full h-fit items-center gap-2">
                <TicketSlash size={20} />
                <p className="font-display text-xl font-semibold whitespace-nowrap">
                  Amount spent
                </p>
              </div>

              <div className="flex flex-1 w-full h-full items-center">
                <p className="font-mono text-3xl ">
                  <span className="text-xl mr-1">₱</span>
                  567.00
                </p>
              </div>

              <div className="flex flex-0 w-full h-full">
                <p className="text-[0.9rem] text-(--color-text-secondary)">
                  <span className="font-semibold">34%</span> of the total budget
                </p>
              </div>
            </div>
          </div>
          <Card
            className="flex flex-3 w-full h-full"
            header={
              <div className="flex w-full items-center gap-2">
                <Mail size={20} />
                <p>Envelopes</p>
              </div>
            }
            link="/"
            linkText="Add an envelope"
          >
            <div className="flex flex-1 flex-col w-full h-full">
              {Envelopes.map((item, index) => (
                <div
                  className="flex flex-0 w-full h-full px-5 py-2 border-b border-(--color-border-subtle) text-[0.9rem] hover:bg-(--color-bg-subtle) cursor-pointer"
                  key={index}
                >
                  <p className="flex flex-1">{item.name}</p>
                  <p className="flex flex-1 font-mono items-center">
                    <span className="text-[0.7rem] mr-1">₱</span>
                    {item.value}
                  </p>
                  <p className="flex flex-1 text-(--color-text-secondary)">
                    <span className="mr-1">/</span>
                    <span className="text-[0.9rem] mr-1">₱</span>
                    {item.target}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-0 w-full h-fit px-5 py-3 items-center">
              <p className="text-[0.9rem] text-(--color-text-secondary)">
                Show data{" "}
                <span className="border border-(--color-border-default) rounded-sm p-2">
                  10
                </span>{" "}
                of 200
              </p>

              <div className="flex flex-auto w-auto h-fit" />

              <div className="flex flex-1 w-full h-full justify-end gap-2">
                {pagination.map((item, index) => (
                  <div
                    className="flex w-fit h-fit px-2 py-1 rounded-md border border-(--color-border-default)"
                    key={index}
                  >
                    <p>{item}</p>
                  </div>
                ))}
                <div className="flex w-fit h-full px-2 py-1 rounded-md border border-(--color-border-default) cursor-pointer hover:bg-(--color-bg-subtle) duration-100 transition-all items-center active:bg-(--color-border-strong)">
                  <ChevronRight size={15} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right side */}
        <div className="flex flex-2 flex-col w-full h-full gap-5">
          <div className="flex flex-1 w-full h-full gap-5">
            {/* Monthly budget spending chart */}
            <div
              className="flex flex-2 w-full h-full border border-(--color-border-default) rounded-lg"
              ref={divRef}
            ></div>

            {/* Fixed and Variable expenses */}
            <div className="flex flex-1 flex-col w-full h-full gap-5">
              <div className="flex flex-1 flex-col w-full h-full border border-(--color-border-default) rounded-lg px-5 py-2">
                <div className="flex flex-0 w-full h-fit items-center gap-2 text-xl font-semibold">
                  <p>Fixed expenses</p>
                  <CircleQuestionMarkIcon size={20} />
                </div>

                <div className="flex flex-1 w-full h-full items-center">
                  <p className="font-mono text-3xl">
                    <span className="text-xl mr-1">₱</span>1,000.00
                  </p>
                </div>

                <div className="flex flex-0 w-full h-fit">
                  <p className="text-[0.9rem] text-(--color-text-secondary)">
                    1.2% decrease compared to last month
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col w-full h-full border border-(--color-border-default) rounded-lg px-5 py-2">
                <div className="flex flex-0 w-full h-fit items-center gap-2 text-xl font-semibold">
                  <p>Variable expenses</p>
                  <CircleQuestionMarkIcon size={20} />
                </div>

                <div className="flex flex-1 w-full h-full items-center">
                  <p className="font-mono text-3xl">
                    <span className="text-xl mr-1">₱</span>613.42
                  </p>
                </div>

                <div className="flex flex-0 w-full h-fit">
                  <p className="text-[0.9rem] text-(--color-text-secondary)">
                    5% decrease compared to last month
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-2 w-full h-full border border-(--color-border-default) rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
