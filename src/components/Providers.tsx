'use client'
import react from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

type Props = {
    children: React.ReactNode
}

const queryClient = new QueryClient()

const Providers = ({ childres  => {
    return (
        <div>Providers</div>
    )
}

export default Providers;