const error = (message) => ({
    tagName: "div",
    className: "error",
    children: [{
        tagName: "h4",
        children: [message],
    }],
});

export default error;
