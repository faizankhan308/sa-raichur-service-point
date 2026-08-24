import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchBookingsStart, 
  fetchBookingsSuccess, 
  fetchBookingsFailure, 
  updateBookingStatusInStore, 
  selectBookings, 
  selectBookingLoading 
} from '../redux/bookingSlice';
import { selectAuth, logout } from '../redux/authSlice';
import { 
  fetchAdminBookings, 
  updateBookingStatusApi, 
  fetchServices, 
  createServiceApi, 
  updateServiceApi, 
  deleteServiceApi 
} from '../services/api';
import { 
  Phone, 
  MessageSquare, 
  Search, 
  Filter, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  LogOut, 
  User, 
  Calendar, 
  MapPin, 
  Clock,
  Wrench,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Star
} from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, username } = useSelector(selectAuth);
  const bookings = useSelector(selectBookings);
  const loading = useSelector(selectBookingLoading);

  const [localError, setLocalError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Services catalog management states
  const [servicesList, setServicesList] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Service form fields states
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('cleaning');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formRating, setFormRating] = useState('4.8');
  const [formReviewCount, setFormReviewCount] = useState('150');
  const [formBenefits, setFormBenefits] = useState('');
  const [formInclusions, setFormInclusions] = useState('');
  
  // Filtering and search state
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadDashboardData = async () => {
    dispatch(fetchBookingsStart());
    setLocalError(null);
    try {
      const data = await fetchAdminBookings(token);
      if (data.success && data.bookings) {
        dispatch(fetchBookingsSuccess(data.bookings));
      } else {
        throw new Error(data.error || 'Failed to retrieve bookings.');
      }
    } catch (err) {
      console.error(err);
      dispatch(fetchBookingsFailure(err.message));
      setLocalError(err.message);
      
      // If unauthorized, trigger logout
      if (err.message.includes('expired') || err.message.includes('Access denied') || err.message.includes('token')) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === 'services') {
      loadServicesData();
    }
  }, [token, activeTab]);

  const loadServicesData = async () => {
    setServicesLoading(true);
    setLocalError(null);
    try {
      const data = await fetchServices();
      if (data.success && data.services) {
        setServicesList(data.services);
      } else {
        throw new Error(data.error || 'Failed to retrieve services catalog.');
      }
    } catch (err) {
      console.error(err);
      setLocalError(err.message);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!formId.trim() || !formName.trim() || !formPrice) {
      alert('Please fill in all required fields (ID, Name, and Price).');
      return;
    }

    const servicePayload = {
      id: formId.trim().toLowerCase(),
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      rating: Number(formRating) || 4.8,
      reviewCount: Number(formReviewCount) || 150,
      image: formImage.trim(),
      benefits: formBenefits.split('\n').map(b => b.trim()).filter(b => b.length > 0),
      inclusions: formInclusions.split('\n').map(i => i.trim()).filter(i => i.length > 0)
    };

    try {
      if (editingService) {
        // Edit service flow
        const data = await updateServiceApi(token, editingService.id, servicePayload);
        if (data.success) {
          alert('Service updated successfully!');
        } else {
          throw new Error(data.error || 'Failed to update service.');
        }
      } else {
        // Create service flow
        const data = await createServiceApi(token, servicePayload);
        if (data.success) {
          alert('Service created successfully!');
        } else {
          throw new Error(data.error || 'Failed to create service.');
        }
      }
      setServiceModalOpen(false);
      loadServicesData();
    } catch (err) {
      alert(`Error saving service: ${err.message}`);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm(`Are you sure you want to delete service "${id}"? This cannot be undone.`)) {
      return;
    }
    try {
      const data = await deleteServiceApi(token, id);
      if (data.success) {
        alert('Service deleted successfully!');
        loadServicesData();
      } else {
        throw new Error(data.error || 'Failed to delete service.');
      }
    } catch (err) {
      alert(`Error deleting service: ${err.message}`);
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormId('');
    setFormName('');
    setFormCategory('cleaning');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormDescription('');
    setFormImage('');
    setFormRating('4.8');
    setFormReviewCount('150');
    setFormBenefits('');
    setFormInclusions('');
    setServiceModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormId(service.id);
    setFormName(service.name);
    setFormCategory(service.category);
    setFormPrice(service.price);
    setFormOriginalPrice(service.originalPrice || '');
    setFormDescription(service.description || '');
    setFormImage(service.image || '');
    setFormRating(service.rating || '4.8');
    setFormReviewCount(service.reviewCount || '150');
    setFormBenefits(service.benefits ? service.benefits.join('\n') : '');
    setFormInclusions(service.inclusions ? service.inclusions.join('\n') : '');
    setServiceModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const data = await updateBookingStatusApi(token, id, newStatus);
      if (data.success && data.booking) {
        dispatch(updateBookingStatusInStore({ id, status: newStatus }));
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
      loadDashboardData(); // Refresh list to revert UI
    }
  };

  // Status-dependent classes
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Contacted': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'Confirmed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Stats calculation
  const totalCount = bookings.length;
  const newCount = bookings.filter(b => b.status === 'New').length;
  const contactedCount = bookings.filter(b => b.status === 'Contacted').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

  // Filtering filter Logic
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = 
      booking.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight">
            Admin Control Center
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Log of customer service requests submitted to S A Raichur Service Point.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadDashboardData}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            title="Refresh database entries"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 mb-8 gap-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-4 font-display text-sm font-extrabold tracking-tight transition-colors border-b-2 cursor-pointer ${
            activeTab === 'bookings' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Bookings Log
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-4 font-display text-sm font-extrabold tracking-tight transition-colors border-b-2 cursor-pointer ${
            activeTab === 'services' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Services Catalog
        </button>
      </div>

      {activeTab === 'bookings' ? (
        <>
          {/* 2. Statistical Widget grids */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider">New</span>
              <div className="text-2xl font-black text-amber-700 mt-1">{newCount}</div>
            </div>

            <div className="bg-sky-50/50 border border-sky-200/50 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] text-sky-500 font-extrabold uppercase tracking-wider">Contacted</span>
              <div className="text-2xl font-black text-sky-700 mt-1">{contactedCount}</div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-200/50 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-wider">Confirmed</span>
              <div className="text-2xl font-black text-indigo-700 mt-1">{confirmedCount}</div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider">Completed</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{completedCount}</div>
            </div>

            <div className="bg-red-50/50 border border-red-200/50 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-wider">Cancelled</span>
              <div className="text-2xl font-black text-red-700 mt-1">{cancelledCount}</div>
            </div>

          </div>

          {/* 3. Filter and search bars */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer, ID, address, phone..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>

            {/* Dropdown status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase">Filter</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-primary transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

          </div>

          {/* 4. Bookings list table grid */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="text-slate-400 text-xs font-bold">Querying database bookings...</span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-3xl">📭</span>
                <h4 className="font-display text-sm font-bold text-slate-800 mt-3">No Bookings Match</h4>
                <p className="text-slate-500 text-xs mt-1">We couldn't find any service bookings matching your current query inputs.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="px-6 py-4">ID & Date</th>
                      <th className="px-6 py-4">Customer Details</th>
                      <th className="px-6 py-4">Requested Service</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4">Time Schedule</th>
                      <th className="px-6 py-4">Booking Status</th>
                      <th className="px-6 py-4 text-center">Contact Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((bk) => (
                      <tr key={bk._id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* ID & Date */}
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-primary px-2 py-0.5 bg-primary-light rounded border border-primary/10">
                            {bk.id || `SABK-${bk._id.slice(-8).toUpperCase()}`}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-1.5 font-medium">
                            {new Date(bk.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Customer details */}
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-slate-800">{bk.customerName}</div>
                          <div className="text-slate-400 mt-0.5">{bk.phone}</div>
                          {bk.email && <div className="text-slate-400 text-[10px] mt-0.5">{bk.email}</div>}
                        </td>

                        {/* Services and amounts */}
                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="font-semibold text-slate-800 line-clamp-1">{bk.service}</div>
                          <div className="text-primary font-black mt-1">₹{bk.totalAmount}</div>
                        </td>

                        {/* Address details */}
                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="text-slate-500 line-clamp-2 leading-relaxed" title={bk.address}>
                            {bk.address}
                          </div>
                        </td>

                        {/* Preferred Date Schedule */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-slate-700 font-bold">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{bk.preferredDate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-[10px]">{bk.preferredTime}</span>
                          </div>
                        </td>

                        {/* Status selection */}
                        <td className="px-6 py-4">
                          <select
                            value={bk.status}
                            onChange={(e) => handleStatusChange(bk._id || bk.id, e.target.value)}
                            className={`font-bold border text-[10px] rounded-full px-3 py-1 focus:outline-none cursor-pointer ${getStatusBadgeClass(bk.status)}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <a 
                              href={`tel:${bk.phone}`}
                              className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-primary-light hover:border-primary text-slate-600 hover:text-primary rounded-lg transition-colors"
                              title={`Call: ${bk.customerName}`}
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                            <a 
                              href={`https://wa.me/91${bk.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-500 text-slate-600 hover:text-emerald-600 rounded-lg transition-colors"
                              title={`WhatsApp: ${bk.customerName}`}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        // Services Management Catalog section
        <div>
          {/* Catalog Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display text-base font-extrabold text-slate-800">
                Service Catalog Offerings
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Manage the pricing, details, categories, descriptions, images, and benefits of your home services.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4.5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-primary/10 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Service</span>
            </button>
          </div>

          {/* Services Table Card */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            {servicesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="text-slate-400 text-xs font-bold">Querying catalog database...</span>
              </div>
            ) : servicesList.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-3xl">🗂️</span>
                <h4 className="font-display text-sm font-bold text-slate-800 mt-3">Catalog Empty</h4>
                <p className="text-slate-500 text-xs mt-1">There are no services configured in the database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Service Name & ID</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price Details</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {servicesList.map((svc) => (
                      <tr key={svc.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Image Preview */}
                        <td className="px-6 py-4">
                          <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                            {svc.image ? (
                              <img src={svc.image} alt={svc.name} className="w-full h-full object-cover" />
                            ) : (
                              <Wrench className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </td>

                        {/* Name and ID */}
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-slate-800 leading-snug">{svc.name}</div>
                          <div className="text-slate-400 text-[10px] font-mono mt-0.5">{svc.id}</div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="capitalize font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px]">
                            {svc.category}
                          </span>
                        </td>

                        {/* Price Details */}
                        <td className="px-6 py-4">
                          <div className="font-black text-slate-900">₹{svc.price}</div>
                          {svc.originalPrice && (
                            <div className="text-slate-400 text-[10px] line-through mt-0.5">₹{svc.originalPrice}</div>
                          )}
                        </td>

                        {/* Rating & Review */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-bold text-slate-700">
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                            <span>{svc.rating}</span>
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5">{svc.reviewCount} reviews</div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(svc)}
                              className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-primary-light hover:border-primary text-slate-600 hover:text-primary rounded-lg transition-colors cursor-pointer"
                              title="Edit service details"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(svc.id)}
                              className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-500 text-slate-600 hover:text-red-650 rounded-lg transition-colors cursor-pointer"
                              title="Delete service offering"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Edit / Create Dialog */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setServiceModalOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display text-base font-extrabold text-slate-800">
                {editingService ? `Edit Service Details: ${editingService.name}` : 'Add New Service Offering'}
              </h3>
              <button 
                onClick={() => setServiceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-700">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* ID (Unique URL reference) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Service ID (URL slug, unique) *</label>
                  <input
                    type="text"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g. ac-deep-wash"
                    required
                    disabled={!!editingService}
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary disabled:opacity-50"
                  />
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Service Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. AC Deep Cleaning"
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary cursor-pointer"
                  >
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Price (₹) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 599"
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                {/* Original Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Original Price (₹, optional for discount visual)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="e.g. 899"
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                {/* Image URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Image URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary font-normal text-slate-600"
                  />
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                {/* Review Count */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Review Count</label>
                  <input
                    type="number"
                    value={formReviewCount}
                    onChange={(e) => setFormReviewCount(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary"
                  />
                </div>

              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Service Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Summarize what this service offering includes and what it covers..."
                  rows="3"
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary font-normal text-slate-650"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Benefits */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Benefits (one per line)</label>
                  <textarea
                    value={formBenefits}
                    onChange={(e) => setFormBenefits(e.target.value)}
                    placeholder="e.g. Saves 25% electricity bills&#10;Better cooling performance"
                    rows="4"
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary font-normal text-slate-650"
                  />
                </div>

                {/* Inclusions */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Inclusions (one per line)</label>
                  <textarea
                    value={formInclusions}
                    onChange={(e) => setFormInclusions(e.target.value)}
                    placeholder="e.g. Jet water filter wash&#10;Gas pressure checks"
                    rows="4"
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white focus:border-primary font-normal text-slate-650"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl shadow-md shadow-primary/10 cursor-pointer"
                >
                  Save Service
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
