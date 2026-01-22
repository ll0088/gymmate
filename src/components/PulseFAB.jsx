import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PulseFAB() {
    const navigate = useNavigate()

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/pulse')}
            className="pulse-fab"
        >
            <div className="relative">
                <Sparkles className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[var(--primary-teal)] animate-pulse" />
            </div>
        </motion.button>
    )
}
