// version number
const cacheVersionNumber = 'v4';

// resources to be cached
// const cacheFiles = [
//     '/index.html',
//     '/index-2.html',
//     '/js/app.js',
//     '/extra-file.txt'
// ];

// install event
self.addEventListener('install', event => {

    console.log('serviceWorker installed :)', event);

    // create the cache and add files to the cache
    // event.waitUntil(
    //     caches
    //         .open(cacheVersionNumber)
    //         .then((cache) => {
    //             console.log('service worker -> caching files');
    //             return cache.addAll(cacheFiles)
    //         })
    //         .then(() => self.skipWaiting())
    // )
})


// activate event => place to remove existing old caches
self.addEventListener('activate', event => {
    console.log('activate event :) ', event);

    event.waitUntil(
        caches.keys()
            .then(oldCaches => {
                const cacheToBeRemoved = oldCaches.filter(oldCache => oldCache != cacheVersionNumber)
                return cacheToBeRemoved
            })
            .then(cacheToBeRemoved => Promise.all(cacheToBeRemoved.map(singleOldCacheToBeRemoved => caches.delete(singleOldCacheToBeRemoved))))
    )
})

/** 
 * fetch event
 * Here we are intercepting every fetch request and response
 * In case of Request, if there is a match in the current cache, we return it else we perform a fetch request
 * and then catch its Response in current cache
 * Make sure to clone the response as Request and Response are read once only
 */
self.addEventListener('fetch', (event) => {
    console.log('intercepting fetch request and response');
    event.respondWith(
        caches.match(event.request).then((resp) => {
            return resp || fetch(event.request).then((response) => {
                let responseClone = response.clone();
                caches.open(cacheVersionNumber).then((cache) => {
                    cache.put(event.request, responseClone);
                });

                return response;
            });
        }).catch(() => {
            return caches.match('/index.html');
        })
    );
});