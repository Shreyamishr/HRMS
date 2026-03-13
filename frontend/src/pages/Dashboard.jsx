import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserFriends, FaClipboardCheck, FaBuilding } from 'react-icons/fa';
import { SkeletonStatCard } from '../components/SkeletonLoader';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hrms-0ne6.onrender.com/api";

const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex items-center justify-between">
        <div>
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-full ${color} text-white text-xl flex-shrink-0`}>
            {icon}
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalEmployees: 0, totalPresentToday: 0, departments: 0 });
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError(false);
                const today = new Date().toISOString().split('T')[0];
                const [empRes, attRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/employees`),
                    axios.get(`${API_BASE_URL}/attendance`)
                ]);

                const employees = Array.isArray(empRes.data) ? empRes.data : [];
                const attendance = Array.isArray(attRes.data) ? attRes.data : [];

                const uniqueDepts = new Set(employees.map(e => e.department)).size;
                const presentToday = attendance.filter(a => a.date === today && a.status === 'Present').length;

                // Get employee name map
                const empMap = {};
                employees.forEach(e => { empMap[e.employeeId] = e.name; });

                setStats({
                    totalEmployees: employees.length,
                    totalPresentToday: presentToday,
                    departments: uniqueDepts
                });

                // Show recent 5 records with names resolved
                setRecentAttendance(
                    attendance.slice(0, 5).map(r => ({
                        ...r,
                        employeeName: empMap[r.employeeId] || r.employeeId
                    }))
                );
            } catch (err) {
                console.error("Error fetching dashboard stats", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (error) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-700 mb-1">Unable to connect to server</h3>
                    <p className="text-red-500 text-sm">Make sure the backend is running at <code className="bg-red-100 px-1 rounded">localhost:8000</code></p>
                    <button
                        onClick={() => { setLoading(true); setError(false); window.location.reload(); }}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <p className="text-gray-500 text-sm mt-1">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)
                ) : (
                    <>
                        <StatCard
                            title="Total Employees"
                            value={stats.totalEmployees}
                            icon={<FaUserFriends />}
                            color="bg-blue-600"
                            subtitle="Active headcount"
                        />
                        <StatCard
                            title="Present Today"
                            value={stats.totalPresentToday}
                            icon={<FaClipboardCheck />}
                            color="bg-green-500"
                            subtitle={`Out of ${stats.totalEmployees} employees`}
                        />
                        <StatCard
                            title="Departments"
                            value={stats.departments}
                            icon={<FaBuilding />}
                            color="bg-purple-500"
                            subtitle="Active departments"
                        />
                    </>
                )}
            </div>

            {/* Recent Attendance */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-700">Recent Attendance</h3>
                </div>
                {loading ? (
                    <div className="p-6 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="skeleton-bar" style={{ width: '35%' }} />
                                <div className="skeleton-bar" style={{ width: '20%' }} />
                                <div className="skeleton-bar" style={{ width: '15%' }} />
                            </div>
                        ))}
                    </div>
                ) : recentAttendance.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <div className="text-4xl mb-2">📋</div>
                        <p>No attendance records yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {recentAttendance.map(record => (
                            <div key={record._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{record.employeeName}</p>
                                    <p className="text-xs text-gray-400">#{record.employeeId}</p>
                                </div>
                                <p className="text-sm text-gray-500">{record.date}</p>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    record.status === 'Present'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {record.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {stats.totalEmployees === 0 && !loading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-5 text-sm text-center">
                    👋 Welcome to <strong>HRMS Lite</strong>! Go to <strong>Employees</strong> to add your first employee, then track attendance from the <strong>Attendance</strong> page.
                </div>
            )}
        </div>
    );
};

export default Dashboard;
