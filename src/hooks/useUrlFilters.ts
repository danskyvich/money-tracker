import { FilterField } from "@/features/accounts/types/types";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function useFilterModal(fields: FilterField[]) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // modal states
    const [open, setOpen] = useState<boolean>(false);
    const [draft, setDraft] = useState<Record<string, string>>(() => 
        Object.fromEntries(searchParams.entries())
    );
    const openModal = useCallback(() => {
        setDraft(Object.fromEntries(searchParams.entries()));
        setOpen(true);
    }, [searchParams])

    const closeModal = useCallback(() => setOpen(false), []);

    const setField = useCallback((key: string, value: string) => {
        setDraft((prev) => ({ ...prev, [key]: value}));
    }, [])

    const apply = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        const ownedKeys = fields.flatMap((f) => f.type === 'date' ? [`${f.key}From`, `${f.key}To`] : [f.key]);

        ownedKeys.forEach((key) => {
            const value = draft[key];
            value ? params.set(key, value) : params.delete(key);
        })

        router.push(`${pathname}?${params.toString()}`);
        setOpen(false)
    }, [draft, fields, pathname, router, searchParams]);

    const clear = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        const ownedKeys = fields.flatMap((f) => f.type === 'date' ? [`${f.key}From`, `${f.key}To`] : [f.key]
        );
        ownedKeys.forEach((key) => params.delete(key));

        setDraft({});
        router.push(`${pathname}?${params.toString()}`);
        setOpen(false);
    }, [fields, pathname, router, searchParams]);

    const activeCount = fields.filter((f) => {
        if (f.type === 'date') {
            return searchParams.get(`${f.key}From`) || searchParams.get(`${f.key}To`);
        }
        return !!searchParams.get(f.key);
    }).length

    return { open, openModal, closeModal, draft, setField, apply, clear, activeCount}
}