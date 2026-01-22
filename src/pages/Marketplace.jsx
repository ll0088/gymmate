import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import { Search, MapPin, Star, Filter, MessageCircle, ChevronRight, Briefcase } from 'lucide-react'

export default function Marketplace() {
    const [trainers, setTrainers] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchTrainers()
    }, [])

    const fetchTrainers = async () => {
        // Fetch profiles where role is trainer
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'trainer')
            .limit(20)

        if (data) setTrainers(data)
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-teal)] border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 bg-[var(--bg-cream)]">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate('/dashboard')} className="text-[var(--text-muted)]">
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Briefcase className="text-[var(--primary-teal)]" />
                        Trainer Marketplace
                    </h1>
                    <div className="w-8" />
                </header>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-4 text-[var(--text-muted)] w-5 h-5" />
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white shadow-sm border-none focus:ring-2 focus:ring-[var(--primary-teal)] text-sm"
                        placeholder="Search by specialty, location, or name..."
                    />
                    <button className="absolute right-4 top-3 p-2 bg-[var(--tag-bg)] rounded-xl">
                        <Filter className="w-4 h-4 text-[var(--primary-teal)]" />
                    </button>
                </div>

                {/* Trainers List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trainers.length === 0 ? (
                        <div className="col-span-full py-20 text-center card bg-white">
                            <p className="text-[var(--text-muted)]">No trainers found yet. Check back soon!</p>
                        </div>
                    ) : (
                        trainers.map((trainer) => (
                            <div key={trainer.id} className="profile-card group hover:shadow-2xl transition-all cursor-pointer">
                                <div className="h-48 bg-gradient-to-br from-[var(--primary-teal)] to-[var(--primary-teal-dark)] relative">
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                                        £{trainer.price_per_hour || '45'}/hr
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold">{trainer.full_name}</h3>
                                            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {trainer.location || 'London'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-bold">4.9</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-[var(--text-dark)] line-clamp-2 mb-4">
                                        {trainer.bio || "Transforming bodies and mindsets through customized training programs tailored to your lifestyle."}
                                    </p>

                                    <div className="flex gap-2 mb-6">
                                        <span className="px-3 py-1 bg-[var(--tag-bg)] rounded-full text-[10px] font-bold uppercase tracking-wider">Strength</span>
                                        <span className="px-3 py-1 bg-[var(--tag-bg)] rounded-full text-[10px] font-bold uppercase tracking-wider">Nutrition</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="btn-primary flex-1 text-xs py-2 shadow-sm">
                                            View Profile
                                        </button>
                                        <button className="p-2 border-2 border-[var(--primary-teal)] text-[var(--primary-teal)] rounded-xl hover:bg-[#f1f8f7]">
                                            <MessageCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
