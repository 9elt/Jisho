(chrome ?? browser).runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.scrape) {
      fetch(request.url)
        .then(response => response.text())
        .then(response => sendResponse(response))
        .catch(error => console.log(error));
      return true;
    }
  }
)
