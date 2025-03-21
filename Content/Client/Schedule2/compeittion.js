
function Competition(loadData) {
    var self = this;

    self.$type = 'Competition';
    self.id = ko.observable();
    self.name = ko.observable();
    self.startDate = ko.observable();
    self.endDate = ko.observable();
    self.isConcluded = ko.observable();    

    self.applyModel = function (data) {
        ko.mapping.fromJS(data, [], self);
        return self;
    }

    self.applyModel(loadData);
}