$(document).ready(()  => {

    if(selectedTab === "following") {
        loadFollowers();
    }
    else {
        loadFollowing();
    }
    
})

function loadFollowers() {
    $.get(`/api/users/${profileUserId}/followers`, (results) => {
        outputUsers(results, $(".resultsContainer"));
    }) 
}

function loadFollowing() {
    $.get(`/api/users/${profileUserId}/following`, (results) => {
        outputUsers(results, $(".resultsContainer"));
    }) 
}

function outputUsers(results, container) {
    console.log(results);
}