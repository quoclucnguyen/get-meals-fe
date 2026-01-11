import { format, parse, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date to DD/MM/YYYY format
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "11/01/2026")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(d)) {
    return '';
  }
  
  return format(d, 'dd/MM/yyyy', { locale: vi });
}

/**
 * Format date with day name (e.g., "Thứ 2, 11/01/2026")
 * @param date - Date object or ISO string
 * @returns Formatted date string with day name
 */
export function formatDateWithDayName(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(d)) {
    return '';
  }
  
  return format(d, 'EEEE, dd/MM/yyyy', { locale: vi });
}

/**
 * Format date with day name only (e.g., "Thứ 2")
 * @param date - Date object or ISO string
 * @returns Formatted day name
 */
export function formatDayName(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(d)) {
    return '';
  }
  
  return format(d, 'EEEE', { locale: vi });
}

/**
 * Format date to time (e.g., "14:30")
 * @param date - Date object or ISO string
 * @returns Formatted time string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(d)) {
    return '';
  }
  
  return format(d, 'HH:mm', { locale: vi });
}

/**
 * Format date and time (e.g., "11/01/2026 14:30")
 * @param date - Date object or ISO string
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(d)) {
    return '';
  }
  
  return format(d, 'dd/MM/yyyy HH:mm', { locale: vi });
}

/**
 * Format date for display in UI (smart format)
 * - Today: "Hôm nay"
 * - Yesterday: "Hôm qua"
 * - Tomorrow: "Ngày mai"
 * - Otherwise: "Thứ 2, 11/01/2026"
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDateSmart(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (!isValid(d)) {
    return '';
  }
  
  // Compare dates without time
  const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
  if (dDate.getTime() === todayDate.getTime()) {
    return 'Hôm nay';
  } else if (dDate.getTime() === yesterdayDate.getTime()) {
    return 'Hôm qua';
  } else if (dDate.getTime() === tomorrowDate.getTime()) {
    return 'Ngày mai';
  } else {
    return formatDateWithDayName(d);
  }
}

/**
 * Parse DD/MM/YYYY string to Date object
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  try {
    const parsed = parse(dateString, 'dd/MM/yyyy', new Date());
    if (isValid(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if a date is today
 * @param date - Date object or ISO string
 * @returns True if the date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  if (!isValid(d)) {
    return false;
  }
  
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

/**
 * Get relative time (e.g., "2 giờ trước", "hôm qua")
 * @param date - Date object or ISO string
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  if (!isValid(d)) {
    return '';
  }
  
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'Vừa xong';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays === 1) {
    return 'Hôm qua';
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    return formatDate(d);
  }
}
