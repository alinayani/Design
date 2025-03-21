var modelDialogCallBack;
//var isModalDialogOpen = false;
var modelDialogIsCreated = false;

$(document).ready(function () {

    $('body').append('<div id="modalDialogContainer"></div>');


});

function createModalDialog() {
        
    $('#openModal').removeClass('hide');

    if (modelDialogIsCreated)
    {        
        return;
    }

    //console.log('create modal');
    modelDialogIsCreated = true;

    $('#modalDialogContainer').replaceWith('<div id="modalDialogContainer">' +

    '<a href="#openModal" id="openModelhrefID" style="display:none;"></a>' +
    '<div id="openModal" class="modalDialog"><div>' +
    '<a href="javascript:void(0);" onclick="closeModalDialog();" title="Close" class="close">Close</a>' +
    '<div id="modalTitle"></div>' +
    '<div id="modalError"></div>' +
    '<div id="modalDialogContent">' +
    '</div>        ' +
    '<a href="javascript:void(0);" onclick="closeModalDialog();" class="defaultmodalCloseButton" >Close</a></div></div>' +
    '</div>'
    );
    
}

function createWranglerModalDialog() {

    modelDialogIsCreated = false;

    $('#openModal').removeClass('hide');


    $('#modalDialogContainer').replaceWith('<div id="modalDialogContainer">' +

    '<a href="#openModal" id="openModelhrefID" style="display:none;"></a>' +
    '<div id="openModal" class="modalDialog"><div>' +
    '<a href="javascript:void(0);" onclick="closeWranglerModalDialog();" title="Close" class="close">Close</a>' +
    '<div id="modalTitle"></div>' +
    '<div id="modalError"></div>' +
    '<div id="modalDialogContent">' +
    '</div>        ' +
    '<a href="javascript:void(0);" onclick="closeWranglerModalDialog();" class="defaultmodalCloseButton" >Close</a></div></div>' +
    '</div>'
    );

}

function hideModalDialog() {
    $("#openModal").removeClass('open');        
    
    setTimeout(destroyModalDialog, 300);
}

/*
function emptyModelDialog()
{
    $("#modalTitle").text('');
    $("#modalDialogContent").html('');

}*/
function destroyModalDialog() {

    //if (isModalDialogOpen == false) {
        $("#openModal").removeClass('hide');
        $("#openModal").addClass('hide');
        //$('#modalDialogContainer').html('');
    //}
}

function modalDialogConfirmURL(obj) {

    var yesurl = obj.getAttribute('data-yesurl');
    var nourl = obj.getAttribute('data-nourl');

    if (nourl == null) { nourl = 'javascript:closeModalDialog();'; }

    var confirm = obj.getAttribute('data-confirm');

    showModalDialogWithContent('Please Confirm Action', '<p></p>' + confirm + '<br /><br /><br /><br />' +
        '<div style="width:100%; font-size:1.3em; margin-bottom:40px;">' +
        '<a href="' + yesurl + '" style="width:45%; text-align:center; display:inline-block;">Yes, let us proceed!</a>' +
        '<a href="' + nourl + '" style="width:45%; text-align:center; display:inline-block;">No, let me rethink things.</a></div>'
        , false);
}

function onError(modalSource, errorData) {

    $("#modalError").html(errorData);
    $("#pageError").html(errorData);

    showModalDialogWithContent('ERROR', errorData, errorData);
}

function setModalDialogContent(content) {
    $("#modalDialogContent").html(content);
}

function showDialogWithContent(obj, callback) {

    modelDialogCallBack = callback;

    var url = obj.getAttribute('data-url');
    showLoadingModalDialog('Loading...', 'Loading...');

    $.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        //data: JSON.stringify({ model: { PageId: pageId, SectionNumber: section, Html: html } }),

        success: function (result) {
            showModalDialogWithContent('', result, false);
        },
        error: function (result) {
            onError(result);
        }

    });
}

function modalDialogPost(data) {
    if (data.CloseModalDialog == true) {
        closeModalDialog(true);

        modelDialogCallBack(data);
    }
}

function showModalDialogWithContent(title, content, showDefaultCloseButton, isWranglerModal) {

    if (isWranglerModal) {
        console.log('wrangler');
        createWranglerModalDialog();
    }
    else {
        console.log('simple');
        createModalDialog();
    }
    
    if (title.length > 0) {
        $("#modalTitle").text(title);
        $("#modalTitle").css('display', 'block');
    }
    else {
        $("#modalTitle").css('display', 'none');
    }

    $("#modalDialogContent").html(content);

    if (showDefaultCloseButton) {
        $(".defaultmodalCloseButton").show();
    }
    else {
        $(".defaultmodalCloseButton").hide();
    }

    

    //alert($("#openModal").attr('class'));

    $("#openModal").removeClass('open');
    $("#openModal").addClass('open');
    //window.location = document.getElementById('openModelhrefID').href;
}

function showModalDialog(title, data) {

    //alert(data);

    createModalDialog();

    $("#modalTitle").text(title);
    //window.location = document.getElementById('openModelhrefID').href;
    $("#openModal").removeClass('open');
    $("#openModal").addClass('open');
}

function showLoadingModalDialog() {
    createModalDialog();

    //alert('Show Loaing Modal dialog');
    $("#modalTitle").text('Loading...');
    $("#modalDialogContent").html("Please wait.");
    //window.location = document.getElementById('openModelhrefID').href;
    $("#openModal").removeClass('open');
    $("#openModal").addClass('open');
}

function showLoadingModalDialog(title, data) {

    createModalDialog();

    //alert('Show Loaing Modal dialog');
    $("#modalTitle").text(title);
    $("#modalDialogContent").html("Please wait.");
    //window.location = document.getElementById('openModelhrefID').href;
    $("#openModal").removeClass('open');
    $("#openModal").addClass('open');
}

function closeModalDialog(clearContents) {

    if (clearContents == true) {
        $('#modalDialogContent').html(' ');
    }

    //window.location.href = "#close";

    hideModalDialog();

    /*$("#openModal").removeClass('open');
    isModalDialogOpen = false;
    setTimeout(hideModalDialog, 1100);
    */
    
 }

function closeWranglerModalDialog(clearContents) {

    if (clearContents == true) {
        $('#modalDialogContent').html(' ');
    }

    var event = new Event('closeModal');
    window.dispatchEvent(event);

    hideModalDialog();


}


/* *********** BEGIN: COMMON SITE FUNCTIONS  ************************************/

function navagateMe(obj) {
    window.location.href = $(obj).attr('data-url');
}

function ajaxPartialRefresh(obj) {


    var url = $(obj).attr('data-url');
    var container = '#' + $(obj).attr('data-container');

    //alert('URL = ' + url + " & container = "+ $(container));

    $.ajax({
        url: url,
        type: "POST",
        dataType: 'html',
        success: function (data) {
            $(container).replaceWith(data);
            //  document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        error: function () {
            $(container).replaceWith('<div>There was an Error</div>');
        }
    });
}

/* *********** END: COMMON SITE FUNCTIONS  ************************************/
