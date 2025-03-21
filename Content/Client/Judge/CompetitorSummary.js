function Row(improve, didWell) {
    this.improve = improve;
    this.didWell = didWell;
    this.displayedComment = ko.observable('');
    this.selectedOption = ko.observable('');
    this.commentClass = ko.computed(() => {
        switch (this.selectedOption()) {
            case 'improve':
                return 'improve';
            case 'didWell':
                return 'didwell';
            default:
                return 'no-comment';
        }
    });
}

// Criteria Model
function Criteria(name, improveOptions, didWellOptions) {
    this.name = name;
    this.rows = ko.observableArray(didWellOptions.map((dw, index) => {
        return new Row(improveOptions[index] || '', dw);
    }));
}
function CompetitorSummary(loadData, criteriaTemplates = null) {
    var self = this;
    self.id = ko.observable();
    self.eventId = ko.observable();
    self.orderNumber = ko.observable();
    self.name = ko.observable();
    self.stageName = ko.observable();
    self.positivescore = ko.observable();
    self.totaldeductions = ko.observable();
    self.totalscore = ko.observable();
    self.canEdit = ko.observable();
    self.isCurrent = ko.observable();
    self.isScoreSubmitted = ko.observable();
    self.competitorNick = ko.observable();
    self.place = ko.observable();
    self.isWarning = ko.observable();   
    self.didWellComments = ko.observable('');
    self.ThingstoImprove1 = ko.observableArray();
    self.ThingsDidWell1 = ko.observableArray();
    self.improveComments = ko.observable('');
    self.canSubmit = ko.observable(false);
    self.isSaved = ko.observable(false);
    ko.mapping.fromJS(loadData, {}, self);
    if (criteriaTemplates != null) {
        self.criteria = ko.observableArray(criteriaTemplates.map(template => {
            return new Criteria(template.name,
                template.rows().map(row => row.improve),
                template.rows().map(row => row.didWell));
        }));
        // Keep track of the selected criteria for each competitor
        self.selectedCriteria = ko.observable(self.criteria()[0]);
    }
    //self.initialize(loadData);
}

/*
CompetitorSummary.prototype.initialize = function (values) {
    var entity = this; //so we don't get confused
    var prop = '';
    if (values) {
        for (prop in values) {
            if (values.hasOwnProperty(prop.toLowerCase()) && entity.hasOwnProperty(prop.toLowerCase())) {
                //the setter should have the same name as the property on the values object

                if (typeof (entity[prop]) === 'function') {
                    entity[prop](values[prop]); // we are assuming that the setter only takes one param like a Knockout observable()
                } else {// if its not a function, then we will just set the value and overwrite whatever it was previously
                    entity[prop] = values[prop];
                }
            }
        }
    }
};
*/