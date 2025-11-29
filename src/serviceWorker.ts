interface ServiceWorkerMessage<T = void> {
  type: string;
  payload?: T;
}

interface ServiceWorkerResponse<T = unknown> {
  error?: string;
  data?: T;
  key?: T;
  success?: boolean;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return null;
  }

  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const swPath = `${baseUrl}sw.js`;
    const registration = await navigator.serviceWorker.register(swPath);
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

async function sendMessage<TPayload = void, TResponse = unknown>(
  type: string,
  payload?: TPayload
): Promise<TResponse> {
  const controller = navigator.serviceWorker.controller;

  if (!controller) {
    throw new Error('No service worker controller available');
  }

  const messageChannel = new MessageChannel();

  return new Promise<TResponse>((resolve, reject) => {
    messageChannel.port1.onmessage = (event: MessageEvent<ServiceWorkerResponse<TResponse>>) => {
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data as TResponse);
      }
    };

    const message: ServiceWorkerMessage<TPayload> = { type, payload };
    controller.postMessage(message, [messageChannel.port2]);
  });
}

export async function storeData(data: string): Promise<void> {
  await sendMessage<string, { success: boolean }>('STORE_DATA', data);
}

export async function storeKey(key: string): Promise<void> {
  await sendMessage<string, { success: boolean }>('STORE_KEY', key);
}

export async function getData(): Promise<string | null> {
  const response = await sendMessage<void, { data: string | null }>('GET_DATA');
  return response.data;
}

export async function getKey(): Promise<string | null> {
  const response = await sendMessage<void, { key: string | null }>('GET_KEY');
  return response.key;
}

export async function getAll(): Promise<{ data: string | null; key: string | null }> {
  return await sendMessage<void, { data: string | null; key: string | null }>('GET_ALL');
}

export async function clearStorage(): Promise<void> {
  await sendMessage<void, { success: boolean }>('CLEAR');
}
