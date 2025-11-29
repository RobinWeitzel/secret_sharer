let temporaryStorage = {
  data: null,
  key: null,
  timestamp: null
};

const MAX_AGE_MS = 5 * 60 * 1000;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'STORE_DATA':
      temporaryStorage.data = payload;
      temporaryStorage.timestamp = Date.now();
      event.ports[0].postMessage({ success: true });
      break;

    case 'STORE_KEY':
      temporaryStorage.key = payload;
      temporaryStorage.timestamp = Date.now();
      event.ports[0].postMessage({ success: true });
      break;

    case 'GET_DATA':
      if (isExpired()) {
        clearStorage();
        event.ports[0].postMessage({ data: null });
      } else {
        event.ports[0].postMessage({ data: temporaryStorage.data });
      }
      break;

    case 'GET_KEY':
      if (isExpired()) {
        clearStorage();
        event.ports[0].postMessage({ key: null });
      } else {
        event.ports[0].postMessage({ key: temporaryStorage.key });
      }
      break;

    case 'CLEAR':
      clearStorage();
      event.ports[0].postMessage({ success: true });
      break;

    case 'GET_ALL':
      if (isExpired()) {
        clearStorage();
        event.ports[0].postMessage({ data: null, key: null });
      } else {
        event.ports[0].postMessage({
          data: temporaryStorage.data,
          key: temporaryStorage.key
        });
      }
      break;

    default:
      event.ports[0].postMessage({ error: 'Unknown message type' });
  }
});

function isExpired() {
  if (!temporaryStorage.timestamp) return false;
  return Date.now() - temporaryStorage.timestamp > MAX_AGE_MS;
}

function clearStorage() {
  temporaryStorage = {
    data: null,
    key: null,
    timestamp: null
  };
}
