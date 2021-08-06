const staticCacheName = 'site-static'
const assets = [
    '/',
    '/about',
    '/create',
    '/application.js',
    '/choices.js',
    '/questions.js',
    'index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css?family=Montserrat:200,400,700'
];

//install service worker
self.addEventListener('install', evt => {
    //console.log('Service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
})

//activate event
self.addEventListener('activate', evt => {
    console.log('Service worker has been activated');
})

// fetch event
self.addEventListener('fetch', evt => {
    console.log('fetch event', evt);
})