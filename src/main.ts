import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Secret Sharer</h1>
        <p class="text-gray-600">Securely share secrets using split QR codes</p>
      </div>
    </div>
  `;
}
