import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Users, Zap, Briefcase, User as UserIcon } from 'lucide-react'

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
        <nav className="bottom-nav-blur">
            {navItems.map((item) => {
                const active = isActive(item.path)
                const Icon = item.icon
                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="flex flex-col items-center gap-1 group transition-all"
                    >
                        <div className={`p-2 rounded-2xl transition-all ${active
                                ? 'bg-[var(--primary-teal)] text-white shadow-lg shadow-teal-900/20 scale-110'
                                : 'text-[var(--text-muted)] group-hover:text-[var(--primary-teal)] group-hover:bg-[var(--tag-bg)]'
                            }`}>
                            <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider transition-all ${active ? 'text-[var(--primary-teal)] opacity-100' : 'text-[var(--text-muted)] opacity-60'
                            }`}>
                            {item.label}
                        </span>
                    </button>
                )
            })}
        </nav>
    )
}
