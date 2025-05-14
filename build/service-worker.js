// public/service-worker.js

self.addEventListener("install", (e) => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", (e) => {
  console.log("Service Worker intercepting fetch request for:", e.request.url);
});
