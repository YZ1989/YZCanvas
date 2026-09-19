import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { verifyJinyuKey } from "@/services/api/jinyu-account";
import { AITUDOU_WALLET_REFRESH_EVENT } from "@/services/api/aitudou-wallet";
import { useConfigStore } from "@/stores/use-config-store";

export function useJinyuAccount() {
    const apiKey = useConfigStore((state) => state.config.apiKey.trim());
    const query = useQuery({
        queryKey: ["jinyu-account", apiKey],
        queryFn: ({ signal }) => verifyJinyuKey(apiKey, signal),
        enabled: Boolean(apiKey),
        gcTime: 0,
        refetchOnMount: "always",
        staleTime: 30_000,
        retry: false,
    });
    useEffect(() => {
        if (!apiKey) return;
        const refresh = () => {
            void query.refetch({ cancelRefetch: false });
        };
        window.addEventListener(AITUDOU_WALLET_REFRESH_EVENT, refresh);
        return () => window.removeEventListener(AITUDOU_WALLET_REFRESH_EVENT, refresh);
    }, [apiKey, query.refetch]);
    return { ...query, hasKey: Boolean(apiKey), connected: Boolean(apiKey && query.data && !query.isError) };
}
