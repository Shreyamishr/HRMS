import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { SkeletonRow } from '../components/SkeletonLoader';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hrms-0ne6.onrender.com/api";
const API_URL = `${API_BASE_URL}/employees`;

const departments = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Design', 'Operations', 'Legal'];

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        email: '',
        department: 'Engineering'
    });

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setEmployees(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Failed to fetch employees. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ employeeId: '', name: '', email: '', department: 'Engineering' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await axios.post(API_URL, formData);
            toast.success(`✅ ${formData.name} added successfully!`);
            setShowModal(false);
            resetForm();
            fetchEmployees();
        } catch (error) {
            // FastAPI sends error in 'detail', not 'message'
            const errMsg = error.response?.data?.detail || error.response?.data?.message || 'Error adding employee';
            toast.error(`❌ ${errMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                toast.success('Employee deleted successfully');
                // Optimistic update — remove from state immediately
                setEmployees(prev => prev.filter(e => e._id !== id));
            } catch (error) {
                toast.error('Error deleting employee');
                fetchEmployees(); // Re-sync if optimistic update was wrong
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">All Employees</h2>
                    {!loading && (
                        <p className="text-sm text-gray-500 mt-1">
                            {employees.length} {employees.length === 1 ? 'employee' : 'employees'} found
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
                >
                    <FaPlus /> Add Employee
                </button>
            </div>

            <div className="table-container">
                <div className="table-scroll">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                // Skeleton rows while loading
                                Array.from({ length: 5 }).map((_, i) => (
                                    <SkeletonRow key={i} cols={5} />
                                ))
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="text-center py-12">
                                            <div className="text-5xl mb-3">👥</div>
                                            <p className="text-gray-500 font-medium">No employees found</p>
                                            <p className="text-gray-400 text-sm mt-1">Click "Add Employee" to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td className="font-medium text-blue-700">{emp.employeeId}</td>
                                        <td className="font-semibold text-gray-800">{emp.name}</td>
                                        <td className="text-gray-500">{emp.email}</td>
                                        <td>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => handleDelete(emp._id, emp.name)}
                                                className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title="Delete Employee"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 animate-fadeIn">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800">Add New Employee</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    required
                                    placeholder="e.g. EMP001"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <select
                                    name="department"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    value={formData.department}
                                    onChange={handleChange}
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors border border-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : 'Save Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
