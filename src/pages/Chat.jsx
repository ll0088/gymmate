import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, getCurrentUser } from '../lib/supabase'
import { Send, ArrowLeft, Phone, Video, MoreHorizontal, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Chat() {
    const { matchId } = useParams()
    const [match, setMatch] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchChatData()
        const subscription = subscribeToMessages()
        return () => {
            subscription.unsubscribe()
        }
    }, [matchId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchChatData = async () => {
        const user = await getCurrentUser()
        setCurrentUser(user)

        // Fetch match and other user's info
        const { data: matchData } = await supabase
            .from('matches')
            .select('*, profile1:profiles!profile1_id(*), profile2:profiles!profile2_id(*)')
            .eq('id', matchId)
            .single()

        if (matchData) {
            const otherUser = matchData.profile1_id === user.id ? matchData.profile2 : matchData.profile1
            setMatch({ ...matchData, otherUser })
        }

        // Fetch messages
        const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('match_id', matchId)
            .order('created_at', { ascending: true })

        if (messagesData) setMessages(messagesData)
    }

    const subscribeToMessages = () => {
        return supabase
            .channel(`chat:${matchId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `match_id=eq.${matchId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new])
            })
            .subscribe()
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const message = {
            match_id: matchId,
            sender_id: currentUser.id,
            content: newMessage,
        }

        const { error } = await supabase.from('messages').insert([message])
        if (!error) setNewMessage('')
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (!match) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-cream)]">
            <div className="w-10 h-10 border-4 border-[var(--primary-teal)] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[var(--bg-cream)] flex flex-col h-screen overflow-hidden">
            {/* Premium Header */}
            <header className="px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-white/20 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/matches')} className="p-2 -ml-2 text-[var(--primary-teal)]">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white font-black">
                            {match.otherUser.full_name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="font-black text-[var(--primary-teal)] leading-none uppercase tracking-tighter">{match.otherUser.full_name}</h1>
                            <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Online Now</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-3 bg-[var(--tag-bg)] rounded-xl text-[var(--primary-teal)]">
                        <Phone className="w-5 h-5 fill-current" />
                    </button>
                    <button className="p-3 bg-[var(--tag-bg)] rounded-xl text-[var(--primary-teal)]">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === currentUser.id
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                max-w-[75%] p-4 rounded-3xl text-sm font-semibold shadow-sm
                ${isMe
                                    ? 'bg-[var(--primary-teal)] text-white rounded-tr-none'
                                    : 'bg-white text-[var(--text-dark)] rounded-tl-none border border-white/50'}
              `}>
                                {msg.content}
                                <div className={`text-[8px] mt-1 font-black uppercase tracking-widest opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Modern Input */}
            <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-white/20 pb-10">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Send a message..."
                            className="w-full bg-[var(--tag-bg)] border-none rounded-2xl py-4 pl-6 pr-14 text-sm font-semibold focus:ring-2 focus:ring-[var(--primary-teal)]"
                        />
                        <button className="absolute right-3 top-2 p-2 text-[var(--text-muted)] hover:text-[var(--primary-teal)]">
                            <User className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="p-4 premium-gradient text-white rounded-2xl shadow-lg active:scale-95 transition-all"
                    >
                        <Send className="w-5 h-5 fill-current" />
                    </button>
                </form>
            </div>
        </div>
    )
}
