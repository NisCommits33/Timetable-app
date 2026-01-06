import { useState, useEffect } from 'react';

export const useHabits = () => {
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('habits');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
    }, [habits]);

    const addHabit = (habit) => {
        const newHabit = {
            id: Date.now(),
            title: habit.title,
            category: habit.category, // 'health', 'learning', 'productivity', 'mindfulness'
            goal: habit.goal || 1, // times per day
            streak: 0,
            history: {}, // { "2023-10-27": true }
            createdAt: new Date().toISOString()
        };
        setHabits(prev => [newHabit, ...prev]);
    };

    const deleteHabit = (id) => {
        setHabits(prev => prev.filter(h => h.id !== id));
    };

    const toggleHabit = (id, dateStr) => {
        setHabits(prev => prev.map(habit => {
            if (habit.id === id) {
                const newHistory = { ...habit.history };
                const wasCompleted = newHistory[dateStr];

                if (wasCompleted) {
                    delete newHistory[dateStr];
                } else {
                    newHistory[dateStr] = true;
                }

                // Recalculate streak
                let streak = 0;
                const today = new Date();
                // simple streak calculation: count backwards from today/yesterday
                // In a real app, this would be more robust handling gaps allowed etc.
                if (newHistory[dateStr] || newHistory[new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0]]) {
                    // Check consecutive days
                    let d = new Date();
                    while (true) {
                        const dStr = d.toISOString().split('T')[0];
                        if (newHistory[dStr]) {
                            streak++;
                            d.setDate(d.getDate() - 1);
                        } else {
                            // Check if yesterday was missed but today is not yet done (so streak is technically alive but not incremented today)
                            // For simplicity: mostly linear backwards check
                            break;
                        }
                    }
                }

                return { ...habit, history: newHistory, streak: streak };
            }
            return habit;
        }));
    };

    const getTodayHabits = () => {
        return habits;
    };

    return {
        habits,
        addHabit,
        deleteHabit,
        toggleHabit,
        getTodayHabits
    };
};
