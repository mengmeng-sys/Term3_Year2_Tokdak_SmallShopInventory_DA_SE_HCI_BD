import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/common/AdminSidebar';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import authService from '../../services/authService';
import userService from '../../services/userService';
import { formatDate } from '../../utils/formatDate';
import '../../styles/adminProfile.css';

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
  const { user, updateUser } = useAuth();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const originalRef = useRef({});

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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    const fetchProfile = async () => {
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
      const orig = originalRef.current;
      const userData = {};
      if (name !== orig.name) userData.name = name;
      if (email !== orig.email) userData.email = email;
      if (dob !== (orig.DOB || '')) userData.DOB = dob || null;
      if (gender !== orig.gender) userData.gender = gender;

      if (Object.keys(userData).length === 0) {
        setSaveMessage('No changes to save');
        setSaving(false);
        return;
      }

      const response = await userService.update(user?.user_id, userData);
      const updatedUser = response.data?.data;
      if (updatedUser) {
        updateUser({ name: updatedUser.name, email: updatedUser.email });
        originalRef.current = {
          name: updatedUser.name ?? orig.name,
          email: updatedUser.email ?? orig.email,
          DOB: updatedUser.DOB ?? orig.DOB,
          gender: updatedUser.gender ?? orig.gender,
        };
      } else {
        updateUser({ name, email });
      }
      setSaveMessage('Profile updated successfully');
    } catch (err) {
      setSaveMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Only image files are allowed (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be 5MB or less');
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await userService.uploadAvatar(user?.user_id, formData);
      const base = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
      const avatarUrlValue = `${base}${res.data.avatar_url}`;
      setAvatarUrl(avatarUrlValue);
      updateUser({ avatar_url: res.data.avatar_url });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
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
            <NotificationDropdown />
            <div className="ap-topbar-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                getUserInitials()
              )}
            </div>
          </div>
        </div>

        <div className="ap-content">
          <div className="ap-grid">
            <div className="ap-profile-card">
              <div className="ap-avatar-wrap">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="ap-avatar-img" />
                ) : (
                  <div className="ap-avatar-circle">{getUserInitials()}</div>
                )}
                <button className="ap-avatar-edit" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}>
                  {uploadingAvatar ? <div className="ap-avatar-spinner" /> : <CameraIcon />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={handleAvatarUpload} />
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
