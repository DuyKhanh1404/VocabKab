// Đặt tên phiên bản cache để dễ quản lý khi bạn cập nhật web sau này
const CACHE_NAME = 'vocabkab-v1';

// Danh sách các file cốt lõi cần lưu trữ để chạy offline
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json'
  // Bạn có thể thêm các file css/js chính của bạn vào đây, ví dụ: './style.css', './app.js'
];

// 1. Sự kiện Install: Tải và lưu các file vào bộ nhớ đệm (Cache)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Đang mở cache và lưu tài nguyên...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Kích hoạt service worker mới ngay lập tức mà không cần đợi đóng tab cũ
  self.skipWaiting();
});

// 2. Sự kiện Activate: Dọn dẹp các bản cache cũ nếu có thay đổi phiên bản
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Đang xoá cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Sự kiện Fetch: Chặn các request mạng để trả về dữ liệu từ cache nếu mất kết nối
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Nếu tìm thấy trong cache thì trả về luôn, nếu không thì đi gọi mạng internet
      return cachedResponse || fetch(event.request);
    })
  );
});
