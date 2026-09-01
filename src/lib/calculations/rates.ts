import { getCategoryBreakdown, getMonthlyInflowOutflow } from "@/features/overview/api/fetchChartData";

export async function retrieveData({type = "income"}: {type: "income" | "expense" }): Promise<number> {
    const { chartData } = await getCategoryBreakdown(type);
    return chartData.reduce((sum, item) => sum + item.value, 0);
}

function roundUpToTwoDecimalPlaces(num: number) {
    const factor = Math.pow(10, 2);
    return Math.ceil(num * factor) / factor;
}

export async function calculateGrowthRate(): Promise<{success: true, value: string}>{
    const thisMonth = await retrieveData({type: "income"})

    const lastMonthArray = (await getMonthlyInflowOutflow(1)).inflowData;


    if (lastMonthArray.length === 0) return { success: true, value: String(0)};

    const lastMonth = lastMonthArray.reduce((x, y) => x + y, 0);

    if (thisMonth === null) return { success: true, value: String(0)};

    if (thisMonth !== null && lastMonth === 0 ) return { success: true, value: "N/A" };
    console.log({ thisMonth, lastMonth });

    const value = String(roundUpToTwoDecimalPlaces((((lastMonth - thisMonth) / thisMonth) * 100)).toLocaleString("en-PH", {minimumFractionDigits: 2}) + "%");
    return { success: true, value };
}

export async function calculateExpenseRate(): Promise<{success: true, value: string}>{
    const thisMonth = await retrieveData({type: "expense"});

    const lastMonthArray = (await getMonthlyInflowOutflow(1)).outflowData;

    if (thisMonth === null) return { success: true, value: String(0)};
    if (lastMonthArray.length === 0) return { success: true, value: String(0)};

    const lastMonth = lastMonthArray.reduce((x, y) => x + y, 0);
    console.log({ thisMonth, lastMonth });
    if (thisMonth !== null && lastMonth === 0) return { success: true, value: "N/A" };
    const value = String(roundUpToTwoDecimalPlaces((((lastMonth - thisMonth) / thisMonth) * 100)).toLocaleString("en-PH", {minimumFractionDigits: 2}) + "%");
    return { success: true, value}
}