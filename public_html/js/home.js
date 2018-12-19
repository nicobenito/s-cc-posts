'use strict';
$(document).ready(function(){
    getAllPosts();

    $('#imageForm').submit(function(e){
        var formData = new FormData(this);
        formData.append('totalItems', $('ul#sortable li').length)
        createPost(formData);
        $(this).trigger("reset");
        return false;
      });

    $(function() {
        $('#sortable').sortable({
            update: function( event, ui ) {
                updateOrder(event, ui)
            }
        });
    });
});

function createPost(formData){
    $.ajax({
        data:  formData,
        cache:false,
        contentType: false,
        processData: false,
        url:   '/posts/create',
        type:  'POST',
        success:  function (response) {
            addPostToList(response.name, response.url, response.orderPos, response._id);
            updateCounter();
        },
        error: function(response){
            console.log(response);
        }
    });
};

function getAllPosts(){
    $.ajax({
        url:   '/posts/getall',
        type:  'GET',
        success:  function (response) {
            response.forEach(post => {
                addPostToList(post.name, post.url, post.orderPos, post._id);
            });
            updateCounter();
        }
    });
};

function addPostToList(name, imgUrl, orderPos, id){
    $('ul.postList').prepend(`
        <div class="post-item row justify-content-center" id=`+ id +` order-pos=`+ orderPos +`>
            <li class="card">
                <h3>` + name + `</h3>
                <img class="postImg" src="` + imgUrl + `" />
                <div class="actions">
                    <button type="button" class="btn btn-primary edit" data-toggle="collapse" data-target="#collapseForm`+ id +`" aria-expanded="false" aria-controls="collapseExample"></button>
                    <button type="button" class="btn btn-danger delete" onclick="removePost(this)"></button>
                </div>
                <div class="collapse" id="collapseForm`+ id +`">
                    <form id="updateForm`+ id +`" enctype="multipart/form-data">
                        <div class="form-group">
                            <label>Select an image</label>
                            <input class="form-control-file" type="file" name="imageFile" required>
                            <small id="fileHelp" class="form-text text-muted">Allowed JPG, PNG and GIF files only.</small>
                        </div>
                        <div class="form-group">
                            <input class="form-control" type="text" name="descText" id="desc" placeholder="Description" required/>
                        </div>
                        <div class="form-group">
                            <input class="btn btn-primary" value="Update post" onclick="updatePost('updateForm`+ id +`')">
                        </div>
                        <div class="collapse">
                        <span class="error-message">Please complete all fields.</span>
                        </div>
                    </form>
                </div>
            </li>            
        </div>
    `);
};

function updateOrder(event, ui){
    var sortedIDs = $('#sortable').sortable('toArray');
    $.ajax({
        data: JSON.stringify({ data: sortedIDs }),
        contentType: 'application/json',
        url:   '/posts/sort',
        type:  'POST',
        success:  function (response) {
            console.log(response);
        },
        error: function(response){
            //$('#result').html('Error');
            console.log(response);
        }
    });
};

function removePost(e){
    var postItem = $(e).closest('.post-item');
    var postItemId = postItem.attr('id');
    $.ajax({
        data: JSON.stringify({ id: postItemId }),
        contentType: 'application/json',
        url:   '/posts/delete',
        type:  'POST',
        success:  function (response) {
            console.log(response);
            postItem.remove();
            updateCounter();
        },
        error: function(response){
            //$("#result").html("Error");
            console.log(response);
        }
    });
    console.log("removed");
};

function updatePost(formId){
    var form = document.getElementById(formId);
    var postItemId = $(form).closest('.post-item').attr('id');
    if (validateForm(formId)){
        $('#'+ formId).submit(function(e){
            var formData = new FormData(this);
            $.ajax({
                data:  formData,
                cache:false,
                contentType: false,
                processData: false,
                url:   '/posts/'+ postItemId +'/update',
                type:  'POST',
                success:  function (response) {
                    console.log(response);
                    updatePostItem(response);
                    $('#'+ formId).trigger('reset');
                    $('#'+ formId).closest('.post-item').find('.edit').trigger('click');
                    $('#'+ formId).find('.collapse').collapse('hide');
                },
                error: function(response){
                    console.log(response);
                }
            });
            return false;
        });
        $('#'+ formId).submit();
    }
    else{
        console.log('no valid form');
        $('#'+ formId).find('.collapse').collapse('show');
    }
};

function updatePostItem(post){
    var postItem = document.getElementById(post._id);
    $('#'+ post._id).find('h3').text(post.name);
    $('#'+ post._id).find('img').attr('src',post.url);
};

function updateCounter(){
    var totalItems = $('ul#sortable li').length;
    $('.post-counter').text(totalItems);
};

function validateForm(formId){
    var valid = true;

     if($('#'+formId).find('.form-control-file').val() == ''){
        valid = false;
     }
     else if($('#'+formId).find('.form-control').val() == ''){
        valid = false;
     }

    return valid
};