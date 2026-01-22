import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase, signOut, updateProfile } from '../lib/supabase'
import {
    Settings, Camera, Edit3, LogOut, Award,
    Target, Calendar, DollarSign, ChevronRight,
    ShieldCheck, Smartphone, Bell, Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Profile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)
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

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const user = await getCurrentUser()
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update profile with new avatar_url
            const { error: updateError } = await updateProfile(user.id, {
                avatar_url: publicUrl
            })

            if (updateError) throw updateError

            setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
            alert('Profile picture updated!')
        } catch (error) {
            console.error('Upload Error:', error)
            alert('Upload failed. Ensure you have created the "avatars" bucket in Supabase.')
        } finally {
            setUploading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-cream)]">
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
                    <div className="absolute top-10 left-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                            <span className="text-sm font-bold text-[var(--primary-teal)] tracking-tight">Back</span>
                        </button>
                    </div>
                    <button className="absolute top-10 right-6 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95">
                        <Settings className="w-6 h-6 text-[var(--primary-teal)]" />
                    </button>

                    <div className="relative inline-block mb-6 mt-6">
                        <div className="w-32 h-32 rounded-[40px] bg-white border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center relative group">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <div className="w-full h-full premium-gradient flex items-center justify-center text-4xl font-black text-white">
                                    {profile?.full_name?.charAt(0) || 'U'}
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 active:scale-90 transition-all"
                        >
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
                        <div className="text-2xl font-black mb-1">
                            {isTrainer ? `£${profile?.price_per_hour || '45'}` : (profile?.calorie_scans_today || '8')}
                        </div>
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

                        {/* Developer Tools */}
                        <div className="pt-8 opacity-40">
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-center mb-4">DEVELOPER TOOLS</p>
                            <button
                                onClick={async () => {
                                    const { seedDatabase } = await import('../seed')
                                    await seedDatabase()
                                    alert('Marketplace Seeded! Refresh to see new profiles.')
                                }}
                                className="w-full border-2 border-dashed border-gray-300 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[var(--primary-teal)] hover:text-[var(--primary-teal)] transition-all"
                            >
                                Seed Mock Profiles
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
