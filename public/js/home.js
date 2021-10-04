$(document).ready(() => {
    $.get("/api/posts", (results) => {
       outputPosts(results, $(".postsContainer"));
    }) 
})

function outputPosts(results, container) {
    container.html("");

    results.map(result => {
        let html = createPostHtml(result)
        container.append(html);
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}