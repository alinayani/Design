
function EventCompetitor(id, name) {
    var self = this;

    self.$type = 'EventCompetitor';

    if (id == 0) {
        if (typeof EventCompetitor.TempNewId == 'undefined') {
            EventCompetitor.TempNewId = 0;
        }
        EventCompetitor.TempNewId--;
        id = EventCompetitor.TempNewId;
    }

    // *** Model ****
    self.id = ko.observable(id);
    self.name = ko.observable(name + id);
    self.scoreSubmitted = ko.observable(false);
    self.eventType = ko.observable();
    self.level = ko.observable();
    self.ageGroup = ko.observable();
    // *******************

    self.applyModel = function (data) {        
        ko.mapping.fromJS(data, {}, self);
        return self;
    }

    self.isDirty = ko.observable(false);

    self.parentEvent = ko.observable();
      
    self.ItemType = 'Competitor';
    self.order = ko.observable(1);
    self.startTime = ko.observable();
    self.endTime = ko.observable();
    self.order = ko.observable(1);
    self.hasScheduleWarning = ko.observable(false);
    self.PersonHash = ko.observable();

    self.preventReOrder = ko.computed(function () {
        return self.scoreSubmitted() == false;
    });
   

    self.tags = ko.computed(function () {
        var ret = '';
        if (self.eventType() == 5)
            return '';
        if (self.level() == '5') {
            ret = ret + " Pro";
        }
        else {
            ret = ret + " L" + self.level();
        }

        if (self.ageGroup() != '0'){
            ret = ret + " A"+self.ageGroup();
        }
        
        return ret;
    });

}