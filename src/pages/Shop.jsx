import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Package, Truck, Sparkles, ArrowLeft } from 'lucide-react'

export default function Shop() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[var(--bg-cream)] p-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                        <ArrowLeft className="w-6 h-6 text-[var(--primary-teal)]" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-[var(--primary-teal)] uppercase tracking-tighter">Gym-Mate Shop</h1>
                        <p className="text-[var(--text-muted)] text-sm">Premium Gear For Serious Athletes</p>
                    </div>
                    <div className="w-10 h-10 bg-[var(--primary-teal)] rounded-xl flex items-center justify-center text-white">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                </header>

                <div className="relative card bg-[var(--primary-teal)] overflow-hidden p-12 text-center text-white mb-8 border-none ring-offset-4 ring-2 ring-[var(--primary-teal)]">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Package className="w-64 h-64 rotate-12" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 inline-flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-400" /> coming soon
                        </div>
                        <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none">THE COLLECTION IS CURATING.</h2>
                        <p className="max-w-md text-white/70 text-lg mb-8">
                            We're testing the highest performing supplements, apparel and equipment to bring you the best in the UK.
                        </p>

                        <div className="w-full max-w-sm flex gap-2">
                            <input
                                type="email"
                                placeholder="early-access@gymmate.com"
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-bold"
                            />
                            <button className="bg-white text-[var(--primary-teal)] px-8 py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-yellow-50 transition-all active:scale-95 shadow-xl">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card bg-white p-6 border-none shadow-sm">
                            <div className="h-48 bg-[var(--tag-bg)] rounded-3xl mb-6 flex items-center justify-center">
                                <Truck className="w-12 h-12 text-[var(--text-muted)]" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-2/3 bg-[var(--tag-bg)] rounded-full" />
                                <div className="h-3 w-1/2 bg-[var(--tag-bg)] rounded-full" />
                                <div className="h-8 w-full bg-[var(--tag-bg)] rounded-xl mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
