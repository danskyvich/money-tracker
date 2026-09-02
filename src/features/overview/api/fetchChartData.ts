"use server"

import { createClient } from "@/lib/supabase/clients/server";

export interface MonthlyFlow {
    month_start: string;
    inflow: number;
    outflow: number;
}

export interface CategoryBreakdownRow {
  category_name: string;
  total: number;
}


export async function getMonthlyInflowOutflow(monthsBack: number = 6) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_monthly_inflow_outflow", {
        months_back: monthsBack,
    })

    if (error || !data) return { xAxisLabels: [], inflowData: [], outflowData: [], error };

    const rows = data as MonthlyFlow[];
    return {
        xAxisLabels: rows.map((r) => 
            new Date(r.month_start).toLocaleString("default", { month: "short"})
        ),
        inflowData: rows.map((r) => Number(r.inflow)),
        outflowData: rows.map((r) => Number(r.outflow)),
        error: null,
    }
}

export async function getCategoryBreakdown(type: "income" | "expense") {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_category_breakdown", { p_type: type});

    if (error || !data) return { chartData: [], error };
    const rows = data as CategoryBreakdownRow[];

    return {
        chartData: rows.map((row) => ({ name: row.category_name, value: Number(row.total)})),
        error: null,
    }
}