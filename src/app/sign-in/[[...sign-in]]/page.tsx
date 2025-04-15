import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#2C1810] to-[#1a0f0a]">
            <div className="w-full max-w-md p-4">
                <SignIn appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-amber-100/5 border border-amber-100/20",
                    }
                }} />
            </div>
        </div>
    )
}