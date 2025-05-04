import React from 'react';
import { Toast } from 'flowbite-react';
import {
  HiInformationCircle,
} from 'react-icons/hi';

const ICONS = {
  info: HiInformationCircle,
};

export default function Alert({ show, onClose, color = 'info', title, message }) {
  const Icon = ICONS[color] || ICONS.info;

  if (!show) return null;

  return (
    <div className="absolute inset-x-0 top-[80px] flex justify-center z-50">
      <Toast className="whitespace-nowrap">
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-1 text-sm font-normal">
          <span className="font-semibold">{title}</span>{message && ` ${message}`}
        </div>
        <Toast.Toggle onClick={onClose} />
      </Toast>
    </div>
  );
}
