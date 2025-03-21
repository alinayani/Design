
function timeSlot(startTime, height, duration) {
    var self = this;

    self.startTime = ko.observable(startTime);

    self.endTime = ko.observable(addMinutes(startTime, duration));

    self.height = ko.observable(height);
    self.duration = ko.observable(duration);
    self.flagMe = ko.observable(false);

    self.timeDisplay = ko.computed(function () {

        var text = formatHourMinute(self.startTime().getHours(), self.startTime().getMinutes());

        //console.log('what' + self.startTime() + ' = ' + text);

        return text;
    });
}