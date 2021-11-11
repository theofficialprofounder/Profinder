{
    let addToggleToComment = function(){
        let buttons = document.getElementsByClassName("commentBtn");

        for(let button of buttons){
            button.addEventListener('click',function(){
                let id = button.id;
                let div = $("#"+id+"+div");
                div[0].classList.toggle("comments");
            })
        }
    }   

    let addMoreComments = function(currentUserId){
        let buttons = document.getElementsByClassName("moreCommentsBtn");
        for(let button of buttons){
            button.addEventListener('click',function(){
                let postId = $("#"+button.id + " + input")[0].value;
                let commentsCount = $("#"+button.id + " + input + input")[0].value;
                let comments = [];
                $.ajax({
                    type: "GET",
                    url: "/posts/"+postId,
                    success: function(data){
                        // console.log(data);
                        comments = data.comments;
                        // console.log(comments);
                        // console.log(postId, commentsCount);
                        let listOfComments = document.getElementById("comments-"+postId);
                        // console.log(Math.min(parseInt(commentsCount)+5,comments.length));
                        for(let i = commentsCount;i<Math.min(parseInt(commentsCount)+5,comments.length);i++){
                            let data = {
                                comment:comments[i], 
                                user: comments[i].user.name,
                                userId: comments[i].user._id
                            }
                            let current = createHTML(data)[0];
                            if(comments[i].user._id != currentUserId){
                                current = createHTMLWithoutDelete(data)[0];
                            }
                            listOfComments.append(current);
                        }
                        $("#"+button.id + " + input + input")[0].value = Math.min(parseInt(commentsCount)+5,comments.length);
                        deleteCommentAjax();
                    }, error: function(error){
                        // console.log(error.responseText);
                    }
                })
                
            });
        }
    }
    


    let createAjaxComment = function(){
        let commentPostForm = $('.commentForm');

        for(let i=0; i<commentPostForm.length; i++){
            commentForm = commentPostForm[i];
            commentForm.addEventListener("submit",function(e){
                e.preventDefault();
                // console.log(commentForm);
                $.ajax({
                    type: "POST",
                    url: "/comments/create",
                    data: commentPostForm.serialize(),
                    success: function(data){
                        // console.log(data);
                        let list = $("#"+data.data.postId+"+div .commentsDiv .allCommentsDisplayed");
                        let htmlform = createHTML(data.data);
                        // console.log(htmlform);
                        list.prepend(htmlform);
                        let buttons = document.getElementsByClassName("moreCommentsBtn");
                        let button = buttons[i];
                        let postId = $("#"+button.id + " + input")[0].value;
                        let commentsCount = $("#"+button.id + " + input + input")[0].value;
                        $("#"+button.id + " + input + input")[0].value = parseInt(commentsCount)+1;
                        deleteCommentAjax();

                    }, error: function(error){
                        // console.log(error.responseText);
                    }
                });
                commentPostForm[i].content.value = "";
            });
        }

    }

    let createHTML = function(data){
        let comment = data.comment;
        let user = data.user;
        return $(` 
        <div class="card mb-3" id="comment-card-${comment._id}" style="box-shadow: none !important; border-radius: none !important">   
        <div class="card-header">
          <div id="first-div" style="float: left;">
            <h5 class="blockquote pt-3">
              <cite title="Source Title"> 
                <a href = "/users/profile/${data.userId}">${user}</a>
              </cite>
            </h5>
          </div>
          
          <div class="pt-3" id="second-div" style="float: right;">
              <a href="/comments/delete/${comment._id}" class="commentDelete">Delete</a>
          </div>
        </div>
        
          <div class="card-body" style="background-color: rgb(241, 238, 238)">
            <p class="card-text lead" id="<%=comment.id%>" class="visibleComment">
              <strong><em>${comment.content}</em></strong>
            </p>
          </div>
        </div>`);
    }

    let createHTMLWithoutDelete = function(data){
        let comment = data.comment;
        let user = data.user;
        return $(` 
        <div class="card mb-3" id="comment-card-${comment._id}" style="box-shadow: none !important; border-radius: none !important">   
        <div class="card-header">
          <div id="first-div" style="float: left;">
            <h5 class="blockquote pt-3">
              <cite title="Source Title"> 
                <a href = "/users/profile/${data.userId}">${user}</a>
              </cite>
            </h5>
          </div>
        </div> 
        
          <div class="card-body" style="background-color: rgb(241, 238, 238)">
            <p class="card-text lead" id="<%=comment.id%>" class="visibleComment">
              <strong><em>${comment.content}</em></strong>
            </p>
          </div>
        </div>`);
        // Comment doesnt has the .id property
    }

    let deleteCommentAjax = function(){
        let allCommentDelete = document.querySelectorAll(".commentDelete");
        for(let deleteButton of allCommentDelete){
            // console.log(deleteButton);
            deleteButton.addEventListener('click', function(event){
                event.preventDefault();
                $.ajax({
                    type: "GET",
                    url: deleteButton.href,
                    success: function(data){
                        // console.log(data);
                        $("#comment-card-"+data.commentId).remove();
                    }, error: function(error){
                        // console.log(error.responseText);

                    }
                });
            });
        }
    }

    let arr = $('.commentPost');
    let currentUser = $('.currentUser')[0];
    let currentUserId = currentUser.id;
    // console.log(currentUserId);
    addMoreComments(currentUserId);
    addToggleToComment();
    createAjaxComment();
    deleteCommentAjax();
}