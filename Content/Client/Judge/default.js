


var timerId = null;
var secondsElapsed = 0;
var firstEditSecondsElapsed = 0;
var submitClicked = false;

$(document).ready(function () { documentReady(); });

function adjustRightPane() {
    $('.rightPane').css('position', 'fixed');

    var top = 0;
    var topMargin = 100;
    var bottomMargin = $('footer').innerHeight();
    var leftPaneHeight = $('.leftPane').innerHeight();
    var rightPaneHeight = $('.rightPane').innerHeight();
    var bottomPadding = $('.bottomPadding').innerHeight();
    
    if ($(window).scrollTop() < topMargin) {
        top = topMargin - $(window).scrollTop()
    }
    
    //if ($(window).scrollTop() + $('.rightPane').innerHeight() > topMargin + $('.leftPane').innerHeight()) {
    if ($(window).scrollTop() + rightPaneHeight > topMargin + leftPaneHeight + bottomPadding)
    { //top =  ($(window).scrollTop() - (topMargin + $('.leftPane').innerHeight() - $('.rightPane').innerHeight())) * -1;
        top = ($(window).scrollTop() - (topMargin + leftPaneHeight + bottomPadding - rightPaneHeight)) * -1;
    }

    //> Minimum Top
    if (top + $(window).scrollTop() < topMargin) {
        top = topMargin;
    }
        
    if (Model.isEditingScore() == false)
    {
        $('.rightPane').css('position', 'absolute');
        top = topMargin;
    }
    /*

    $('.debug').show();

      $('.debug').html('' +
           'WindowHeight: ' + window.innerHeight + '\r\n' +
           'ScrollPOS: ' + $(window).scrollTop() + '\r\n' +
           'LP:' + leftPaneHeight + '\r\n' +
           'RP:' + rightPaneHeight + '\r\n' +
           'Bottom padd:' + bottomPadding + '\r\n' +
           'RP top:' + top + '\r\n'
           );
           */

    $('.rightPane').css('top', top+'px');
    var left = (window.innerWidth / 2) + 50;
    $('.rightPane').css('left', left + 'px');
    $('.rightPane').css('width', (window.innerWidth / 2) - 100 + 'px');
      
}

function inputKeyDown(event) {
    // Enter Key or Key Down
    if (event.keyCode == 40) {
        var nextItem = $(this).parent().nextAll('.editor-field').first('.customEditor').find('input');

        if (nextItem.length === 0) {
            $('textarea').focus();
        }
        else {
            selectOnKeyUp = true;
            nextItem.focus();
        }
    }
    // Key Up
    else if (event.keyCode == 38) {              

        if ($(this).prop('tagName') == 'TEXTAREA') {

            if ($(this).caret() == 0) {

                var nextItem = $(this).parent().prevAll('.editor-field').first('.customEditor').find('input');

                selectOnKeyUp = true;
                nextItem.focus();
            }
        }
        else
        {

            var nextItem = $(this).parent().prevAll('.editor-field').first('.customEditor').find('input');
                                
            selectOnKeyUp = true;
            nextItem.focus();
        }
    }
}
      
function inputFocus()
{
          
    $('input').removeClass('focus');
    $('.editor-label').removeClass('focus');
    $('textarea').removeClass('focus');

    $(this).addClass('focus');
    $(this).parent().prev().addClass('focus');
}

var selectOnKeyUp = false;

