import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Activity } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/blogs');
        setBlogs(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Calculate stats
  const recentBlogs = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  
  const stats = [
    { title: 'Total Blogs', value: loading ? '...' : blogs.length, icon: FileText, color: 'var(--primary)' },
    { title: 'Published This Month', value: loading ? '...' : blogs.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length, icon: Calendar, color: 'var(--success)' },
    { title: 'Active Sessions', value: '1', icon: Activity, color: '#f59e0b' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '24px' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                backgroundColor: `${stat.color}15`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: stat.color
              }}>
                <Icon size={28} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="card">
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Recent Activity (Latest Blogs)</h2>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading recent activity...</p>
        ) : recentBlogs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No recent activity to show.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentBlogs.map((blog) => (
              <div key={blog._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: '500' }}>{blog.title}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
