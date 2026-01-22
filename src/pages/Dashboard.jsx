import { useNavigate } from 'react-router-dom'
import { Users, MessageCircle, Dumbbell, Sparkles, LogOut, Briefcase, ShoppingBag, Zap, TrendingUp, Calendar, Heart } from 'lucide-react'
import { signOut } from '../lib/supabase'
import { motion } from 'framer-motion'

export default function Dashboard() {
    const navigate = useNavigate()

    const stats = [
        { label: 'CALORIES', value: '1,840', icon: Zap, color: 'text-yellow-500' },
        { label: 'WORKOUTS', value: '12', icon: Dumbbell, color: 'text-teal-500' },
        { label: 'MATCHES', value: '4', icon: Heart, color: 'text-red-500' },
    ]

    const features = [
        {
            title: 'Find Partner',
            description: 'Match with local buddies',
            icon: Users,
            color: 'bg-blue-500/10 text-blue-600',
            action: () => navigate('/swipe')
        },
        {
            title: 'Marketplace',
            description: 'Book pro trainers',
            icon: Briefcase,
            color: 'bg-emerald-500/10 text-emerald-600',
            action: () => navigate('/marketplace')
        },
        {
            title: 'Food Scan',
            description: 'AI macro tracking',
            icon: Zap,
            color: 'bg-yellow-500/10 text-yellow-600',
            action: () => navigate('/scanner')
        },
        {
            title: 'Gym Shop',
            description: 'Premium curated gear',
            icon: ShoppingBag,
            color: 'bg-pink-500/10 text-pink-600',
            action: () => navigate('/shop')
        }
    ]

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    return (
        <div className="min-h-screen pb-32 pt-8 px-6">
            <header className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <img src="/assets/logo.jpg" alt="Logo" className="w-12 h-12 object-contain rounded-xl shadow-sm" />
                    <div>
                        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-0.5">GYMMATE</h1>
                        <h2 className="text-2xl font-black text-[var(--primary-teal)] tracking-tighter uppercase leading-none">STRIVING FOR ELITE</h2>
                    </div>
                </div>
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/profile')}
                    className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden"
                >
                    <div className="w-full h-full premium-gradient flex items-center justify-center text-white font-black text-xl">
                        S
                    </div>
                </motion.div>
            </header>

            {/* Hero Stats Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card premium-gradient text-white mb-8 border-none overflow-hidden relative shadow-2xl shadow-teal-900/30"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8 opacity-70">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">TODAY'S OVERVIEW</span>
                    </div>
                    <div className="flex justify-between items-end">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-black mb-1">{stat.value}</div>
                                <div className="text-[9px] font-black opacity-60 tracking-widest uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">CORE FEATURES</h3>
                    <div className="h-px bg-gray-200 flex-1 ml-4" />
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-4"
                >
                    {features.map((feature, i) => (
                        <motion.button
                            variants={item}
                            key={i}
                            onClick={feature.action}
                            className="card bg-white p-7 text-left group hover:shadow-xl transition-all"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-[var(--primary-teal)] text-sm mb-1 uppercase tracking-tighter leading-none">{feature.title}</h4>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold">{feature.description}</p>
                        </motion.button>
                    ))}
                </motion.div>
            </section>

            {/* Active Promotion / Tip Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-yellow-400 p-8 rounded-[40px] flex items-center gap-6 shadow-xl shadow-yellow-900/10"
            >
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-yellow-500 shadow-sm">
                    <Sparkles className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="font-black text-black leading-none mb-1 uppercase tracking-tighter">GET PRO ACCESS</h4>
                    <p className="text-black/60 text-[10px] font-bold">Unlocks Trainer Messaging, Ad-Free Scan & Unlimited Swipes.</p>
                </div>
            </motion.div>
        </div>
    )
}
