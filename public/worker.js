self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  const x = self.registration.showNotification(data.title, {
    body: data.Description,
    icon: "http://image.ibb.co/frYOFd/tmlogo.png",
    data: data.url
  });
  e.waitUntil(x)
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.');
  console.info(event.notification)
  event.notification.close();

  event.waitUntil(
    clients.claim(event.notification.data)
  );
});