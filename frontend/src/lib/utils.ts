import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function getImageUrl(path: string | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const serverUrl = apiBase.replace(/\/api\/v1$|\/api$/, '');
    return `${serverUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}
