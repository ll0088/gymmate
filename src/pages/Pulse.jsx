import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Send, Image as ImageIcon, X, Camera } from 'lucide-react'
import { getGeminiStream, analyzeImage } from '../lib/gemini'

export default function Pulse() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hey! I'm Pulse, your AI fitness assistant. I can help you with workout plans, nutrition advice, and motivation. What can I help you with today?"
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

        // Create a placeholder for the assistant's response
        const assistantMessage = { role: 'assistant', content: '' }
        setMessages(prev => [...prev, assistantMessage])

        try {
            if (currentImage) {
                const prompt = userContent || "Analyze this image and tell me what you see related to fitness or nutrition."
                const result = await analyzeImage(currentImage, prompt)
                setMessages(prev => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1].content = result
                    return newMessages
                })
            } else {
                let fullResponse = ""
                await getGeminiStream([...messages, userMessage], (chunk) => {
                    fullResponse += chunk
                    setMessages(prev => {
                        const newMessages = [...prev]
                        newMessages[newMessages.length - 1].content = fullResponse
                        return newMessages
                    })
                })
            }
        } catch (error) {
            console.error("Pulse Error:", error)
            setMessages(prev => {
                const newMessages = [...prev]
                newMessages[newMessages.length - 1].content = "Sorry, I encountered an error. Please check your API key and try again."
                return newMessages
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen flex flex-col bg-[var(--bg-cream)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--primary-teal)] to-[var(--primary-teal-dark)] text-white p-4 shadow-lg z-10">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard')} className="text-white/80 hover:text-white transition-colors">
                        ← Back
                    </button>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Pulse AI</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-white/80">Online fitness coach</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                <div className="max-w-2xl mx-auto space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${message.role === 'user'
                                    ? 'bg-[var(--primary-teal)] text-white rounded-br-sm'
                                    : 'bg-white text-[var(--text-dark)] rounded-bl-sm border border-teal-50'
                                    }`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-[var(--primary-teal)]" />
                                        <span className="text-xs font-bold text-[var(--primary-teal)] uppercase tracking-wider">
                                            Pulse
                                        </span>
                                    </div>
                                )}
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Uploaded"
                                        className="w-full max-w-[200px] h-auto rounded-lg mb-2 border border-white/20 shadow-sm"
                                    />
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap text-[15px]">
                                    {message.content || (loading && index === messages.length - 1 ? "..." : "")}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Overlay for Image Preview */}
            {imagePreview && (
                <div className="max-w-2xl mx-auto w-full px-4 mb-2">
                    <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-[var(--primary-teal)] shadow-md" />
                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="bg-white border-t border-gray-100 p-4 pb-8 md:pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-[var(--text-muted)] hover:text-[var(--primary-teal)] hover:bg-teal-50 rounded-full transition-all"
                    >
                        <ImageIcon className="w-6 h-6" />
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Pulse anything..."
                            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[var(--primary-teal)]/20 text-[15px] transition-all"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={(!input.trim() && !selectedImage) || loading}
                            className={`absolute right-2 top-1.5 p-2 rounded-xl transition-all ${(!input.trim() && !selectedImage) || loading
                                ? 'text-gray-300'
                                : 'text-[var(--primary-teal)] hover:bg-teal-50'
                                }`}
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                </form>
                <p className="text-[10px] text-center text-[var(--text-muted)] mt-3 font-medium uppercase tracking-[0.05em]">
                    Pulse Proprietary Intelligence • Premium Access
                </p>
            </div>
        </div>
    )
}
