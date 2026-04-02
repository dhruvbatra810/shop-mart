import { cookies } from "next/headers";

export default function Login() {
    async function handleFormSubmit(formData: FormData) {
        "use server"
        console.log('coming here?')
        const email = formData.get("email")
        // const password = formData.get("password")
        // console.log(email, password)
        const cookieStore = await cookies();
        cookieStore.set("token", "abc123");
        console.log(cookieStore.get("token"));
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-50 px-4 font-sans text-zinc-900">
            <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                <h1 className="text-3xl font-bold mb-2 text-center text-zinc-900 tracking-tight">
                    Welcome Back
                </h1>
                <p className="text-sm text-zinc-500 text-center mb-8">
                    Enter your credentials to access your account
                </p>
                <form action={handleFormSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-zinc-700 ml-1" htmlFor="email">Email address</label>
                        <input
                            className="bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-zinc-700 ml-1" htmlFor="password">Password</label>
                        <input
                            className="bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        className="mt-2 bg-zinc-900 hover:bg-zinc-800 text-white border-none rounded-xl px-4 py-3.5 font-medium transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                        type="submit"
                    >
                        Sign In
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}