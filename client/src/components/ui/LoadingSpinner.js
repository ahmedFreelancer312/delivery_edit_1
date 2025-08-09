import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = size === 'small' ? 'spinner-sm' : size === 'large' ? 'spinner-lg' : '';
  
  return (
    <div className={`spinner ${sizeClass}`}>
      <div className="spinner-border"></div>
    </div>
  );
};

export default LoadingSpinner;