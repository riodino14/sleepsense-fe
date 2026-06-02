export function checkNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.requestPermission();
}

export function scheduleLocalNotification(title, options, delayMs) {
  if (Notification.permission !== 'granted') return;
  setTimeout(() => {
    new Notification(title, {
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      ...options
    });
  }, delayMs);
}

export function scheduleBedtimeReminder(bedtimeTime) {
  const [hours, minutes] = bedtimeTime.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours - 0, minutes - 30, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target.getTime() - now.getTime();
  scheduleLocalNotification('🌙 Waktunya bersiap tidur!', {
    body: 'Matikan layar dan rileks ya. Tidur berkualitas menanti!',
    tag: 'bedtime-reminder'
  }, delay);
}