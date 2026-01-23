import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserFriends, FaClipboardCheck, FaBuilding } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hrms-0ne6.onrender.com/api";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalPresentToday: 0,
        departments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const [empRes, attRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/employees`),
                    axios.get(`${API_BASE_URL}/attendance`)
                ]);

                // Safety checks
                const employees = Array.isArray(empRes.data) ? empRes.data : [];
                const attendance = Array.isArray(attRes.data) ? attRes.data : [];

                const uniqueDepartments = new Set(employees.map(e => e.department)).size;
                const presentToday = attendance.filter(a => a.date === today && a.status === 'Present').length;

                setStats({
                    totalEmployees: employees.length,
                    totalPresentToday: presentToday,
                    departments: uniqueDepartments
                });
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-transparent hover:border-l-blue-500 transition-all flex items-center justify-between">
            <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            </div>
            <div className={`p-4 rounded-full ${color} text-white text-xl`}>
                {icon}
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={<FaUserFriends />}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Present Today"
                    value={stats.totalPresentToday}
                    icon={<FaClipboardCheck />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Active Departments"
                    value={stats.departments}
                    icon={<FaBuilding />}
                    color="bg-purple-500"
                />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to HRMS Lite</h3>
                <p className="text-gray-500">Select <span className="font-bold text-blue-600">Employees</span> or <span className="font-bold text-blue-600">Attendance</span> from the sidebar to get started.</p>
            </div>
        </div>
    );
};

export default Dashboard;
