if (navigator.serviceWorker) {
    console.log('serviceWorker is supported!');

    window.addEventListener('load', () => {
        // register the serviceWorker
        navigator.serviceWorker.register('../sw-main.js')
            .then((response) => {
                console.log('service worker is registered :)', response);
            })
            .catch((err) => console.log('err while registering service worker :(', err))
    })

}
else {
    console.log('serviceWorker is not supported in the browser!');
}