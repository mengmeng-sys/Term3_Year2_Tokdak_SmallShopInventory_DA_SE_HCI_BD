import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import '../../styles/adminDashboard.css';
import '../../styles/AddProduct.css';

const ICON_CHEVRON_DOWN =
  "M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4V7.4";
const ICON_BREADCRUMB_CHEVRON =
  "M3.06667 4L0 0.933333L0.933333 0L4.93333 4L0.933333 8L0 7.06667L3.06667 4V4";
const ICON_PLUS_CIRCLE =
  "M7.5 12.5H9.16667V9.16667H12.5V7.5H9.16667V4.16667H7.5V7.5H4.16667V9.16667H7.5V12.5V12.5M8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667V16.6667M8.33333 15C10.1944 15 11.7708 14.3542 13.0625 13.0625C14.3542 11.7708 15 10.1944 15 8.33333C15 6.47222 14.3542 4.89583 13.0625 3.60417C11.7708 2.3125 10.1944 1.66667 8.33333 1.66667C6.47222 1.66667 4.89583 2.3125 3.60417 3.60417C2.3125 4.89583 1.66667 6.47222 1.66667 8.33333C1.66667 10.1944 2.3125 11.7708 3.60417 13.0625C4.89583 14.3542 6.47222 15 8.33333 15V15";
const ICON_INFO =
  "M9 15H11V9H9V15V15M10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7V7M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20V20M10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18V18";
const ICON_BOX =
  "M3 20C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V6.725C0.7 6.54167 0.458333 6.30417 0.275 6.0125C0.0916667 5.72083 0 5.38333 0 5V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V5C20 5.38333 19.9083 5.72083 19.725 6.0125C19.5417 6.30417 19.3 6.54167 19 6.725V18C19 18.55 18.8042 19.0208 18.4125 19.4125C18.0208 19.8042 17.55 20 17 20H3V20M2 5H18V5V5V2V2V2H2V2V2V5V5V5V5M7 12H13V10H7V12V12";
const ICON_SYNC =
  "M0 16V14H2.75L2.35 13.65C1.48333 12.8833 0.875 12.0083 0.525 11.025C0.175 10.0417 0 9.05 0 8.05C0 6.2 0.554167 4.55417 1.6625 3.1125C2.77083 1.67083 4.21667 0.716667 6 0.25V2.35C4.8 2.78333 3.83333 3.52083 3.1 4.5625C2.36667 5.60417 2 6.76667 2 8.05C2 8.8 2.14167 9.52917 2.425 10.2375C2.70833 10.9458 3.15 11.6 3.75 12.2L4 12.45V10H6V16H0V16M10 15.75V13.65C11.2 13.2167 12.1667 12.4792 12.9 11.4375C13.6333 10.3958 14 9.23333 14 7.95C14 7.2 13.8583 6.47083 13.575 5.7625C13.2917 5.05417 12.85 4.4 12.25 3.8L12 3.55V6H10V0H16V2H13.25L13.65 2.35C14.4667 3.16667 15.0625 4.05417 15.4375 5.0125C15.8125 5.97083 16 6.95 16 7.95C16 9.8 15.4458 11.4458 14.3375 12.8875C13.2292 14.3292 11.7833 15.2833 10 15.75V15.75";

