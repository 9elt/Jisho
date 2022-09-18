chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        if (request.scrape) {

            try {
                fetch(request.url)
                .then(response => response.text())
                .then(response => sendResponse(response))
                .catch(error => console.log(error));
            } catch (error) {
                sendResponse('error');
            }

            return true;
        }
    }
);