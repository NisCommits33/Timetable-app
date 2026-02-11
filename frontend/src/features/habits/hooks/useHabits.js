import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../providers/AuthProvider';

const STORAGE_KEY = 'timetable-habits';

export const useHabits = () => {
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFirstRender = useRef(true);

    // Initial load: from Supabase if logged in, otherwise localStorage
    useEffect(() => {
        const loadHabits = async () => {
            setLoading(true);
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('habits')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    if (data && data.length > 0) {
                        setHabits(data.map(h => ({
                            ...h,
                            title: h.name,
                            history: h.frequency?.history || {},
                            goal: h.frequency?.goal || 1,
                            category: h.description,
                        })));
                    } else {
                        // Migration from local
                        const saved = localStorage.getItem(STORAGE_KEY);
                        const localHabits = saved ? JSON.parse(saved) : [];
                        if (localHabits.length > 0) {
                            const habitsToPush = localHabits.map(h => ({
                                id: crypto.randomUUID(),
                                user_id: user.id,
                                name: h.title,
                                description: h.category,
                                frequency: { goal: h.goal, history: h.history },
                                streak: h.streak,
                                created_at: h.createdAt || new Date().toISOString()
                            }));

                            const { error: pushError } = await supabase
                                .from('habits')
                                .insert(habitsToPush);

                            if (pushError) console.error('Habit migration error:', pushError);
                            setHabits(habitsToPush.map(h => ({ ...h, title: h.name })));
                        }
                    }
                } catch (err) {
                    console.error('Error loading habits:', err);
                }
            } else {
                const saved = localStorage.getItem(STORAGE_KEY);
                setHabits(saved ? JSON.parse(saved) : []);
            }
            setLoading(false);
        };

        loadHabits();
    }, [user]);

    // Real-time subscription
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`habits_user_${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'habits',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setHabits(prev => {
                        if (prev.find(h => h.id === payload.new.id)) return prev;
                        return [{ ...payload.new, title: payload.new.name }, ...prev];
                    });
                } else if (payload.eventType === 'UPDATE') {
                    setHabits(prev => prev.map(h => h.id === payload.new.id ? { ...payload.new, title: payload.new.name } : h));
                } else if (payload.eventType === 'DELETE') {
                    setHabits(prev => prev.filter(h => h.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [user]);

    // Local fallback
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }, [habits]);

    const addHabit = async (habit) => {
        const habitId = crypto.randomUUID();
        const newHabitData = {
            id: habitId,
            title: habit.title,
            category: habit.category,
            goal: habit.goal || 1,
            streak: 0,
            history: {},
            createdAt: new Date().toISOString()
        };

        if (user) {
            try {
                const { data, error } = await supabase
                    .from('habits')
                    .insert([{
                        id: habitId,
                        user_id: user.id,
                        name: habit.title,
                        description: habit.category,
                        frequency: { goal: habit.goal || 1, history: {} },
                        streak: 0,
                    }])
                    .select()
                    .single();

                if (error) throw error;
                const flattened = {
                    ...data,
                    title: data.name,
                    history: data.frequency?.history || {},
                    goal: data.frequency?.goal || 1,
                    category: data.description,
                };
                setHabits(prev => [flattened, ...prev]);
            } catch (err) {
                console.error('Supabase addHabit error:', err);
            }
        } else {
            setHabits(prev => [newHabitData, ...prev]);
        }
    };

    const deleteHabit = async (id) => {
        if (user && typeof id === 'string' && id.includes('-')) {
            try {
                await supabase.from('habits').delete().eq('id', id);
                setHabits(prev => prev.filter(h => h.id !== id));
            } catch (err) {
                console.error('Supabase deleteHabit error:', err);
            }
        } else {
            setHabits(prev => prev.filter(h => h.id !== id));
        }
    };

    const toggleHabit = async (id, dateStr) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        // Code logic for history/streak
        const currentHistory = habit.frequency?.history || habit.history || {};
        const newHistory = { ...currentHistory };
        const wasCompleted = newHistory[dateStr];

        if (wasCompleted) {
            delete newHistory[dateStr];
        } else {
            newHistory[dateStr] = true;
        }

        // Recalculate streak (simplified)
        let streak = 0;
        let d = new Date();
        while (true) {
            const dStr = d.toISOString().split('T')[0];
            if (newHistory[dStr]) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else if (dStr === new Date().toISOString().split('T')[0]) {
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
        }

        if (user && typeof id === 'string' && id.includes('-')) {
            try {
                const { data, error } = await supabase
                    .from('habits')
                    .update({
                        frequency: { ...habit.frequency, history: newHistory },
                        streak: streak,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;
                const flattened = {
                    ...data,
                    title: data.name,
                    history: data.frequency?.history || {},
                    goal: data.frequency?.goal || 1,
                    category: data.description,
                };
                setHabits(prev => prev.map(h => h.id === id ? flattened : h));
            } catch (err) {
                console.error('Supabase toggleHabit error:', err);
            }
        } else {
            setHabits(prev => prev.map(h => h.id === id ? { ...h, history: newHistory, streak } : h));
        }
    };

    return {
        habits,
        loading,
        addHabit,
        deleteHabit,
        toggleHabit,
    };
};
