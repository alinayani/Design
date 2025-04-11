// $("#tagpopup").dialog({
    // autoOpen: false,
    // close: function () {
    // }
// });
// function JudgeViewModel() {
    // var self = this;
    // self.isActivePlace = ko.observable(false);
    // self.isActiveOrder = ko.observable(false);
    // self.eventId = ko.observable(5);
    // self.totalScore = ko.observable(0);
    // self.editingCompetitorId = ko.observable(MVC_EditingCompetitorId);
    // self.maxTotalScore = ko.observable();
    // self.competitors = ko.mapping.fromJS([]);
    // self.sortBy = ko.observable(MVC_DefaultSortby);
    // criteriaTemplates = MVC_CriteriaTemplates;
    // self.selectedCompetitor = ko.observable();
    // self.showTagPopup = ko.observable(false);
    // self.newTag = ko.observable('');
    // self.currentCompetitor = null;
    // self.isCompleted = ko.observable(false);
    // self.isDone = ko.observable(false);
    // self.completedText = ko.observable('In Progress');
    // self.completedClass = ko.observable('inprogress');
    // self.showComments = ko.observable(true);
    // self.showSubmit = ko.observable(false);
    // self.openTagPopup = function (competitor) {
        // //console.log(competitor.id(), competitor.competitorNick(), competitor, self.selectedCompetitor());
        // if (self.selectedCompetitor() === competitor) {
            // self.currentCompetitor = competitor;
            // self.newTag('');
            // self.showTagPopup(true);
            // $('html, body').animate({ scrollTop: 0 }, 400, null, function () {
                // $('#tagpopup').dialog('open');
            // });
        // }
    // };
    // self.saveTag = function () {
        // if (self.currentCompetitor) {
            // self.currentCompetitor.competitorNick(self.newTag());
        // }
        // self.showTagPopup(false);
        // $('#tagpopup').dialog('close');
    // };
    // self.selectCompetitor = function (competitor) {
        // self.showComments(true);
        // self.showSubmit(false);
        // self.selectedCompetitor(competitor);
    // };
    // self.selectCriteria = function (criteria) {
        // self.selectedCompetitor().selectedCriteria(criteria);
    // };
    // self.showComment = function (row, type) {
        // const criteriaName = self.selectedCompetitor().selectedCriteria().name + ': ';
        // if (type === 'improve') {
            // row.displayedComment(criteriaName + row.improve);
            // row.selectedOption('improve');
        // } else if (type === 'didWell') {
            // row.displayedComment(criteriaName + row.didWell);
            // row.selectedOption('didWell');
        // }
    // };
    // self.hideComment = function (row) {
        // row.displayedComment('');
        // row.selectedOption('');
    // };
    // self.addToComments = function () {
        // const didWell = [], improve = [];
        // const currentCompetitor = self.selectedCompetitor();
        // const selectedCriteria = currentCompetitor.selectedCriteria();

        // // Collect selected options
        // selectedCriteria.rows().forEach(row => {
            // const criteriaName = selectedCriteria.name + ': ';
            // if (row.selectedOption() === 'didWell') {
                // didWell.push(criteriaName + row.didWell);
            // }
            // if (row.selectedOption() === 'improve') {
                // improve.push(criteriaName + row.improve);
            // }
        // });

        // // Helper to remove old comments of current criteria
        // function removeCriteriaComments(existing, criteria) {
            // return existing.split('\n').filter(comment => !comment.startsWith(criteria + ': ')).join('\n');
        // }

        // // Remove old comments and append new ones
        // const criteriaName = selectedCriteria.name;
        // let currentDidWell = removeCriteriaComments(currentCompetitor.didWellComments(), criteriaName);
        // let currentImprove = removeCriteriaComments(currentCompetitor.improveComments(), criteriaName);

        // if (didWell.length > 0) currentDidWell += (currentDidWell ? '\n' : '') + didWell.join('\n');
        // if (improve.length > 0) currentImprove += (currentImprove ? '\n' : '') + improve.join('\n');

        // currentCompetitor.didWellComments(currentDidWell.trim());
        // currentCompetitor.improveComments(currentImprove.trim());
        // let didwellCount = currentCompetitor.didWellComments().split('\n');
        // let improveCount = currentCompetitor.improveComments().split('\n');
        // //if (didWell.length > 1 && improve.length > 1 || (didwellCount.length > 1 && improveCount.length > 1)) {
            // currentCompetitor.canSubmit(true);
        // //}
    // };

    // // Submit Comments
    // self.submitComments = function () {
        // alert('Comments submitted for ' + self.selectedCompetitor().stageName());
        // self.selectedCompetitor().isSaved(true);
        // self.showComments(false);
        // self.showSubmit(true);
        // //console.log(ko.toJSON(self.selectedCompetitor()));
    // };
    // self.editComments = function () {
        // alert('Comments edit for ' + self.selectedCompetitor().stageName());
        // self.selectedCompetitor().isSaved(false);
        // self.showComments(true);
        // self.showSubmit(false);
        // //console.log(ko.toJSON(self.selectedCompetitor()));
    // };
    // self.finalizeComments = function () {
        // alert('Comments finalized');
        // self.isDone(true);
        // self.isCompleted(false);
        // self.completedClass("completed");
        // self.completedText("Completed");
        // console.log(ko.toJSON(self.selectedCompetitor()));
    // };
    // self.nextCompetitor = function () {
        // const currentIndex = self.competitors.indexOf(self.selectedCompetitor());
        // const nextIndex = currentIndex + 1;
        // console.log(nextIndex, self.competitors().length);
        // if (nextIndex < self.competitors().length) {
            // // Select the next competitor if available
            // self.selectedCompetitor(self.competitors()[nextIndex]);
            // //self.selectedCompetitor().isSaved(false);
            // if (!self.selectedCompetitor().isSaved()) {
                // self.showComments(true);
                // self.showSubmit(false);
            // } else {
                // self.showComments(false);
                // self.showSubmit(true);
            // }
            // console.log(self.selectedCompetitor(), nextIndex, currentIndex);
        // } else {

            // const unsavedCompetitor = ko.utils.arrayFirst(self.competitors(), function (competitor) {
                // return !competitor.isSaved();
            // });
            // console.log(unsavedCompetitor);
            // if (unsavedCompetitor) {
                // self.selectedCompetitor(unsavedCompetitor);
                // self.showComments(true);
                // self.showSubmit(false);
            // } else {
                // console.log("done");
                // // No unsaved competitors left, navigate to the finish page
                // //alert("/Finish");
                // self.showSubmit(false);
                // self.isCompleted(true);
            // }
        // }
    // };
    // self.isEditingScore = ko.computed(function () {
        // return self.editingCompetitorId() > 0;
    // });

    // self.sortedCompetitors = ko.computed(function () {
        
        // var sortedRecords = self.competitors().slice(0, self.competitors().length);
        
        // if (self.sortBy() === 'place') {
            // sortedRecords.sort(self.competitorSortCompare_Score);
            // self.isActivePlace(true);
            // self.isActiveOrder(false);
        // }
        // else {
            // sortedRecords.sort(self.competitorSortCompare_Order);
            // self.isActivePlace(false);
            // self.isActiveOrder(true);
        // }

        // return sortedRecords;
    // });

    
    // self.editingCompetitor = function () {
        
        // return Enumerable.From(self.competitors()).Where(function (c) {            
            // return c.id() == self.editingCompetitorId();
        // }).FirstOrDefault();        
    // }
    
    // self.loadCompetitors = function (data, shouldPassCriteria) {
        
        // var mapping = {
            // create: function (options) {
                // return new CompetitorSummary(options.data, shouldPassCriteria ? criteriaTemplates : null);
            // },
            // ignore: ['eventId']
        // }
        
        // ko.mapping.fromJS(data, mapping, self.competitors);
        // if (self.competitors().length > 0) {
            // self.selectedCompetitor(self.competitors()[0]);
            // console.log(self.selectedCompetitor(), self.selectedCompetitor().id(), "ali");
        // }
    // }

    // self.competitorSortCompare_Score = function (l, r) {
        
        // if (l.positivescore() > 0 || r.positivescore() > 0) {
            // return l.positivescore() > r.positivescore() ? -1 : 1;
        // }
        // else {
            // return l.orderNumber() < r.orderNumber() ? -1 : 1;
        // }
    // }

    // self.competitorSortCompare_Order = function (l, r) {
        // return l.orderNumber() < r.orderNumber() ? -1 : 1;        
    // }
