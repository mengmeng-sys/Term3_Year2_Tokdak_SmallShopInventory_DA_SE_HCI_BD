import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import authService from '../../services/authService';
import userService from '../../services/userService';
import { formatDate } from '../../utils/formatDate';
import '../../styles/adminProfile.css';

function BellIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M16 17H0v-2l2-2V8c0-3.31 2.69-6 6-6s6 2.69 6 6v5l2 2v2zM8 20a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2z" fill="#5f5e5e"/>
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="16.7" height="15" viewBox="0 0 16.6667 15" fill="none">
      <path d="M6.667 0L5.2 1.667H0V15h16.667V1.667h-5.2L10 0H6.667zM8.333 12.5a4.167 4.167 0 1 1 0-8.333 4.167 4.167 0 0 1 0 8.333z" fill="#ff6b00"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 14.25V16h1.75l7.87-7.87-1.75-1.75L2 14.25zM15.96 5.29a.996.996 0 0 0 0-1.41L14.12 2.04a.996.996 0 0 0-1.41 0l-1.06 1.06 1.75 1.75 1.06-1.06z" fill="#5f5e5e"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M8 0C5.24 0 3 2.24 3 5v1H1.5C.67 6 0 6.67 0 7.5v11c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5H13V5c0-2.76-2.24-5-5-5zm0 3c1.1 0 2 .9 2 2v1H6V5c0-1.1.9-2 2-2zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="#ff6b00"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16.7" height="13.3" viewBox="0 0 16.6667 13.3333" fill="none">
      <path d="M16.667 2c0-1.1-.9-2-2-2H2C.9 0 0 .9 0 2v.222l8.333 5.556L16.667 2.222V2zm0 3.611L8.333 11.167 0 5.611V11.333c0 1.1.9 2 2 2h12.667c1.1 0 2-.9 2-2V5.611z" fill="#5f5e5e"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="16.7" viewBox="0 0 15 16.6667" fill="none">
      <path d="M13.333 1.667h-.833V0H10v1.667H5V0H2.5v1.667h-.833C.833 1.667 0 2.5 0 3.333V15c0 .833.833 1.667 1.667 1.667h11.666c.833 0 1.667-.834 1.667-1.667V3.333c0-.833-.834-1.666-1.667-1.666zm0 13.333H1.667V5.833h11.666V15z" fill="#5f5e5e"/>
    </svg>
  );
}