const ChevronDown = () => (
  <svg fill="none" viewBox="0 0 12 7.4" style={{ width: 12, height: 7.4 }}>
    <path d={ICON_CHEVRON_DOWN} fill="#5F5E5E" />
  </svg>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    unit: 'pcs',
    current_quantity: 0,
    min_quantity: 10,
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        if (!mountedRef.current) return;
        const data = res.data?.data || res.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch { /* ignore */ }
    };
    fetchCategories();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.category_id) errs.category_id = 'Please select a category';
    if (form.price === '' || form.price === null) errs.price = 'Price is required';
    if (form.current_quantity === '' || form.current_quantity === null) errs.current_quantity = 'Quantity is required';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setError('');
    try {
      await productService.create({
        name: form.name.trim(),
        category_id: Number(form.category_id),
        description: form.description.trim() || null,
        price: Number(form.price) || 0,
        current_quantity: Number(form.current_quantity) || 0,
        min_quantity: Number(form.min_quantity) || 0,
        unit: form.unit || 'pcs',
      });
      navigate('/client/products');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add product';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dash-page">
      <ClientSidebar />
      <div className="dash-main">
        <Topbar title="Add Product" />
        <div className="dash-content">

          <nav className="ap-breadcrumb" aria-label="Breadcrumb">
            <span className="ap-breadcrumb__link" onClick={() => navigate('/client/products')}>Products</span>
            <span className="ap-breadcrumb__sep">
              <svg fill="none" viewBox="0 0 4.93333 8" style={{ width: 4.9, height: 8 }}>
                <path d={ICON_BREADCRUMB_CHEVRON} fill="#5F5E5E" />
              </svg>
            </span>
            <span className="ap-breadcrumb__current">New Product</span>
          </nav>

          <div className="product-form-card">
            <div className="product-form-card__header">
              <p className="product-form-card__heading">Product Information</p>
              <p className="product-form-card__subheading">
                Fill in the details to list a new item in your inventory.
              </p>
            </div>

            <div className="product-form-card__body">
              <div className="product-form-card__columns">
                <div className="product-form-card__col">
                  <div className="ap-field">
                    <label className="ap-field__label">Product Name <span style={{ color: '#b91c1c' }}>*</span></label>
                    <input
                      className={`ap-field__input${fieldErrors.name ? ' ap-field__input--error' : ''}`}
                      type="text"
                      placeholder="e.g. Organic Green Tea"
                      value={form.name}
                      onChange={(e) => { handleChange('name')(e); setFieldErrors((prev) => ({ ...prev, name: '' })); }}
                    />
                    {fieldErrors.name && <p className="ap-field__error">{fieldErrors.name}</p>}
                  </div>
                  <div className="ap-field">
                    <label className="ap-field__label">Category <span style={{ color: '#b91c1c' }}>*</span></label>
                    <div className="ap-field__select-wrap">
                      <select
                        className={`ap-field__select${fieldErrors.category_id ? ' ap-field__select--error' : ''}`}
                        value={form.category_id}
                        onChange={(e) => { handleChange('category_id')(e); setFieldErrors((prev) => ({ ...prev, category_id: '' })); }}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <span className="ap-field__select-arrow"><ChevronDown /></span>
                    </div>
                    {fieldErrors.category_id && <p className="ap-field__error">{fieldErrors.category_id}</p>}
                  </div>
                  <div className="ap-field">
                    <label className="ap-field__label">Description</label>
                    <textarea
                      className="ap-field__textarea"
                      placeholder="Provide detailed information about the product..."
                      rows={5}
                      value={form.description}
                      onChange={handleChange('description')}
                    />
                  </div>
                </div>

                <div className="product-form-card__col">
                  <div className="ap-field">
                    <label className="ap-field__label">Price ($) <span style={{ color: '#b91c1c' }}>*</span></label>
                    <div className="ap-field__price-wrap">
                      <span className="ap-field__price-prefix">$</span>
                      <input
                        className={`ap-field__input ap-field__input--price${fieldErrors.price ? ' ap-field__input--error' : ''}`}
                        type="number"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                        value={form.price}
                        onChange={(e) => { handleChange('price')(e); setFieldErrors((prev) => ({ ...prev, price: '' })); }}
                      />
                    </div>
                    {fieldErrors.price && <p className="ap-field__error">{fieldErrors.price}</p>}
                  </div>
                  <div className="ap-field">
                    <label className="ap-field__label">Unit <span style={{ color: '#b91c1c' }}>*</span></label>
                    <div className="ap-field__select-wrap">
                      <select
                        className="ap-field__select"
                        value={form.unit}
                        onChange={handleChange('unit')}
                        required
                      >
                        <option value="">Select a unit</option>
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="L">L</option>
                        <option value="mL">mL</option>
                        <option value="box">box</option>
                        <option value="pack">pack</option>
                      </select>
                      <span className="ap-field__select-arrow"><ChevronDown /></span>
                    </div>
                  </div>
                  <div className="ap-field">
                    <label className="ap-field__label">Current Quantity <span style={{ color: '#b91c1c' }}>*</span></label>
                    <input
                      className={`ap-field__input${fieldErrors.current_quantity ? ' ap-field__input--error' : ''}`}
                      type="number"
                      min={0}
                      value={form.current_quantity}
                      onChange={(e) => { handleChange('current_quantity')(e); setFieldErrors((prev) => ({ ...prev, current_quantity: '' })); }}
                    />
                    {fieldErrors.current_quantity && <p className="ap-field__error">{fieldErrors.current_quantity}</p>}
                  </div>
                  <div className="ap-field">
                    <label className="ap-field__label">Minimum Quantity (Alert Threshold)</label>
                    <input
                      className="ap-field__input"
                      type="number"
                      min={0}
                      value={form.min_quantity}
                      onChange={handleChange('min_quantity')}
                    />
                    <p className="ap-field__helper">
                      System will notify you when stock levels drop below this value.
                    </p>
                  </div>
                </div>
              </div>

              {error && <p className="ap-field__error">{error}</p>}

              <div className="ap-actions">
                <button
                  className="ap-btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  <svg fill="none" viewBox="0 0 16.6667 16.6667">
                    <path d={ICON_PLUS_CIRCLE} fill="white" />
                  </svg>
                  {submitting ? 'Adding...' : 'Add Product'}
                </button>
                <button
                  className="ap-btn-secondary"
                  onClick={() => navigate('/client/products')}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="ap-info-cards">
            <div className="ap-info-card">
              <div className="ap-info-card__icon">
                <svg fill="none" viewBox="0 0 20 20">
                  <path d={ICON_INFO} fill="#FF6B00" />
                </svg>
              </div>
              <div className="ap-info-card__body">
                <p className="ap-info-card__title">Data Verification</p>
                <p className="ap-info-card__text">Ensure prices include all applicable taxes before saving.</p>
              </div>
            </div>
            <div className="ap-info-card">
              <div className="ap-info-card__icon">
                <svg fill="none" viewBox="0 0 20 20">
                  <path d={ICON_BOX} fill="#0062A1" />
                </svg>
              </div>
              <div className="ap-info-card__body">
                <p className="ap-info-card__title">Automatic Alerts</p>
                <p className="ap-info-card__text">Low stock notifications are based on your Minimum Quantity input.</p>
              </div>
            </div>
            <div className="ap-info-card">
              <div className="ap-info-card__icon">
                <svg fill="none" viewBox="0 0 16 16">
                  <path d={ICON_SYNC} fill="#636262" />
                </svg>
              </div>
              <div className="ap-info-card__body">
                <p className="ap-info-card__title">Live Sync</p>
                <p className="ap-info-card__text">Changes will reflect immediately across all connected shop devices.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;
