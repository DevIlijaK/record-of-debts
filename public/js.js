document.addEventListener("htmx:wsConnecting", function(e) {
    console.log(e);
});

function copyLink() {
    const link = document.getElementById('link');
    navigator.clipboard.writeText(link.href).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}