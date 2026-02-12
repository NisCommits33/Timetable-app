import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Save, LogOut, Camera, Bell, Moon } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useSnackbar } from '../providers/SnackbarProvider';

const ProfilePage = () => {
    const { user, signOut, updateProfile } = useAuth();
    const { success, error } = useSnackbar();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.user_metadata?.full_name || '',
        avatar_url: user?.user_metadata?.avatar_url || '',
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({
                full_name: formData.full_name,
            });
            success('Profile updated successfully! ✨');
            setIsEditing(false);
        } catch (err) {
            error(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const joinDate = new Date(user?.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Profile Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden"
            >
                <div className="h-32 bg-gradient-to-r from-brand-600 to-purple-600 relative">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                </div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex items-end justify-between">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl bg-white dark:bg-surface-800 p-1 shadow-2xl relative overflow-hidden">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-[22px]" />
                                ) : (
                                    <div className="w-full h-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center rounded-[22px]">
                                        <User size={48} className="text-surface-400" />
                                    </div>
                                )}
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 rounded-xl bg-brand-500 text-white shadow-lg hover:bg-brand-600 transition-colors">
                                <Camera size={16} />
                            </button>
                        </div>

                        <div className="flex gap-3 mb-2">
                            {isEditing ? (
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                    className="premium-button flex items-center gap-2 py-2 px-6"
                                >
                                    {loading ? 'Saving...' : <><Save size={18} /> Save</>}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 rounded-xl border-2 border-surface-200 dark:border-surface-700 font-bold text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-all"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-display font-black text-surface-900 dark:text-white">
                            {user?.user_metadata?.full_name || 'Timetable User'}
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 flex items-center gap-2 font-medium">
                            <Mail size={14} className="text-brand-500" />
                            {user?.email}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Information Column */}
                <div className="md:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-6 text-surface-900 dark:text-white">
                            <Shield size={20} className="text-brand-500" />
                            Account Details
                        </h2>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl bg-surface-100/50 dark:bg-surface-800/50 border border-black/5 dark:border-white/5 disabled:opacity-50 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Member Since</label>
                                    <div className="px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900/50 border border-black/5 dark:border-white/5 text-surface-500 font-medium flex items-center gap-2">
                                        <Calendar size={16} />
                                        {joinDate}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-6 text-surface-900 dark:text-white">
                            <Bell size={20} className="text-brand-500" />
                            Preferences
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600">
                                        <Moon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-surface-900 dark:text-white">Dark Mode</p>
                                        <p className="text-xs text-surface-500">Enable premium dark experience</p>
                                    </div>
                                </div>
                                <div className="w-12 h-6 rounded-full bg-brand-500 relative cursor-pointer shadow-inner shadow-black/10">
                                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                        <Bell size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-surface-900 dark:text-white">Email Newsletters</p>
                                        <p className="text-xs text-surface-500">Weekly productivity reports</p>
                                    </div>
                                </div>
                                <div className="w-12 h-6 rounded-full bg-surface-200 dark:bg-surface-700 relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Account Sidebar */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 border-red-500/10 dark:border-red-900/20"
                    >
                        <h3 className="text-sm font-black uppercase tracking-widest text-red-500 mb-6">Danger Zone</h3>
                        <button
                            onClick={signOut}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold transition-all border border-red-500/20 active:scale-[0.98]"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </motion.div>

                    <div className="p-6 text-center space-y-2 opacity-40">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Timetable Pro v2.0</p>
                        <p className="text-[10px] text-surface-400">Securely stored with Supabase</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
