import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hrms-0ne6.onrender.com/api";
const API_URL = `${API_BASE_URL}/employees`;

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
            const response = await axios.get(API_URL);
            setEmployees(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Failed to fetch employees');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent double submission

        setIsSubmitting(true);
        try {
            await axios.post(API_URL, formData);
            toast.success('Employee added successfully');
            setShowModal(false);
            setFormData({ employeeId: '', name: '', email: '', department: 'Engineering' });
            fetchEmployees();
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error('Duplicate Employee ID or Email!');
            } else {
                toast.error(error.response?.data?.message || 'Error adding employee');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                toast.success('Employee deleted');
                fetchEmployees();
            } catch (error) {
                toast.error('Error deleting employee');
            }
        }
    };

    const departments = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Design'];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Employees</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
                >
                    <FaPlus /> Add Employee
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : employees.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No employees found. Add one to get started.</p>
                </div>
            ) : (
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
                                {employees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td className="font-medium">{emp.employeeId}</td>
                                        <td>{emp.name}</td>
                                        <td>{emp.email}</td>
                                        <td>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => handleDelete(emp._id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title="Delete Employee"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Add New Employee</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    required
                                    placeholder="e.g. EMP001"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    name="department"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.department}
                                    onChange={handleChange}
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Employee'}
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
