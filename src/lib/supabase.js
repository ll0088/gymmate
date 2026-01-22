import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// AUTH HELPERS
// ============================================

export const signUp = async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: userData
        }
    })
    return { data, error }
}

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error }
}

// OAuth Sign In
export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    })
    return { data, error }
}

export const signInWithApple = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    })
    return { data, error }
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// ============================================
// PROFILE HELPERS
// ============================================

export const createProfile = async (profileData) => {
    const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
    return { data, error }
}

export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    return { data, error }
}

export const updateProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
    return { data, error }
}

// ============================================
// SUBSCRIPTION HELPERS
// ============================================

export const getSubscription = async (userId) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()
    return { data, error }
}

export const createSubscription = async (subscriptionData) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()
    return { data, error }
}

export const updateSubscription = async (userId, updates) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('user_id', userId)
        .select()
    return { data, error }
}

// ============================================
// SWIPE HELPERS
// ============================================

export const createSwipe = async (swiperId, swipedId, action) => {
    const { data, error } = await supabase
        .from('swipes')
        .insert([{ swiper_id: swiperId, swiped_id: swipedId, action }])
        .select()
    return { data, error }
}

export const getPotentialMatches = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', userId)
        .eq('is_active', true)
        .limit(10)
    return { data, error }
}

// ============================================
// MATCH HELPERS
// ============================================

export const getMatches = async (userId) => {
    const { data, error } = await supabase
        .from('matches')
        .select(`
      *,
      user1:profiles!matches_user1_id_fkey(*),
      user2:profiles!matches_user2_id_fkey(*)
    `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    return { data, error }
}

// ============================================
// MESSAGE HELPERS
// ============================================

export const sendMessage = async (matchId, senderId, content) => {
    const { data, error } = await supabase
        .from('messages')
        .insert([{ match_id: matchId, sender_id: senderId, content }])
        .select()
    return { data, error }
}

export const getMessages = async (matchId) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })
    return { data, error }
}

export const subscribeToMessages = (matchId, callback) => {
    return supabase
        .channel(`messages:${matchId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `match_id=eq.${matchId}`
        }, callback)
        .subscribe()
}

// ============================================
// FOOD LOG HELPERS
// ============================================

export const createFoodLog = async (foodData) => {
    const { data, error } = await supabase
        .from('food_logs')
        .insert([foodData])
        .select()
    return { data, error }
}

export const getFoodLogs = async (userId, date) => {
    const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('scan_date', date)
        .order('created_at', { ascending: false })
    return { data, error }
}

// ============================================
// PULSE CHAT HELPERS
// ============================================

export const savePulseChat = async (userId, role, content) => {
    const { data, error } = await supabase
        .from('pulse_chats')
        .insert([{ user_id: userId, role, content }])
        .select()
    return { data, error }
}

export const getPulseChatHistory = async (userId, limit = 50) => {
    const { data, error } = await supabase
        .from('pulse_chats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(limit)
    return { data, error }
}
