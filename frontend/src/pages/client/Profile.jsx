import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClientSidebar from '../../components/common/ClientSidebar';
import authService from '../../services/authService';
import userService from '../../services/userService';
import shopService from '../../services/shopService';
import { formatDate } from '../../utils/formatDate';
import {
  MapPin, Phone, Pencil, Lock, ChevronDown, ChevronRight,
  AlertTriangle, Store, Mail, Calendar, Eye, EyeOff,
} from 'lucide-react';
import Topbar from '../../components/common/Topbar';
import '../../styles/adminDashboard.css';
import '../../styles/Profile.css';

// ─── Personal Info Card ───────────────────────────────────────────────────────

function PersonalInfoCard({ name, email, dob, gender, joinedAt, loading, avatarUrl, onAvatarUpload, uploadingAvatar }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'C';
  const fileInputRef = useRef(null);

  if (loading) {
    return (
      <div className="p-card">
        <div className="p-avatar-wrap">
          <div className="p-avatar-circle">--</div>
        </div>
        <div style={{ height: 18, width: 120, background: '#e4e2e2', borderRadius: 4, margin: '12px auto' }} />
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Only image files are allowed (JPEG, PNG, GIF, WebP)');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be 5MB or less');
      e.target.value = '';
      return;
    }

    onAvatarUpload(file);
    e.target.value = '';
  };

  return (
    <div className="p-card p-profile-card">
      <div className="p-avatar-wrap">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="p-avatar-img" />
        ) : (
          <div className="p-avatar-circle">{initials}</div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          className="p-avatar-edit"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingAvatar}
        >
          {uploadingAvatar ? (
            <div className="p-avatar-spinner" />
          ) : (
            <svg width="16.7" height="15" viewBox="0 0 16.6667 15" fill="none">
              <path d="M6.667 0L5.2 1.667H0V15h16.667V1.667h-5.2L10 0H6.667zM8.333 12.5a4.167 4.167 0 1 1 0-8.333 4.167 4.167 0 0 1 0 8.333z" fill="#ff6b00"/>
            </svg>
          )}
        </button>
      </div>
      <div className="p-profile-name">{name || 'Unknown User'}</div>
      <div className="p-profile-badge">CLIENT</div>
      <div className="p-divider" />
      <div className="p-meta">
        <div className="p-meta-row">
          <Mail size={16} color="#5f5e5e" />
          <span>{email || '—'}</span>
        </div>
        <div className="p-meta-row">
          <Calendar size={16} color="#5f5e5e" />
          <span>Joined {formatDate(joinedAt)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Shop Info Card ───────────────────────────────────────────────────────────

function ShopInfoCard({ shop }) {
  return (
    <div className="p-card">
      <div className="p-shop-header">
        <Store size={20} color="#ff6b00" />
        <span className="p-shop-title">Shop Information</span>
      </div>
      <div className="p-shop-body">
        <div className="p-shop-name-block">
          <span className="p-label">SHOP NAME</span>
          <span className="p-shop-name">{shop?.shop_name || '—'}</span>
        </div>
        <div className="p-contact-list">
          <div className="p-contact-row">
            <MapPin size={16} color="#5f5e5e" className="p-contact-icon" />
            <div>
              <span className="p-label">ADDRESS</span>
              <span className="p-value">{shop?.address || '—'}</span>
            </div>
          </div>
          <div className="p-contact-row">
            <Phone size={16} color="#5f5e5e" className="p-contact-icon" />
            <div>
              <span className="p-label">PHONE</span>
              <span className="p-value">{shop?.phone || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password Card ─────────────────────────────────────────────────────

function ChangePasswordCard({ onChangePassword, changing, passwordMessage, onCancel }) {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!oldPw || !newPw || !confirmPw) { setError('All fields are required'); return; }
    if (newPw !== confirmPw) { setError('Passwords do not match'); return; }
    onChangePassword({ oldPassword: oldPw, newPassword: newPw, confirmPassword: confirmPw });
  };

  return (
    <div className="p-card">
      <div className="p-form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lock size={18} color="#ff6b00" />
          <span className="p-form-title">Change Password</span>
        </div>
        <button className="p-btn-cancel" onClick={onCancel}>Cancel</button>
      </div>
      <div className="p-form-body">
        <div className="p-field p-field-full">
          <label className="p-field-label">Current Password</label>
          <div className="p-input-wrap">
            <input type={showOld ? 'text' : 'password'} value={oldPw} onChange={e => setOldPw(e.target.value)} className="p-input" placeholder="••••••••" />
            <button type="button" className="p-pw-toggle" onClick={() => setShowOld(s => !s)} tabIndex={-1}>
              {showOld ? <EyeOff size={16} color="#5f5e5e" /> : <Eye size={16} color="#5f5e5e" />}
            </button>
          </div>
        </div>
        <div className="p-form-row">
          <div className="p-field">
            <label className="p-field-label">New Password</label>
            <div className="p-input-wrap">
              <input type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} className="p-input" placeholder="••••••••" />
              <button type="button" className="p-pw-toggle" onClick={() => setShowNew(s => !s)} tabIndex={-1}>
                {showNew ? <EyeOff size={16} color="#5f5e5e" /> : <Eye size={16} color="#5f5e5e" />}
              </button>
            </div>
          </div>
          <div className="p-field">
            <label className="p-field-label">Confirm Password</label>
            <div className="p-input-wrap">
              <input type={showConfirm ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="p-input" placeholder="••••••••" />
              <button type="button" className="p-pw-toggle" onClick={() => setShowConfirm(s => !s)} tabIndex={-1}>
                {showConfirm ? <EyeOff size={16} color="#5f5e5e" /> : <Eye size={16} color="#5f5e5e" />}
              </button>
            </div>
          </div>
        </div>
        {(error || passwordMessage) && (
          <div className={`p-message ${error ? 'p-error' : passwordMessage?.includes('success') ? 'p-success' : 'p-error'}`}>
            {error || passwordMessage}
          </div>
        )}
        <div className="p-form-footer">
          <div className="p-form-divider" />
          <button className="p-btn-save" onClick={handleSubmit} disabled={changing}>
            {changing ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Profile Form ────────────────────────────────────────────────────────

function EditProfileForm({ name, email, dob, gender, shopName, onSave, saving, message }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', birthDate: '', gender: '', shopName: '' });
  const initialized = useRef(false);

  useEffect(() => {
    if (!name) return;
    if (!initialized.current) {
      initialized.current = true;
      const parts = name.split(' ');
      setForm({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: email || '',
        birthDate: dob || '',
        gender: gender || 'Male',
        shopName: shopName || '',
      });
      return;
    }
    if (shopName) {
      setForm(prev => prev.shopName ? prev : { ...prev, shopName });
    }
  }, [name, email, dob, gender, shopName]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSave = () => {
    onSave({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      DOB: form.birthDate,
      gender: form.gender,
      shop_name: form.shopName,
    });
  };

  return (
    <div className="p-card p-form-card">
      <div className="p-form-header">
        <span className="p-form-title">Edit Profile</span>
        <button><Pencil size={16} color="#5f5e5e" /></button>
      </div>
      <div className="p-form-body">
        <div className="p-form-row">
          <div className="p-field">
            <label className="p-field-label">First Name</label>
            <div className="p-input-wrap">
              <input name="firstName" value={form.firstName} onChange={handleChange} className="p-input" />
            </div>
          </div>
          <div className="p-field">
            <label className="p-field-label">Last Name</label>
            <div className="p-input-wrap">
              <input name="lastName" value={form.lastName} onChange={handleChange} className="p-input" />
            </div>
          </div>
        </div>
        <div className="p-field p-field-full">
          <label className="p-field-label">Email</label>
          <div className="p-input-wrap">
            <input name="email" value={form.email} onChange={handleChange} className="p-input" />
          </div>
        </div>
        <div className="p-field p-field-full">
          <label className="p-field-label">Shop Name</label>
          <div className="p-input-wrap">
            <input name="shopName" value={form.shopName} onChange={handleChange} className="p-input" />
          </div>
        </div>
        <div className="p-form-row">
          <div className="p-field">
            <label className="p-field-label">Date of Birth</label>
            <div className="p-input-wrap">
              <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} className="p-input" />
            </div>
          </div>
          <div className="p-field">
            <label className="p-field-label">Gender</label>
            <div className="p-select-wrap">
              <select name="gender" value={form.gender} onChange={handleChange} className="p-select">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <div className="p-select-chevron"><ChevronDown size={16} color="#6B7280" /></div>
            </div>
          </div>
        </div>
        {message && (
          <div className={`p-message ${message.includes('success') ? 'p-success' : 'p-error'}`}>{message}</div>
        )}
        <div className="p-form-footer">
          <div className="p-form-divider" />
          <button className="p-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Account Settings ─────────────────────────────────────────────────────────

const settingsLinks = [];

function HelpActionsColumn({ onShowChangePassword }) {
  return (
    <div className="p-help-col">
      <div className="p-card p-settings-card">
        <span className="p-settings-title">Account Settings</span>
        <div className="p-settings-links">
          {settingsLinks.map(({ label, icon: Icon }) => (
            <button key={label} className="p-settings-btn">
              <div className="p-settings-btn-inner">
                <Icon size={16} color="#5f5e5e" />
                <span className="p-settings-btn-label">{label}</span>
              </div>
              <ChevronRight size={12} color="#5f5e5e" />
            </button>
          ))}
          <button className="p-settings-btn" onClick={onShowChangePassword}>
            <div className="p-settings-btn-inner">
              <Lock size={16} color="#ff6b00" />
              <span className="p-settings-btn-label">Change Password</span>
            </div>
            <ChevronRight size={12} color="#5f5e5e" />
          </button>
        </div>
      </div>
      <div className="p-card p-danger-card">
        <div className="p-danger-header">
          <AlertTriangle size={18} color="#ba1a1a" />
          <span className="p-danger-title">Danger Zone</span>
        </div>
        <button className="p-danger-btn">Request Account Deletion</button>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, logout } = useAuth();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const originalRef = useRef({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [joinedAt, setJoinedAt] = useState('');
  const [shop, setShop] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    const load = async () => {
      try {
        const res = await authService.getMe();
        if (!mountedRef.current) return;
        const data = res.data?.data || res.data || {};
        originalRef.current = {
          name: data.name || user?.name || '',
          email: data.email || user?.email || '',
          DOB: data.DOB || '',
          gender: data.gender || 'Male',
        };
        setName(data.name || user?.name || '');
        setEmail(data.email || user?.email || '');
        setDob(data.DOB || '');
        setGender(data.gender || 'Male');
        setJoinedAt(data.created_at || '');
        if (data.avatar_url) {
          const base = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
          setAvatarUrl(`${base}${data.avatar_url}`);
        }
      } catch {
        if (mountedRef.current) {
          setName(user?.name || '');
          setEmail(user?.email || '');
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    const fallback = setTimeout(() => {
      if (mountedRef.current) {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setLoading(false);
      }
    }, 8000);
    load();
    return () => { mountedRef.current = false; clearTimeout(fallback); };
  }, [user]);

  useEffect(() => {
    if (!user?.user_id) return;
    const loadShop = async () => {
      try {
        const res = await shopService.getByUserId(user.user_id);
        if (!mountedRef.current) return;
        setShop(res.data?.data || res.data || null);
      } catch { /* ignore */ }
    };
    loadShop();
  }, [user]);

  const handleChangePassword = async (data) => {
    setChangingPassword(true);
    setPasswordMessage('');
    try {
      await authService.changePassword(data);
      setPasswordMessage('Password changed successfully');
      setTimeout(() => {
        if (mountedRef.current) {
          setShowPasswordForm(false);
          setPasswordMessage('');
        }
      }, 1500);
    } catch (err) {
      setPasswordMessage(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    setSaveMessage('');
    try {
      const orig = originalRef.current;
      const userData = {};
      if (data.name !== orig.name) userData.name = data.name;
      if (data.email !== orig.email) userData.email = data.email;
      if (data.DOB !== (orig.DOB || '')) userData.DOB = data.DOB || null;
      if (data.gender !== orig.gender) userData.gender = data.gender;

      if (Object.keys(userData).length > 0) {
        const res = await userService.update(user?.user_id, userData);
        const updatedUser = res.data?.data;
        if (updatedUser) {
          originalRef.current = {
            name: updatedUser.name ?? orig.name,
            email: updatedUser.email ?? orig.email,
            DOB: updatedUser.DOB ?? orig.DOB,
            gender: updatedUser.gender ?? orig.gender,
          };
        }
      }

      if (shop?.shop_id && data.shop_name !== (shop?.shop_name || '')) {
        await shopService.update(shop.shop_id, { shop_name: data.shop_name });
        setShop(prev => prev ? { ...prev, shop_name: data.shop_name } : prev);
      }

      setSaveMessage('Profile updated successfully. Logging out...');
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err) {
      setSaveMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await userService.uploadAvatar(user?.user_id, formData);
      const base = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
      setAvatarUrl(`${base}${res.data.avatar_url}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading && !name) {
    return (
      <div className="dash-page">
        <ClientSidebar />
        <div className="dash-main">
          <div className="p-loading">
            <div className="p-spinner" />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page p-no-scroll">
      <ClientSidebar />
      <div className="dash-main">
        <Topbar title="My Profile" />

        <div className="p-content">
          <div className="p-grid">
            <div>
              <PersonalInfoCard
                name={name} email={email} dob={dob} gender={gender}
                joinedAt={joinedAt} loading={loading}
                avatarUrl={avatarUrl} onAvatarUpload={handleAvatarUpload}
                uploadingAvatar={uploadingAvatar}
              />
            </div>

            <div className="p-right-col">
              <div className="p-form-row">
                <ShopInfoCard shop={shop} />
              </div>
              <EditProfileForm
                name={name} email={email} dob={dob} gender={gender}
                shopName={shop?.shop_name}
                onSave={handleSave} saving={saving} message={saveMessage}
              />
              <div className="p-form-row">
                {showPasswordForm ? (
                  <ChangePasswordCard
                    onChangePassword={handleChangePassword}
                    changing={changingPassword}
                    passwordMessage={passwordMessage}
                    onCancel={() => { setShowPasswordForm(false); setPasswordMessage(''); }}
                  />
                ) : (
                  <HelpActionsColumn onShowChangePassword={() => setShowPasswordForm(true)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
