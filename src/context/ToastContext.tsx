import React, { createContext, useState, useContext, ReactNode } from 'react';
import ToastMessage from '@/components/ToastMessage';
interface ToastType {
    heading: string;
    message: string;
    duration?: number;
    type: 'success' | 'warn' | 'info' | 'error';
}

interface ToastContextType {
    success: (data: ToastType) => void;
    warning: (data: ToastType) => void;
    info: (data: ToastType) => void;
    error: (data: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toastData, setToastData] = useState<ToastType | null>(null);

    const toastMessageFn = (data: ToastType) => {
        setToastData(data);
        setTimeout(() => {
            setToastData(null);
        }, data.duration || 3000);
    };

    const success = (data: ToastType) => {
        const toastData: ToastType = { ...data, type: "success" };
        toastMessageFn(toastData);
    };

    const warning = (data: ToastType) => {
        const toastData: ToastType = { ...data, type: "warn" };
        toastMessageFn(toastData);
    };

    const info = (data: ToastType) => {
        const toastData: ToastType = { ...data, type: "info" };
        toastMessageFn(toastData);
    };

    const error = (data: ToastType) => {
        const toastData: ToastType = { ...data, type: "error" };
        toastMessageFn(toastData);
    };

    const value: ToastContextType = { success, warning, info, error };

    return (
        <ToastContext.Provider value={value}>
            {toastData && <ToastMessage toast={toastData} />}
            {children}
        </ToastContext.Provider>
    );
}

// Hook untuk menggunakan ToastContext
export function useToastContext() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
}