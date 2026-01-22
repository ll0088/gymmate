import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, createProfile, updateProfile } from '../lib/supabase'
import { Camera, ArrowRight, Award, DollarSign, Briefcase } from 'lucide-react'

const GOALS = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '📉' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'strength', label: 'Strength', icon: '🏋️' },
    { value: 'cardio', label: 'Cardio', icon: '🏃' },
]

const EXPERIENCE = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
]

export default function Onboarding() {
    const [step, setStep] = useState(1)
    const [role, setRole] = useState('user')
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        gender: 'prefer_not_to_say',
        location: '',
        gym_name: '',
        bio: '',
        fitness_goal: 'strength',
        experience_level: 'intermediate',
        workout_frequency: '3-4',
        specialties: [],
        price_per_hour: '',
        certification_url: '',
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserRole = async () => {
            const user = await getCurrentUser()
            if (user?.user_metadata?.role) {
                setRole(user.user_metadata.role)
            }
        }
        fetchUserRole()
    }, [])

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const user = await getCurrentUser()
            const profileData = {
                id: user.id,
                role: role,
                full_name: formData.full_name,
                age: parseInt(formData.age),
                gender: formData.gender,
                location: formData.location,
                gym_name: formData.gym_name,
                bio: formData.bio,
            }

            if (role === 'user') {
                Object.assign(profileData, {
                    fitness_goal: formData.fitness_goal,
                    experience_level: formData.experience_level,
                    workout_frequency: formData.workout_frequency,
                })
            }

            await createProfile(profileData)

            if (role === 'trainer') {
                // Create trainer specific entry if needed or update profile
                await updateProfile(user.id, {
                    is_trainer: true,
                    price_per_hour: parseFloat(formData.price_per_hour) || 0,
                })
            }

            navigate('/dashboard')
        } catch (error) {
            console.error('Error creating profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const progress = (step / 3) * 100

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <div className="h-2 bg-[var(--tag-bg)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--primary-teal)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-2">Step {step} of 3</p>
                </div>

                <div className="card shadow-2xl border border-gray-100">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <h2 className="text-3xl font-bold mb-2">Basic Info</h2>
                            <p className="text-[var(--text-muted)] mb-6">Let's start with the basics.</p>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="input-field"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="input-field"
                                        placeholder="25"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-field"
                                    placeholder="London, UK"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            <h2 className="text-3xl font-bold mb-2">
                                {role === 'trainer' ? 'Your Expertise' : 'Your Fitness Profile'}
                            </h2>

                            {role === 'user' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        {GOALS.map((goal) => (
                                            <button
                                                key={goal.value}
                                                onClick={() => setFormData({ ...formData, fitness_goal: goal.value })}
                                                className={`p-4 rounded-xl border-2 transition-all text-center ${formData.fitness_goal === goal.value
                                                        ? 'border-[var(--primary-teal)] bg-[#f1f8f7]'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                            >
                                                <div className="text-3xl mb-2">{goal.icon}</div>
                                                <div className="font-bold text-sm text-[var(--primary-teal)]">{goal.label}</div>
                                            </button>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-3">Experience Level</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {EXPERIENCE.map((exp) => (
                                                <button
                                                    key={exp.value}
                                                    onClick={() => setFormData({ ...formData, experience_level: exp.value })}
                                                    className={`p-2 rounded-lg border-2 transition-all text-center text-xs font-bold ${formData.experience_level === exp.value
                                                            ? 'border-[var(--primary-teal)] bg-[var(--primary-teal)] text-white'
                                                            : 'border-gray-200 text-[var(--text-muted)] hover:border-gray-300'
                                                        }`}
                                                >
                                                    {exp.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Specialties</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="High Intensity, Yoga, Strength Training..."
                                            onChange={(e) => setFormData({ ...formData, gym_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Rate (£/Hour)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                                            <input
                                                type="number"
                                                value={formData.price_per_hour}
                                                onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                                                className="input-field pl-10"
                                                placeholder="35"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-[var(--tag-bg)] rounded-xl flex items-center gap-3">
                                        <Award className="w-8 h-8 text-[var(--primary-teal)]" />
                                        <div className="text-xs">
                                            <p className="font-bold">Verified Training</p>
                                            <p className="text-[var(--text-muted)]">Upload your certs to get the verify badge.</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-500">
                            <h2 className="text-3xl font-bold mb-2">Professional Profile</h2>
                            <p className="text-[var(--text-muted)] mb-6">Tell us more about yourself.</p>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="input-field min-h-[120px] resize-none"
                                    placeholder={role === 'trainer' ? "I help people transform their lives through..." : "I'm looking for a partner to push me..."}
                                />
                            </div>

                            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-[var(--primary-teal)] transition-colors cursor-pointer group">
                                <Camera className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] group-hover:text-[var(--primary-teal)]" />
                                <p className="text-sm font-bold group-hover:text-[var(--primary-teal)]">
                                    Add Profile Photo
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">Upload a clear photo of yourself</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-8">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="btn-secondary flex-1"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (step < 3) {
                                    setStep(step + 1)
                                } else {
                                    handleSubmit()
                                }
                            }}
                            disabled={loading}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating Profile...' : step === 3 ? 'Complete' : 'Continue'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
