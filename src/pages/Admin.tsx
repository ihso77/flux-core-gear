import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Activity, Clock, Globe,
  LogOut, BarChart3, Settings, Shield, Eye, RefreshCw, Camera
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminShowcaseManager from "@/components/admin/AdminShowcaseManager";

interface OnlineUser {
  id: string;
  user_id?: string | null;
  session_id: string;
  last_seen: string;
  page_url: string;
  profiles?: { email: string; full_name: string } | { email: string; full_name: string }[] | null;
}

interface Stats {
  totalUsers: number;
  totalReviews: number;
}

const Admin = () => {
  const { user, profile, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalReviews: 0 });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); return; }
    setLoading(false);
  }, [user, isAdmin, authLoading, navigate]);

  const fetchOnlineUsers = async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('online_presence')
        .select(`id, user_id, session_id, last_seen, page_url, profiles:user_id (email, full_name)`)
        .gte('last_seen', fiveMinutesAgo)
        .order('last_seen', { ascending: false })
        .limit(50);
      if (!error && data) setOnlineUsers(data as unknown as OnlineUser[]);
    } catch (error) {
      console.debug('Error fetching online users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersCount, reviewsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        totalUsers: usersCount.count || 0,
        totalReviews: reviewsCount.count || 0,
      });
    } catch (error) {
      console.debug('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (loading || !isAdmin) return;
    fetchOnlineUsers();
    fetchStats();
    const interval = setInterval(fetchOnlineUsers, 1000);
    return () => clearInterval(interval);
  }, [loading, isAdmin]);

  useEffect(() => {
    if (loading || !isAdmin) return;
    const channel = supabase
      .channel('online-users-tracking')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'online_presence' }, () => fetchOnlineUsers())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loading, isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAdmin) return null;

  const getProfileData = (u: OnlineUser) => {
    const p = Array.isArray(u.profiles) ? u.profiles[0] : u.profiles;
    return p || null;
  };

  const authenticatedUsers = onlineUsers.filter(u => u.user_id);
  const anonymousUsers = onlineUsers.filter(u => !u.user_id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'online', label: 'Online Users', icon: Activity },
    { id: 'showcase', label: 'Customer Photos', icon: Camera },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl py-4 sm:py-6 md:py-8 pt-16 sm:pt-20 md:pt-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Admin <span className="text-gradient-pulse">Dashboard</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back, {profile?.full_name || "Admin"}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-bold text-green-400">{onlineUsers.length}</span>
              <span className="text-xs text-green-400/70">online</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">Admin</span>
            </div>
            <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-card transition-colors touch-manipulation">
              <LogOut className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all touch-manipulation ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
              <StatCard title="Online Now" value={onlineUsers.length} subtitle={`${authenticatedUsers.length} logged in`} icon={Activity} color="green" />
              <StatCard title="Total Users" value={stats.totalUsers} subtitle="Registered" icon={Users} color="blue" />
              <StatCard title="Reviews" value={stats.totalReviews} subtitle="Customer ratings" icon={Eye} color="purple" />
              <StatCard title="Guests" value={anonymousUsers.length} subtitle="Anonymous visitors" icon={Globe} color="yellow" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl gradient-pulse flex items-center justify-center">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground">Live Activity</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Real-time visitor tracking</p>
                  </div>
                </div>
                <button onClick={fetchOnlineUsers} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-center">
                  <p className="text-2xl sm:text-3xl font-display font-bold text-green-400">{onlineUsers.length}</p>
                  <p className="text-[10px] sm:text-xs text-green-400/70 mt-1">Total Online</p>
                </div>
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                  <p className="text-2xl sm:text-3xl font-display font-bold text-primary">{authenticatedUsers.length}</p>
                  <p className="text-[10px] sm:text-xs text-primary/70 mt-1">Logged In</p>
                </div>
                <div className="rounded-xl bg-secondary p-3 text-center">
                  <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">{anonymousUsers.length}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Guests</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Online Users Tab */}
        {activeTab === 'online' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground">Active Users (Last 5 Minutes)</h3>
                <button onClick={fetchOnlineUsers} className="text-sm text-primary hover:underline">Refresh</button>
              </div>
              {onlineUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No active users right now</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {onlineUsers.map((u, index) => {
                    const prof = getProfileData(u);
                    return (
                      <motion.div key={u.session_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center justify-between p-3 sm:p-4 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {prof?.full_name?.charAt(0) || prof?.email?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{prof?.full_name || prof?.email || 'Anonymous User'}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">{u.page_url || '/'}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(u.last_seen).toLocaleTimeString()}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            u.user_id ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                          }`}>
                            {u.user_id ? 'Logged In' : 'Guest'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Showcase Tab */}
        {activeTab === 'showcase' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
              <AdminShowcaseManager />
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Traffic Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Visitors</span>
                    <span className="font-display font-bold text-foreground">{onlineUsers.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Registered Users</span>
                    <span className="font-display font-bold text-foreground">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Auth Rate</span>
                    <span className="font-display font-bold text-primary">
                      {onlineUsers.length > 0 ? Math.round((authenticatedUsers.length / onlineUsers.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Page Views</h3>
                <div className="space-y-2">
                  {Object.entries(
                    onlineUsers.reduce<Record<string, number>>((acc, u) => {
                      const page = u.page_url || '/';
                      acc[page] = (acc[page] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([page, count]) => (
                    <div key={page} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">{page}</span>
                      <span className="text-sm font-medium text-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Admin Settings</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Your Account</p>
                      <p className="text-xs text-muted-foreground">{profile?.email}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string; value: string | number; subtitle: string;
  icon: React.ComponentType<{ className?: string }>; color: 'green' | 'blue' | 'purple' | 'yellow';
}) {
  const colorClasses = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }}
      className="rounded-xl border border-border bg-card p-3 sm:p-4 md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">{title}</p>
      <p className="text-lg sm:text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-[9px] sm:text-xs text-muted-foreground mt-1">{subtitle}</p>
    </motion.div>
  );
}

export default Admin;
