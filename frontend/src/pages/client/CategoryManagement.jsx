import { useState, useEffect, useRef, useCallback } from 'react';
import Topbar from '../../components/common/Topbar';
import ClientSidebar from '../../components/common/ClientSidebar';
import CategoryCard from '../../components/client/CategoryCard';
import categoryService from '../../services/categoryService';
import '../../styles/adminDashboard.css';
import '../../styles/Category.css';

const DEFAULT_ICON = {
  path: "M12 2L2 7v1h20V7L12 2zM4 12h2v6H4v-6zm5 0h2v6H9v-6zm5 0h2v6h-2v-6zm5 0h2v6h-2v-6zM2 20h20v2H2v-2z",
  viewBox: "0 0 24 24",
};

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
    <path d="M16.5 16.5l-3.675-3.675M14.25 8.25A6 6 0 118.25 2.25a6 6 0 016 6z" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
    <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
    <path d="M1 1l12 12M13 1L1 13" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

function CategoryModal({ open, onClose, title, name, setName, description, setDescription, error, onSubmit, submitLabel, submitting }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cat-modal-overlay" onClick={onClose}>
      <div className="cat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cat-modal-header">
          <h2 className="cat-modal-title">{title}</h2>
          <button className="cat-modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="cat-modal-body">
          <label className="cat-modal-label" htmlFor="cat-name-input">Category Name</label>
          <input
            ref={inputRef}
            id="cat-name-input"
            className="cat-modal-input"
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }}
            maxLength={100}
          />
          <div className="cat-modal-field-gap" />
          <label className="cat-modal-label" htmlFor="cat-desc-input">
            Description <span className="cat-modal-optional">(Optional)</span>
          </label>
          <textarea
            id="cat-desc-input"
            className="cat-modal-input cat-modal-textarea"
            placeholder="Brief description of this category"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={255}
          />
          {error && <p className="cat-modal-error">{error}</p>}
        </div>
        <div className="cat-modal-footer">
          <button className="cat-modal-btn cat-modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button
            className="cat-modal-btn cat-modal-btn--confirm"
            onClick={onSubmit}
            disabled={submitting || !name.trim()}
          >
            {submitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ open, onClose, category, onConfirm, submitting }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || !category) return null;

  const hasProducts = category.product_count > 0;

  return (
    <div className="cat-modal-overlay" onClick={onClose}>
      <div className="cat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cat-modal-header">
          <h2 className="cat-modal-title">Delete Category</h2>
          <button className="cat-modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="cat-modal-body">
          {hasProducts ? (
            <p className="cat-delete-msg">
              Cannot delete <strong>{category.name}</strong> because it has {category.product_count} product{category.product_count !== 1 ? 's' : ''} assigned to it. Please reassign or remove those products first.
            </p>
          ) : (
            <p className="cat-delete-msg">
              Are you sure you want to delete <strong>{category.name}</strong>? This action cannot be undone.
            </p>
          )}
        </div>
        <div className="cat-modal-footer">
          <button className="cat-modal-btn cat-modal-btn--cancel" onClick={onClose}>Cancel</button>
          {!hasProducts && (
            <button
              className="cat-modal-btn cat-modal-btn--delete"
              onClick={onConfirm}
              disabled={submitting}
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const CategoryManagement = () => {
  const mountedRef = useRef(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      if (!mountedRef.current) return;
      const data = res.data?.data || res.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      if (!mountedRef.current) return;
      setCategories([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    const trimmed = createName.trim();
    if (!trimmed) return;
    setCreateError('');
    setCreateSubmitting(true);
    try {
      const payload = { name: trimmed };
      const desc = createDesc.trim();
      if (desc) payload.description = desc;
      await categoryService.create(payload);
      setCreateOpen(false);
      setCreateName('');
      setCreateDesc('');
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create category';
      setCreateError(msg);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleEdit = async () => {
    const trimmed = editName.trim();
    if (!trimmed || !editCategory) return;
    setEditError('');
    setEditSubmitting(true);
    try {
      const payload = { name: trimmed };
      const desc = editDesc.trim();
      payload.description = desc || null;
      await categoryService.update(editCategory.category_id, payload);
      setEditOpen(false);
      setEditCategory(null);
      setEditName('');
      setEditDesc('');
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update category';
      setEditError(msg);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    setDeleteSubmitting(true);
    try {
      await categoryService.remove(deleteCategory.category_id);
      setDeleteOpen(false);
      setDeleteCategory(null);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete category';
      alert(msg);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const openEdit = (cat) => {
    setEditCategory(cat);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
    setEditError('');
    setEditOpen(true);
  };

  const openDelete = (cat) => {
    setDeleteCategory(cat);
    setDeleteOpen(true);
  };

  return (
    <div className="dash-page">
      <ClientSidebar />
      <div className="dash-main">
        <Topbar title="Category Management" />
        <div className="dash-content">

          <div className="cat-controls-row">
            <div className="cat-search-wrap">
              <div className="cat-search-icon"><SearchIcon /></div>
              <input
                className="cat-search-input"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="cat-add-btn" onClick={() => { setCreateName(''); setCreateDesc(''); setCreateError(''); setCreateOpen(true); }}>
              <PlusIcon />
              <span>Add Category</span>
            </button>
          </div>

          {loading ? (
            <div className="dash-empty-state">Loading categories...</div>
          ) : filtered.length === 0 ? (
            <div className="dash-empty-state">
              {search ? 'No categories match your search' : 'No categories yet. Add your first category!'}
            </div>
          ) : (
            <div className="cat-grid">
              {filtered.map((cat) => (
                <CategoryCard
                  key={cat.category_id}
                  iconPath={DEFAULT_ICON.path}
                  iconViewBox={DEFAULT_ICON.viewBox}
                  name={cat.name}
                  description={cat.description || `${cat.product_count} product${cat.product_count !== 1 ? 's' : ''} in this category`}
                  productCount={`${cat.product_count} Product${cat.product_count !== 1 ? 's' : ''}`}
                  onEdit={() => openEdit(cat)}
                  onDelete={() => openDelete(cat)}
                />
              ))}
            </div>
          )}

          <CategoryModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            title="Add Category"
            name={createName}
            setName={setCreateName}
            description={createDesc}
            setDescription={setCreateDesc}
            error={createError}
            onSubmit={handleCreate}
            submitLabel="Add"
            submitting={createSubmitting}
          />

          <CategoryModal
            open={editOpen}
            onClose={() => { setEditOpen(false); setEditCategory(null); }}
            title="Edit Category"
            name={editName}
            setName={setEditName}
            description={editDesc}
            setDescription={setEditDesc}
            error={editError}
            onSubmit={handleEdit}
            submitLabel="Save"
            submitting={editSubmitting}
          />

          <DeleteModal
            open={deleteOpen}
            onClose={() => { setDeleteOpen(false); setDeleteCategory(null); }}
            category={deleteCategory}
            onConfirm={handleDelete}
            submitting={deleteSubmitting}
          />

        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
