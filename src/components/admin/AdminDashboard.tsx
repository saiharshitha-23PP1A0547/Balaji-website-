import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth, getAdminAuthHeaders } from '../../context/AdminAuthContext';
import { MuttonItem, DEFAULT_MUTTON_ITEMS } from '../../config/businessConfig';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import {
  Store,
  Bell,
  Building,
  Beef,
  Image as ImageIcon,
  MessageSquare,
  Lock,
  LogOut,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Info,
  Check,
  XCircle,
  Tag,
  ShoppingBag,
  Phone,
} from 'lucide-react';

interface ShopConfig {
  BUSINESS_NAME: string;
  PHONE_NUMBER: string;
  WHATSAPP_NUMBER: string;
  SHOP_ADDRESS: string;
  GOOGLE_MAPS_URL: string;
  OPENING_HOURS: string;
  SHOP_STATUS: 'OPEN' | 'CLOSED' | 'SPECIAL HOURS';
  ANNOUNCEMENT_ENABLED: boolean;
  ANNOUNCEMENT_MESSAGE: string;
  REOPENING_DATE: string;
  REOPENING_TIME: string;
  SPECIAL_HOURS_MESSAGE: string;
  MUTTON_PRICE_PER_KG: number;
  MUTTON_AVAILABLE: boolean;
  MUTTON_NOTICE: string;
}

interface OrderSettings {
  muttonTemplate: string;
  bulkTemplate: string;
  generalTemplate: string;
}

interface PhotoItem {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  placeholderLabel: string;
  imageKey: string;
  altText: string;
  customUrl: string | null;
}

interface CustomerOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: string;
  totalAmount: number;
  orderStatus: string;
  createdAt?: any;
}

