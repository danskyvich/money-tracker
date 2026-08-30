"use server"

import { getUser } from "./auth";
import { createClient } from "../clients/server"
import { AccountCategories, AccountsWithBalance, Categories, Transactions, TransactionSearchResults } from "@/lib/types/derived";

// <------------------ accounts ---------------------------------->

interface AccountParams {
    name: string,
    description: string,
    category_id: string,
}

// INSERT
export async function InsertAccount(name: string, description: string, categoryId: string | undefined) {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) return { success: false, error: "User not authenticated"};
    const user_id = user.id;
    
    const { data, error } = await supabase
        .from("accounts")
        .insert({user_id: user_id, name, description, category_id: categoryId})
        .select()
    if (error) return { data: null, error: error.message};
    return { data, error: null};
}

// DELETE
export async function DeleteAccount(id: string) {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) return { success: false, error: "User not authenticated"};
    const user_id = user.id;

    const { data, error } = await supabase
        .from("accounts")
        .delete()
        .eq('id', id)
        .eq("user_id", user_id)
        .select()
    if (!data) return { data: null, error: error.message}
    return { error: null };
}

// UPDATE 
export async function UpdateAccount(id: string, accounts: AccountParams): Promise<{success: false, error: string} | {success: true, data: any}> {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) return { success: false, error: "User not authenticated"}
    const user_id = user.id;

    const { data, error } = await supabase
        .from("accounts")
        .update({name: accounts.name, description: accounts.description, category_id: accounts.category_id})
        .eq("user_id", user_id)
        .eq("id", id)
        .select()
        .single();

        console.log(error);
        console.log(data);
    if (error) return { success: false, error: "Updating account data failed."};
    return { success: true, data }
}

// <------------------ account_categories ------------------------>

// UPDATE
export async function UpdateAccountCategoryName(name: string, uuid: string) {
    const { data, error } = await (await createClient())
        .from('account_categories')
        .update({ name })
        .eq('id', uuid);
    
    if (error) return{ success: false, error: error.message}
    return { success: true, data };
}
// DELETE
export async function DeleteAccountCategoryName(uuid: string) {
    const { data, error } = await (await createClient())
        .from('account_categories')
        .delete()
        .eq('id', uuid);

    if (error) return { success: false, error: error.message}

    return { success: true, data };
}
// INSERT
export async function InsertAccountCategoryName(name: string) {
    const supabase = await createClient();
    
    const user = await getUser(); // user_id

    const { error } = await supabase
        .from('account_categories')
        .insert({ name, user_id: user?.id })
    
    if (error) return { success: false, error: error.message}

    return { success: true }
}


// SELECT 
export async function FetchAccounts(currentPage: number, numberOfItems: number): Promise<{success: false, error: string} | {success: true, accountsData: AccountsWithBalance[], accountCategoriesData: Pick<AccountCategories, "id" | "name">[], totalItems: number}> {
    const supabase = await createClient();
    const [accountsResult, accountCategoriesResult] = await Promise.all([
        supabase.rpc('fetch_accounts', {
            page_number: currentPage,
            page_size: numberOfItems,
        }),
        supabase.from("account_categories").select(`id, name`),
    ]);

    const { data: accountsData, error: accountsError} = accountsResult;
    const { data: accountCategoriesData, error: accountCategoriesError} = accountCategoriesResult;

    if (accountCategoriesError || accountsError) {
        return { success: false, error: "Database error"}
    }
    const totalItems = accountsData?.[0]?.total_count ?? 0;
    const cleaned = (accountsData ?? []).map(({ total_count, ...rest }) => rest);    
    return {
        success: true,
        accountsData: cleaned,
        accountCategoriesData,
        totalItems,
    }
}

export async function FetchAccountCategories(): Promise<{success: false, error: string} | {success: true, data: AccountCategories[]}> {
   const supabase = await createClient();
   const user = await supabase.auth.getClaims();
   if (user.error || !user) return { success: false, error: "User not authenticated"};
   const user_id = user.data?.claims.sub;
   if (!user_id) return { success: false, error: "Uer id not found"};

   const { data, error} = await supabase
    .from("account_categories")
    .select(`*`)
    .eq("user_id", user_id); 
    if (error) return { success: false, error: error.message};
    return { success: true, data}
}

