/**
 * Toast notification system for user feedback
 */

type NotificationType = 'error' | 'success' | 'info' | 'warning';

interface NotificationOptions {
  type: NotificationType;
  message: string;
  duration?: number;
}

const NOTIFICATION_DURATION = 5000;

/**
 * Show a toast notification to the user
 */
export function showNotification(options: NotificationOptions): void {
  const { type, message, duration = NOTIFICATION_DURATION } = options;

  const notification = createNotificationElement(type, message);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
  }, 100);

  setTimeout(() => {
    notification.remove();
  }, duration);
}

function createNotificationElement(type: NotificationType, message: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'notification-toast';
  container.setAttribute('role', 'alert');
  container.setAttribute('aria-live', 'assertive');

  const colors = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const icons = {
    error: '✕',
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
  };

  container.innerHTML = `
    <div class="flex items-center gap-3 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg max-w-md">
      <span class="text-xl font-bold">${icons[type]}</span>
      <span class="flex-1">${escapeHtml(message)}</span>
    </div>
  `;

  return container;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show an error notification
 */
export function showError(message: string, duration?: number): void {
  showNotification({ type: 'error', message, duration });
}

/**
 * Show a success notification
 */
export function showSuccess(message: string, duration?: number): void {
  showNotification({ type: 'success', message, duration });
}

/**
 * Show an info notification
 */
export function showInfo(message: string, duration?: number): void {
  showNotification({ type: 'info', message, duration });
}

/**
 * Show a warning notification
 */
export function showWarning(message: string, duration?: number): void {
  showNotification({ type: 'warning', message, duration });
}
