import './style.css';
import { initRouter, navigate } from './router';
import { getQRCodeType } from './utils';

// If URL has QR code data, ensure we're on the decrypt page
if (getQRCodeType() && !window.location.pathname.endsWith('/secret_sharer/')) {
  navigate('/');
}

initRouter();
