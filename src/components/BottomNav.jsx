import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Users, Zap, Briefcase, User as UserIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/swipe', icon: Users, label: 'Match' },
        { path: '/scanner', icon: Zap, label: 'Scan' },
        { path: '/marketplace', icon: Briefcase, label: 'Experts' },
        { path: '/profile', icon: UserIcon, label: 'Profile' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-gray-100 px-6 py-4 pb-8 md:pb-6 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const active = isActive(item.path)
                const Icon = item.icon
                return (
                    <motion.button
                        key={item.path}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(item.path)}
                        className="relative flex flex-col items-center gap-1.5 transition-all"
                    >
                        <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active
                            ? 'bg-[var(--primary-teal)] text-white shadow-xl shadow-teal-900/20'
                            : 'text-[var(--text-muted)]'
                            }`}>
                            <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${active ? 'text-[var(--primary-teal)] opacity-100 translate-y-0' : 'text-[var(--text-muted)] opacity-60 translate-y-1'
                            }`}>
                            {item.label}
                        </span>
                        {active && (
                            <motion.div
                                layoutId="nav-dot"
                                className="absolute -top-1 w-1 h-1 bg-[var(--primary-teal)] rounded-full"
                            />
                        )}
                    </motion.button>
                )
            })}
        </nav>
    )
}
