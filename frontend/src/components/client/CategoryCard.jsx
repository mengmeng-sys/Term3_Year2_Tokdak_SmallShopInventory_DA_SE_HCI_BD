import React from "react";

const svgPaths = {
  edit:   "M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16V16M0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0V18M16 3.4V3.4L14.6 2V2L16 3.4V3.4M12.475 5.525L11.775 4.8V4.8L13.2 6.225V6.225L12.475 5.525V5.525",
  delete: "M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3V18M13 3H3V16V16V16H13V16V16V3V3M5 14H7V5H5V14V14M9 14H11V5H9V14V14M3 3V3V16V16V16V16V16V16V3V3",
};

export default function CategoryCard({
  iconPath,
  iconViewBox,
  name,
  description,
  productCount,
  onEdit,
  onDelete,
}) {
  return (
    <div className="cat-card">
      <div aria-hidden className="cat-card-border" />

      <div className="cat-card-body">

        <div className="cat-card-header">
          <div className="cat-card-icon-wrap">
            <svg
              className="cat-card-icon"
              fill="none"
              viewBox={iconViewBox}
            >
              <path d={iconPath} fill="#A04100" />
            </svg>
          </div>
          <div className="cat-card-badge">
            <span>{productCount}</span>
          </div>
        </div>

        <div className="cat-card-name-wrap">
          <p className="cat-card-name">{name}</p>
        </div>

        <div className="cat-card-desc-wrap">
          <p className="cat-card-desc">{description}</p>
        </div>

        <div className="cat-card-footer">
          <div aria-hidden className="cat-card-footer-line" />
          <div className="cat-card-actions">
            <button
              onClick={onEdit}
              className="cat-card-action-btn"
              aria-label={`Edit ${name}`}
            >
              <div className="cat-card-action-icon">
                <svg fill="none" viewBox="0 0 18 18">
                  <path d={svgPaths.edit} fill="#5F5E5E" />
                </svg>
              </div>
            </button>
            <button
              onClick={onDelete}
              className="cat-card-action-btn"
              aria-label={`Delete ${name}`}
            >
              <div className="cat-card-action-icon cat-card-action-icon--delete">
                <svg fill="none" viewBox="0 0 16 18">
                  <path d={svgPaths.delete} fill="#5F5E5E" />
                </svg>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