function documentReady(){
    
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    if ($('.bodyMessage').html().length > 0) {
        $('.bodyMessage').slideDown();
        setTimeout(function () { $('.bodyMessage').slideUp(); }, 2000);
    }
    Model = new JudgeViewModel();
    //console.log(Model);
    //if (!document.getElementById('feedback-container')) {
        Model.editingCompetitorId(MVC_EditingCompetitorId);
        Model.eventId(MVC_EventId)
    
        Model.loadCompetitors(MVC_InitialData, shouldPassCriteria);
        //console.log(Model);
    ko.applyBindings(Model);
    //ko.isActive.subscribe(function (newValue) {
    //    if (newValue) { $('.active a').attr("disabled", true); }
    //    else { { $('.active a').attr("disabled", false); } }
    //});
        //console.log(Model);
    
        //console.log(Model.competitors, Model.competitors().length, Model.competitors()[0].id());
        //if (Model.competitors().length > 0) {
        //    console.log("all");
        //    Model.selectedCompId(Model.competitors()[0].id());
        //    console.log(Model.selectedCompId, Model.selectedCompId());
        //}
        if (Model.isEditingScore()) {
            calculateTotalScore(false);
        }
        else {
            calculatePlacements();
        }
    //}
    adjustRightPane();
    $(document).scroll(function () { adjustRightPane(); });
    $(window).resize(function () { adjustRightPane(); });
             
    initializeTimer();        
          
    $('.customEditor').bind('keydown', inputKeyDown);
    $('textarea').bind('keydown', inputKeyDown);
    $('input').bind('focus', inputFocus);
    $('textarea').bind('focus', inputFocus);
          
    $('.customEditor').bind('keyup', function (event) {
        if (selectOnKeyUp) {
            selectOnKeyUp = false;
            $(this).select();
        }
    });
                    
    $(".customEditor").each(function () {
        var $editor = $(this);
        //console.log("a", $(this));
        $(this).focus(function () {              
            var $this = $(this);
            $this.select();
            $this.mouseup(function () { $this.unbind('mouseup'); return false; })
        });
        $(this).change(function () {
            //console.log($(this).hasClass("clarity"), $(this).val(), $(this));
            if ($(this).hasClass("clarity") && $(this).val() <= 10) {
                alert("Just checking! Clarity of Concept is out of 25 points, and you have scored 10 points or less. Please check to make sure this is accurate. Thanks!");
            }
            //console.log("commented");
            calculateTotalScore(true);
        });              
        $('#Notes').change(function () {
            pageIsDirty = true;
        });
    });

    $("form").submit(function (event) {
        submitClicked = true;
        setTimeout(function () { submitClicked = false; }, 400);
    });

    window.onbeforeunload = function () {
        if (pageIsDirty && !submitClicked) {
            return "You have unsaved Changes. Leaving this page will cancel all unsaved changes.";
        }              
    }

    $('.floatingScrollButtons').on('click', '.up', function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
              
    });

    $('.floatingScrollButtons').on('click', '.down', function () {

        var WH = $(window).height();
        var SH = $('body')[0].scrollHeight;
        SH = 100 + $('.leftPane').innerHeight();

        $('html, body').stop().animate({ scrollTop: SH - WH }, 600);              
    });

    $("#confirmScoreDialog").dialog({
        autoOpen: false,
        close: function () {

        }
    });

    $("#confirmScore").click(function (e) {
        e.preventDefault();
        
        $('#confirmScoreDialog').dialog('close');
        $('form').submit();
    });

    $("#cancelConfirmScore").click(function (e) {
        e.preventDefault();
       
        $('#confirmScoreDialog').dialog('close');
    });
    
    
    
    $("#submitScore").click(function (e) {
        e.preventDefault();
                                       
        var maxTotalScore = $('#MaxTotalScore').val();
        if (Model.totalScore() > maxTotalScore) {
            alert('Your score is too high, please adjust');            
            return;
        }

        var isFormValid = $('form').valid();                
        if (isFormValid == 0) {            
            return;
        }                        

       // $('#submitScore').prop('disabled', true);
       // $('#submitScore').css('color', 'Gray');



        var scores = Enumerable.From(Model.competitors()).Where(function (c) { return c.positivescore() > 0; }).ToArray();
                       
        // Don't confirm the Very first Competitor (they will always be places in first!)
        if (MVC_ConfirmScore == true && scores.length > 1) {
                  
            var myTotalScore = parseFloat(Model.totalScore());
            var rank = 1;
            var tie = 0;
            for (var i = 0; i < scores.length; i ++)
            {
                if (scores[i].isCurrent()) { continue; }

                var competitorScore = parseFloat(scores[i].positivescore());
                if (competitorScore == myTotalScore) { tie++; }
                if (competitorScore > myTotalScore) { rank++; }
            }
                              
            if (tie > 0) {
                $('#confirmScoreDialog .place').html('tie for ' + getGetOrdinal(rank));
            }
            else {
                $('#confirmScoreDialog .place').html(getGetOrdinal(rank));
            }

            $('#confirmScoreDialog .competitorName').html($('.judgeScore .competitorName').html());                  
            $('#confirmScoreDialog .score').html(myTotalScore);                  

            $('html, body').animate({ scrollTop: 0 }, 400, null, function ()
            {
                $('#confirmScoreDialog').dialog('open');                      
            });                  
        }
        else {
          
            $('form').submit();
        }
    });

    setTimeout(function () { $('.editor-field input.first').focus(); }, 100);
}
      