const AdminProfile = () => {
  const { user } = useAuth();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [joinedAt, setJoinedAt] = useState('');

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    mountedRef.current = true;
    const fetchProfile = async () => {
      try {
        const res = await authService.getMe();
        if (!mountedRef.current) return;
        const data = res.data?.data || res.data || {};
        setName(data.name || user?.name || '');
        setEmail(data.email || user?.email || '');
        setDob(data.DOB || '');
        setGender(data.gender || 'Male');
        setJoinedAt(data.created_at || '');
      } catch {
        if (mountedRef.current) {
          setName(user?.name || '');
          setEmail(user?.email || '');
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    const fallbackTimer = setTimeout(() => {
      if (mountedRef.current) {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setLoading(false);
      }
    }, 8000);
    fetchProfile();
    return () => {
      mountedRef.current = false;
      clearTimeout(fallbackTimer);
    };
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      await userService.update(user?.user_id, { name, email, DOB: dob, gender });
      setSaveMessage('Profile updated successfully');
    } catch (err) {
      setSaveMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await authService.changePassword({ oldPassword, newPassword, confirmPassword });
      setPasswordSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const getUserInitials = () => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="ap-page">
        <AdminSidebar />
        <div className="ap-loading">
          <div className="ap-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-page">
      <AdminSidebar />

      <div className="ap-main">
        <div className="ap-topbar">
          <span className="ap-topbar-title">My Profile</span>
          <div className="ap-topbar-right" style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <button className="ap-notif-btn" onClick={() => setShowNotif(v => !v)}>
                <BellIcon />
                <span className="ap-notif-dot" />
              </button>
              {showNotif && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 280, background: '#fff', border: '1px solid #e2bfb0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, padding: 16 }}>
                  <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Notifications</p>
                  <p style={{ fontSize: 13, color: '#5f5e5e' }}>No new notifications</p>
                </div>
              )}
            </div>
            <div className="ap-topbar-avatar">
              {getUserInitials()}
            </div>
          </div>
        </div>

        <div className="ap-content">
          <div className="ap-grid">
            <div className="ap-profile-card">
              <div className="ap-avatar-wrap">
                <div className="ap-avatar-circle">{getUserInitials()}</div>
                <button className="ap-avatar-edit" onClick={() => fileInputRef.current?.click()}>
                  <CameraIcon />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) alert('Avatar upload coming soon');
                }} />
              </div>

              <div className="ap-profile-name">{name || 'Admin User'}</div>
              <div className="ap-admin-badge">ADMIN</div>
              <div className="ap-profile-bio">
                {user?.bio || 'Administrator at TOKDAK Retail Systems'}
              </div>

              <div className="ap-divider" />

              <div className="ap-profile-meta">
                <div className="ap-meta-row">
                  <MailIcon />
                  <span>{email}</span>
                </div>
                <div className="ap-meta-row">
                  <CalendarIcon />
                  <span>Joined {formatDate(joinedAt)}</span>
                </div>
              </div>
            </div>

            <div className="ap-right-col">
              <div className="ap-card" ref={formRef}>
                <div className="ap-card-heading">
                  <span className="ap-card-title">Edit Profile</span>
                  <button className="ap-card-edit-btn" onClick={() => formRef.current?.querySelector('input')?.focus()}>
                    <EditIcon />
                  </button>
                </div>

                <div className="ap-form-grid">
                  <div className="ap-field">
                    <label className="ap-field-label">Name</label>
                    <input className="ap-field-input" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="ap-field">
                    <label className="ap-field-label">Email</label>
                    <input className="ap-field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="ap-field">
                    <label className="ap-field-label">Date of Birth</label>
                    <input className="ap-field-input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                  </div>
                  <div className="ap-field">
                    <label className="ap-field-label">Gender</label>
                    <div className="ap-select-wrap">
                      <select className="ap-field-select" value={gender} onChange={e => setGender(e.target.value)}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      <svg className="ap-select-chevron" width="12" height="7.4" viewBox="0 0 12 7.4" fill="none">
                        <path d="M1.41 0L6 4.58 10.59 0 12 1.41l-6 6-6-6L1.41 0z" fill="#5f5e5e" />
                      </svg>
                    </div>
                  </div>
                </div>

                {saveMessage && (
                  <div className={`ap-save-message ${saving ? '' : saveMessage.includes('success') ? 'ap-success' : 'ap-error'}`}>
                    {saveMessage}
                  </div>
                )}

                <div className="ap-save-row">
                  <button className="ap-btn-save" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              <div className="ap-card">
                <div className="ap-security-heading">
                  <LockIcon />
                  <span>Security</span>
                </div>

                {!showPasswordForm ? (
                  <div className="ap-password-row">
                    <div>
                    <div className="ap-password-info-title">Account Password</div>
                    <div className="ap-password-info-sub">{user?.password_changed_at ? `Last changed ${formatDate(user.password_changed_at)}.` : ''} We recommend updating your password regularly.</div>
                    </div>
                    <button className="ap-btn-change-pw" onClick={() => setShowPasswordForm(true)}>Change Password</button>
                  </div>
                ) : (
                  <div className="ap-password-form">
                    <div className="ap-field">
                      <label className="ap-field-label">Current Password</label>
                      <input className="ap-field-input" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                    </div>
                    <div className="ap-field">
                      <label className="ap-field-label">New Password</label>
                      <input className="ap-field-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <div className="ap-field">
                      <label className="ap-field-label">Confirm New Password</label>
                      <input className="ap-field-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    {passwordError && <div className="ap-error">{passwordError}</div>}
                    {passwordSuccess && <div className="ap-success">{passwordSuccess}</div>}
                    <div className="ap-pw-form-btns">
                      <button className="ap-btn-cancel" onClick={() => { setShowPasswordForm(false); setPasswordError(''); setPasswordSuccess(''); }}>Cancel</button>
                      <button className="ap-btn-save" onClick={handleChangePassword} disabled={changingPassword}>
                        {changingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="ap-danger-card">
                <div className="ap-danger-title">Danger Zone</div>
                <div className="ap-danger-row">
                  <div>
                    <div className="ap-danger-action-title">Deactivate Admin Access</div>
                    <div className="ap-danger-action-desc">Temporarily disable your administrative privileges and log out.</div>
                  </div>
                  <button className="ap-btn-deactivate" onClick={() => {
                    if (window.confirm('Are you sure you want to deactivate your admin access? You will be logged out immediately.')) {
                      localStorage.removeItem('tokdak_token');
                      window.location.href = '/login';
                    }
                  }}>Deactivate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
