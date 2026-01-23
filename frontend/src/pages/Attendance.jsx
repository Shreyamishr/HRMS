import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
            toast.error('Failed to load data');
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

        if (isSubmitting) return; // Prevent double submit
        setIsSubmitting(true);

        try {
            const isUpdate = attendance.some(a => a.employeeId === formData.employeeId && a.date === formData.date);
            await axios.post(`${API_BASE_URL}/attendance`, formData);
            toast.success(isUpdate ? 'Attendance Updated!' : 'Attendance Marked!');
            fetchData(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error marking attendance');
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
                                <option value="">-- Select --</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp.employeeId}>
                                        {emp.name} ({emp.employeeId})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                max={new Date().toISOString().split('T')[0]} // Prevent future dates
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
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">Present</span>
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
                                    <span className="text-gray-700">Absent</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn-primary w-full mt-2`}
                        >
                            {isSubmitting ? 'Processing...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Attendance List */}
            <div className="lg:col-span-2">
                <div className="table-container">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-800">Recent Attendance Records</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : attendance.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No attendance records found.</div>
                    ) : (
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
                                    {attendance.map((record) => (
                                        <tr key={record._id}>
                                            <td className="text-gray-600">{record.date}</td>
                                            <td className="font-medium text-gray-800">
                                                {getEmployeeName(record.employeeId)}
                                                <span className="text-xs text-gray-400 ml-2 block sm:inline">#{record.employeeId}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${record.status === 'Present'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {record.status === 'Present' ? <FaCheckCircle /> : <FaTimesCircle />}
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
