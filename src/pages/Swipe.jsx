import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Heart, X, MapPin, Info, ArrowLeft, MoreVertical, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase, createSwipe, getCurrentUser } from '../lib/supabase'

export default function Swipe() {
    const [profiles, setProfiles] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [matchData, setMatchData] = useState(null)
    const navigate = useNavigate()

    // Motion values
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-25, 25])
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
    const heartOpacity = useTransform(x, [0, 100], [0, 1])
    const crossOpacity = useTransform(x, [-100, 0], [1, 0])

    useEffect(() => {
        fetchProfiles()
    }, [])

    const fetchProfiles = async () => {
        try {
            const user = await getCurrentUser()
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .neq('id', user.id)
                .limit(20)

            // Fallback demo profiles if database is empty so new users can test swipe
            if (data && data.length > 0) {
                setProfiles(data)
            } else {
                setProfiles([
                    {
                        id: 'demo-1',
                        full_name: 'Alex Rivera',
                        age: 26,
                        fitness_goal: 'Strength',
                        experience_level: 'Advanced',
                        gym_name: 'PureGym London Central',
                    },
                    {
                        id: 'demo-2',
                        full_name: 'Sarah Chen',
                        age: 24,
                        fitness_goal: 'Bodyweight',
                        experience_level: 'Intermediate',
                        gym_name: 'Gymbox Farringdon',
                    },
                    {
                        id: 'demo-3',
                        full_name: 'James Wilson',
                        age: 28,
                        fitness_goal: 'Endurance',
                        experience_level: 'Beginner',
                        gym_name: 'JD Gyms',
                    },
                ])
            }
        } finally {
            setLoading(false)
        }
    }

    const activeProfile = profiles[currentIndex]

    const handleSwipe = async (direction) => {
        const swipeType = direction === 'right' ? 'like' : 'dislike'

        if (activeProfile) {
            const user = await getCurrentUser()
            await createSwipe(user.id, activeProfile.id, swipeType)
        }

        x.set(0)
        setCurrentIndex(prev => prev + 1)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-cream)]">
            <div className="w-12 h-12 border-4 border-[var(--primary-teal)] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[var(--bg-cream)] flex flex-col pt-8 overflow-hidden">
            {/* Header */}
            <header className="px-6 flex items-center justify-between mb-8">
                <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-2xl shadow-sm">
                    <ArrowLeft className="w-6 h-6 text-[var(--primary-teal)]" />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-black text-[var(--primary-teal)] uppercase tracking-tighter">DISCOVER</h1>
                    <div className="w-12 h-1 bg-[var(--primary-teal)] mx-auto rounded-full mt-1" />
                </div>
                <button className="p-3 bg-white rounded-2xl shadow-sm">
                    <MoreVertical className="w-6 h-6 text-[var(--text-muted)]" />
                </button>
            </header>

            <div className="flex-1 relative px-6 flex items-center justify-center">
                <AnimatePresence>
                    {profiles.length > currentIndex ? (
                        <motion.div
                            key={activeProfile.id}
                            style={{ x, rotate, opacity }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.x > 100) handleSwipe('right')
                                else if (info.offset.x < -100) handleSwipe('left')
                            }}
                            className="absolute w-[calc(100%-48px)] aspect-[3/4] max-h-[600px] cursor-grab active:cursor-grabbing"
                        >
                            <div className="w-full h-full rounded-[48px] overflow-hidden relative shadow-2xl border-4 border-white">
                                {/* Simulated Photo */}
                                <div className="absolute inset-0 premium-gradient" />

                                {/* UI Overlay Icons */}
                                <motion.div style={{ opacity: heartOpacity }} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <div className="p-10 bg-white/20 backdrop-blur-md rounded-full border-4 border-white">
                                        <Heart className="w-20 h-20 text-white fill-white" />
                                    </div>
                                </motion.div>
                                <motion.div style={{ opacity: crossOpacity }} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <div className="p-10 bg-white/20 backdrop-blur-md rounded-full border-4 border-white">
                                        <X className="w-20 h-20 text-white" />
                                    </div>
                                </motion.div>

                                {/* Info Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                                    <div className="flex items-end justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-4xl font-black tracking-tighter uppercase">{activeProfile.full_name}, {activeProfile.age || '24'}</h2>
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                                            </div>
                                            <p className="flex items-center gap-1 text-sm font-bold opacity-70">
                                                <MapPin className="w-4 h-4" /> {activeProfile.gym_name || 'PureGym London'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mb-4">
                                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                                            {activeProfile.fitness_goal || 'STRENGTH'}
                                        </span>
                                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                                            {activeProfile.experience_level || 'ADVANCED'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-900/10">
                                <Users className="w-10 h-10 text-[var(--primary-teal)]" />
                            </div>
                            <h2 className="text-2xl font-black text-[var(--primary-teal)] uppercase tracking-tighter mb-2">YOU'RE ALL SET!</h2>
                            <p className="text-[var(--text-muted)] font-bold text-sm max-w-xs mx-auto mb-8">No more profiles in your area. Try increasing your search radius.</p>
                            <button onClick={() => navigate('/dashboard')} className="btn-primary">BACK TO HUB</button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            {profiles.length > currentIndex && (
                <div className="px-6 py-12 flex items-center justify-center gap-6">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSwipe('left')}
                        className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center text-[var(--text-muted)] shadow-xl hover:shadow-2xl transition-all border border-gray-100"
                    >
                        <X className="w-10 h-10" />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-lg border border-gray-100"
                    >
                        <Info className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSwipe('right')}
                        className="w-20 h-20 premium-gradient rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-teal-900/30 hover:scale-110' transition-all"
                    >
                        <Heart className="w-10 h-10 fill-current" />
                    </motion.button>
                </div>
            )}
        </div>
    )
}
