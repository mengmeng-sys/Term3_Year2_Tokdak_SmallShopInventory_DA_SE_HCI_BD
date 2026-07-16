import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Mail, Info, ArrowRight, CheckCircle, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "../../components/common/AdminSidebar";
import NotificationDropdown from "../../components/common/NotificationDropdown";
import api from "../../services/axiosInstance";
import "../../styles/add-new-shop.css";

const OTP_LEN = 6;

const AddShop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [ownerName, setOwnerName]     = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [dob, setDob]                 = useState("");
  const [gender, setGender]           = useState("");
  const [shopName, setShopName]       = useState("");
  const [address, setAddress]         = useState("");
  const [phone, setPhone]             = useState("");

  const [otp, setOtp]                 = useState(Array(OTP_LEN).fill(""));
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === 2) otpRefs.current[0]?.focus();
  }, [step]);

  const getUserInitials = () => {
    if (!user?.name) return "A";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleSendVerification = async () => {
    if (!ownerName || !email || !password || !shopName) {
      alert("Owner Name, Email, Password, and Shop Name are required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: ownerName, email, password,
        DOB: dob || null, gender: gender || null,
        shop_name: shopName, address: address || null, phone: phone || null
      });
      setStep(2);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    const digit = val.replace(/\D/, "").slice(-1);
    const next = [...otp]; next[idx] = digit; setOtp(next);
    if (digit && idx < OTP_LEN - 1) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!text) return;
    e.preventDefault();
    const next = [...otp];
    text.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(text.length, OTP_LEN - 1)]?.focus();
  };

  const otpFilled = otp.every(d => d !== "");

  const handleVerifyOtp = async () => {
    if (!otpFilled) return;
    setLoading(true);
    try {
      const otpCode = otp.join("");
      await api.post("/auth/verify-registration", { email, otp: otpCode });
      setSuccess(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtp(Array(OTP_LEN).fill(""));
    handleSendVerification();
  };

  return (
    <div className="ans-page">
      <AdminSidebar />
      <div className="ans-main">
        <div className="ans-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/admin/shops')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 4.5L7 10l5.5 5.5" stroke="#a04100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="ans-topbar-title">Add New Shop</span>
          </div>
          <div className="ans-topbar-right">
            <NotificationDropdown />
            <Mail size={20} color="#5f5e5e" />
            <div style={{ width: 1, height: 32, backgroundColor: "#e2dfde" }} />
            <div className="ans-topbar-avatar">{getUserInitials()}</div>
          </div>
        </div>

        <div className="ans-content">
          <div className="ans-steps" style={{ maxWidth: 800, width: "100%", marginBottom: 32 }}>
            <div className={`ans-step-line ${step === 2 ? "done" : ""}`} />
            <div className="ans-step-item left">
              <div className="ans-step-circle active">1</div>
              <span className="ans-step-label active">Shop Info</span>
            </div>
            <div className={`ans-step-item right ${step === 2 ? "active" : ""}`}>
              <div className={`ans-step-circle ${step === 2 ? "active" : "inactive"}`}>
                {step === 2 ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7.5l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : "2"}
              </div>
              <span className={`ans-step-label ${step === 2 ? "active" : "inactive"}`}>Verify Email</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="ans-form-card">
              <div className="ans-form-grid">
                <div>
                  <div className="ans-section-title">Owner Details</div>
                  <div className="ans-field">
                    <label className="ans-label">Owner Name</label>
                    <input className="ans-input" placeholder="Full name" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                  </div>
                  <div className="ans-field">
                    <label className="ans-label">Email Address</label>
                    <input className="ans-input" type="email" placeholder="owner@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="ans-field">
                    <label className="ans-label">Temporary Password</label>
                    <div style={{ position: "relative" }}>
                      <input className="ans-input" type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#5f5e5e" }}>
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="ans-field">
                    <label className="ans-label">Date of Birth</label>
                    <input className="ans-input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                  </div>
                  <div className="ans-field">
                    <label className="ans-label">Gender</label>
                    <div style={{ position: "relative" }}>
                      <select className="ans-select" value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="ans-section-title">Shop Details</div>
                  <div className="ans-field">
                    <label className="ans-label">Shop Name</label>
                    <input className="ans-input" placeholder="e.g. Tokdak Mart Central" value={shopName} onChange={e => setShopName(e.target.value)} />
                  </div>
                  <div className="ans-field">
                    <label className="ans-label">Business Address</label>
                    <textarea className="ans-textarea" placeholder="Street address, City, Postal Code" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div className="ans-field" style={{ paddingBottom: 24 }}>
                    <label className="ans-label">Phone Number</label>
                    <div className="ans-phone-row">
                      <div className="ans-phone-prefix">+855</div>
                      <input className="ans-phone-input" placeholder="000-000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="ans-alert">
                    <Info size={20} color="#a04100" style={{ flexShrink: 0 }} />
                    <p className="ans-alert-text">A verification email will be sent to the owner&apos;s address. The account will remain inactive until verified.</p>
                  </div>
                </div>
              </div>

              <div className="ans-footer-action">
                <button className="ans-btn-submit" onClick={handleSendVerification} disabled={loading}>
                  {loading ? (
                    <span className="ans-loading">
                      <span className="ans-spinner" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Verification Email
                      <ArrowRight size={16} color="white" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="otp-card">
              <div className="otp-card-body">
                <div className="otp-icon-wrap">
                  <Mail size={28} color="#ff6b00" />
                </div>
                <h2 className="otp-heading">Verification Code Sent</h2>
                <p className="otp-subheading">
                  Enter the 6-digit code sent to{" "}
                  <span className="otp-email-highlight">{email}</span>
                </p>

                <div className="otp-boxes-row" onPaste={handlePaste}>
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      className={`otp-box${d ? " filled" : ""}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>

                <button className="otp-btn-verify" onClick={handleVerifyOtp} disabled={!otpFilled || loading}>
                  {loading ? (
                    <span className="ans-loading">
                      <span className="ans-spinner" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify and Create Account"
                  )}
                </button>

                <div className="otp-resend">
                  <span>Didn&apos;t receive a code?</span>
                  <button className="otp-resend-link" onClick={handleResend}>Resend Code</button>
                </div>
              </div>

              <div className="otp-card-footer">
                <ShieldAlert size={20} color="#5f5e5e" style={{ flexShrink: 0 }} />
                <p className="otp-footer-text">
                  Security check: This code expires in 10 minutes. Please do not share this code with anyone.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="ans-footer">© {new Date().getFullYear()} TOKDAK Admin Portal. System Version 2.4.0-release</div>
      </div>

      {success && (
        <div className="otp-success-overlay">
          <div className="otp-success-card">
            <div className="otp-success-icon">
              <CheckCircle size={40} color="#16a34a" />
            </div>
            <h2 className="otp-success-title">Account Created<br />Successfully</h2>
            <p className="otp-success-sub">
              A welcome email with the temporary password has been sent to <strong>{email}</strong>. The owner can log in and change their password.
            </p>
            <button className="otp-btn-dashboard" onClick={() => navigate("/admin/shops")}>
              Go to Shops
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddShop;