// <-----------------Transactions --------------------------->

// SELECT
export async function FetchTransaction(currentPage: number, numberOfItems: number):Promise<{success: true, data: TransactionSearchResults[], totalItems: number | null} | {success: false, error: string}> {
    const supabase = await createClient();
    const { data, error, count } = await supabase
        .from("transactions")
        .select(`id, date_time, description, amount, type, category_id:categories!category_id(id, name), account_id:accounts!account_id(id, name), to_account_id:accounts!to_account_id(id, name)`, {count: "exact"})
        .order("date_time", { ascending: false})
        .range((currentPage - 1) * numberOfItems, (currentPage - 1) * numberOfItems + numberOfItems - 1);
    
    if (error) return { success: false, error: error.message};

    return  { success: true, data, totalItems: count}
}
interface InsertTransactionParams {
    account_id: string,
    amount: number,
    category_id: string,
    description: string | null,
    user_id: string,
    to_account_id: string | null,
    date_time: string,
    type: string
}

// INSERT
export async function InsertTransaction(transaction: InsertTransactionParams[]): Promise<{success: true, data: any} | {success: false, error: string}> {
    const supabase = await createClient(); // initialize client

    const { data, error } = await supabase
        .from("transactions")
        .insert(transaction);

    if (error) return { success: false, error: error.message };
    
    return { success: true, data }  
}

// UPDATE
export async function UpdateTransaction(id: string, transaction: InsertTransactionParams[]): Promise<{success: false, error: string} | {success: true, data: any}> {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) return { success: false, error: "Unauthenticated user."}

    const { data, error } = await supabase
        .from("transactions")
        .update(transaction)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
    
    if (error) return { success: false, error: error.message };
    return { success: true, data};
}

// DELETE
export async function DeleteTransaction(id: string) {
    const {data, error } = await (await createClient()).from("transactions")
        .delete()
        .eq("id", id)
        .select()
    if (!data) return { error: error.message}
    return { data, error: null}
}

// TRANSACTIONS from an ACCOUNT 
export async function SelectTransactionsFromChosenAccount(id: string, currentPage: number, pagesToShow: number) {
    const from = (currentPage - 1) * pagesToShow;
    const to = from + pagesToShow - 1;
    const { data, error, count } = await (await createClient())
        .from("transactions")
        .select(`*, categories(name), fromAccount:accounts!account_id(name), toAccount:accounts!to_account_id(name)`, { count: "exact"})
        .or(`account_id.eq.${id},to_account_id.eq.${id}`)
        .order("date_time", { ascending: false})
        .range(from, to);
    if (!data) return { data: null, error: error.message ?? "Unknown Error", count: null}
    return { data, error: null, count };
}

// <!-------------------- INCOME & EXPENSE CATEGORIES ------------>


// INCOME categories
export async function FetchIncomeCategories(): Promise<{success: false, error: string} | {success: true, data: Categories[]}> {
    const supabase = await createClient();
    const { data, error } = await supabase 
        .from("categories")
        .select(`*`)
        .eq('type', 'Income')
    if (error) return { success: false, error: error.message }
    return { success: true, data}
}

export async function AddIncomeCategory(name: string, id?: string): Promise<{success: false, error: string} | {success: true}> {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) return { success: false, error: "User not authenticated"};

    if (!name.trim()) return { success: false, error: "Name is required"};

    if (id) {
        const { error } = await supabase
            .from('categories')
            .update({name: name.trim()})
            .eq(`id`, id)
            .eq('user_id', user.id)
        if (error) {
            if (error.code === '23505') {
                return { success: false, error: "Category already exist"};
            }
            return { success: false, error: error.message}
        }
    } else {
        const { error } = await supabase
            .from('categories')
            .insert({name: name.trim(), user_id: user.id, type: 'Income'});
        if (error) {
            if (error.code === '23505') {
                return { success: false, error: "Category already exist"};
            }
            return { success: false, error: error.message}
        }
    }

   return { success: true};
}

export async function DeleteIncomeCategory(id: string): Promise<{success: true} | {success: false, error: string}> {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthenticated user"};
    const user_id = user.id;

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id)
    if (error) return { success: false, error: error?.message}
    return { success: true} 
}

export async function FetchExpenseCategories(): Promise<{success: false, error: string} | {success: true, data: Categories[]}> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select(`*`)
        .eq('type', 'Expense')
    if (error) return { success: false, error: error.message}
    return { success: true, data}
}

export async function AddExpenseCategory(name: string, id?: string): Promise<{success: false, error: string} | {success: true}> {
    const trimmedName = name.trim();
    const user = await getUser();
    if (!trimmedName) return { success: false, error: "Name required"}
    if (!user) return { success: false, error: "Unauthenticated user"}
    const user_id = user.id;

    const supabase = await createClient();

    if (id) {
        const { error } = await supabase
            .from('categories')
            .update({name: trimmedName})
            .eq('id', id)
            .eq('user_id', user_id)
        if (error) {
            if (error.code === '23505') {
                return { success: false, error: "Category already exist"};
            }
            return { success: false, error: error.message}
        }
    } else {
        const { error } = await supabase
            .from('categories')
            .insert({name: trimmedName, user_id: user_id, type: 'Expense'})
        if (error) {
            if (error.code === '23505') {
                return { success: false, error: 'Category already exist'};
            }
            return { success: false, error: error.message}
        }
    }
    return { success: true };
}

export async function DeleteExpenseCategory(id: string): Promise<{success: false, error: string} | {success: true}> {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthenticated user"}
    const user_id = user?.id;

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('user_id', user_id)
        .eq('id', id)
    if (error) return { success: false, error: error.message}
    return { success: true }
}

// <!-------------------- SETTINGS / CONFIG -------------------->

// DELETE USER DATA
export async function DeleteUserData() {
    const supabase = await createClient();
    const { data: { user }, error: user_error } = await supabase.auth.getUser();

    if (!user || user_error ) return { success: false, error:  "Not authenticated" };

    const user_id = user.id;

    const deletes = [
        () => supabase.from("transactions").delete().eq("user_id", user_id),
        () => supabase.from("accounts").delete().eq("user_id", user_id),
        () => supabase.from("account_categories").delete().eq("user_id", user_id),
        () => supabase.from("categories").delete().eq("user_id", user_id),
    ];

    for (const del of deletes) {
        const { error } = await del();
        if (error) return { success: false, error: error.message}
    }

    return { success: true};
}

// SEARCH ACCOUNTS
export async function SearchAccounts(term: string): Promise<{success: true; data: AccountsWithBalance[]} | {success: false, error: string}> {
    if (!term.trim()) return { success: true, data: []};
    
    const supabase = await createClient();
    const { data, error } = await supabase
        .rpc('search_accounts', { search_term: term })

    if (!data || error ) return { success: false, error: error?.message ?? "Unknown error."};

    return { success: true, data};
} 

// SEARCH TRANSACTIONS
export async function SearchTransactions(term: string, currentPage: number): Promise<{success: true; data: TransactionSearchResults[]} | {success: false, error: string}> {
    if (!term.trim()) return { success: true, data: []};

    const supabase = await createClient();
    const { data, error } = await supabase
        .rpc('search_transactions', { search_term: term, page_size: 9, page_number: currentPage})
    
    if (!data || error) return { success: false, error: error.message ?? "Unknown error"};

    return { success: true, data: data as unknown as TransactionSearchResults[] };
}

export async function CalculateTotalEarnings(): Promise<{success: false, error: string} | {success: true, data: any[]}> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .rpc('calculate_monthly_earnings')
    if (!data || error ) return { success: false, error: error.message}
    return { success: true, data } 
}