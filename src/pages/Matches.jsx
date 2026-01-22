import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getMatches } from '../lib/supabase'
import { MessageCircle, Dumbbell } from 'lucide-react'

export default function Matches() {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        loadMatches()
    }, [])

    const loadMatches = async () => {
        const user = await getCurrentUser()
        const { data } = await getMatches(user.id)
        setMatches(data || [])
        setLoading(false)
    }

    const getMatchedUser = (match, currentUserId) => {
        return match.user1_id === currentUserId ? match.user2 : match.user1
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-teal)] border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate('/dashboard')} className="text-[var(--text-muted)]">
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold">Matches</h1>
                    <div className="w-16" />
                </div>

                {matches.length === 0 ? (
                    <div className="text-center py-12">
                        <Dumbbell className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                        <h2 className="text-xl font-bold mb-2">No matches yet</h2>
                        <p className="text-[var(--text-muted)] mb-6">
                            Start swiping to find your gym partners!
                        </p>
                        <button onClick={() => navigate('/swipe')} className="btn-primary">
                            Start Swiping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {matches.map((match) => {
                            const user = getCurrentUser()
                            const matchedUser = getMatchedUser(match, user?.id)

                            return (
                                <button
                                    key={match.id}
                                    onClick={() => navigate(`/chat/${match.id}`)}
                                    className="card w-full flex items-center gap-4 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-teal)] to-[var(--primary-teal-dark)] rounded-full flex items-center justify-center flex-shrink-0">
                                        <Dumbbell className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-lg">{matchedUser?.full_name}</h3>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {matchedUser?.fitness_goal?.replace('_', ' ')} • {matchedUser?.location}
                                        </p>
                                    </div>
                                    <MessageCircle className="w-6 h-6 text-[var(--primary-teal)]" />
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
