import { supabase } from './lib/supabase'

const MOCK_PROFILES = [
    {
        full_name: 'Alex Rivera',
        age: 26,
        role: 'user',
        fitness_goal: 'Strength',
        experience_level: 'Advanced',
        gym_name: 'PureGym London Central',
        bio: 'Powerlifting enthusiast. Looking for a spotter for heavy squat days. Usually train 6pm weekdays.',
        avatar_url: 'https://i.pravatar.cc/150?u=alex'
    },
    {
        full_name: 'Sarah Chen',
        age: 24,
        role: 'user',
        fitness_goal: 'Bodyweight',
        experience_level: 'Intermediate',
        gym_name: 'Gymbox Farringdon',
        bio: 'Calisthenics addict. Working on my muscle-ups. Let\'s push together!',
        avatar_url: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
        full_name: 'Marcus Thorne',
        age: 32,
        role: 'trainer',
        specialties: 'Hypertrophy, Fat Loss',
        price_per_hour: 55,
        gym_name: 'Third Space Soho',
        bio: 'Certified PT with 10 years experience. Transform your physique with science-based training.',
        rating: 4.9,
        avatar_url: 'https://i.pravatar.cc/150?u=marcus'
    },
    {
        full_name: 'Elena Kostic',
        age: 29,
        role: 'trainer',
        specialties: 'Yoga, Mobility, Rehab',
        price_per_hour: 45,
        gym_name: 'Virgin Active',
        bio: 'Focusing on mindful movement and recovery. Let\'s fix your posture and core strength.',
        rating: 4.8,
        avatar_url: 'https://i.pravatar.cc/150?u=elena'
    },
    {
        full_name: 'James Wilson',
        age: 28,
        role: 'user',
        fitness_goal: 'Endurance',
        experience_level: 'Beginner',
        gym_name: 'JD Gyms',
        bio: 'Just started my fitness journey. Looking for someone to keep me accountable and motivated.',
        avatar_url: 'https://i.pravatar.cc/150?u=james'
    }
]

export const seedDatabase = async () => {
    console.log('Seeding Database...')
    for (const profile of MOCK_PROFILES) {
        // In a real app, we'd create auth users first. This is for demonstration.
        // We'll use random UUIDs for the profile IDs.
        const id = crypto.randomUUID()
        const { error } = await supabase
            .from('profiles')
            .upsert({ id, ...profile, updated_at: new Date().toISOString() })

        if (error) console.error('Error seeding profile:', error)
    }
    console.log('Seeding Complete!')
}
