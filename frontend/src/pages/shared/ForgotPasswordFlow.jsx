import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, Mail, KeyRound } from 'lucide-react';
import authService from '../../services/authService';
import TokdakLogo from '../../components/common/TokdakLogo';
import '../../styles/ForgotPassword.css';

const ForgotPasswordFlow = () => {
  const [screen, setScreen] = useState('forgot'); // forgot | otp | reset | success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Step 1: Request OTP
  const handleSendOTP = async () => {
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword(email);
      setScreen('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Just validate OTP format and move to reset screen
  const handleVerifyOtp = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    // Move to reset password screen
    setScreen('reset');
    setError('');
  };

  // Step 3: Reset password with OTP verification in one call
  const handleResetPassword = async () => {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Validate password has required characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must contain uppercase, lowercase, number, and special character');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const otpCode = otp.join('');
      
      //  CORRECT - Pass ONE object with all 4 fields
      await authService.resetPasswordOtp({
        email: email,
        otp: otpCode,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });
      
      setScreen('success');
    } catch (err) {
      console.error('Reset error:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      
      // If OTP is invalid or expired, go back to OTP screen
      if (errorMessage.toLowerCase().includes('otp') || 
          errorMessage.toLowerCase().includes('expired') ||
          errorMessage.toLowerCase().includes('incorrect')) {
        setTimeout(() => {
          setScreen('otp');
          setOtp(['', '', '', '', '', '']);
          setError('');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press on OTP inputs
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      handleVerifyOtp();
    }
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Handle Enter key on password fields
  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleResetPassword();
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-blob-orange" />
      <div className="fp-blob-blue" />

      {/* Forgot Password Screen */}
      {screen === 'forgot' && (
        <div className="fp-card">
          <div className="fp-card-inner">
            <div className="fp-logo">
              <TokdakLogo height={40} />
              <div className="fp-logo-sub">Small Shop Stock Inventory System</div>
            </div>

            <div className="fp-icon-wrap orange">
              <Mail size={48} color="#ff6b00" />
            </div>

            <h1 className="fp-heading">Forgot Password?</h1>
            <p className="fp-subheading">
              Enter your registered email address and we'll send you a one-time password (OTP).
            </p>

            <div className="fp-form">
              <div className="fp-field">
                <label className="fp-label">Email Address</label>
                <input
                  type="email"
                  className="fp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                />
              </div>

              {error && <p className="fp-error-msg">{error}</p>}

              <button 
                className="fp-btn" 
                onClick={handleSendOTP}
                disabled={!email || loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>

              <button className="fp-link muted" onClick={() => navigate('/login')}>
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Screen */}
      {screen === 'otp' && (
        <div className="fp-card">
          <div className="fp-card-inner">
            <div className="fp-icon-wrap orange">
              <KeyRound size={48} color="#ff6b00" />
            </div>

            <h1 className="fp-heading">Verify Your Email</h1>
            <p className="fp-subheading">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>

            <div className="fp-otp-row">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="fp-otp-box"
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && <p className="fp-error-msg">{error}</p>}

            <button 
              className="fp-btn" 
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length !== 6}
            >
              Verify & Continue
            </button>

            <button 
              className="fp-link muted" 
              onClick={() => {
                setScreen('forgot');
                setError('');
                setOtp(['', '', '', '', '', '']);
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Screen */}
      {screen === 'reset' && (
        <div className="fp-card">
          <div className="fp-card-inner">
            <h1 className="fp-heading">Create New Password</h1>
            <p className="fp-subheading">Please enter and confirm your new password.</p>

            <div className="fp-form">
              <div className="fp-field">
                <label className="fp-label">New Password</label>
                <div className="fp-password-wrap">
                  <input
                    type={showNewPw ? "text" : "password"}
                    className="fp-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Must be 8+ chars with uppercase, lowercase, number, special"
                    disabled={loading}
                    onKeyDown={handlePasswordKeyDown}
                  />
                  <button 
                    type="button"
                    className="fp-eye-btn" 
                    onClick={() => setShowNewPw(!showNewPw)}
                    disabled={loading}
                  >
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="fp-field">
                <label className="fp-label">Confirm New Password</label>
                <div className="fp-password-wrap">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    className="fp-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    disabled={loading}
                    onKeyDown={handlePasswordKeyDown}
                  />
                  <button 
                    type="button"
                    className="fp-eye-btn" 
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    disabled={loading}
                  >
                    {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="fp-error-msg">{error}</p>}

              <button 
                className="fp-btn" 
                onClick={handleResetPassword}
                disabled={!newPassword || !confirmPassword || loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <button 
                className="fp-link muted" 
                onClick={() => {
                  setScreen('otp');
                  setError('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Screen */}
      {screen === 'success' && (
        <div className="fp-card">
          <div className="fp-card-inner">
            <div className="fp-icon-wrap green">
              <CheckCircle2 size={64} color="#16a34a" />
            </div>

            <h1 className="fp-heading">Password Reset Successful!</h1>
            <p className="fp-subheading">
              Your password has been updated successfully.<br />
              You can now sign in with your new password.
            </p>

            <button className="fp-btn" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordFlow;