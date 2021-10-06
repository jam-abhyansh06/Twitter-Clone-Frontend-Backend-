$("#postTextarea, #replyTextarea").keyup(event => {
    let textbox = $(event.target);
    let value = textbox.val().trim();

    let isModal = textbox.parents(".modal").length == 1;

    let submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

    if(submitButton.length == 0)
        return alert("No submit button found");
    
    if(value === "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
    
})


$("#submitPostButton, #submitReplyButton").click(() => {
    let button = $(event.target);

    let isModal = button.parents(".modal").length == 1;

    let textbox = isModal ? $("#replyTextarea") : $("#postTextarea");

    let data = {
        content: textbox.val()
    }

    if( isModal ) {
        let id = button.data().id;
        if( id === null) return alert("Button id is null");
        // adding replyTo key with id value to data object to be sent
        data.replyTo = id;  
    }

    $.post("/api/posts", data, (postData) => {

        if(postData.replyTo) {
            // if it is a reply
            location.reload();
        }
        else {
            // if it is a new post
            var html = createPostHtml(postData);
            $(".postsContainer").prepend(html);

            textbox.val("");
            button.prop("disabled", true);
        }
    })
})

// This does not works as button is dynamic
// $(".likeButton").click(() => alert("hi"))

$(document).on("click", ".likeButton", (event) => {
    let button = $(event.target);
    let postId = getPostIdFromElement(button);

    if(postId === undefined) return;

    // ajax call for PUT as shortcut is only available for GET & POST ($.get(), $.post())
    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {
            button.find("span").text(postData.likes !== undefined ? postData.likes.length || "" : "")

            if(postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active")
            }
            else 
            {
                button.removeClass("active")
            }
        }
    })

})


$(document).on("click", ".retweetButton", (event) => {
    let button = $(event.target);
    let postId = getPostIdFromElement(button);

    if(postId === undefined) return;

    // ajax call for PUT as shortcut is only available for GET & POST ($.get(), $.post())
    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: "POST",
        success: (postData) => {

            button.find("span").text(postData.retweetUsers.length || "")

            if(postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active")
            }
            else 
            {
                button.removeClass("active")
            }
        }
    })

})


$(document).on("click", ".post", (event) => {
    let element = $(event.target);
    let postId = getPostIdFromElement(element);

    if(postId !== undefined && !element.is("button")) {
        window.location.href = "/posts/" + postId;
    }

})



$("#replyModal").on("show.bs.modal", (event) => {

    let button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);

    // Attaching postId to submit button when modal opens so that we can get postId
    // when sending reply to server [in $("#submitPostButton, #submitReplyButton").click(()]
    $("#submitReplyButton").data("id", postId); 

    $.get(`/api/posts/${postId}`, (results) => {
        outputPosts(results, $("#originalPostContainer"));
     }) 
})


$("#replyModal").on("hidden.bs.modal", () => {
    $("#originalPostContainer").html("");
})



function getPostIdFromElement(element) {
    // element which has id (data-id) has class "post"
    let isRoot = element.hasClass("post");              
    let rootElement = isRoot == true ? element : element.closest(".post")
    let postId = rootElement.data().id;                 

    if(postId === undefined)    return alert("Post Id undefined")

    return postId;
}


function createPostHtml(postData) {

    if(postData === null)    return alert("post object is null");

    // console.log(postData);

    let isRetweet = postData.retweetData !== undefined;
    let retweetedBy = isRetweet ? postData.postedBy.username : null;
    postData = isRetweet ? postData.retweetData : postData;



    let postedBy = postData.postedBy;

    if(postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    let displayName = postedBy.firstName + " " + postedBy.lastName;
    let timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    let retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";

    let retweetText ="";
    if(isRetweet) {
        retweetText = `<span>
        <i class="fas fa-retweet"></i>
                            Retweeted by <a href="/profile/${retweetedBy}">@${retweetedBy}</a>
                        </span>`
    }


    let replyFlag = "";
    if (postData.replyTo) {

        if (!postData.replyTo._id) {
            return alert("Reply is not populated")
        }
        else if (!postData.replyTo.postedBy._id) {
            return alert("Reply is not populated")
        }

        let replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `<div class="replyFlag">
                        Replying to <a href="/profile/${replyToUsername}">@${replyToUsername}</a>
                    </div>`
    }

    return `
            <div class="post" data-id="${postData._id}">
                <div class="postActionContainer">
                    ${retweetText}
                </div>

                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href="/profile/${postedBy.username}" class="displayName">${displayName}</a>
                            <span class="username">@${postedBy.username}</span>
                            <span class="date">${timestamp}</span>
                        </div>
                        ${replyFlag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class="postButtonContainer">
                                <button data-bs-toggle="modal" data-bs-target="#replyModal">
                                    <i class="far fa-comment"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="retweetButton ${retweetButtonActiveClass}">
                                    <i class="fas fa-retweet"></i>
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class="postButtonContainer red">
                                <button class="likeButton ${likeButtonActiveClass}">
                                    <i class="far fa-heart"></i>
                                    <span>${postData.likes !== undefined ? postData.likes.length || "" : ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>        

            `

}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now";
        
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function outputPosts(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.map(result => {
        let html = createPostHtml(result)
        container.append(html);
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}