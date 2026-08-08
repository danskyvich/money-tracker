import { createClient } from "../clients/client";
import Papa from "papaparse";
import JSZip from "jszip";

// <!------------------------------------ EXPORTS --------------------------------->

type ExportOptions = {
    exportAll: boolean,
    startDate?: string,
    endDate?: string,
}

// EXPORT TO CSV

const FILTERED_TABLES = ['transactions'] as const
const REFERENCE_TABLES = ['accounts', 'categories', 'account_categories', 'accounts_balances'] as const

async function GetAllTables(
    table: string,
    applyDateFilter: boolean,
    options: ExportOptions
): Promise<string> {
    
    const supabase = await createClient();
    let query = supabase.from(table).select('*');

    if (applyDateFilter && !options.exportAll) {
        if (options.startDate) query = query.gte('date_time', options.startDate);
        if (options.endDate) query = query.lte('date_time', options.endDate);
    }

    const { data, error } = await query;
    if (error) throw new Error(`${table} export failed: ${error.message}`);

    return Papa.unparse(data ?? []);
}

export async function exportAllTablesCsv(options: ExportOptions) {
    const allTables = [
        ...FILTERED_TABLES.map((t) => ({ table: t, dateFiltered: true})),
        ...REFERENCE_TABLES.map((t) => ({ table: t, dateFiltered: false})),
    ];

    const results = await Promise.all(
        allTables.map(async ({ table, dateFiltered }) => ({
            table,
            csv: await GetAllTables(table, dateFiltered, options),
        }))
    );

    const zip = new JSZip();
    for (const { table, csv } of results) {
        zip.file(`${table}.csv`, csv);
    }

    const blob = await zip.generateAsync({type: 'blob'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);
}

// EXPORT TO JSON
export async function ExportAllTablesToJSON(options: ExportOptions) {
    const allTables = [
        ...FILTERED_TABLES.map((t) => ({ table: t, dateFiltered: true})),
        ...REFERENCE_TABLES.map((t) => ({ table: t, dateFiltered: false})),
    ];

    const results = await Promise.all(
        allTables.map(async ({ table, dateFiltered}) => {
            const supabase = await createClient();
            let query = supabase.from(table).select('*');

            if (dateFiltered && !options.exportAll) {
                if (options.startDate) query = query.gte('date_time', options.startDate);
                if (options.endDate) query = query.lte('date_time', options.endDate);
            }

            const { data, error } = await query;
            if (error) throw new Error(`${table} export failed: ${error.message}`);

            return [table, data ?? []] as const
        })
    );

    const combined = Object.fromEntries(results);
    const blob = new Blob([JSON.stringify(combined, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// <!---------------------------------- IMPORT ------------------------------->

const EXPECTED_TABLES = ['accounts', 'categories', 'account_categories', 'transactions', 'accounts_balances'];

export function validateImportShape(parsed: Record<string, unknown>): boolean {
    return EXPECTED_TABLES.every((table) => Array.isArray(parsed[table]));
}

export async function ImportFromJSON(parsed: Record<string, any[]>) {
    const supabase = await createClient();

    const insertOrder = ['accounts', 'categories', 'account_categories', 'transactions', 'accounts_balances'];

    for (const table of insertOrder) {
        const rows = parsed[table];
        if (!rows || rows.length === 0) continue;

        const { error } = await supabase.from(table).upsert(rows);
        if (error) throw new Error(`Failed importing ${table}: ${error.message}`);
    }
}