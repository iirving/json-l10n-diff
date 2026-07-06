import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from '@/App.vue';
import i18n from '@/i18n';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(i18n);
app.mount('#app');

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const appVersion = import.meta.env.VITE_APP_VERSION || 'dev';
    const swUrl = `${import.meta.env.BASE_URL}sw.js?appVersion=${encodeURIComponent(appVersion)}`;

    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}