type TabType = 'status' | 'announcement' | 'business' | 'mutton' | 'photos' | 'customer-orders' | 'whatsapp' | 'security';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('status');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Editable states
  const [config, setConfig] = useState<ShopConfig>({
    BUSINESS_NAME: 'Balaji Mutton Shop',
    PHONE_NUMBER: '',
    WHATSAPP_NUMBER: '',
    SHOP_ADDRESS: '',
    GOOGLE_MAPS_URL: '',
    OPENING_HOURS: '',
    SHOP_STATUS: 'OPEN',
    ANNOUNCEMENT_ENABLED: false,
    ANNOUNCEMENT_MESSAGE: '',
    REOPENING_DATE: '',
    REOPENING_TIME: '',
    SPECIAL_HOURS_MESSAGE: '',
    MUTTON_PRICE_PER_KG: 1000,
    MUTTON_AVAILABLE: true,
    MUTTON_NOTICE: '',
  });

  const [orderSettings, setOrderSettings] = useState<OrderSettings>({
    muttonTemplate: '',
    bulkTemplate: '',
    generalTemplate: '',
  });

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);

  // Mutton Items state
  const [muttonItems, setMuttonItems] = useState<MuttonItem[]>(DEFAULT_MUTTON_ITEMS);
  const [editingMuttonItem, setEditingMuttonItem] = useState<MuttonItem | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState<boolean>(false);
  const [newItemForm, setNewItemForm] = useState<{
    name: string;
    pricePerKg: string;
    available: boolean;
    description: string;
    imageUrl: string;
  }>({
    name: '',
    pricePerKg: '',
    available: true,
    description: '',
    imageUrl: '',
  });

  // Security Credentials form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/config', {
        headers: getAdminAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setOrderSettings(data.orderSettings || {});
        setPhotos(data.photos || []);
        if (Array.isArray(data.muttonItems) && data.muttonItems.length > 0) {
          setMuttonItems(data.muttonItems);
        }
      } else if (res.status === 401) {
        await logout();
        navigate('/admin/login');
      } else {
        setSaveError('Failed to fetch server data');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Network error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Real-time Firestore customer orders listener
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [newOrderAlert, setNewOrderAlert] = useState<CustomerOrder | null>(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: CustomerOrder[] = [];
        let pending = 0;
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const order: CustomerOrder = {
            id: docSnap.id,
            customerName: data.customerName || 'Customer',
            phone: data.phone || '',
            address: data.address || '',
            items: data.items || '',
            totalAmount: data.totalAmount || 0,
            orderStatus: data.orderStatus || 'Pending',
            createdAt: data.createdAt,
          };
          list.push(order);
          if (order.orderStatus === 'Pending') {
            pending++;
          }
        });

        if (customerOrders.length > 0 && list.length > customerOrders.length) {
          const newest = list[0];
          setNewOrderAlert(newest);
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.8);
            osc.stop(ctx.currentTime + 0.8);
          } catch {
            // Audio policy fallback
          }
          setTimeout(() => setNewOrderAlert(null), 6000);
        }

        setCustomerOrders(list);
        setPendingOrdersCount(pending);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    return () => unsubscribe();
  }, [customerOrders.length]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
      });
      setSaveSuccess(`Order status updated to "${newStatus}"`);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      setSaveError('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order record?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setSaveSuccess('Order deleted successfully');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
      setSaveError('Failed to delete order');
    }
  };

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          config,
          orderSettings,
          muttonItems,
        }),
      });

      if (res.ok) {
        setSaveSuccess('All changes saved successfully! The live public website is updated.');
        setTimeout(() => setSaveSuccess(null), 4000);
      } else if (res.status === 401) {
        await logout();
        navigate('/admin/login');
      } else {
        const data = await res.json();
        setSaveError(data.error || 'Failed to save changes');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Network error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Mutton Items Management Handlers
  const handleToggleItemAvailability = async (itemId: string) => {
    const updated = muttonItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, available: !item.available };
      }
      return item;
    });
    setMuttonItems(updated);
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/mutton-items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({ muttonItems: updated }),
      });
      if (res.ok) {
        setSaveSuccess('Item availability updated and live on website!');
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        setSaveError('Failed to update item availability');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error updating availability');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMuttonItem) return;

    const parsedPrice =
      editingMuttonItem.pricePerKg === null ||
      editingMuttonItem.pricePerKg === undefined ||
      String(editingMuttonItem.pricePerKg).trim() === '' ||
      isNaN(Number(editingMuttonItem.pricePerKg)) ||
      Number(editingMuttonItem.pricePerKg) <= 0
        ? null
        : Number(editingMuttonItem.pricePerKg);

    const updatedItem: MuttonItem = {
      ...editingMuttonItem,
      name: editingMuttonItem.name.trim(),
      pricePerKg: parsedPrice,
      description: (editingMuttonItem.description || '').trim(),
      imageUrl: (editingMuttonItem.imageUrl || '').trim() || null,
    };

    const updated = muttonItems.map((i) => (i.id === updatedItem.id ? updatedItem : i));
    setMuttonItems(updated);

    if (updatedItem.id === 'item-fresh-mutton' || updatedItem.name.toLowerCase() === 'fresh mutton') {
      if (parsedPrice !== null) {
        setConfig((prev) => ({ ...prev, MUTTON_PRICE_PER_KG: parsedPrice }));
      }
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/mutton-items/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        setSaveSuccess(`"${updatedItem.name}" updated successfully!`);
        setEditingMuttonItem(null);
        setTimeout(() => setSaveSuccess(null), 3500);
      } else {
        const data = await res.json();
        setSaveError(data.error || 'Failed to update item');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error updating mutton item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.name.trim()) {
      setSaveError('Item name is required');
      return;
    }

    const parsedPrice =
      newItemForm.pricePerKg.trim() === '' ||
      isNaN(Number(newItemForm.pricePerKg)) ||
      Number(newItemForm.pricePerKg) <= 0
        ? null
        : Number(newItemForm.pricePerKg);

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/mutton-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          name: newItemForm.name.trim(),
          pricePerKg: parsedPrice,
          available: newItemForm.available,
          description: newItemForm.description.trim(),
          imageUrl: newItemForm.imageUrl.trim() || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.muttonItems) {
          setMuttonItems(data.muttonItems);
        }
        setSaveSuccess(`"${newItemForm.name.trim()}" added successfully to website!`);
        setIsAddingNewItem(false);
        setNewItemForm({
          name: '',
          pricePerKg: '',
          available: true,
          description: '',
          imageUrl: '',
        });
        setTimeout(() => setSaveSuccess(null), 3500);
      } else {
        const data = await res.json();
        setSaveError(data.error || 'Failed to add item');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error adding new item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${itemName}"? This item will no longer appear in customer order options.`
      )
    ) {
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/mutton-items/${itemId}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.muttonItems) {
          setMuttonItems(data.muttonItems);
        } else {
          setMuttonItems((prev) => prev.filter((i) => i.id !== itemId));
        }
        setSaveSuccess(`"${itemName}" deleted from website catalogue`);
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        setSaveError('Failed to delete item');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error deleting item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePhotos = async (updatedPhotos: PhotoItem[]) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/photos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({ photos: updatedPhotos }),
      });
      if (res.ok) {
        setPhotos(updatedPhotos);
        setSaveSuccess('Photo gallery updated successfully!');
        setEditingPhoto(null);
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        setSaveError('Failed to update photos');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error updating photos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (!currentPassword) {
      setSecurityMessage({ type: 'error', text: 'Current password is required to update credentials' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setSecurityMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    try {
      const res = await fetch('/api/admin/security/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newEmail: newEmail.trim() || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSecurityMessage({ type: 'success', text: 'Admin security credentials updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSecurityMessage({ type: 'error', text: data.error || 'Failed to update credentials' });
      }
    } catch (err: any) {
      setSecurityMessage({ type: 'error', text: err.message || 'Error updating credentials' });
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#C5A059]/30 border-t-[#6B121C] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#1F1B1A]">Loading Balaji Mutton Shop Management...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EFE8] flex flex-col text-[#1F1B1A]">
      {/* Top Admin Header */}
      <header className="bg-[#4A0B10] text-white border-b-2 border-[#C5A059] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6B121C] border border-[#C5A059] flex items-center justify-center font-serif font-bold text-sm text-[#E5C88F] shadow-xs">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-brand font-bold text-base sm:text-lg tracking-wide text-[#FAF8F5]">
                  Balaji Mutton Shop
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#C5A059] text-[#1F1B1A]">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-[#FAF8F5]/70">
                Logged in as <span className="font-semibold text-[#E5C88F]">{user?.username}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF8F5] text-xs font-semibold transition-colors"
              title="Open public website in a new tab"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#d6b068] text-[#1F1B1A] text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold transition-colors cursor-pointer"
              title="End session and log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Real-Time New Order Alert Banner */}
      {newOrderAlert && (
        <div className="bg-[#6B121C] text-white text-xs font-semibold py-3 px-6 shadow-xl animate-bounce flex items-center justify-between gap-3 border-b-2 border-[#C5A059] z-40">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span>
              🔔 <strong>New Customer Order!</strong> {newOrderAlert.customerName} ordered {newOrderAlert.items} (₹{newOrderAlert.totalAmount})
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('customer-orders');
              setNewOrderAlert(null);
            }}
            className="px-3 py-1 rounded bg-[#C5A059] text-black font-bold hover:bg-[#d6b068] text-xs cursor-pointer"
          >
            View Orders ({pendingOrdersCount})
          </button>
        </div>
      )}

      {/* Notifications Bar */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2.5 px-4 text-center shadow-md animate-in fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="bg-red-600 text-white text-xs font-semibold py-2.5 px-4 text-center shadow-md animate-in fade-in flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Body with Sidebar Navigation */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Navigation Tabs List */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#E8E2D8] p-2.5 shadow-sm sticky top-20">
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'status'
                      ? 'bg-[#6B121C] text-white shadow-xs'
                      : 'text-[#5A504D] hover:bg-[#FAF8F5] hover:text-[#1F1B1A]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span className="flex-1 text-left">A. Shop Status</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      config.SHOP_STATUS === 'OPEN'
                        ? 'bg-emerald-400'
                        : config.SHOP_STATUS === 'CLOSED'
                        ? 'bg-red-400'
                        : 'bg-amber-400'
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('announcement')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'announcement'
                      ? 'bg-[#6B121C] text-white shadow-xs'
                      : 'text-[#5A504D] hover:bg-[#FAF8F5] hover:text-[#1F1B1A]'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span className="flex-1 text-left">B. Announcement Notice</span>
                  {config.ANNOUNCEMENT_ENABLED && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-black">Active</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('business')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'business'
                      ? 'bg-[#6B121C] text-white shadow-xs'
                      : 'text-[#5A504D] hover:bg-[#FAF8F5] hover:text-[#1F1B1A]'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span className="flex-1 text-left">C. Business Information</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('mutton')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'mutton'
                      ? 'bg-[#6B121C] text-white shadow-xs'
                      : 'text-[#5A504D] hover:bg-[#FAF8F5] hover:text-[#1F1B1A]'
                  }`}
                >
                  <Beef className="w-4 h-4" />
                  <span className="flex-1 text-left">D. Mutton Items & Prices</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/10">
                    {muttonItems.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'photos'
                      ? 'bg-[#6B121C] text-white shadow-xs'
                      : 'text-[#5A504D] hover:bg-[#FAF8F5] hover:text-[#1F1B1A]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="flex-1 text-left">E. Photo Gallery Management</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/10">{photos.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('customer-orders')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'customer-orders'
                      ? 'bg-[#6B121C] text-white shadow-xs'
                      : 'text-[#5A504D] hover:bg-[#FAF8F5] hover:text-[#1F1B1A]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="flex-1 text-left">F. Customer Orders</span>
                  {pendingOrdersCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-bold animate-pulse">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('whatsapp')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'whatsapp'
                      ? 'bg-[#6B121C] text-white shadow-xs'
                      : 'text-[#5A504D] hover:bg-[#FAF8F5] hover:text-[#1F1B1A]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="flex-1 text-left">G. WhatsApp Order Settings</span>
                </button>

                <div className="pt-2 border-t border-[#E8E2D8]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'security'
                        ? 'bg-[#6B121C] text-white shadow-xs'
                        : 'text-[#5A504D] hover:bg-[#FAF8F5] hover:text-[#1F1B1A]'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="flex-1 text-left">Admin Security & Password</span>
                  </button>
                </div>
              </nav>

              <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] text-[11px] text-[#5A504D] leading-relaxed">
                <p className="font-semibold text-[#1F1B1A] mb-1">Live Store Sync</p>
                Any changes saved here immediately update the customer-facing website and WhatsApp ordering.
              </div>
            </div>
          </aside>

          {/* Main Tab Content Panel */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-sm p-6 sm:p-8">
              {/* ========================================================= */}
              {/* TAB A: SHOP STATUS */}
              {/* ========================================================= */}
              {activeTab === 'status' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D8] pb-4">
                    <h2 className="text-xl font-bold text-[#1F1B1A] flex items-center gap-2">
                      <Store className="w-5 h-5 text-[#6B121C]" />
                      <span>Shop Status</span>
                    </h2>
                    <p className="text-xs text-[#5A504D] mt-1">
                      Control the operational status displayed to customers across the header, status banner, and mobile bar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Status: OPEN */}
                    <div
                      onClick={() => setConfig({ ...config, SHOP_STATUS: 'OPEN' })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        config.SHOP_STATUS === 'OPEN'
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-emerald-800">OPEN</span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs text-[#5A504D]">
                        Normal operations. Fresh mutton is available and all order channels are active.
                      </p>
                    </div>

                    {/* Status: CLOSED */}
                    <div
                      onClick={() => setConfig({ ...config, SHOP_STATUS: 'CLOSED' })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        config.SHOP_STATUS === 'CLOSED'
                          ? 'border-red-600 bg-red-50/50 shadow-sm ring-2 ring-red-500/20'
                          : 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-red-800">CLOSED TODAY</span>
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                      </div>
                      <p className="text-xs text-[#5A504D]">
                        Displays a prominent closure banner. Informs visitors and shifts WhatsApp to advance enquiries.
                      </p>
                    </div>

                    {/* Status: SPECIAL HOURS */}
                    <div
                      onClick={() => setConfig({ ...config, SHOP_STATUS: 'SPECIAL HOURS' })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        config.SHOP_STATUS === 'SPECIAL HOURS'
                          ? 'border-amber-600 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/20'
                          : 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-amber-800">SPECIAL HOURS</span>
                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                      </div>
                      <p className="text-xs text-[#5A504D]">
                        Displays customized special opening or early closing timings (e.g. Festival morning only).
                      </p>
                    </div>
                  </div>

                  {/* Contextual Settings for CLOSED or SPECIAL */}
                  {config.SHOP_STATUS === 'CLOSED' && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-900 uppercase">
                        <AlertCircle className="w-4 h-4 text-red-700" />
                        <span>Closure Details for Customers</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                            Expected Reopening Date
                          </label>
                          <input
                            type="text"
                            value={config.REOPENING_DATE}
                            onChange={(e) => setConfig({ ...config, REOPENING_DATE: e.target.value })}
                            placeholder="e.g. Tomorrow, 6 October"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-white text-[#1F1B1A]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                            Expected Reopening Time
                          </label>
                          <input
                            type="text"
                            value={config.REOPENING_TIME}
                            onChange={(e) => setConfig({ ...config, REOPENING_TIME: e.target.value })}
                            placeholder="e.g. 7:00 AM sharp"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-white text-[#1F1B1A]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {config.SHOP_STATUS === 'SPECIAL HOURS' && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                      <label className="block text-xs font-bold text-amber-900 uppercase">
                        Special Hours Message
                      </label>
                      <input
                        type="text"
                        value={config.SPECIAL_HOURS_MESSAGE}
                        onChange={(e) => setConfig({ ...config, SPECIAL_HOURS_MESSAGE: e.target.value })}
                        placeholder="e.g. Open today: 7:00 AM – 1:30 PM only"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-white text-[#1F1B1A]"
                      />
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveConfig}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-[#6B121C] hover:bg-[#4A0B10] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Apply Shop Status'}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB B: ANNOUNCEMENT */}
              {/* ========================================================= */}
              {activeTab === 'announcement' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D8] pb-4">
                    <h2 className="text-xl font-bold text-[#1F1B1A] flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#6B121C]" />
                      <span>Announcement Notice System</span>
                    </h2>
                    <p className="text-xs text-[#5A504D] mt-1">
                      Display an urgent banner across all pages for festivals, temporary closures, or holiday messages.
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
                    <div>
                      <span className="font-bold text-sm text-[#1F1B1A] block">
                        Enable Announcement Banner
                      </span>
                      <span className="text-xs text-[#5A504D]">
                        When enabled, a prominent notice appears at the top of both mobile and desktop views.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.ANNOUNCEMENT_ENABLED}
                        onChange={(e) => setConfig({ ...config, ANNOUNCEMENT_ENABLED: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#D9D2C7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B121C]"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                      Announcement Message Text
                    </label>
                    <textarea
                      rows={3}
                      value={config.ANNOUNCEMENT_MESSAGE}
                      onChange={(e) => setConfig({ ...config, ANNOUNCEMENT_MESSAGE: e.target.value })}
                      placeholder="e.g. Shop will be closed today due to a family function. We will reopen tomorrow at 7:00 AM."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A] focus:ring-2 focus:ring-[#6B121C] focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                        Reopening Date (Optional)
                      </label>
                      <input
                        type="text"
                        value={config.REOPENING_DATE}
                        onChange={(e) => setConfig({ ...config, REOPENING_DATE: e.target.value })}
                        placeholder="e.g. Tomorrow, 6 October"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                        Reopening Time (Optional)
                      </label>
                      <input
                        type="text"
                        value={config.REOPENING_TIME}
                        onChange={(e) => setConfig({ ...config, REOPENING_TIME: e.target.value })}
                        placeholder="e.g. 7:00 AM"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveConfig}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-[#6B121C] hover:bg-[#4A0B10] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Announcement'}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB C: BUSINESS INFORMATION */}
              {/* ========================================================= */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D8] pb-4">
                    <h2 className="text-xl font-bold text-[#1F1B1A] flex items-center gap-2">
                      <Building className="w-5 h-5 text-[#6B121C]" />
                      <span>Business Information & Contacts</span>
                    </h2>
                    <p className="text-xs text-[#5A504D] mt-1">
                      Configure your shop phone numbers, full address, Google Maps location, and operating hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                        Calling Phone Number
                      </label>
                      <input
                        type="text"
                        value={config.PHONE_NUMBER}
                        onChange={(e) => setConfig({ ...config, PHONE_NUMBER: e.target.value })}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                      />
                      <p className="text-[11px] text-[#8C7E7A] mt-1">
                        Triggered directly by Call Now and phone dialer buttons.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={config.WHATSAPP_NUMBER}
                        onChange={(e) => setConfig({ ...config, WHATSAPP_NUMBER: e.target.value })}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                      />
                      <p className="text-[11px] text-[#8C7E7A] mt-1">
                        Used to receive orders and customer enquiries directly on WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                      Full Physical Shop Address
                    </label>
                    <textarea
                      rows={2}
                      value={config.SHOP_ADDRESS}
                      onChange={(e) => setConfig({ ...config, SHOP_ADDRESS: e.target.value })}
                      placeholder="e.g. Balaji Mutton Shop, Main Market Road, City, State - PIN"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                      Google Maps Link
                    </label>
                    <input
                      type="url"
                      value={config.GOOGLE_MAPS_URL}
                      onChange={(e) => setConfig({ ...config, GOOGLE_MAPS_URL: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                    />
                    <p className="text-[11px] text-[#8C7E7A] mt-1">
                      Opened when visitors tap 'Get Directions' or 'Visit Us'.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                      Regular Opening Hours
                    </label>
                    <input
                      type="text"
                      value={config.OPENING_HOURS}
                      onChange={(e) => setConfig({ ...config, OPENING_HOURS: e.target.value })}
                      placeholder="Tuesday to Sunday: 7:00 AM – 1:30 PM & 5:00 PM – 8:30 PM"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveConfig}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-[#6B121C] hover:bg-[#4A0B10] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Business Information'}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB D: MUTTON ITEMS & PRICES */}
              {/* ========================================================= */}
              {activeTab === 'mutton' && (
                <div className="space-y-6">
                  {/* Tab Header with Add New Item Action */}
                  <div className="border-b border-[#E8E2D8] pb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1F1B1A] flex items-center gap-2">
                        <Beef className="w-5 h-5 text-[#6B121C]" />
                        <span>Mutton Items & Prices</span>
                      </h2>
                      <p className="text-xs text-[#5A504D] mt-1">
                        Configure individual item rates per kg, manage availability, add descriptions, and upload photos.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewItem(true);
                        setEditingMuttonItem(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6B121C] text-white text-xs font-bold hover:bg-[#4A0B10] shadow-sm cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Mutton Item</span>
                    </button>
                  </div>

                  {/* Informational Guidance Box */}
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/40 text-xs text-[#5A504D] space-y-1.5 leading-relaxed">
                    <p className="font-bold text-[#1F1B1A] flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-[#C5A059]" />
                      <span>Pricing & Availability Rules:</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                      <li>
                        <strong>Configured Price:</strong> When a price is set, customers can select weights (250g, 500g, 1kg, custom) with automatic total price calculation.
                      </li>
                      <li>
                        <strong>Unpriced Items:</strong> If an item does not have a set price, the website will display <span className="text-[#6B121C] font-semibold">"Price: Contact us"</span> rather than inventing a price.
                      </li>
                      <li>
                        <strong>Availability:</strong> Mark an item as <span className="text-red-700 font-semibold">Unavailable</span> to immediately prevent customers from ordering it.
                      </li>
                    </ul>
                  </div>

                  {/* MODAL / FORM: ADD NEW MUTTON ITEM */}
                  {isAddingNewItem && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border-2 border-[#C5A059] shadow-md space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                        <h3 className="text-sm font-bold text-[#6B121C] flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          <span>Add New Mutton Item</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewItem(false)}
                          className="text-xs text-[#5A504D] hover:text-[#1F1B1A] font-semibold cursor-pointer"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      <form onSubmit={handleCreateNewItem} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                              Item Name <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Mutton Chops, Keema, Trotters"
                              value={newItemForm.name}
                              onChange={(e) =>
                                setNewItemForm({ ...newItemForm, name: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-white text-[#1F1B1A] focus:border-[#6B121C]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                              Price Per Kilogram (₹) (Optional)
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-[#6B121C]">
                                ₹
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="10"
                                placeholder="Leave blank for 'Price: Contact us'"
                                value={newItemForm.pricePerKg}
                                onChange={(e) =>
                                  setNewItemForm({ ...newItemForm, pricePerKg: e.target.value })
                                }
                                className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-white text-[#1F1B1A] focus:border-[#6B121C]"
                              />
                            </div>
                            <span className="text-[10px] text-[#8C7E7A] mt-1 block">
                              Leave empty if price requires enquiry or varies by market.
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                              Availability Status
                            </label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setNewItemForm({ ...newItemForm, available: true })}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  newItemForm.available
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white border border-[#D9D2C7] text-[#5A504D]'
                                }`}
                              >
                                ✓ In Stock (Available)
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewItemForm({ ...newItemForm, available: false })}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  !newItemForm.available
                                    ? 'bg-red-600 text-white shadow-xs'
                                    : 'bg-white border border-[#D9D2C7] text-[#5A504D]'
                                }`}
                              >
                                ✕ Unavailable
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                              Item Photo URL (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. /images/mutton.jpg or https://..."
                              value={newItemForm.imageUrl}
                              onChange={(e) =>
                                setNewItemForm({ ...newItemForm, imageUrl: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-white text-[#1F1B1A] focus:border-[#6B121C]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                            Item Description (Optional)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Brief description of the cut, preparation standard, or special cooking recommendations..."
                            value={newItemForm.description}
                            onChange={(e) =>
                              setNewItemForm({ ...newItemForm, description: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-white text-[#1F1B1A] focus:border-[#6B121C]"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                          <button
                            type="button"
                            onClick={() => setIsAddingNewItem(false)}
                            className="px-4 py-2 rounded-lg border border-[#D9D2C7] text-xs font-semibold text-[#5A504D] hover:bg-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2 rounded-lg bg-[#6B121C] text-white text-xs font-bold hover:bg-[#4A0B10] cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            {isSaving ? 'Adding...' : 'Add Item to Website'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* MODAL / FORM: EDIT MUTTON ITEM */}
                  {editingMuttonItem && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border-2 border-[#C5A059] shadow-md space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                        <h3 className="text-sm font-bold text-[#6B121C] flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          <span>Edit Mutton Item: {editingMuttonItem.name}</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingMuttonItem(null)}
                          className="text-xs text-[#5A504D] hover:text-[#1F1B1A] font-semibold cursor-pointer"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveItemEdit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                              Item Name <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={editingMuttonItem.name}
                              onChange={(e) =>
                                setEditingMuttonItem({ ...editingMuttonItem, name: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-white text-[#1F1B1A] focus:border-[#6B121C]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                              Price Per Kilogram (₹) (Optional)
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-[#6B121C]">
                                ₹
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="10"
                                placeholder="Leave blank for 'Price: Contact us'"
                                value={
                                  editingMuttonItem.pricePerKg === null ||
                                  editingMuttonItem.pricePerKg === undefined
                                    ? ''
                                    : editingMuttonItem.pricePerKg
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditingMuttonItem({
                                    ...editingMuttonItem,
                                    pricePerKg: val === '' ? null : Number(val),
                                  });
                                }}
                                className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-white text-[#1F1B1A] focus:border-[#6B121C]"
                              />
                            </div>
                            <span className="text-[10px] text-[#8C7E7A] mt-1 block">
                              Clear price to show "Price: Contact us" on the website.
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                              Availability Status
                            </label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingMuttonItem({ ...editingMuttonItem, available: true })
                                }
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  editingMuttonItem.available
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white border border-[#D9D2C7] text-[#5A504D]'
                                }`}
                              >
                                ✓ In Stock (Available)
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingMuttonItem({ ...editingMuttonItem, available: false })
                                }
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  !editingMuttonItem.available
                                    ? 'bg-red-600 text-white shadow-xs'
                                    : 'bg-white border border-[#D9D2C7] text-[#5A504D]'
                                }`}
                              >
                                ✕ Unavailable
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                              Item Photo URL (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. /images/mutton.jpg or https://..."
                              value={editingMuttonItem.imageUrl || ''}
                              onChange={(e) =>
                                setEditingMuttonItem({
                                  ...editingMuttonItem,
                                  imageUrl: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-white text-[#1F1B1A] focus:border-[#6B121C]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                            Item Description
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Description of the mutton item..."
                            value={editingMuttonItem.description || ''}
                            onChange={(e) =>
                              setEditingMuttonItem({
                                ...editingMuttonItem,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-white text-[#1F1B1A] focus:border-[#6B121C]"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                          <button
                            type="button"
                            onClick={() => setEditingMuttonItem(null)}
                            className="px-4 py-2 rounded-lg border border-[#D9D2C7] text-xs font-semibold text-[#5A504D] hover:bg-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2 rounded-lg bg-[#6B121C] text-white text-xs font-bold hover:bg-[#4A0B10] cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* MUTTON ITEMS CATALOGUE GRID */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#8C7E7A] px-1">
                      <span>Mutton Item Catalogue ({muttonItems.length})</span>
                      <span>Click 'Edit' or availability toggle to update instantly</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {muttonItems.map((item, index) => {
                        const hasPrice = typeof item.pricePerKg === 'number' && item.pricePerKg > 0;
                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl border bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${
                              item.available ? 'border-[#E8E2D8]' : 'border-red-200 bg-red-50/20'
                            }`}
                          >
                            {/* Left: Thumbnail & Item info */}
                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center shrink-0 overflow-hidden">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback on error
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <Beef className="w-6 h-6 text-[#C5A059]" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-mono text-[#8C7E7A]">
                                    #{index + 1}
                                  </span>
                                  <h4 className="text-sm font-bold text-[#1F1B1A] truncate">
                                    {item.name}
                                  </h4>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      item.available
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {item.available ? '✓ In Stock' : '✕ Out of Stock'}
                                  </span>
                                </div>

                                <p className="text-xs text-[#5A504D] mt-0.5 line-clamp-1">
                                  {item.description || 'No description added.'}
                                </p>

                                <div className="mt-1 flex items-center gap-3 text-xs">
                                  <span className="font-bold text-[#6B121C]">
                                    {hasPrice
                                      ? `₹${item.pricePerKg!.toLocaleString('en-IN')} / kg`
                                      : 'Price: Contact us'}
                                  </span>
                                  {item.imageUrl && (
                                    <span className="text-[10px] text-[#8C7E7A] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8E2D8]">
                                      Photo attached
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right: Quick Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleItemAvailability(item.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                                  item.available
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                }`}
                                title="Click to toggle in-stock / out-of-stock"
                              >
                                {item.available ? 'Mark Out of Stock' : 'Mark In Stock'}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMuttonItem(item);
                                  setIsAddingNewItem(false);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9D2C7] bg-[#FAF8F5] text-xs font-semibold text-[#1F1B1A] hover:border-[#6B121C] hover:text-[#6B121C] transition-colors cursor-pointer"
                                title="Edit item details, price, description or photo"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                                title="Delete this item from catalogue"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="sr-only sm:not-sr-only">Delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Save All Changes Bottom Action */}
                  <div className="pt-4 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-[#8C7E7A]">
                      Changes are synchronized live. Click 'Save All Changes' to ensure full server configuration write.
                    </p>
                    <button
                      type="button"
                      onClick={handleSaveConfig}
                      disabled={isSaving}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6B121C] hover:bg-[#4A0B10] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB E: PHOTO GALLERY MANAGEMENT */}
              {/* ========================================================= */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D8] pb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1F1B1A] flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#6B121C]" />
                        <span>Photo Gallery Management</span>
                      </h2>
                      <p className="text-xs text-[#5A504D] mt-1">
                        Manage website gallery slots, upload or link high-resolution photographs, and update alt tags.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newSlot: PhotoItem = {
                          id: `photo-${Date.now()}`,
                          number: photos.length + 1,
                          title: 'New Gallery Photo',
                          category: 'Shop',
                          description: 'Description of photo...',
                          placeholderLabel: 'Uploaded Photo Slot',
                          imageKey: `custom-${Date.now()}`,
                          altText: 'Balaji Mutton Shop photo',
                          customUrl: '',
                        };
                        setEditingPhoto(newSlot);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6B121C] text-white text-xs font-semibold hover:bg-[#4A0B10] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Photo Slot</span>
                    </button>
                  </div>

                  {/* Photo Edit Modal / Sub-card */}
                  {editingPhoto && (
                    <div className="p-5 rounded-2xl bg-[#FAF8F5] border-2 border-[#C5A059] shadow-md space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#6B121C]">
                          Edit Photo Slot #{editingPhoto.number}: {editingPhoto.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingPhoto(null)}
                          className="text-xs text-[#5A504D] hover:text-[#1F1B1A] font-semibold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                            Photo Title
                          </label>
                          <input
                            type="text"
                            value={editingPhoto.title}
                            onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-white text-[#1F1B1A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                            Category
                          </label>
                          <select
                            value={editingPhoto.category}
                            onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-white text-[#1F1B1A]"
                          >
                            <option value="Heritage">Heritage</option>
                            <option value="Shop">Shop</option>
                            <option value="Craft">Craft</option>
                            <option value="Livestock">Livestock</option>
                            <option value="Events">Events</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                          Image URL or Path (e.g. /images/real-shop.jpg or https://...)
                        </label>
                        <input
                          type="text"
                          value={editingPhoto.customUrl || ''}
                          onChange={(e) =>
                            setEditingPhoto({
                              ...editingPhoto,
                              customUrl: e.target.value.trim() || null,
                            })
                          }
                          placeholder="/images/your-photo.jpg or https://..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-white text-[#1F1B1A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingPhoto.description}
                          onChange={(e) =>
                            setEditingPhoto({ ...editingPhoto, description: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-white text-[#1F1B1A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                          Alt Text for SEO
                        </label>
                        <input
                          type="text"
                          value={editingPhoto.altText}
                          onChange={(e) =>
                            setEditingPhoto({ ...editingPhoto, altText: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-white text-[#1F1B1A]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingPhoto(null)}
                          className="px-3 py-1.5 rounded-lg border border-[#D9D2C7] text-xs font-semibold text-[#5A504D]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const exists = photos.some((p) => p.id === editingPhoto.id);
                            const updated = exists
                              ? photos.map((p) => (p.id === editingPhoto.id ? editingPhoto : p))
                              : [...photos, editingPhoto];
                            handleSavePhotos(updated);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#6B121C] text-white text-xs font-bold hover:bg-[#4A0B10]"
                        >
                          Save Photo Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photos Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B121C] bg-[#6B121C]/10 px-2 py-0.5 rounded">
                              #{photo.number} · {photo.category}
                            </span>
                            <span className="text-[10px] text-[#8C7E7A] font-medium">
                              {photo.customUrl ? 'Custom Image Active' : 'Placeholder Mode'}
                            </span>
                          </div>

                          {/* Preview Area */}
                          <div className="h-28 w-full rounded-lg bg-[#E8E2D8] overflow-hidden flex items-center justify-center relative mb-2">
                            {photo.customUrl ? (
                              <img
                                src={photo.customUrl}
                                alt={photo.altText}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="p-2 text-center">
                                <ImageIcon className="w-6 h-6 text-[#8C7E7A] mx-auto mb-1" />
                                <span className="text-[10px] text-[#5A504D] line-clamp-1">
                                  {photo.placeholderLabel}
                                </span>
                              </div>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-[#1F1B1A] line-clamp-1 mb-1">
                            {photo.title}
                          </h4>
                          <p className="text-[11px] text-[#5A504D] line-clamp-2 mb-3">
                            {photo.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-[#E8E2D8]">
                          <button
                            type="button"
                            onClick={() => setEditingPhoto(photo)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-[#D9D2C7] hover:border-[#6B121C] text-[11px] font-semibold text-[#1F1B1A] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-[#6B121C]" />
                            <span>Edit</span>
                          </button>
                          {photos.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove photo slot "${photo.title}"?`)) {
                                  handleSavePhotos(photos.filter((p) => p.id !== photo.id));
                                }
                              }}
                              className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs cursor-pointer"
                              title="Delete photo slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB F: CUSTOMER ORDERS (REAL-TIME) */}
              {/* ========================================================= */}
              {activeTab === 'customer-orders' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D8] pb-4 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1F1B1A] flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#6B121C]" />
                        <span>Customer Orders (Real-Time Live)</span>
                      </h2>
                      <p className="text-xs text-[#5A504D] mt-1">
                        Live orders submitted by customers across websites and installed PWAs. Synchronized in real-time via Firestore.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#6B121C]/10 text-[#6B121C] border border-[#6B121C]/20">
                        Pending Orders: {pendingOrdersCount}
                      </span>
                    </div>
                  </div>

                  {customerOrders.length === 0 ? (
                    <div className="text-center py-12 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8]">
                      <ShoppingBag className="w-12 h-12 text-[#C5A059] mx-auto mb-3 opacity-50" />
                      <h3 className="text-sm font-bold text-[#1F1B1A]">No customer orders yet</h3>
                      <p className="text-xs text-[#5A504D] mt-1">
                        When customers place orders from the website or Android PWA, they will appear here instantly with sound and banner alerts.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customerOrders.map((order) => {
                        const statusColors: Record<string, string> = {
                          Pending: 'bg-amber-100 text-amber-800 border-amber-300',
                          Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                          Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                          Cancelled: 'bg-red-100 text-red-800 border-red-300',
                        };

                        return (
                          <div
                            key={order.id}
                            className={`p-5 rounded-2xl border transition-all bg-white shadow-xs space-y-3 ${
                              order.orderStatus === 'Pending'
                                ? 'border-[#6B121C] ring-2 ring-[#6B121C]/15 bg-gradient-to-r from-amber-50/20 to-white'
                                : 'border-[#E8E2D8]'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E2D8] pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold text-sm text-[#1F1B1A]">
                                  {order.customerName}
                                </span>
                                <a
                                  href={`tel:${order.phone}`}
                                  className="text-xs font-mono font-semibold text-[#6B121C] bg-[#6B121C]/10 px-2.5 py-1 rounded-md hover:bg-[#6B121C]/20 flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{order.phone}</span>
                                </a>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                    statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800 border-gray-300'
                                  }`}
                                >
                                  {order.orderStatus}
                                </span>
                                <span className="text-[11px] text-[#8C7E7A] font-mono">
                                  {order.createdAt?.toDate
                                    ? order.createdAt.toDate().toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : 'Just now'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="font-semibold text-[#8C7E7A] block mb-0.5">Ordered Items & Details:</span>
                                <p className="font-bold text-[#1F1B1A] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8E2D8]">
                                  {order.items}
                                </p>
                              </div>

                              <div>
                                <span className="font-semibold text-[#8C7E7A] block mb-0.5">Fulfillment & Total:</span>
                                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8E2D8] space-y-1">
                                  <p className="text-[#5A504D]">
                                    <strong>Mode & Date:</strong> {order.address}
                                  </p>
                                  <p className="text-[#6B121C] font-bold">
                                    <strong>Estimated Total:</strong> ₹{order.totalAmount?.toLocaleString('en-IN') || 0}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8E2D8]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-bold text-[#8C7E7A]">Update Status:</span>
                                {['Pending', 'Confirmed', 'Delivered', 'Cancelled'].map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(order.id, st)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      order.orderStatus === st
                                        ? 'bg-[#6B121C] text-white shadow-xs'
                                        : 'bg-[#FAF8F5] text-[#5A504D] border border-[#D9D2C7] hover:bg-white'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(order.id)}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Record</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB G: WHATSAPP ORDER SETTINGS */}
              {/* ========================================================= */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D8] pb-4">
                    <h2 className="text-xl font-bold text-[#1F1B1A] flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#6B121C]" />
                      <span>WhatsApp Order & Enquiry Messages</span>
                    </h2>
                    <p className="text-xs text-[#5A504D] mt-1">
                      Customize the pre-filled messages customers send when placing orders on WhatsApp.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                      Standard Mutton Order Message Format
                    </label>
                    <textarea
                      rows={3}
                      value={orderSettings.muttonTemplate}
                      onChange={(e) =>
                        setOrderSettings({ ...orderSettings, muttonTemplate: e.target.value })
                      }
                      placeholder="Hello Balaji Mutton Shop, I would like to order {quantity} of fresh mutton ({cut}). Estimated price: {price}."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A] font-mono leading-relaxed"
                    />
                    <p className="text-[11px] text-[#8C7E7A] mt-1">
                      Dynamic tags: <code>{'{quantity}'}</code>, <code>{'{cut}'}</code>, <code>{'{price}'}</code>, <code>{'{customer}'}</code>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                      Special & Bulk Function Order Template
                    </label>
                    <textarea
                      rows={3}
                      value={orderSettings.bulkTemplate}
                      onChange={(e) =>
                        setOrderSettings({ ...orderSettings, bulkTemplate: e.target.value })
                      }
                      placeholder="Hello Balaji Mutton Shop, I would like to place a bulk order for {occasion} on {date}."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A] font-mono leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                      General Shop Enquiry Template
                    </label>
                    <input
                      type="text"
                      value={orderSettings.generalTemplate}
                      onChange={(e) =>
                        setOrderSettings({ ...orderSettings, generalTemplate: e.target.value })
                      }
                      placeholder="Hello Balaji Mutton Shop, I would like to enquire about placing an order."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveConfig}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-[#6B121C] hover:bg-[#4A0B10] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save Order Templates'}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB G: ADMIN SECURITY */}
              {/* ========================================================= */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D8] pb-4">
                    <h2 className="text-xl font-bold text-[#1F1B1A] flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#6B121C]" />
                      <span>Admin Security & Login Credentials</span>
                    </h2>
                    <p className="text-xs text-[#5A504D] mt-1">
                      Update your private administrator username, contact email, and password.
                    </p>
                  </div>

                  {securityMessage && (
                    <div
                      className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                        securityMessage.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {securityMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                      <span>{securityMessage.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSecuritySubmit} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wider mb-1.5">
                        Current Admin Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password to verify identity"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8E2D8]">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                          New Username (Optional)
                        </label>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="e.g. admin"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                          New Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="staff@balajimuttonshop.com"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                          New Password (Optional)
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F1B1A] mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FAF8F5] text-[#1F1B1A]"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#6B121C] hover:bg-[#4A0B10] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Update Security Credentials
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
