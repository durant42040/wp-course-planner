import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filters text to keep only Chinese characters
 */
export function filterChinese(text: string): string {
  const chineseOnly = text.match(/[\u4e00-\u9fff]+/);
  return chineseOnly ? chineseOnly.join("") : "";
}

/**
 * Filters text to keep only Chinese characters and numbers
 */
export function filterChineseAndNumbers(text: string): string {
  const chineseAndNumbers = text.match(/[\u4e00-\u9fff0-9]+/g);
  return chineseAndNumbers ? chineseAndNumbers.join("") : "";
}
