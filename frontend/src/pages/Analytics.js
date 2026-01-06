import React, { useMemo, useContext, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { AuthContext } from '../App';
import DashboardLayout from '../layouts/DashboardLayout';
import { API_ENDPOINTS } from '../config/api';

export default function Analytics() {
  const { setToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(API_ENDPOINTS.HISTORY, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  // Calculate KPIs from real data
  const kpis = useMemo(() => {
    const totalSent = applications.length;
    const viewed = applications.filter(app => app.status === 'Viewed' || app.status === 'viewed').length;
    const interviewing = applications.filter(app => app.status === 'Interviewing' || app.status === 'interviewing').length;
    const offers = applications.filter(app => app.status === 'Offer' || app.status === 'offer' || app.status === 'Offers').length;
    
    return [
      { label: 'Total Sent', value: totalSent },
      { label: 'Viewed', value: viewed },
      { label: 'Interviewing', value: interviewing },
      { label: 'Offers', value: offers },
    ];
  }, [applications]);

  // Generate chart data from application dates
  const chartData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const dayViews = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    applications.forEach(app => {
      const date = app.date ? new Date(app.date) : new Date();
      const dayOfWeek = date.getDay();
      dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
      
      if (app.status === 'Viewed' || app.status === 'viewed') {
        dayViews[dayOfWeek] = (dayViews[dayOfWeek] || 0) + 1;
      }
    });

    return dayNames.map((name, index) => ({
      name,
      apps: dayCounts[index] || 0,
      views: dayViews[index] || 0,
    }));
  }, [applications]);

  return (
    <DashboardLayout>
      {/* Fixed Control Bar - Top Right Corner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 right-6 z-[100] flex items-center gap-4 bg-[#111]/80 backdrop-blur-2xl border border-white/10 px-4 py-2 rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]"
      >
        <Link to="/dashboard" className="relative group">
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            location.pathname === '/dashboard' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}>
            <Icon icon="solar:widget-bold-duotone" width="20" height="20" />
          </div>
          {location.pathname === '/dashboard' && (
            <motion.div 
              layoutId="dot" 
              className="absolute -bottom-1 left-0 right-0 mx-auto w-1 h-1 bg-white rounded-full" 
            />
          )}
        </Link>
        <Link to="/discover" className="relative group">
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            location.pathname === '/discover' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}>
            <Icon icon="solar:radar-bold-duotone" width="20" height="20" />
          </div>
          {location.pathname === '/discover' && (
            <motion.div 
              layoutId="dot" 
              className="absolute -bottom-1 left-0 right-0 mx-auto w-1 h-1 bg-white rounded-full" 
            />
          )}
        </Link>
        <div className="w-px h-6 bg-white/10 mx-1"></div>
        <button 
          onClick={() => { 
            localStorage.removeItem('token'); 
            setToken(null);
            navigate('/auth');
          }} 
          className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <Icon icon="solar:logout-3-bold-duotone" width="20" height="20" />
        </button>
      </motion.div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
        <p className="text-gray-400">Real-time insight into your application funnel.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading analytics...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Big Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0A0A0A] border border-white/5">
              <h3 className="font-bold mb-6 text-sm text-gray-400 uppercase">Application Velocity</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF4D00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF4D00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#555" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#555" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px'}} />
                    <Area type="monotone" dataKey="apps" stroke="#FF4D00" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/5">
              <h3 className="font-bold mb-6 text-sm text-gray-400 uppercase">Response Rate</h3>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                       <XAxis dataKey="name" stroke="#555" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                       <YAxis stroke="#555" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                       <Bar dataKey="views" fill="#333" radius={[4, 4, 0, 0]} />
                       <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{backgroundColor: '#111', border: '1px solid #333'}}/>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {kpis.map((kpi, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
               <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{kpi.label}</p>
               <h2 className="text-3xl font-bold text-white">{kpi.value}</h2>
            </div>
         ))}
      </div>
    </DashboardLayout>
  );
}

