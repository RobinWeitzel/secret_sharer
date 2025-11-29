export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

async function sendMessage(type: string, payload?: unknown): Promise<unknown> {
  const controller = navigator.serviceWorker.controller;

  if (!controller) {
    throw new Error('No service worker controller available');
  }

  const messageChannel = new MessageChannel();

  return new Promise((resolve, reject) => {
    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data);
      }
    };

    controller.postMessage(
      { type, payload },
      [messageChannel.port2]
    );
  });
}

export async function storeData(data: string): Promise<void> {
  await sendMessage('STORE_DATA', data);
}

export async function storeKey(key: string): Promise<void> {
  await sendMessage('STORE_KEY', key);
}

export async function getData(): Promise<string | null> {
  const response = await sendMessage('GET_DATA') as { data: string | null };
  return response.data;
}

export async function getKey(): Promise<string | null> {
  const response = await sendMessage('GET_KEY') as { key: string | null };
  return response.key;
}

export async function getAll(): Promise<{ data: string | null; key: string | null }> {
  const response = await sendMessage('GET_ALL') as { data: string | null; key: string | null };
  return response;
}

export async function clearStorage(): Promise<void> {
  await sendMessage('CLEAR');
}
