import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function Profile() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="p-8 sm:p-12 text-center">
                    {/* User Avatar */}
                    {session.user.image ? (
                        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-zinc-100 shadow-sm">
                            <Image
                                src={session.user.image}
                                alt={session.user.name || 'User Profile'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-100 flex items-center justify-center border-4 border-white shadow-sm">
                            <span className="text-3xl font-semibold text-zinc-400">
                                {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* User Info */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
                        {session.user.name}
                    </h1>
                    <p className="text-zinc-500 mb-10 text-lg">
                        {session.user.email}
                    </p>

                    {/* Sign Out Button */}
                    <form action={async () => {
                        'use server';
                        await signOut({ redirectTo: '/' });
                    }}>
                        <button
                            type="submit"
                            className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3.5 rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 mx-auto w-full sm:w-auto min-w-[200px]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}