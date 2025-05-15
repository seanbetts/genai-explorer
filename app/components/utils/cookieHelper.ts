'use client';

const COOKIE_NAME = 'bypassMobileNotification';

/**
 * Get the bypass cookie if it exists
 */
export function getBypassCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const cookies = document.cookie.split('; ');
  const bypassCookie = cookies.find(cookie => cookie.startsWith(`${COOKIE_NAME}=`));
  
  if (bypassCookie) {
    return bypassCookie.split('=')[1];
  }
  
  return undefined;
}

/**
 * Check if the mobile notification bypass cookie exists
 */
export function hasBypassCookie(): boolean {
  return getBypassCookie() === 'true';
}

/**
 * Set the bypass cookie
 * @param hours Hours until expiry (default: 1 hour)
 */
export function setBypassCookie(hours = 1): void {
  if (typeof document === 'undefined') return;
  
  const maxAge = hours * 60 * 60;
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
  
  document.cookie = `${COOKIE_NAME}=true; path=/; max-age=${maxAge}; expires=${expires}; SameSite=Lax`;
  
  console.log(`🍪 Bypass cookie set, expires in ${hours} hour(s)`);
}

/**
 * Clear the bypass cookie
 */
export function clearBypassCookie(): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  
  console.log('🍪 Bypass cookie cleared');
}