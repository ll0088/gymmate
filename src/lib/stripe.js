// Stripe Integration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Price IDs (set these in Stripe Dashboard)
export const PRICE_IDS = {
    PRO_MONTHLY: import.meta.env.VITE_STRIPE_PRO_PRICE_ID, // £6.99
    ELITE_MONTHLY: import.meta.env.VITE_STRIPE_ELITE_PRICE_ID, // £9.99
}

// ============================================
// STRIPE CHECKOUT
// ============================================

export const createCheckoutSession = async (priceId, userId) => {
    try {
        // This would typically call your backend API
        // For now, we'll use Supabase Edge Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                priceId,
                userId,
                successUrl: `${window.location.origin}/subscription/success`,
                cancelUrl: `${window.location.origin}/subscription`
            })
        })

        const { sessionId, error } = await response.json()

        if (error) throw new Error(error)

        // Redirect to Stripe Checkout
        const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY)
        await stripe.redirectToCheckout({ sessionId })

        return { error: null }
    } catch (error) {
        console.error('Checkout Error:', error)
        return { error: error.message }
    }
}

// ============================================
// BILLING PORTAL
// ============================================

export const createPortalSession = async (customerId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                customerId,
                returnUrl: `${window.location.origin}/subscription`
            })
        })

        const { url, error } = await response.json()

        if (error) throw new Error(error)

        window.location.href = url

        return { error: null }
    } catch (error) {
        console.error('Portal Error:', error)
        return { error: error.message }
    }
}

// ============================================
// SUBSCRIPTION PLANS
// ============================================

export const PLANS = [
    {
        name: 'Free',
        price: '£0',
        priceId: null,
        features: [
            'Limited swipes per day',
            'Basic matching',
            'Limited AI chats',
            'Basic calorie tracking'
        ]
    },
    {
        name: 'Pro',
        price: '£6.99',
        period: '/month',
        priceId: PRICE_IDS.PRO_MONTHLY,
        features: [
            'Unlimited swipes',
            'Priority matching',
            'Unlimited AI chats',
            'Unlimited calorie scans',
            'Trainer chat access'
        ],
        popular: true
    },
    {
        name: 'Elite',
        price: '£9.99',
        period: '/month',
        priceId: PRICE_IDS.ELITE_MONTHLY,
        features: [
            'Everything in Pro',
            'Profile boost',
            'Advanced filters',
            'Exclusive partner discounts',
            'Priority support'
        ]
    }
]

// ============================================
// FEATURE GATING
// ============================================

export const canAccessFeature = (subscription, feature) => {
    const tier = subscription?.plan || 'free'

    const features = {
        unlimited_swipes: ['pro', 'elite'],
        unlimited_ai: ['pro', 'elite'],
        unlimited_scans: ['pro', 'elite'],
        trainer_chat: ['pro', 'elite'],
        profile_boost: ['elite'],
        advanced_filters: ['elite']
    }

    return features[feature]?.includes(tier) || false
}

export const getFeatureLimit = (subscription, feature) => {
    const tier = subscription?.plan || 'free'

    const limits = {
        free: {
            swipes_per_day: 10,
            ai_chats_per_day: 5,
            scans_per_day: 3
        },
        pro: {
            swipes_per_day: -1, // unlimited
            ai_chats_per_day: -1,
            scans_per_day: -1
        },
        elite: {
            swipes_per_day: -1,
            ai_chats_per_day: -1,
            scans_per_day: -1
        }
    }

    return limits[tier]?.[feature] || 0
}
