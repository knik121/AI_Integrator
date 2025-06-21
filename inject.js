(function () { 
    // Save original methods
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // Hook into the 'open' method
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._url = url; // Save URL for later use
        return originalOpen.apply(this, arguments);
    };

    // Hook into the 'send' method
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("load", function () {
            // Only intercept if the request succeeds
            if (this.status >= 200 && this.status < 300) {
                const data = {
                    url: this._url,
                    status: this.status,
                    response: this.responseText,
                };

                // Dispatch a custom event with the data
                window.dispatchEvent(new CustomEvent("xhrDataFetched", { detail: data }));
            }
        });

        return originalSend.apply(this, arguments);
    };
})();