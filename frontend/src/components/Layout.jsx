import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaUserTie, FaClipboardList, FaChartPie } from 'react-icons/fa';

const Layout = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-600';
        return location.pathname.includes(path) ? 'bg-blue-700' : 'hover:bg-blue-600';
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-blue-800 text-white flex flex-col shadow-lg">
                <div className="p-6 text-2xl font-bold border-b border-blue-700 flex items-center gap-2">
                    HRMS Lite
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${isActive('/')}`}
                    >
                        <FaChartPie className="text-xl" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/employees"
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${isActive('employees')}`}
                    >
                        <FaUserTie className="text-xl" />
                        <span className="font-medium">Employees</span>
                    </Link>

                    <Link
                        to="/attendance"
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${isActive('attendance')}`}
                    >
                        <FaClipboardList className="text-xl" />
                        <span className="font-medium">Attendance</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-blue-700">
                    <div className="text-sm opacity-70 text-center">Admin User</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {location.pathname === '/' ? 'Dashboard' : location.pathname.includes('employees') ? 'Employee Management' : 'Attendance Management'}
                    </h1>
                    <div className="text-gray-500 text-sm">Welcome, Admin</div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
