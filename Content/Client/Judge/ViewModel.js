$("#tagpopup").dialog({
    autoOpen: false,
    close: function () {
    }
});
function JudgeViewModel() {
    var self = this;
    self.isActivePlace = ko.observable(false);
    self.isActiveOrder = ko.observable(false);
    self.eventId = ko.observable(5);
    self.totalScore = ko.observable(0);
    self.editingCompetitorId = ko.observable(MVC_EditingCompetitorId);
    self.maxTotalScore = ko.observable();
    self.competitors = ko.mapping.fromJS([]);
    self.sortBy = ko.observable(MVC_DefaultSortby);
    criteriaTemplates = MVC_CriteriaTemplates;
    self.selectedCompetitor = ko.observable();
    self.showTagPopup = ko.observable(false);
    self.newTag = ko.observable('');
    self.currentCompetitor = null;
    self.isCompleted = ko.observable(false);
    self.isDone = ko.observable(false);
    self.completedText = ko.observable('In Progress');
    self.completedClass = ko.observable('inprogress');
    self.showComments = ko.observable(true);
    self.showSubmit = ko.observable(false);
    self.openTagPopup = function (competitor) {
        //console.log(competitor.id(), competitor.competitorNick(), competitor, self.selectedCompetitor());
        if (self.selectedCompetitor() === competitor) {
            self.currentCompetitor = competitor;
            self.newTag('');
            self.showTagPopup(true);
            $('html, body').animate({ scrollTop: 0 }, 400, null, function () {
                $('#tagpopup').dialog('open');
            });
        }
    };
    self.saveTag = function () {
        if (self.currentCompetitor) {
            self.currentCompetitor.competitorNick(self.newTag());
        }
        self.showTagPopup(false);
        $('#tagpopup').dialog('close');
    };
    self.selectCompetitor = function (competitor) {
        self.showComments(true);
        self.showSubmit(false);
        self.selectedCompetitor(competitor);
    };
    self.selectCriteria = function (criteria) {
        self.selectedCompetitor().selectedCriteria(criteria);
    };
    self.showComment = function (row, type) {
        const criteriaName = self.selectedCompetitor().selectedCriteria().name + ': ';
        if (type === 'improve') {
            row.displayedComment(criteriaName + row.improve);
            row.selectedOption('improve');
        } else if (type === 'didWell') {
            row.displayedComment(criteriaName + row.didWell);
            row.selectedOption('didWell');
        }
    };
    self.hideComment = function (row) {
        row.displayedComment('');
        row.selectedOption('');
    };
    self.addToComments = function () {
        const didWell = [], improve = [];
        const currentCompetitor = self.selectedCompetitor();
        const selectedCriteria = currentCompetitor.selectedCriteria();

        // Collect selected options
        selectedCriteria.rows().forEach(row => {
            const criteriaName = selectedCriteria.name + ': ';
            if (row.selectedOption() === 'didWell') {
                didWell.push(criteriaName + row.didWell);
            }
            if (row.selectedOption() === 'improve') {
                improve.push(criteriaName + row.improve);
            }
        });

        // Helper to remove old comments of current criteria
        function removeCriteriaComments(existing, criteria) {
            return existing.split('\n').filter(comment => !comment.startsWith(criteria + ': ')).join('\n');
        }

        // Remove old comments and append new ones
        const criteriaName = selectedCriteria.name;
        let currentDidWell = removeCriteriaComments(currentCompetitor.didWellComments(), criteriaName);
        let currentImprove = removeCriteriaComments(currentCompetitor.improveComments(), criteriaName);

        if (didWell.length > 0) currentDidWell += (currentDidWell ? '\n' : '') + didWell.join('\n');
        if (improve.length > 0) currentImprove += (currentImprove ? '\n' : '') + improve.join('\n');

        currentCompetitor.didWellComments(currentDidWell.trim());
        currentCompetitor.improveComments(currentImprove.trim());
        let didwellCount = currentCompetitor.didWellComments().split('\n');
        let improveCount = currentCompetitor.improveComments().split('\n');
        //if (didWell.length > 1 && improve.length > 1 || (didwellCount.length > 1 && improveCount.length > 1)) {
            currentCompetitor.canSubmit(true);
        //}
    };

    // Submit Comments
    self.submitComments = function () {
        alert('Comments submitted for ' + self.selectedCompetitor().stageName());
        self.selectedCompetitor().isSaved(true);
        self.showComments(false);
        self.showSubmit(true);
        //console.log(ko.toJSON(self.selectedCompetitor()));
    };
    self.editComments = function () {
        alert('Comments edit for ' + self.selectedCompetitor().stageName());
        self.selectedCompetitor().isSaved(false);
        self.showComments(true);
        self.showSubmit(false);
        //console.log(ko.toJSON(self.selectedCompetitor()));
    };
    self.finalizeComments = function () {
        alert('Comments finalized');
        self.isDone(true);
        self.isCompleted(false);
        self.completedClass("completed");
        self.completedText("Completed");
        console.log(ko.toJSON(self.selectedCompetitor()));
    };
    self.nextCompetitor = function () {
        const currentIndex = self.competitors.indexOf(self.selectedCompetitor());
        const nextIndex = currentIndex + 1;
        console.log(nextIndex, self.competitors().length);
        if (nextIndex < self.competitors().length) {
            // Select the next competitor if available
            self.selectedCompetitor(self.competitors()[nextIndex]);
            //self.selectedCompetitor().isSaved(false);
            if (!self.selectedCompetitor().isSaved()) {
                self.showComments(true);
                self.showSubmit(false);
            } else {
                self.showComments(false);
                self.showSubmit(true);
            }
            console.log(self.selectedCompetitor(), nextIndex, currentIndex);
        } else {

            const unsavedCompetitor = ko.utils.arrayFirst(self.competitors(), function (competitor) {
                return !competitor.isSaved();
            });
            console.log(unsavedCompetitor);
            if (unsavedCompetitor) {
                self.selectedCompetitor(unsavedCompetitor);
                self.showComments(true);
                self.showSubmit(false);
            } else {
                console.log("done");
                // No unsaved competitors left, navigate to the finish page
                //alert("/Finish");
                self.showSubmit(false);
                self.isCompleted(true);
            }
        }
    };
    self.isEditingScore = ko.computed(function () {
        return self.editingCompetitorId() > 0;
    });

    self.sortedCompetitors = ko.computed(function () {
        
        var sortedRecords = self.competitors().slice(0, self.competitors().length);
        
        if (self.sortBy() === 'place') {
            sortedRecords.sort(self.competitorSortCompare_Score);
            self.isActivePlace(true);
            self.isActiveOrder(false);
        }
        else {
            sortedRecords.sort(self.competitorSortCompare_Order);
            self.isActivePlace(false);
            self.isActiveOrder(true);
        }

        return sortedRecords;
    });

    
    self.editingCompetitor = function () {
        
        return Enumerable.From(self.competitors()).Where(function (c) {            
            return c.id() == self.editingCompetitorId();
        }).FirstOrDefault();        
    }
    
    self.loadCompetitors = function (data, shouldPassCriteria) {
        
        var mapping = {
            create: function (options) {
                return new CompetitorSummary(options.data, shouldPassCriteria ? criteriaTemplates : null);
            },
            ignore: ['eventId']
        }
        
        ko.mapping.fromJS(data, mapping, self.competitors);
        if (self.competitors().length > 0) {
            self.selectedCompetitor(self.competitors()[0]);
            console.log(self.selectedCompetitor(), self.selectedCompetitor().id(), "ali");
        }
    }

    self.competitorSortCompare_Score = function (l, r) {
        
        if (l.positivescore() > 0 || r.positivescore() > 0) {
            return l.positivescore() > r.positivescore() ? -1 : 1;
        }
        else {
            return l.orderNumber() < r.orderNumber() ? -1 : 1;
        }
    }

    self.competitorSortCompare_Order = function (l, r) {
        return l.orderNumber() < r.orderNumber() ? -1 : 1;        
    }
}