function initializeTimer() {
          
    if (refreshTimer > 0 || isEditingScore == 'True') {

        if (refreshTimer < 10) { refreshTimer = 10; }

        restartTimer();
    }
    else if (refreshTimer < 0) { refreshTimer = 0; }
}
      
function startScoreEditingTimer() {
          
}

function getGetOrdinal(n) {
    var s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function timerElapsed() {          

    var timeRemaining = refreshTimer - secondsElapsed;
    
    $('.refresh-indicator').html('This page will auto refresh in ' + timeRemaining + ' seconds...');

    if ($('#timeRemaining').length) {
        $('#timeRemaining').text(
            firstEditSecondsElapsed + ':'+secondsElapsed + ' (' + timeRemaining + ')');
    }

    if (refreshTimer > 0) {
        secondsElapsed = secondsElapsed + 1;
        if (secondsElapsed == refreshTimer) {
            //clearTimeout(timerId);
           // timerId = null;
            getCurrentJudgingStatus();
        }
        else {
            restartTimer(false);
        }
    }                   

    if (firstEditSecondsElapsed > 0)
    {              
        firstEditSecondsElapsed++;
    }
}

function restartTimer(resetElpased) {
    
    if (resetElpased) {
        secondsElapsed = 0;
    }
    timerId = setTimeout(timerElapsed, 1000);
}

function getCurrentJudgingStatus() {
    $.ajax({
        type: "POST",
        url: "/Judge/PollJudgingStatus/",
        data: { pageJudgingStatus: pageJudgingStatus, isEditingScore: isEditingScore },
        success: function (jsReturnArgs) {

            //alert('TEST 1.' + jsReturnArgs.JudgingStatus + " vs " + pageJudgingStatus);

            if (jsReturnArgs.Action == "Refresh") {                      
                window.location.href = jsReturnArgs.Url;
            }
            else {
                      
                if (jsReturnArgs.Action == "Message") {
                    showModalDialogWithContent(jsReturnArgs.Title, '<p>'+jsReturnArgs.Message+'</p>', true);
                }                      
                restartTimer();
            }
        },
        error: function (errorData) { onError(true, errorData); }
    });
}


function applyScoreElementRecomendation(id, value) {

    $('#' + id).val(value);
    calculateTotalScore(true);
}

function checkIfRecomendationIsApplied(editor) {
    var $recomendation = $(".recomendation[for='" + $(editor).attr('id') + "']");
    if ($recomendation) {
        //console.log(Number($recomendation.text()) + ' vs ' + Number($(editor).val()));
        $recomendation.removeClass('applied');
        if (Number($recomendation.text()) == Number($(editor).val())) {
            $recomendation.addClass('applied');
        }
    }
}

function calculateTotalScore(scoreChanged) {
    //console.log("calculatetoalscore");
    var totalScore = 0;
    $('.customEditor.score').each(function ()
    {              
        totalScore = totalScore + Number($(this).val());
        checkIfRecomendationIsApplied($(this));
        
    }).stop(true, true);

   /* $('.customEditor.deduction').each(function () {

        totalScore = totalScore - Number($(this).val());
        checkIfRecomendationIsApplied($(this));

    }).stop(true, true);*/
        
    totalScore = parseFloat(Number(totalScore).toFixed(2));

    Model.totalScore(totalScore);
    if (MVC_BindTotalScore == true) {
        Model.editingCompetitor().score(totalScore);
    }

    //$('#calculatedScoreTotal').text(totalScore);
    //$('table.competitorScoreTable tr.highlightlight td.myScore').html(Number(totalScore).toFixed(2));
        
    var invalidMean = false;
    if (MVC_VerifyScoreAgainstMean == 'True') {
        $('.scoreInProgressTotal').removeClass('invalid');
        $('.scoreInProgressTotal').removeClass('invalidMedian');
        $('.scoreInProgressTotal .message').html('');
        
        if (meanScore > 0 && (totalScore > meanScore + 3 || totalScore < meanScore - 3)) {
            
            $('.scoreInProgressTotal').addClass('invalidMedian');            
            $('.scoreInProgressTotal .message').html('<ul><li>Score must be within 3 points of Median</li><li>Element score suggestions are provided to assist with adjusting your score proportionally.</li><li>Click a suggestion box to change your score automatically</li></ul>');
            invalidMean = true;
        }
    }

    if (MVC_BindTotalScore == true) {
        Model.editingCompetitor().isWarning(invalidMean);
    }

    var maxTotalScore = $('#MaxTotalScore').val();    
          
       if (totalScore > maxTotalScore) {
            //showClientError('maxtotalscore', 'Max Score Cannot exceed ' + maxTotalScore);
            $('.scoreInProgressTotal').addClass('invalid');
            $('.scoreInProgressTotal .message').html('<ul><li>Score cannot exceed: ' + maxTotalScore+'</li></ul>');
        }
        else if (!invalidMean)
        {
            //hideClientError('maxtotalscore');
            $('.scoreInProgressTotal').removeClass('invalid');
            $('.scoreInProgressTotal').removeClass('invalidMedian');
            $('.scoreInProgressTotal .message').html('');
        }
    

    calculatePlacements();

    if (scoreChanged) {
        pageIsDirty = true;
        if (firstEditSecondsElapsed == 0) { firstEditSecondsElapsed = 1; }
    }
}
                 
function sortScoresDescending(a,b) {
    if (a.score < b.score)
        return 1;
    if (a.score > b.score)
        return -1;
    return 0;
}


function calculatePlacements() {

    var scores = Model.competitors().sort(Model.competitorSortCompare_Score);
        
    var lastScore = -99;
    var place = 0;
    for (var i = 0; i < scores.length; i++) {

        if (scores[i].positivescore() != lastScore) {
            place++;
            lastScore = scores[i].positivescore();
        }

        //console.log('sort sort: ' + scores[i].score() + ' for ' + scores[i].stageName());
        if (scores[i].positivescore() > 0) {

            scores[i].place(place);
            //var cell = $('table.competitorScoreTable tr[data-orderNumber=' + scores[i].order + '] td.place');
            //cell.html(place);
        }
    }

}

function hideClientError(id) {
          
    $('.validation-summary-errors #' + id).remove();
}

function showClientError(id, message) {
    var $div = $('.validation-summary-errors');

    if ($div.length == 0) {              
        $('.validation-summary-container').html('<div class="validation-summary-errors"><ul></ul></div>');
        $div = $('.validation-summary-errors');
    }

    if ($div.find('li#' + id).length == 0) {
        $div.find('ul').append($('<li id=' + id + '>').text(message));
    }
}
     
            
function scoreElementNumberChanged(data) {

    //alert('number');

    var numberValue = $(data).val();
    //alert('selected value: ' + numberValue);
    var inputBox = $("input#" + $(data).attr('forinput'));

    var inputBoxValue = $(inputBox).attr('forinput');
              
    var values = $(inputBox).val().split('.');
    var decimals = '.00';

    if (values.length > 1) {
        decimals = '.' + values[1];
    }

    //alert('Number changed: ' + numberValue + '(' + $(data).attr('id') +') = ' + $(inputBox).attr('id'));                
    $(inputBox).val(numberValue + decimals);
    calculateTotalScore(true);
}

function scoreElementDecimalChanged(data) {
                        
    var decimalValue = $(data).val().split('.')[0];
          
    //alert($(data).attr('forinput'));
              
    var inputBox = $("input#" + $(data).attr('forinput'));

    //alert('Decimals changed: ' + decimalValue + '(' + $(data).attr('id') + ') = ' + $(inputBox).val());

    var values = $(inputBox).val().split('.');
    var numberValue = '0';

    if (values.length > 1) {
        numberValue = values[0];
    }
        
    $(inputBox).val(numberValue + '.' + decimalValue);
    calculateTotalScore(true);
}

function showScoringHelp(propertyName, eventType) {
              
    $.ajax({
        type: "POST",
        url: "/Judge/ScoringHelp/",
        data: { propertyName: propertyName, eventType: eventType  },
        success: function (jsReturnArgs) {
                      
            showModalDialogWithContent('', jsReturnArgs, true);
        },
        error: function (errorData) { onError(true, errorData); }
    });
}


function scorePreview(sender, eventId, competitorId, judgeAssignment) {
        
    $('#scorePreview .container').html('Loading...');
    $('#scorePreview').fadeIn();

    $.ajax({
        type: "POST",
        url: "/Judge/ScorePreview/",
        data: { eventId: eventId, competitorId: competitorId, judgeAssignment: judgeAssignment },
        success: function (jsReturnArgs) {

            $('#scorePreview .container').html(jsReturnArgs);
            
            //$('#scorePreview').dialog({ position: [left, 180] });
            $('#scorePreview').show();
            
        },
        error: function (errorData) { onError(true, errorData); }
    });

}