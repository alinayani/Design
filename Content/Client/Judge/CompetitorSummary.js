// function Row(improve, didWell) {
    // this.improve = improve;
    // this.didWell = didWell;
    // this.displayedComment = ko.observable('');
    // this.selectedOption = ko.observable('');
    // this.commentClass = ko.computed(() => {
        // switch (this.selectedOption()) {
            // case 'improve':
                // return 'improve';
            // case 'didWell':
                // return 'didwell';
            // default:
                // return 'no-comment';
        // }
    // });
// }

// // Criteria Model
// function Criteria(name, improveOptions, didWellOptions) {
    // this.name = name;
    // this.rows = ko.observableArray(didWellOptions.map((dw, index) => {
        // return new Row(improveOptions[index] || '', dw);
    // }));
// }
// function CompetitorSummary(loadData, criteriaTemplates = null) {
    // var self = this;
    // self.id = ko.observable();
    // self.eventId = ko.observable();
    // self.orderNumber = ko.observable();
    // self.name = ko.observable();
    // self.stageName = ko.observable();
    // self.positivescore = ko.observable();
    // self.totaldeductions = ko.observable();
    // self.totalscore = ko.observable();
    // self.canEdit = ko.observable();
    // self.isCurrent = ko.observable();
    // self.isScoreSubmitted = ko.observable();
    // self.competitorNick = ko.observable();
    // self.place = ko.observable();
    // self.isWarning = ko.observable();   
    // self.didWellComments = ko.observable('');
    // self.ThingstoImprove1 = ko.observableArray();
    // self.ThingsDidWell1 = ko.observableArray();
    // self.improveComments = ko.observable('');
    // self.canSubmit = ko.observable(false);
    // self.isSaved = ko.observable(false);
    // ko.mapping.fromJS(loadData, {}, self);
    // if (criteriaTemplates != null) {
        // self.criteria = ko.observableArray(criteriaTemplates.map(template => {
            // return new Criteria(template.name,
                // template.rows().map(row => row.improve),
                // template.rows().map(row => row.didWell));
        // }));
        // // Keep track of the selected criteria for each competitor
        // self.selectedCriteria = ko.observable(self.criteria()[0]);
    // }
    // //self.initialize(loadData);
// }

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

function Row(improve, didWell, displayedComment = '', selectedOption = '') {
    this.improve = improve;
    this.didWell = didWell;
    this.displayedComment = ko.observable(displayedComment);
    this.selectedOption = ko.observable(selectedOption);
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
//function Criteria(name, improveOptions, didWellOptions) {
//    this.name = name;
//    this.rows = ko.observableArray(didWellOptions.map((dw, index) => {
//        return new Row(improveOptions[index] || '', dw);
//    }));
//}
//function Criteria(name, improveOptions, didWellOptions, rowsData = []) {
//    this.name = name;
//    //console.log(rowsData != null, rowsData.length);
//    // Map rows including improve, didWell, displayedComment, and selectedOption
//    if (rowsData.length > 0) {
//        //console.log("here1");
//        this.rows = ko.observableArray(rowsData.map(row => {
//            return new Row(row.improve, row.didWell, row.displayedComment, row.selectedOption);
//        }));
//    } else {
//        //console.log("there1");
//        this.rows = ko.observableArray((didWellOptions || []).map((dw, index) => {
//            const existingRow = rowsData[index] || {};
//            //console.log(existingRow, dw, index, didWellOptions, improveOptions, rowsData);
//            return new Row(
//                improveOptions[index] || '',
//                dw,
//                existingRow.displayedComment || '',
//                existingRow.selectedOption || ''
//            );
//        }));
//    }

//}
function Criteria(name, comments) {
    this.name = name;
    this.comments = comments;
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
    self.isScoreSubmitted = ko.observable(false);
    self.isCommentsSubmitted = ko.observable(false);
    self.competitorNick = ko.observable();
    self.selectedCriteria = ko.observable();
    self.place = ko.observable();
    self.isWarning = ko.observable();   
    self.didWellComments = ko.observable('');
    self.improveComments = ko.observable('');
    self.thingYouDidWell1 = ko.observable();
    self.thingYouDidWell2 = ko.observable();
    self.thingYouDidWell3 = ko.observable();
    self.thingToImprove1 = ko.observable();
    self.thingToImprove2 = ko.observable();
    self.thingToImprove3 = ko.observable();
    self.canSubmit = ko.observable(false);
    self.isSaved = ko.observable(false);
    self.selectionMap = ko.observable({});
    ko.mapping.fromJS(loadData, {}, self);
    if (criteriaTemplates != null) {
        if (self.thingYouDidWell1() != null) {
            self.didWellComments(self.thingYouDidWell1() + "\n" + self.thingYouDidWell2());
        }
        if (self.thingToImprove1() != null) {
            self.improveComments(self.thingToImprove1() + "\n" + self.thingToImprove2());
        }
        if (self.thingYouDidWell3() != null) {
            var selectionMapJson = ko.toJS(self.thingYouDidWell3());
            if (selectionMapJson && typeof selectionMapJson === 'string') {
                try {
                    var parsedSelectionMap = JSON.parse(selectionMapJson);
                    self.selectionMap(parsedSelectionMap);
                } catch (e) {
                    console.warn("Invalid selection map JSON:", selectionMapJson);
                }
            }
        }
        if (self.thingToImprove3() != null) {
            var selectedCriterionName = self.thingToImprove3();
            console.log(selectedCriterionName);
            var matchingCriterion = ko.utils.arrayFirst(criteriaTemplates, function (criterion) {
                console.log(criterion);
                return criterion.name === self.thingToImprove3();
            });
            console.log(matchingCriterion);
            if (matchingCriterion) {
                self.selectedCriteria(matchingCriterion);
            }
            else {
                self.selectedCriteria(criteriaTemplates[0]);
            }
        } else {
            self.selectedCriteria(criteriaTemplates[0]);
        }
    }
    if (self.isScoreSubmitted() && self.isCommentsSubmitted()) {
        self.isSaved(true);
    }
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