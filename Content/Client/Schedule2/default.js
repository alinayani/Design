var dragElement = null;
var Model;

var eventViewPixelsPerMinute = 2;
var competitorViewPixelsPerMinute = 5;

var eventViewTicks = 30;
var competitorViewTicks = 10;
var _Refresh_CompetitionId = 3;
var _ScheduleController = "/Schedule2";

window.onbeforeunload = function (e) {
    e = e || window.event;

    if (Model.unSavedChanges) {
        var msg = "You have unsaved Changes, are you sure you want to leave?";

        // For IE and Firefox prior to version 4
        if (e) {
            e.returnValue = msg;
        }

        // For Safari
        return msg;
    }
};

$(document).ready(function () {
    
    Model = new ScheduleViewModel();
    
    Model.initialize();

    ko.applyBindings(Model);    

    sizeForViewPort();

    $('body').on('change','#JudgmentSystem',function () {
        FillCategories();
    });
    $('body').on('change', '#EventType', function () {
        FillSkillLevels();
    });
});

$(window).resize(function () {

    sizeForViewPort();
});

function sizeForViewPort() {

    var maxHeight = $(window).height() - 120;

    $('.allCompetitors .list').css('max-height', maxHeight);
}


function formatHourMinute(hour, minute) {
    var hh = hour;
    var mm = minute;

    var tt = 'am';

    // This line gives you 12-hour (not 24) time
    if (hour > 12) {
        hh = hh - 12;
        tt = 'pm';
    }

    // These lines ensure you have two-digits
    if (hh < 10) { hh = "0" + hh; }
    if (mm < 10) { mm = "0" + mm; }


    // This formats your string to HH:MM:SS
    var text = hh + ":" + mm + "" + tt;

    return text;
}

var ignoreNextMouseDown = 0;
function theMouseDown(element, type) {

    if (ignoreNextMouseDown > 0) {
        ignoreNextMouseDown--;
        //        console.log('next ignored ' + type + '  / ' + ignoreNextMouseDown);
        return;
    }

    //  console.log('MOUSE DOWN');

    if (type == 'Competitor') {
        //    console.log('ignore 1x next ');
        ignoreNextMouseDown = 1;
    }

    $('.psoEvent').removeClass('selected');

    $(element).addClass('selected');

    Model.clickedItemType(type);
    Model.allowCompetitorDrop(type == "Competitor");
    Model.allowEventDrop(type == "Event");

    /*   ko.utils.arrayForEach(Model.panels(), function (panel) {

           ko.utils.arrayForEach(panel.events(), function (event) {

               event.allowDrop(type == "Event");

               ko.utils.arrayForEach(event.competitors(), function (competitor) {

                   competitor.allowDrop(type == "Competitor");

               });

           });

       });*/

}

function showCompetitors() {
    Model.showCompetitors(true);
}

function collapseEvents() {
    Model.showCompetitors(false);
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}



function savePanelDetailsSuccess(data) {

    if (data.success != true) {
        return;
    }

    hideModalDialog();

    if (data.newCreated) {

        var panel = new JudgePanel().applyModel(data.details);        
        console.log(ko.mapping.toJS(panel));
        Model.panels.push(panel);        
    }
    else
    {      
        var panel = Model.getPanel(data.details.id);   
        panel.applyModel(data.details, true);
    }

    Model.calculateOrder();
}

function saveEventDetailsSuccess(data) {

    if (data.success != true) {
        return;
    }

    hideModalDialog();

    if (data.newCreated)
    {
        var panel = Model.getPanel(data.panelId);
        var event = new CompetitionEvent(data.details.id, data.details.name);
        event.description(data.details.description);

        panel.events.push(event);        
    }
    else
    {
        var event = Model.getEvent(data.details.id);
        event.applyModel(data.details, true);
    }

    Model.calculateOrder();
}


function saveCompetitionDetailsSuccess(data) {

    if (data.success != true) {
        return;
    }

    hideModalDialog();
    window.location.reload();
}

function saveCompetitorDetailsSuccess(data) {
        
    if (data.success != true) {
        return;
    }

    hideModalDialog();

    //console.log(data);

    if (data.newCreated) {
        var event = Model.getEvent(data.eventId);
        if (event == null) {
            event = Model.catchAllPanel().events()[0];            
        }

        var competitor = event.addCompetitorFromModel(data.details);
        
        Model.allCompetitors.splice(0, 0, competitor);

        Model.calculateOrder();
    }
    else {
        var competitor = Model.getCompetitor(data.details.id);
        competitor.applyModel(data.details);
    }

}

var toggleSwitch = false;
function toggleAllCompetitors() {
        
    if ($('.allCompetitors').hasClass('show'))
    {
        $('.allCompetitors').removeClass('show');
        }
    else {
        $('.allCompetitors').addClass('show');
    }

    toggleSwitch = !toggleSwitch;
}
function FillCategories(SelectPrevValue=false) {
    var JudgmentSystem = $('#JudgmentSystem').val()
    $.ajax({
        type: "POST",
        url: "/schedule2/GetCategories",
        async:false,
        data: { JudgmentSystem: JudgmentSystem },
        success: function (jsonData) {
            if (jsonData == null || jsonData == undefined)
                return;
            var categories = jsonData.split(',');
            var data = "";
            $(categories).each(function (i, key) {
                data += "<option value='" + key + "'>"+key+"</option>";
            });
            var prevSelectedValue = $('#EventType').val();

            $('#EventType option').remove();
            $('#EventType').append(data);

            if (SelectPrevValue)
                $('#EventType').val(prevSelectedValue);
            FillSkillLevels(SelectPrevValue);
        }
    });
}
function FillSkillLevels(SelectPrevValue = false) {
    var Category = $('#EventType').val()
    $.ajax({
        type: "POST",
        url: "/schedule2/GetSkillLevels",
        data: { Category: Category },
        success: function (jsonData) {
            if (jsonData == null || jsonData == undefined)
                return;
            var skillLevels = jsonData.split(',');
            var data = "";
            $(skillLevels).each(function (i, key) {
                data += "<option value='" + key + "'>"+key+"</option>";
            });


            var prevSelectedValue = $('#SkillLevel').val();

            $('#SkillLevel option').remove();
            $('#SkillLevel').append(data);

            if (SelectPrevValue)
                $('#SkillLevel').val(prevSelectedValue);

        }
    });
}


