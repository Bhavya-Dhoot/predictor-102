import React from 'react';
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}
const AccessibleButton: React.FC<AccessibleButtonProps> = ({ label, ...props }) => (
  <button aria-label={label} {...props} className={['focus:outline-none focus:ring-2 focus:ring-blue-500', props.className].join(' ')}>
    {props.children || label}
  </button>
);
export default AccessibleButton;
