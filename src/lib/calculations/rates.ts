import { getCategoryBreakdown, getMonthlyInflowOutflow } from "@/features/overview/api/fetchChartData";

export async function retrieveData({type = "income"}: {type: "income" | "expense" }): Promise<number> {
    const { chartData } = await getCategoryBreakdown(type);
    return chartData.reduce((sum, item) => sum + item.value, 0);
}

export async function calculateGrowthRate(): Promise<{success: false, error: string} | {success: true, value: number}>{
    const thisMonth = await retrieveData({type: "income"})

    const lastMonthArray = (await getMonthlyInflowOutflow(1)).inflowData;
    if (!lastMonthArray.length) {
        return { success: false, error: "Fetching last month's income failed"};
    }
    const lastMonth = lastMonthArray.reduce((x,y) => x + y, 0);
    if (!thisMonth || !lastMonth) {
        return { success: false, error: "Value aggregation failed."};
    }
    const value = ((thisMonth - lastMonth) / lastMonth) * 100;
    return { success: true,  value };
}

export async function calculateExpenseRate(): Promise<{success: false, error: string} | {success: true, value: number}>{
    const thisMonth = await retrieveData({type: "expense"});

    const lastMonthArray = (await getMonthlyInflowOutflow(1)).outflowData;
    if (!lastMonthArray.length) {
        return { success: false, error: "Fetching last month's expense failed"};
    }
    const lastMonth = lastMonthArray.reduce((x,y) => x + y, 0);
    if (!thisMonth || !lastMonth) {
        return { success: false, error: "Value aggregation failed."};
    }
    const value = ((thisMonth - lastMonth) / lastMonth) * 100;
    return { success: true,  value };
}