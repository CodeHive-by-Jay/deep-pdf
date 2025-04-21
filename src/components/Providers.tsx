'use client'
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

type Props = {
    children: React.ReactNode
}

// Create a client with better defaults to avoid unnecessary refetches
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
        },
    },
});

const Providers = ({ children }: Props) => {
    // Use React.useState to ensure the QueryClient is only created once per session
    const [client] = React.useState(() => queryClient);

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
}

export default Providers;