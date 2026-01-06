import React from 'react';
import { motion } from 'framer-motion';
import { Package, Bell, Download, Upload, Keyboard, HelpCircle, Sparkles, Shield, Zap, Database } from 'lucide-react';
import NotificationSettings from '../features/notifications/components/NotificationSettings';

const FeaturesPage = ({ isDarkMode }) => {
    const tools = [
        { icon: Download, label: 'Export Data', desc: 'Secure local backup', color: 'emerald', action: () => { } },
        { icon: Upload, label: 'Import Data', desc: 'Restore from JSON', color: 'blue', action: () => { } },
        { icon: Keyboard, label: 'Shortcuts', desc: 'Power user commands', color: 'amber', action: () => { } },
        { icon: HelpCircle, label: 'System Guide', desc: 'Usage documentation', color: 'purple', action: () => { } },
    ];

    const colorConfig = {
        emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-12"
        >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-display font-black text-surface-900 dark:text-white flex items-center gap-3">
                        Control Center
                        <Sparkles size={24} className="text-brand-500 animate-pulse" />
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 font-medium mt-2 max-w-xl">
                        Optimize your productivity engine. Manage notifications, backup your data, and fine-tune your workflow settings.
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-6 px-6 py-3 rounded-2xl bg-surface-100/50 dark:bg-surface-800/50 border border-black/5 dark:border-white/5">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">Security</span>
                        <Shield size={16} className="text-emerald-500" />
                    </div>
                    <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">Sync</span>
                        <Zap size={16} className="text-amber-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Notification Settings Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card flex flex-col h-full"
                >
                    <div className="p-8 border-b border-black/5 dark:border-white/5 bg-gradient-to-br from-blue-500/[0.03] to-transparent">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/20 text-white">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-black text-surface-900 dark:text-white">Orchestration</h3>
                                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Smart Notification Engine</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 sm:p-6 flex-1">
                        <NotificationSettings isDarkMode={isDarkMode} isOpen={true} inline={true} />
                    </div>
                </motion.div>

                {/* Management Tools & Data */}
                <div className="space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-amber-500 shadow-lg shadow-amber-500/20 text-white">
                                <Database size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-black text-surface-900 dark:text-white">Data Systems</h3>
                                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Import, Export & Sync</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {tools.map((tool, index) => (
                                <motion.button
                                    key={tool.label}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex flex-col items-start p-6 rounded-3xl bg-surface-50 dark:bg-surface-800/40 border border-black/5 dark:border-white/5 hover:border-brand-500/30 transition-all text-left group"
                                >
                                    <div className={`p-4 rounded-2xl mb-4 border transition-colors ${colorConfig[tool.color]}`}>
                                        <tool.icon size={24} />
                                    </div>
                                    <h4 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">
                                        {tool.label}
                                    </h4>
                                    <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                                        {tool.desc}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Stats / Feedback */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-[2rem] bg-gradient-to-br from-brand-600 to-indigo-700 text-white relative overflow-hidden shadow-2xl shadow-brand-500/20"
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl font-display font-black mb-2">Need a Boost?</h3>
                            <p className="text-indigo-100 font-medium mb-6 max-w-xs">Our AI-powered scheduling recommendations are always learning from your habits.</p>
                            <button className="px-6 py-3 rounded-xl bg-white text-brand-600 font-black uppercase tracking-widest text-xs hover:bg-brand-50 transition-colors shadow-lg">
                                View Recommendations
                            </button>
                        </div>

                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                            <Sparkles size={120} />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default FeaturesPage;
