import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaUserTie, FaClipboardList, FaChartPie, FaBars, FaTimes } from 'react-icons/fa';

const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-600';
        return location.pathname.includes(path) ? 'bg-blue-700' : 'hover:bg-blue-600';
    };

    return (
        <div className="app-container">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="flex items-center gap-2">HRMS Lite</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-300 hover:text-white" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                        <FaTimes />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`nav-link ${isActive('/')}`}
                    >
                        <FaChartPie className="text-xl" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/employees"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`nav-link ${isActive('employees')}`}
                    >
                        <FaUserTie className="text-xl" />
                        <span>Employees</span>
                    </Link>

                    <Link
                        to="/attendance"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`nav-link ${isActive('attendance')}`}
                    >
                        <FaClipboardList className="text-xl" />
                        <span>Attendance</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div>Admin User</div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                <header className="top-header">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="menu-btn"
                        >
                            <FaBars />
                        </button>
                        <h1 className="header-title">
                            {location.pathname === '/' ? 'Dashboard' : location.pathname.includes('employees') ? 'Employees' : 'Attendance'}
                        </h1>
                    </div>
                    <div className="text-gray-500 text-sm hidden sm:block">Welcome, Admin</div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
