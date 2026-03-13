import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { SkeletonRow } from '../components/SkeletonLoader';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hrms-0ne6.onrender.com/api";

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [empRes, attRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/employees`),
                axios.get(`${API_BASE_URL}/attendance`)
            ]);
            setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
            setAttendance(Array.isArray(attRes.data) ? attRes.data : []);
        } catch (error) {
            toast.error('Failed to load data. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.employeeId) {
            toast.error('Please select an employee');
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const isUpdate = attendance.some(
                a => a.employeeId === formData.employeeId && a.date === formData.date
            );
            await axios.post(`${API_BASE_URL}/attendance`, formData);
            toast.success(isUpdate ? '🔄 Attendance Updated!' : '✅ Attendance Marked!');
            fetchData();
        } catch (error) {
            const errMsg = error.response?.data?.detail || error.response?.data?.message || 'Error marking attendance';
            toast.error(`❌ ${errMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(e => e.employeeId === id);
        return emp ? emp.name : id;
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mark Attendance Form */}
            <div className="lg:col-span-1">
                <div className="form-card sticky top-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Mark Attendance</h2>

                    {loading ? (
                        <div className="space-y-4 py-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i}>
                                    <div className="skeleton-bar" style={{ width: '40%', height: '12px', marginBottom: '8px' }} />
                                    <div className="skeleton-bar" style={{ width: '100%', height: '38px' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Employee</label>
                                <select
                                    name="employeeId"
                                    className="form-input bg-white"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select Employee --</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp.employeeId}>
                                            {emp.name} ({emp.employeeId})
                                        </option>
                                    ))}
                                </select>
                                {employees.length === 0 && (
                                    <p className="text-xs text-amber-600 mt-1">⚠️ No employees found. Add employees first.</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    className="form-input"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Present"
                                            checked={formData.status === 'Present'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-gray-700 font-medium">Present</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Absent"
                                            checked={formData.status === 'Absent'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-gray-700 font-medium">Absent</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || employees.length === 0}
                                className="btn-primary w-full mt-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : 'Mark Attendance'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Attendance List */}
            <div className="lg:col-span-2">
                <div className="table-container">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Recent Attendance Records</h2>
                        {!loading && (
                            <span className="text-sm text-gray-500">{attendance.length} records</span>
                        )}
                    </div>

                    <div className="table-scroll">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Employee</th>
                                    <th className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <SkeletonRow key={i} cols={3} />
                                    ))
                                ) : attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan={3}>
                                            <div className="text-center py-12">
                                                <div className="text-5xl mb-3">📅</div>
                                                <p className="text-gray-500 font-medium">No attendance records</p>
                                                <p className="text-gray-400 text-sm mt-1">Mark attendance using the form on the left</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    attendance.map((record) => (
                                        <tr key={record._id}>
                                            <td className="text-gray-600 font-medium">{record.date}</td>
                                            <td className="font-semibold text-gray-800">
                                                {getEmployeeName(record.employeeId)}
                                                <span className="text-xs text-gray-400 ml-2 block sm:inline">
                                                    #{record.employeeId}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    record.status === 'Present'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {record.status === 'Present' ? <FaCheckCircle /> : <FaTimesCircle />}
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