// }

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
    self.judgeUserId = ko.observable(5);
    self.totalScore = ko.observable(0);
    self.editingCompetitorId = ko.observable(MVC_EditingCompetitorId);
    self.cEditingCompetitorId = ko.observable(MVC_EditingCompetitorId1);
    self.maxTotalScore = ko.observable();
    self.competitors = ko.mapping.fromJS([]);
    self.sortBy = ko.observable(MVC_DefaultSortby);
    //criteriaTemplates = MVC_CriteriaTemplates;
    self.criteriaList = ko.observableArray(MVC_CriteriaTemplates);
    console.log(self.criteriaList(), MVC_CriteriaTemplates);
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
    //self.isStart = ko.observable(true);
    //self.startComments = function () {
    //    self.isStart(false);
    //    console.log("ali ahmed");
    //};
    self.getRowsForSelectedCriteria = function () {
        const selected = self.selectedCompetitor().selectedCriteria();
        return selected ? selected.comments : [];
    };
    // Get the current selection for a given comment
    self.getSelection = function (comment) {
        const crit = self.selectedCompetitor().selectedCriteria();
        const map = self.selectedCompetitor().selectionMap();
        return map[crit.name] ? map[crit.name][comment] : '';
    };

    // Set the selection for a specific comment in the current criterion
    self.setSelection = function (comment, value) {
        const crit = self.selectedCompetitor().selectedCriteria();
        let map = self.selectedCompetitor().selectionMap();

        if (!map[crit.name]) map[crit.name] = {}; // Initialize if not present
        map[crit.name][comment] = value;

        // Clean up if value is empty
        if (!value) delete map[crit.name][comment];

        self.selectedCompetitor().selectionMap(map); // Trigger KO update
    };
    self.getDisplayColor = function (comment) {
        const selected = self.getSelection(comment);
        if (selected === 'didWell') return 'green';
        if (selected === 'improve') return 'red';
        return 'black';
    };
    self.openTagPopup = function (competitor) {
        if (self.selectedCompetitor() === competitor && self.showComments()) {
            self.currentCompetitor = competitor;
            self.newTag(competitor.competitorNick() ? competitor.competitorNick() : '');
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
        if (!self.isDone()) {
            self.showComments(true);
            self.showSubmit(false);
            self.selectedCompetitor(competitor);
            if (self.selectedCompetitor().isSaved()) {
                self.showComments(false);
                self.showSubmit(true);
            }
        }
    };
    self.selectCriteria = function (criteria) {
        //if (self.selectedCompetitor()) {
            self.selectedCompetitor().selectedCriteria(criteria);
        //} else {
        //    console.log("tttt");
        //}
    };
    //self.showComment = function (row, type) {
    //    const criteriaName = self.selectedCompetitor().selectedCriteria().name + ': ';
    //    if (type === 'improve') {
    //        row.displayedComment(criteriaName + row.improve);
    //        row.selectedOption('improve');
    //    } else if (type === 'didWell') {
    //        row.displayedComment(criteriaName + row.didWell);
    //        row.selectedOption('didWell');
    //    }
    //};
    //self.hideComment = function (row) {
    //    row.displayedComment('');
    //    row.selectedOption('');
    //};
    /*self.addToComments = function () {
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
        if (didWell.length > 1 && improve.length > 1 || (didwellCount.length > 1 && improveCount.length > 1)) {
            currentCompetitor.canSubmit(true);
        }
    };*/
    self.addToComments = function () {
        const didWell = [], improve = [];
        const currentCompetitor = self.selectedCompetitor();
        const selectedCriteria = currentCompetitor.selectedCriteria();
        const criteriaName = selectedCriteria.name;
        //const map = currentCompetitor.selectionMap();

        /*if (map[criteriaName]) {
            for (const comment in map[criteriaName]) {
                const selection = map[criteriaName][comment];
                if (selection === 'didWell') {
                    didWell.push(`${criteriaName}: Did Well - ${comment}`);
                } else if (selection === 'improve') {
                    improve.push(`${criteriaName}: Improve - ${comment}`);
                }
            }
        }

        currentCompetitor.didWellComments(didWell.join('\n'));
        currentCompetitor.improveComments(improve.join('\n'));*/

        selectedCriteria.comments.forEach(comment => {
            let sel = self.getSelection(comment);
            if (sel === 'didWell') didWell.push(`${criteriaName}: Did Well - ${comment}`);
            else if (sel === 'improve') improve.push(`${criteriaName}: Improve - ${comment}`);
        });

        const removeOld = (text, prefix) =>
            text.split('\n').filter(line => !line.includes(`${prefix}: `)).join('\n');

        let currDW = removeOld(currentCompetitor.didWellComments(), criteriaName);
        let currIM = removeOld(currentCompetitor.improveComments(), criteriaName);

        if (didWell.length) currDW += (currDW ? '\n' : '') + didWell.join('\n');
        if (improve.length) currIM += (currIM ? '\n' : '') + improve.join('\n');

        currentCompetitor.didWellComments(currDW.trim());
        currentCompetitor.improveComments(currIM.trim());
        let didwellCount = currentCompetitor.didWellComments().split('\n');
        let improveCount = currentCompetitor.improveComments().split('\n');
        if (didWell.length > 1 && improve.length > 1 || (didwellCount.length > 1 && improveCount.length > 1)) {
            currentCompetitor.canSubmit(true);
        }
    };
    // Submit Comments
    self.submitComments = function () {
        var thingsdidwell = self.selectedCompetitor().didWellComments().split("\n");
        var thingstoimp = self.selectedCompetitor().improveComments().split("\n");
        console.log(ko.toJSON(self.selectedCompetitor()), self.selectedCompetitor().selectedCriteria(), thingsdidwell, thingstoimp);
        //var model = ko.mapping.toJSON(self.selectedCompetitor());
        var model = {
            id: self.selectedCompetitor().id(),
            eventId: self.eventId(),
            judgeUserId: self.judgeUserId(),
            orderNumber: self.selectedCompetitor().orderNumber(),
            competitorNick: self.selectedCompetitor().competitorNick(),
            thingYouDidWell1: thingsdidwell[0],
            thingYouDidWell2: thingsdidwell.slice(1).join("\n"),
            thingToImprove1: thingstoimp[0],
            thingToImprove2: thingstoimp.slice(1).join("\n"),
            //isSaved: self.selectedCompetitor().isSaved(),
            thingYouDidWell3: ko.toJSON(self.selectedCompetitor().selectionMap()),
            thingToImprove3: self.selectedCompetitor().selectedCriteria().name
        };

        console.log("Sending Model: ", model, self.eventId(), self.eventId, self.selectedCompetitor(), self.selectedCompetitor().selectedCriteria());
        //console.log(ko.toJSON(self.selectedCompetitor().criteria()));
        //console.log(ko.toJSON(self.selectedCompetitor().selectedCriteria()));
        //console.log(model, self.selectedCompetitor(), self.selectedCompetitor, this.currentCompetitor);
        $.ajax({
            url: "/Judge/PostJudgeComments/",
            type: "POST",
            data: JSON.stringify(model),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (message) {
                console.log(message);
                //console.log(message, message.Action, message.Result, message.Url);
                //ko.mapping.fromJS(data.viewModel, {}, self);
                if (message.Result == "success") {
                    //console.log("test");
                    window.location.href = message.Url;
                    toastr.success(message.Action);
                } else if (message.Result == "error") {
                    toastr.error(message.Action);
                }
            },
            error: function (errorData) {
                console.log(errorData);
            }
        });
        //alert('Comments submitted for ' + self.selectedCompetitor().stageName());
        //self.selectedCompetitor().isSaved(true);
        //self.showComments(false);
        //self.showSubmit(true);
        //console.log(ko.toJSON(self.selectedCompetitor()));
    };
    self.editComments = function () {
        //alert('Comments edit for ' + self.selectedCompetitor().stageName());
        //.selectedCompetitor().isSaved(false);
        self.showComments(true);
        self.showSubmit(false);
        //console.log(ko.toJSON(self.selectedCompetitor()));
    };
    self.finalizeComments = function () {
        //alert('Comments finalized');
        $.ajax({
            url: "/Judge/FinalizeJudgeComments/",
            type: "POST",
            data: { judgeId: self.judgeUserId(), eventId: self.eventId() },
            success: function (jsReturnArgs) {

                //alert('TEST 1.' + jsReturnArgs.JudgingStatus + " vs " + pageJudgingStatus);
                self.isDone(true);
                self.isCompleted(false);
                self.completedClass("completed");
                self.completedText("Completed");
                if (jsReturnArgs.Action == "Refresh") {
                    window.location.href = jsReturnArgs.Url;
                    //console.log(jsReturnArgs.Url);
                }
                else {
                    console.log(jsReturnArgs.Message);
                    if (jsReturnArgs.Action == "Message") {
                        showModalDialogWithContent(jsReturnArgs.Title, '<p>' + jsReturnArgs.Message + '</p>', true);
                    }
                    restartTimer();
                }
            },
            error: function (errorData) {
                console.log(errorData);
                onError(true, errorData);
            }
        });
        //console.log(ko.toJSON(self.selectedCompetitor()));
    };
    self.nextCompetitor = function () {
        //console.log(self.competitors());
        const currentIndex = self.competitors.indexOf(self.selectedCompetitor());
        const nextIndex = currentIndex + 1;
        //console.log(currentIndex, self.selectedCompetitor().id(), nextIndex, self.competitors().length);
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
            //console.log(self.selectedCompetitor(), nextIndex, currentIndex);
        } else {

            const unsavedCompetitor = ko.utils.arrayFirst(self.competitors(), function (competitor) {
                return !competitor.isSaved();
            });
            //console.log(unsavedCompetitor);
            if (unsavedCompetitor) {
                self.selectedCompetitor(unsavedCompetitor);
                self.showComments(true);
                self.showSubmit(false);
            } else {
                //console.log("done");
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
        //console.log(self.competitors(), data);
        var mapping = {
            create: function (options) {
                //console.log(options.data);
                return new CompetitorSummary(options.data, shouldPassCriteria ? self.criteriaList() : null);
            },
            ignore: ['eventId']
        }
        //console.log(self.competitors(), data);
        ko.mapping.fromJS(data, mapping, self.competitors);
        console.log(self.competitors(), data);
        if (self.competitors().length > 0) {
            //self.selectedCompetitor(self.competitors()[0]);
            //self.selectedCompetitor = ko.computed(() => {
            //    const editingId = self.cEditingCompetitorId();
            //    if (editingId && editingId !== 0) {
            //        return ko.utils.arrayFirst(self.competitors(), competitor => {
            //            return competitor.id() === editingId;
            //        });
            //    } else {
            //        return self.competitors()[0];
            //    }
            //});
            //console.log(typeof self.cEditingCompetitorId(), self.cEditingCompetitorId(), typeof self.competitors()[0].id());
            if (self.cEditingCompetitorId() && self.cEditingCompetitorId() !== 0) {
                var competitor = ko.utils.arrayFirst(self.competitors(), function (c) {
                    return c.id() == self.cEditingCompetitorId();
                });
                //console.log("here", ko.toJSON(self.competitors()), competitor);
                if (competitor != null) {
                    self.selectedCompetitor(competitor);
                    var selectedCriterionName = competitor.thingToImprove3();
                    console.log(selectedCriterionName);
                    var matchingCriterion = ko.utils.arrayFirst(self.criteriaList(), function (criterion) {
                        console.log(criterion);
                        return criterion.name === selectedCriterionName;
                    });
                    console.log(matchingCriterion);
                    if (matchingCriterion) {
                        self.selectedCompetitor().selectedCriteria(matchingCriterion);
                        //var selectionMapJson = ko.toJS(self.selectedCompetitor().thingYouDidWell3());
                        //console.log(selectionMapJson, self.selectedCompetitor().thingYouDidWell3);
                        //if (selectionMapJson && typeof selectionMapJson === 'string') {
                        //    try {
                        //        var parsedSelectionMap = JSON.parse(selectionMapJson);
                        //        self.selectedCompetitor().selectionMap(parsedSelectionMap);
                        //    } catch (e) {
                        //        console.warn("Invalid selection map JSON:", selectionMapJson);
                        //    }
                        //}
                    }
                    console.log("here1", self.selectedCompetitor());
                } else {
                    self.selectedCompetitor(self.competitors()[0]);
                    //self.selectedCompetitor().selectedCriteria(self.criteriaList()[0]);
                    //console.log("here2", self.selectedCompetitor());
                }
            } else {
                self.selectedCompetitor(self.competitors()[0]);
                //self.selectedCompetitor().selectedCriteria(self.criteriaList()[0]);
                //console.log("there", self.selectedCompetitor());
            }
            console.log(self.selectedCompetitor());
            if(self.selectedCompetitor()?.isSaved()){
                self.showComments(false);
                self.showSubmit(true);
            }
            //console.log(self.selectedCompetitor().criteria());
            //console.log(self.selectedCompetitor().selectedCriteria());
            //console.log(self.competitors()[0].thingYouDidWell3());
            //console.log(self.competitors()[0].thingToImprove3());
            //self.selectedCompetitor().criteria(self.competitors()[0].thingYouDidWell3());
            //self.selectedCompetitor().selectedCriteria(self.competitors()[0].thingToImprove3());
            //console.log(self.selectedCompetitor(), self.selectedCompetitor().id(), "ali");
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

    //self.competitors.subscribe(function (newValue) {
    //    console.log("Updated competitors:", ko.toJS(newValue));
    //});
}