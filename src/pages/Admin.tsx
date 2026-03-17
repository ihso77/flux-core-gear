import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, ShoppingCart, Package, TrendingUp, 
  Activity, Clock, Globe, Monitor, 
  LogOut, BarChart3, Settings, Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OnlineUser {
  id: string;
  user_id?: string;
  session_id: string;
  last_seen: string;
  page_url: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
}

const Admin = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.role === 'admin') {
          setIsAdmin(true);
        } else {
          // Not admin, redirect
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, navigate]);

  // Fetch online users
  const fetchOnlineUsers = async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('online_presence')
        .select(`
          id,
          user_id,
          session_id,
          last_seen,
          page_url,
          profiles:user_id (email, full_name)
        `)
        .gte('last_seen', fiveMinutesAgo)
        .order('last_seen', { ascending: false })
        .limit(50);

      if (!error && data) {
        setOnlineUsers(data as OnlineUser[]);
      }
    } catch (error) {
      console.debug('Error fetching online users:', error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const [usersCount, productsCount, ordersData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total')
      ]);

      setStats({
        totalUsers: usersCount.count || 0,
        totalProducts: productsCount.count || 0,
        totalOrders: ordersData.data?.length || 0,
        revenue: ordersData.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
      });
    } catch (error) {
      console.debug('Error fetching stats:', error);
    }
  };

  // Initial fetch and polling - update every 1 second
  useEffect(() => {
    if (!isAdmin) return;

    fetchOnlineUsers();
    fetchStats();

    const interval = setInterval(fetchOnlineUsers, 1000); // Every 1 second
    return () => clearInterval(interval);
  }, [isAdmin]);

  // Real-time subscription for online users
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('online-users-tracking')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'online_presence' },
        () => fetchOnlineUsers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
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

  if (!isAdmin) {
    return null;
  }

  const authenticatedUsers = onlineUsers.filter(u => u.user_id);
  const anonymousUsers = onlineUsers.filter(u => !u.user_id);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      <div className="mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl py-4 sm:py-6 md:py-8 pt-16 sm:pt-20 md:pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
        >
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Admin <span className="text-gradient-pulse">Dashboard</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Welcome back, {profile?.full_name || "Admin"}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Admin</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border hover:bg-card transition-colors touch-manipulation"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'online', label: 'Online Users', icon: Activity },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all touch-manipulation ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
              <StatCard
                title="Online Now"
                value={onlineUsers.length}
                subtitle={`${authenticatedUsers.length} logged in`}
                icon={Activity}
                color="green"
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                subtitle="Registered users"
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Products"
                value={stats.totalProducts}
                subtitle="Active products"
                icon={Package}
                color="purple"
              />
              <StatCard
                title="Revenue"
                value={`$${stats.revenue.toFixed(2)}`}
                subtitle="Total revenue"
                icon={TrendingUp}
                color="yellow"
              />
            </div>

            {/* Live Online Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg sm:rounded-xl md:rounded-2xl border border-border bg-card p-3 sm:p-4 md:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg sm:rounded-xl gradient-pulse">
                    <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-base md:text-lg font-semibold text-foreground">
                      Live Visitors
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                      Updated every 10 seconds
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500"></span>
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground">
                    {onlineUsers.length}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">online</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div className="rounded-lg sm:rounded-xl bg-secondary p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Authenticated</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground">
                    {authenticatedUsers.length}
                  </p>
                </div>
                <div className="rounded-lg sm:rounded-xl bg-secondary p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Anonymous</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground">
                    {anonymousUsers.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Online Users Tab */}
        {activeTab === 'online' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Online Users List */}
            <div className="rounded-lg sm:rounded-xl md:rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-3 sm:p-4 md:p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm sm:text-base md:text-lg font-semibold text-foreground">
                    Active Users (Last 5 Minutes)
                  </h3>
                  <button
                    onClick={fetchOnlineUsers}
                    className="text-sm text-primary hover:underline"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {onlineUsers.length === 0 ? (
                <div className="p-8 sm:p-10 md:p-12 text-center">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-muted-foreground/50 mx-auto mb-3 sm:mb-4" />
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">No active users right now</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {onlineUsers.map((u, index) => (
                    <motion.div
                      key={u.session_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 sm:p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <div className="h-8 w-8 sm:h-9 md:h-10 sm:w-9 md:w-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-[10px] sm:text-xs font-bold text-primary-foreground">
                          {u.profiles?.full_name?.charAt(0) || u.profiles?.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-foreground">
                            {u.profiles?.full_name || u.profiles?.email || 'Anonymous User'}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 sm:gap-2">
                            <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">{u.page_url || '/'}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(u.last_seen).toLocaleTimeString()}
                        </div>
                        {u.user_id ? (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-green-500/10 text-green-500 text-[9px] sm:text-[10px] md:text-xs font-medium">
                            Logged In
                          </span>
                        ) : (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted text-muted-foreground text-[9px] sm:text-[10px] md:text-xs font-medium">
                            Guest
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="rounded-lg sm:rounded-xl md:rounded-2xl border border-border bg-card p-3 sm:p-4 md:p-6">
              <h3 className="font-display text-sm sm:text-base md:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Admin Settings
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-foreground">Your Account</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{profile?.email}</p>
                    </div>
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs md:text-sm font-medium">
                      Admin
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary">
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-2">Database Tables</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-3">
                    Create the online_presence table to enable user tracking
                  </p>
                  <code className="block p-2 sm:p-3 rounded-lg bg-background text-[8px] sm:text-[10px] md:text-xs text-muted-foreground overflow-x-auto">
                    CREATE TABLE online_presence (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID REFERENCES profiles(id), session_id VARCHAR(255) UNIQUE, last_seen TIMESTAMP WITH TIME ZONE, page_url TEXT);
                  </code>
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

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: React.ComponentType<{ className?: string }>; 
  color: 'green' | 'blue' | 'purple' | 'yellow';
}) {
  const colorClasses = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-lg sm:rounded-xl md:rounded-2xl border border-border bg-card p-3 sm:p-4 md:p-6"
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
        <div className={`h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">{title}</p>
      <p className="text-base sm:text-lg md:text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1">{subtitle}</p>
    </motion.div>
  );
}

export default Admin;
