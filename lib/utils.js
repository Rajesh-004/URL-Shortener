import { customAlphabet } from 'nanoid';

// Generate a random code using A-Za-z0-9 with length 6-8
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 8);

export function generateShortCode() {
    return nanoid();
}

// Validate short code format: [A-Za-z0-9]{6,8}
export function isValidShortCode(code) {
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    return codeRegex.test(code);
}

// Validate URL format
export function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

// Format date for display
export function formatDate(date) {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
}

// Truncate long URLs for display
export function truncateUrl(url, maxLength = 50) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}
