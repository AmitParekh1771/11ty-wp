console.log("Welcome to the fastest blog!");

const pages = {};

function insertDoc(key, doc) {
    pages[key] = {};
    pages[key].title = doc.title;
    pages[key].description = doc.querySelector("meta[name=description]").getAttribute("content");
    pages[key].content = doc.querySelector("[data-content]").innerHTML;
}

function renderDoc(key) {
    document.title = pages[key].title;
    document.querySelector("meta[name=description]").setAttribute("content", pages[key].description);
    document.querySelector("[data-content]").innerHTML = pages[key].content;
    document.documentElement.scrollTo(0, 0);
}

insertDoc(window.location.pathname, document);

async function loadPage(href) {
    const url = new URL(href, window.location.origin);
    if(document.location.href == url.href) return; 

    if(url.pathname in pages === false) {
        const page = await (await fetch(url.pathname)).text();
        const doc = new DOMParser().parseFromString(page, "text/html");

        insertDoc(url.pathname, doc);
    } 
    
    history.pushState({}, "", url);
    renderDoc(url.pathname);
}

window.addEventListener("popstate", (ev) => {
    renderDoc(window.location.pathname);
});

document.documentElement.addEventListener("click", (ev) => {
    const targets = ev.composedPath();

    for(let i=0 ; i < targets.length - 2 ; ++i) {
        if(targets[i].hasAttribute("href") && 
            targets[i].getAttribute("href").startsWith("/") && 
            targets[i].getAttribute("target") != "_blank") {
            ev.preventDefault();
            loadPage(targets[i].getAttribute("href"));
        }
    }
});