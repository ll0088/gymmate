import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Send, Image as ImageIcon, X, ChevronLeft, Zap, Target, Trophy } from 'lucide-react'
import { getGeminiStream, analyzeImage } from '../lib/gemini'
import { motion, AnimatePresence } from 'framer-motion'

export default function Pulse() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hey there! I'm Pulse, your elite performance coach. Whether you're looking to shatter personal records, optimize your macros, or perfect your form—I've got the data and the drive to get you there. What's our objective today?"
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const navigate = useNavigate()
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleImageSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim() && !selectedImage) return

        const userContent = input.trim()
        const currentImage = selectedImage

        const userMessage = {
            role: 'user',
            content: userContent,
            image: imagePreview
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        removeImage()
        setLoading(true)

        const assistantMessageIdx = messages.length + 1
        setMessages(prev => [...prev, { role: 'assistant', content: '', thinking: true }])

        try {
            if (currentImage) {
                const prompt = userContent || "Analyze this image for fitness, nutrition, or equipment insights. Be precise."
                const result = await analyzeImage(currentImage, prompt)
                setMessages(prev => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1].content = result
                    newMessages[newMessages.length - 1].thinking = false
                    return newMessages
                })
            } else {
                let fullResponse = ""
                await getGeminiStream([...messages, userMessage], (chunk) => {
                    fullResponse += chunk
                    setMessages(prev => {
                        const newMessages = [...prev]
                        newMessages[newMessages.length - 1].content = fullResponse
                        newMessages[newMessages.length - 1].thinking = false
                        return newMessages
                    })
                })
            }
        } catch (error) {
            console.error("Pulse Error:", error)
            setMessages(prev => {
                const newMessages = [...prev]
                newMessages[newMessages.length - 1].content = "Elite connectivity lost. Please recalibrate (check API/Network) and try again."
                newMessages[newMessages.length - 1].thinking = false
                return newMessages
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-[var(--bg-cream)] flex flex-col z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Immersive Header */}
            <header className="premium-gradient p-6 pt-12 pb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-32 h-32 text-white" />
                </div>

                <div className="max-w-3xl mx-auto flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner relative">
                            <Zap className="w-8 h-8 text-[var(--primary-teal)] fill-current" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Pulse AI</h2>
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-1">ELITE PERFORMANCE COACH</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Actions Bar */}
            <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar bg-white/50 border-b border-gray-100">
                {[
                    { label: 'Workout Plan', icon: Target },
                    { label: 'Nutrition Prep', icon: Zap },
                    { label: 'Form Analysis', icon: Trophy }
                ].map((action, i) => (
                    <button key={i} className="flex-shrink-0 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 flex items-center gap-2 shadow-sm active:scale-95 transition-all">
                        <action.icon className="w-4 h-4 text-[var(--primary-teal)]" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--primary-teal)]">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Immersive Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-[var(--bg-cream)] pb-32">
                <AnimatePresence mode="popLayout">
                    {messages.map((message, index) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] relative ${message.role === 'user' ? 'order-2' : ''}`}>
                                <div className={`px-6 py-4 rounded-[32px] shadow-xl ${message.role === 'user'
                                        ? 'bg-[var(--primary-teal)] text-white rounded-tr-sm shadow-teal-900/10'
                                        : 'bg-white text-[var(--text-dark)] rounded-tl-sm border border-white'
                                    }`}>
                                    {message.image && (
                                        <div className="mb-4 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
                                            <img src={message.image} alt="Input" className="w-full h-auto" />
                                        </div>
                                    )}
                                    <div className="leading-relaxed whitespace-pre-wrap text-[15px] font-semibold">
                                        {message.thinking ? (
                                            <div className="flex gap-1 py-1">
                                                <div className="w-2 h-2 bg-[var(--primary-teal)] rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-[var(--primary-teal)] rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-2 h-2 bg-[var(--primary-teal)] rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        ) : message.content}
                                    </div>
                                    <div className={`text-[8px] mt-2 font-black uppercase tracking-widest opacity-40 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {message.role === 'user' ? 'Confirmed' : 'Pulse Proprietary Intelligence'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Fixed Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg-cream)] via-[var(--bg-cream)] to-transparent pb-10">
                <form
                    onSubmit={handleSend}
                    className="max-w-3xl mx-auto bg-white rounded-[32px] p-2 flex items-center shadow-2xl shadow-teal-900/10 border border-white"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary-teal)] transition-colors"
                    >
                        <ImageIcon className="w-6 h-6" />
                    </motion.button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Define your objective..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] font-semibold px-2 py-3"
                        disabled={loading}
                    />

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        disabled={(!input.trim() && !selectedImage) || loading}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${(!input.trim() && !selectedImage) || loading
                                ? 'bg-gray-100 text-gray-300'
                                : 'premium-gradient text-white shadow-lg'
                            }`}
                    >
                        <Send className="w-5 h-5 fill-current" />
                    </motion.button>
                </form>

                {imagePreview && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-28 left-8"
                    >
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-2xl border-4 border-white shadow-2xl" />
                            <button
                                onClick={removeImage}
                                className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-75 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
