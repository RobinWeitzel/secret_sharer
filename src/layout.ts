export function createLayout(content: string, activeRoute: string): string {
  return `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <h1 class="text-2xl font-bold text-gray-900">Secret Sharer</h1>
            </div>
            <nav class="flex space-x-4">
              <a
                href="/secret_sharer/"
                data-link="/"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeRoute === '/'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }"
              >
                Decrypt
              </a>
              <a
                href="/secret_sharer/encrypt"
                data-link="/encrypt"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeRoute === '/encrypt'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }"
              >
                Encrypt
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        ${content}
      </main>
      <footer class="mt-auto py-6 text-center text-sm text-gray-600">
        <p>Secure client-side secret sharing with split QR codes</p>
      </footer>
    </div>
  `;
}
