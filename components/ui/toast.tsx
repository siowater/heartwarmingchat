'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener([...toasts]));
};

export const showToast = (message: string, type: ToastType = 'info') => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = { id, message, type };
  
  toasts = [...toasts, newToast];
  notifyListeners();

  // 3秒後に自動削除
  setTimeout(() => {
    removeToast(id);
  }, 3000);
};

const removeToast = (id: string) => {
  toasts = toasts.filter((toast) => toast.id !== id);
  notifyListeners();
};

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts);
    };
    
    toastListeners.push(listener);
    // 初期状態を設定
    listener([...toasts]);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up rounded-2xl px-6 py-4 shadow-soft-lg min-w-[300px] max-w-md"
          style={{
            backgroundColor: 
              toast.type === 'success' ? '#E0FFE9' :
              toast.type === 'error' ? '#FFE4EC' :
              '#E0EBFF',
            color:
              toast.type === 'success' ? '#1C1917' :
              toast.type === 'error' ? '#1C1917' :
              '#1C1917',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {toast.type === 'success' ? '✨' : toast.type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <p className="flex-1 font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-warm-500 hover:text-warm-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

