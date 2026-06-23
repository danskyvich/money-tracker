import { Envelopes } from "@/lib/mocks/mockEnvelopes";
import DoughnutChart from "../charts/DoughnutChart";

export default function BudgetBreakdownPage() {

    const budgetData = Envelopes.map((item => ({
        name: item.name,
        value: item.value,
    })))

    return <div className="flex flex-1 w-full">
        <DoughnutChart data={budgetData}/>
    </div>;
}
