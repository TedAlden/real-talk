import React from 'react';
import { Toast } from 'flowbite-react';
import {
  HiInformationCircle,
} from 'react-icons/hi';

// Icon mapping for different alert types
const ICONS = {
  info: HiInformationCircle,
};

/**
 * A toast alert component that appears below the timer bar
 * @param {boolean} show - Controls alert visibility
 * @param {function} onClose - Handler for closing the alert
 * @param {string} color - Alert variant type (currently only 'info')
 * @param {string} title - Main alert heading
 * @param {string} message - Optional alert description
 */
export default function Alert({ show, onClose, color = 'info', title, message }) {
  // Get appropriate icon based on alert type
  const Icon = ICONS[color] || ICONS.info;

  if (!show) return null;

  return (
    // Container with central positioning
    <div className="absolute inset-x-0 top-[80px] flex justify-center z-50">
      <Toast className="whitespace-nowrap">
        {/* Icon section */}
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <Icon className="h-6 w-6" />
        </div>
        {/* Alert content */}
        <div className="ml-1 text-sm font-normal">
          <span className="font-semibold">{title}</span>{message && ` ${message}`}
        </div>
        {/* Close button */}
        <Toast.Toggle onClick={onClose} />
      </Toast>
    </div>
  );
}
