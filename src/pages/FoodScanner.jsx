import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, RefreshCw, Zap, Save, X, Utensils } from 'lucide-react'
import { scanFoodImage, imageToBase64 } from '../lib/gemini'
import { createFoodLog, getCurrentUser } from '../lib/supabase'

export default function FoodScanner() {
    const [image, setImage] = useState(null)
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    const handleCapture = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setImage(URL.createObjectURL(file))
        setLoading(true)
        setAnalysis(null)

        try {
            const base64Image = await imageToBase64(file)
            const { data, error: aiError } = await scanFoodImage(base64Image)

            if (aiError) throw new Error(aiError)
            setAnalysis(data)
        } catch (err) {
            console.error('Scan Error:', err)
            setImage(null)
            setAnalysis(null)
            alert(err.message || "Elite analysis failed. Please ensure the lighting is good.")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const user = await getCurrentUser()
            await createFoodLog({
                user_id: user.id,
                food_name: analysis.food_name,
                calories: analysis.calories,
                protein: analysis.protein,
                carbs: analysis.carbs,
                fats: analysis.fats,
                scan_date: new Date().toISOString().split('T')[0]
            })
            navigate('/dashboard')
        } catch (err) {
            console.error('Save Error:', err)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <header className="p-4 flex items-center justify-between z-10">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full blur-backdrop">
                    <X className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="text-yellow-400 fill-yellow-400" />
                    AI Scanner
                </h1>
                <div className="w-10" />
            </header>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {image ? (
                    <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Captured food" />
                ) : (
                    <div className="text-center p-8">
                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Utensils className="w-10 h-10 text-white/40" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Scan Your Meal</h2>
                        <p className="text-white/60 mb-8">Take a photo to automatically track calories and macros.</p>
                    </div>
                )}

                {/* Scan Overlay UI */}
                {loading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div className="w-16 h-16 border-4 border-[var(--primary-teal)] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-bold text-[var(--primary-teal)] animate-pulse">PULSE AI ANALYZING...</p>
                    </div>
                )}

                {analysis && !loading && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white rounded-t-[40px] text-black animate-in slide-in-from-bottom duration-500 z-30 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-3xl font-black text-[var(--primary-teal)] tracking-tighter uppercase leading-none">{analysis.food_name}</h3>
                                <p className="text-[var(--text-muted)] font-bold text-sm">CALORIE BREAKDOWN</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-black text-black">{analysis.calories}</span>
                                <span className="text-xs font-bold block opacity-40">KCAL</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-[var(--tag-bg)] p-4 rounded-3xl text-center">
                                <span className="block text-xl font-black">{analysis.protein}g</span>
                                <span className="text-[10px] font-black uppercase opacity-40">Protein</span>
                            </div>
                            <div className="bg-[var(--tag-bg)] p-4 rounded-3xl text-center">
                                <span className="block text-xl font-black">{analysis.carbs}g</span>
                                <span className="text-[10px] font-black uppercase opacity-40">Carbs</span>
                            </div>
                            <div className="bg-[var(--tag-bg)] p-4 rounded-3xl text-center">
                                <span className="block text-xl font-black">{analysis.fats}g</span>
                                <span className="text-[10px] font-black uppercase opacity-40">Fats</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setImage(null) || setAnalysis(null)}
                                className="btn-secondary flex-1 py-4 flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> Retake
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 shadow-xl"
                            >
                                <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Log'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {!image && !loading && (
                <div className="p-8 pb-12">
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={fileInputRef}
                        onChange={handleCapture}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="w-full bg-[var(--primary-teal)] h-20 rounded-[40px] flex items-center justify-center gap-4 text-xl font-black tracking-tighter shadow-2xl shadow-teal-900/40 active:scale-95 transition-all"
                    >
                        <Camera className="w-8 h-8" />
                        OPEN CAMERA
                    </button>
                </div>
            )}
        </div>
    )
}
