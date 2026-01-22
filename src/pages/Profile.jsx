import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase, signOut } from '../lib/supabase'
import {
    Settings, Camera, Edit3, LogOut, Award,
    Target, Calendar, DollarSign, ChevronRight,
    ShieldCheck, Smartphone, Bell
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Profile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const user = await getCurrentUser()
        if (!user) {
            navigate('/')
            return
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (data) setProfile(data)
        setLoading(false)
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[var(--primary-teal)] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const isTrainer = profile?.role === 'trainer'

    return (
        <div className="min-h-screen bg-[var(--bg-cream)] pb-32">
            <div className="max-w-md mx-auto">
                {/* Header Profile Section */}
                <div className="relative pt-12 pb-8 px-6 text-center">
                    <button className="absolute top-12 right-6 p-3 bg-white rounded-2xl shadow-sm">
                        <Settings className="w-6 h-6 text-[var(--primary-teal)]" />
                    </button>

                    <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 rounded-[40px] premium-gradient border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                            <span className="text-4xl font-black text-white">
                                {profile?.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <button className="absolute bottom-0 right-0 p-3 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <Camera className="w-5 h-5 text-[var(--primary-teal)]" />
                        </button>
                    </div>

                    <h1 className="text-3xl font-black tracking-tighter text-[var(--primary-teal)] uppercase">
                        {profile?.full_name}
                    </h1>
                    <p className="text-[var(--text-muted)] font-bold text-sm mb-4">
                        {profile?.location || 'London, UK'}
                    </p>

                    <div className="flex justify-center gap-2">
                        <span className="px-4 py-1.5 bg-[var(--primary-teal)] text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                            {isTrainer ? 'PRO TRAINER' : 'ELITE MEMBER'}
                        </span>
                        {isTrainer && (
                            <span className="px-4 py-1.5 bg-yellow-400 text-black rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Award className="w-3 h-3" /> VERIFIED
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="px-6 grid grid-cols-2 gap-4 mb-8">
                    <div className="card text-center py-8">
                        <div className="text-2xl font-black mb-1">{isTrainer ? '4.9' : '15'}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                            {isTrainer ? 'RATING' : 'MATCHES'}
                        </div>
                    </div>
                    <div className="card text-center py-8">
                        <div className="text-2xl font-black mb-1">{isTrainer ? `£${profile?.price_per_hour || '45'}` : '8'}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                            {isTrainer ? 'PER HOUR' : 'SCANS'}
                        </div>
                    </div>
                </div>

                {/* Profile Content sections */}
                <div className="px-6 space-y-4">
                    <section className="card bg-white p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
                                <Edit3 className="w-4 h-4" /> ABOUT ME
                            </h2>
                            <button className="text-[var(--primary-teal)] font-bold text-xs">EDIT</button>
                        </div>
                        <p className="text-sm leading-relaxed font-medium">
                            {profile?.bio || (isTrainer
                                ? "I help people transform their lives through customized training programs tailored to your lifestyle."
                                : "Looking for a serious partner to hit the heavy weights with. Consistency is key!")}
                        </p>
                    </section>

                    {isTrainer && (
                        <section className="card bg-white p-8">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> AVAILABILITY
                            </h2>
                            <div className="grid grid-cols-4 gap-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className={`py-3 rounded-2xl text-center text-xs font-black ${i < 5 ? 'bg-[var(--primary-teal)] text-white' : 'bg-[var(--tag-bg)] text-[var(--text-muted)]'}`}>
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="space-y-3">
                        <button className="w-full bg-white p-6 rounded-[32px] flex items-center justify-between border border-gray-100 group transition-all active:scale-95">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl transition-all">
                                    <Smartphone className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className="font-bold text-sm">Account Settings</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                        </button>

                        <button className="w-full bg-white p-6 rounded-[32px] flex items-center justify-between border border-gray-100 group transition-all active:scale-95">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 rounded-2xl transition-all">
                                    <ShieldCheck className="w-5 h-5 text-purple-500" />
                                </div>
                                <span className="font-bold text-sm">Privacy & Security</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full bg-red-50 p-6 rounded-[32px] flex items-center justify-between border border-red-100 group transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 rounded-2xl transition-all">
                                    <LogOut className="w-5 h-5 text-red-600" />
                                </div>
                                <span className="font-bold text-sm text-red-600">Sign Out</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
