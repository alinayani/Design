

function ScheduleViewModel() {
    var self = this;

    self.unSavedChanges = false;
    self.clickedItemType = ko.observable('none');
    self.allowCompetitorDrop = ko.observable(false);
    self.searchText = ko.observable('');
    self.competitions = ko.observableArray([]);
    self.selectedCompetition = ko.observable();

    self.selectedCompetitionId = ko.computed(function () {

        if (self.selectedCompetition()) {
            return self.selectedCompetition().id;
        }
        else {
            return '';
        }

    });

    self.allowEventDrop = ko.observable(false);
    self.pixelsPerMinute = ko.observable(competitorViewPixelsPerMinute);
    self.timeSlots = ko.observableArray([]);
    self.timeSlotsStart = ko.observable();

    self.panel1 = ko.observable();
    self.panel2 = ko.observable();
    self.panel3 = ko.observable();

    self.panels = ko.observableArray([
         // new JudgePanel(1, 'Panel 1'),
          //new JudgePanel(2, 'Panel 2')                     
    ]);

    self.allCompetitors = ko.observableArray([]);

    self.searchCompetitors = ko.computed(function () {
         
        var textToSearch = self.searchText().toLowerCase();
        
        return Enumerable.From(self.allCompetitors()).Where(function (competitor)
        {
            if (textToSearch.length > 0) {
               return competitor.name().toLowerCase().indexOf(textToSearch) != -1;
            }
            else {
                return competitor.parentEvent().isCatchAll() == true;
            }
        }).ToArray();

    });

    self.catchAllPanel = ko.observable();
    self.catchAllEvent = ko.observable();

    self.panelMarginTop = function (id) {

        if (typeof id == 'undefined') { return 0; }

        var panel = Enumerable.From(self.panels()).Where(function (panel) {
            if (panel.id() == id) {
                return true;
            }
        }).SingleOrDefault();

        if (panel == null) { return 0; }

        //var startTime = self.parseJsonDate(panel.startDateTime());
        //var diffInMinutes = Math.round((startTime - self.timeSlotsStart()) / 60000);


        return 0;//self.pixelsPerMinute() * diffInMinutes;
    };

    self.buildTimeSlots = function (pixels) {

        if (!(self.panel1())) { return; }

        pixels = self.pixelsPerMinute();

        var tick = competitorViewTicks;
        if (pixels == eventViewPixelsPerMinute) {
            tick = eventViewTicks;
        }

        //clear array
        self.timeSlots([]);

        if (self.panel1() == null) {
            self.timeSlotsStart(new Date());
        }
        else {
            self.timeSlotsStart(self.parseJsonDate(self.panel1().startDateTime()));
        }

        var startMinutes = self.timeSlotsStart().getMinutes();

        for (var hour = self.timeSlotsStart().getHours() ; hour < 24; hour++) {

            for (var minute = startMinutes; minute < 60; minute = minute + tick) {

                var startTime = new Date(2014, 1, 1, hour, minute, 0, 0);

                var item = new timeSlot(startTime, tick * pixels, tick);

                self.timeSlots.push(item);

            }

            startMinutes = 0;
        }
    }


    self.initialize = function () {
        //self.buildTimeSlots(competitorViewPixelsPerMinute);

        //self.calculateOrder();

        self.loadCompetitions();




    }

    self.showCompetitors = function (show) {

        var pixels = 0;
        if (show == true) {
            pixels = competitorViewPixelsPerMinute;
        }
        else {
            pixels = eventViewPixelsPerMinute;
        }

        self.pixelsPerMinute(pixels);

        self.buildTimeSlots(pixels);

        ko.utils.arrayForEach(self.panels(), function (panel) {

            ko.utils.arrayForEach(panel.events(), function (event) {

                event.visualizer().pixelsPerMinute(pixels);
                event.showCompetitors(show);

            });

        });

        //self.calculateOrder();
    }

    self.onDragStart = function (args) {




    }

    self.selectDay = function (day) {

        if (day == 1) {
            self.panel1(self.panels()[1]);
            self.panel2(self.panels()[2]);
        }
        else {
            self.panel1(self.panels()[3]);
            self.panel2(self.panels()[4]);
        }

        self.buildTimeSlots(self.pixelsPerMinute());
    }


    self.duplicateCompetitor = function (id) {

        $.ajax({
            type: "POST",
            url: "/schedule2/DuplicateCompetitor",
            data: { id: id },
            success: function (jsonData) {
                saveCompetitorDetailsSuccess(jsonData);
            }
        });
    }

    self.removeCompetitor = function (id) {
        var sourceEvent = self.getEventFromCompetitorId(id);
        var competitor = Enumerable.From(sourceEvent.competitors()).Where(function (e) { return e.id() == id; }).Single();

        var targetEvent = self.catchAllPanel().events()[0];

        sourceEvent.competitors.remove(competitor);
        targetEvent.competitors.push(competitor);
        //self.allCompetitors.push(competitor);
        competitor.parentEvent(targetEvent);

        self.calculateOrder(true);
    }

    self.beforeCompetitorMove = function (args) {

        //> If Moving FROM  'AllCompetitor' list
        if (args.sourceParent() == self.searchCompetitors()) {
            
            console.log('from all list');

            //> Process The drag manually because it doesn't actually remove it from the all Competitors List
            args.cancelDrop = true;

            var sourceEvent = self.getEventFromCompetitorId(args.item.id());
            var targetEvent = self.getEventFromCompetitorArray(args.targetParent());

            if (sourceEvent.id() != targetEvent.id()) {

                if (sourceEvent.isCatchAll() == false) {
                    alert('Warning: Competitor is already in an event. Are you sure you want to move them?');
                }

                sourceEvent.competitors.remove(args.item);
                targetEvent.competitors.splice(args.targetIndex, 0, args.item);

                args.item.parentEvent(targetEvent);                
                self.calculateOrder(true);
            }
            else {
                alert('This Competitor is already in this event');
            }
        }




        //alert('are you sure?');

        /*    
            
            if (args.targetParent()[0].ItemType != args.item.ItemType) {
                args.cancelDrop = true;
                
            }*/


    }

    self.parseJsonDate = function (jsonDateString) {
        if (jsonDateString == null) {
            return new Date(2014, 1, 1, 1, 1, 1, 1);
        }

        return new Date(parseInt(jsonDateString.replace('/Date(', '')));
    }


    self.calculateOrder = function (setDirtyFlag) {

        // Reset Time Slot Flags
        ko.utils.arrayForEach(self.timeSlots(), function (timeSlot) {
            timeSlot.flagMe(false);
        });

        // Loop Panels
        ko.utils.arrayForEach(self.panels(), function (panel) {

            var eventStartTime = self.parseJsonDate(panel.startDateTime());

            var eventOrder = 1;
            // Loop Events
            ko.utils.arrayForEach(panel.events(), function (event) {

                event.startTime(formatHourMinute(eventStartTime.getHours(), eventStartTime.getMinutes()));
                var eventEndTime = addMinutes(eventStartTime, event.duration()); // -eventPrefixMinutes() 
                event.endTime(formatHourMinute(eventEndTime.getHours(), eventEndTime.getMinutes()));

                if (setDirtyFlag && event.isDirty() == false && event.order() != eventOrder) {
                    event.isDirty(true);
                }

                event.order(eventOrder);

                // Loop Time Slots for Event
                ko.utils.arrayForEach(self.timeSlots(), function (timeSlot) {

                    if (eventStartTime >= timeSlot.startTime() && eventStartTime < timeSlot.endTime()) {
                        timeSlot.flagMe(true);
                    }
                });

                //> Loop Competitors
                var competitorOrder = 1;
                var competitorStartTime = addMinutes(eventStartTime, event.eventPrefixMinutes());
                ko.utils.arrayForEach(event.competitors(), function (competitor) {

                    var competitorEndTime = addMinutes(competitorStartTime, event.defaultCompetitorDuration());
                    // Reset Warnings
                    competitor.hasScheduleWarning(false);

                    if (setDirtyFlag && competitor.isDirty() == false &&
                        //(competitor.startTime() != competitorStartTime ||
                        //competitor.EndTime() != competitorEndTime ||
                         competitor.order() != competitorOrder) {

                        competitor.isDirty(true);
                        event.isDirty(true);
                    }

                    competitor.startTime(competitorStartTime);
                    competitor.endTime(competitorEndTime);
                    competitor.order(competitorOrder);

                    competitorOrder++;
                    competitorStartTime = competitorEndTime;

                });

                eventOrder++;
                eventStartTime = addMinutes(eventStartTime, event.duration());

            });

        });

        self.calculateCompetitorWarnings(setDirtyFlag);
    }


    /// 
    /// Summary: Loop Each Competitor, then loop each again to find scheduling conflicts & warnings
    //           Example: Person A is scheduled for Room A at 1:00pm and also form Room B at 1:05pm
    ///
    self.calculateCompetitorWarnings = function (setDirtyFlag) {

        // Loop Panels
        ko.utils.arrayForEach(self.panels(), function (panel) {
            // Loop Events
            ko.utils.arrayForEach(panel.events(), function (event) {
                //> Loop Competitors                            
                ko.utils.arrayForEach(event.competitors(), function (competitor) {
                    self.calculateCompetitorScheduleConflicts(setDirtyFlag, competitor, panel);
                });
            });
        });
    }

    self.getEvent = function (id) {
        //> Loop Panels
        for (var panelIndex = 0; panelIndex < self.panels().length; panelIndex++) {
            var panel = self.panels()[panelIndex];
            //> Loop Events
            for (var eventIndex = 0; eventIndex < panel.events().length; eventIndex++) {
                var event = panel.events()[eventIndex];

                if (event.id() == id) {
                    return event;
                }
            }
        }

        return null;
    }

    self.getCompetitor = function (id) {

        //> Loop Panels
        for (var panelIndex = 0; panelIndex < self.panels().length; panelIndex++) {
            var panel = self.panels()[panelIndex];

            //> Loop Events
            for (var eventIndex = 0; eventIndex < panel.events().length; eventIndex++) {
                var event = panel.events()[eventIndex];

                //> Loop Competitors
                for (var competitorIndex = 0; competitorIndex < event.competitors().length; competitorIndex++) {
                    var competitor = event.competitors()[competitorIndex];

                    if (competitor.id() == id) {
                        return competitor;
                    }
                }
            }
        }

    }

    self.getEventFromCompetitorId = function (id) {

        //> Loop Panels
        for (var panelIndex = 0; panelIndex < self.panels().length; panelIndex++) {
            var panel = self.panels()[panelIndex];

            //> Loop Events
            for (var eventIndex = 0; eventIndex < panel.events().length; eventIndex++) {
                var event = panel.events()[eventIndex];

                //> Loop Competitors
                for (var competitorIndex = 0; competitorIndex < event.competitors().length; competitorIndex++) {
                    var competitor = event.competitors()[competitorIndex];

                    if (competitor.id() == id) {
                        return event;
                    }
                }
            }
        }
    }

    self.getEventFromCompetitorArray = function (competitorArray) {
        //> Loop Panels
        for (var panelIndex = 0; panelIndex < self.panels().length; panelIndex++) {
            var panel = self.panels()[panelIndex];

            //> Loop Events
            for (var eventIndex = 0; eventIndex < panel.events().length; eventIndex++) {
                var event = panel.events()[eventIndex];

                if (event.competitors() == competitorArray) {
                    return event;
                }

            }
        }

        return null;
    }

    self.getPanel = function (id) {

        return Enumerable.From(Model.panels()).Where(function (item) { return item.id() == id }).SingleOrDefault(null);

        /*   //> Loop Panels
           for (var panelIndex = 0; panelIndex < self.panels().length; panelIndex++) {

               var panel = self.panels()[panelIndex];

               if (panel.id() == id) {
                   return panel;
               }
           }

           return null;*/
    }

    self.calculateCompetitorScheduleConflicts = function (setDirtyFlag, subjectCompetitor, subjectPanel) {

        var maxSameRoomCompetitorTurnAround = 36;
        var maxDifferentRoomCompetitorTurnAround = 66;

        var limit = 0;

        // Loop Panels
        ko.utils.arrayForEach(self.panels(), function (panel) {
            // Loop Events
            ko.utils.arrayForEach(panel.events(), function (event) {

                //   var samePersonCompetitors = ko.utils.arrayFilter(event.competitors(), function (competitor) {
                //     return competitor.name() == subjectCompetitor.name() && competitor.id() != subjectCompetitor.id();
                //});

                //> Loop Same Person Competitors      
                for (var i = 0; i < event.competitors().length; i++) {
                    var competitor = event.competitors()[i];

                    //> Don't compare a compeitor to it 's own self
                    if (competitor.id() == subjectCompetitor.id()) {
                        continue;
                    }

                    //> Only look for Competitors that are the same person. For now this means comparing the name
                    if (competitor.name() != subjectCompetitor.name()) {
                        continue;
                    }

                    var diffInMinutes = Math.round((competitor.startTime() - subjectCompetitor.startTime()) / 60000);


                    if (panel.id() == subjectPanel.id()) {
                        limit = maxSameRoomCompetitorTurnAround;
                    }
                    else {
                        limit = maxDifferentRoomCompetitorTurnAround;
                    }

                    if (Math.abs(diffInMinutes) < limit) {

                        if (setDirtyFlag && !event.isDirty() && (!competitor.hasScheduleWarning() || !subjectCompetitor.hasScheduleWarning())) {
                            //event.isDirty = true;

                        }

                        competitor.hasScheduleWarning(true);
                        subjectCompetitor.hasScheduleWarning(true);
                    }

                }

            });
        });
    }

    self.afterCompetitorMove = function (args) {

        args.item.isDirty(true);

        var sourceEvent = self.getEventFromCompetitorArray(args.sourceParent());
        var targetEvent = self.getEventFromCompetitorArray(args.targetParent());

        if (targetEvent == null) {
            targetEvent = self.catchAllPanel().events()[0];
        }

        if (sourceEvent.id() != targetEvent.id()) {
            args.item.parentEvent(targetEvent);            
        }

        self.calculateOrder(true);
        self.unSavedChanges = true;
    }

    self.afterEventMove = function (args) {

        args.item.isDirty(true);

        self.calculateOrder(true);
        self.unSavedChanges = true;
    }

    self.start = function () {
        self.loadCompetitions();
    }

    self.loadCompetitions = function () {

        $.ajax({
            type: "POST",
            url: _ScheduleController + "/competitions",
            success: function (jsonData) {

                var mapping =
                    {
                        create: function (options) {
                            return new Competition(options.data);
                        }
                    };

                ko.mapping.fromJS(jsonData, mapping, self.competitions);
                self.selectedCompetition(self.competitions()[0]);
            }
        });
    }


    self.refresh = function (competitionId, ignoreUnSavedChanges) {
        if (ignoreUnSavedChanges != true && self.unSavedChanges == true) {

            showModalDialog('Unsaved Changes Warning', true);
            setModalDialogContent('<br/><br/><br/><button onclick="Model.refresh('+competitionId+',true); closeModalDialog();">Abort Changes and Refresh</button><br/><br/>');
            return;
        }

        $.ajax({
            type: "POST",
            url: "/schedule2/refresh",
            data: { competitionId: competitionId },
            success: function (jsonData) {

                var mapping = {
                    'panels': {
                        /*key: function(mapObj)
                        {
                            return ko.utils.unwrapObservable(mapObj.id);
                        },*/
                        create: function (options) {
                            return new JudgePanel().applyModel(options.data);
                        }/*,
                                    update: function (options)
                                    {
                                        return options.data.applyModel(options.data);
                                    }*/
                    }
                };

                // Every time data is received from the server:
                ko.mapping.fromJS(jsonData, mapping, self);

                self.panel1(self.panels()[1]);
                self.panel2(self.panels()[2]);
                              
                self.unSavedChanges = false;
                self.allCompetitors([]);

                Enumerable.From(self.panels()).ForEach(function (p) {

                    Enumerable.From(p.events()).ForEach(function (e) {
                                                
                        if (e.isCatchAll() == true) {
                            self.catchAllPanel(p);
                            self.catchAllEvent(e);
                        }

                        Enumerable.From(e.competitors()).ForEach(function (c) {
                            c.parentEvent(e);
                            self.allCompetitors.push(c);
                        });

                    });
                });

                self.buildTimeSlots();
                self.calculateOrder(false);
                
                /*
                Enumerable.From(self.catchAllPanel().events()).ForEach(function (e) {
                    Enumerable.From(e.competitors()).ForEach(function (c) {
                        c.eventName(e.name());
                        self.allCompetitors.push(c);
                    });
                });*/


                //> Loop through all Competitors and Process Them
                /*    Enumerable.From(self.panels()).ForEach(function(p){

                        Enumerable.From(p.events()).ForEach(function(e)
                        {
                            Enumerable.From(e.competitors()).ForEach(function(c)
                            {
                                c.eventName(e.name());
                                self.allCompetitors.push(c);
                            });

                        });

                    });*/

                // Select Many Example
                /*.SelectMany(function (panel) {
                    return Enumerable.From(panel.events()).SelectMany('$.competitors()');
                }).ForEach(function (c) {
                    self.allCompetitors.push(c);
                });                          */

                //    self.catchAllPanel(catchAllPanel);                            

            },
            dataType: 'json'
        });
    }

    self.saveChanges = function () {

        //> Ignore everything except the Id property
        var mapping = {
            ignore: ['name', 'eventStarted', 'isUnscheduled', 'isConcluded', 'startDateTime', 'scoreSubmitted', 'eventType', 'level', 'ageGroup', 'order']
        };

        //var data = ko.mapping.toJS(self.panels, mapping);

        var data = self.panels();

        var result = Enumerable.From(data)
        .Select(function (p) {
            return {
                id: p.id(),
                events: Enumerable.From(p.events())
                    //.Where(function (e) {
                      //  return e.isDirty() == true ||
                        //Enumerable.From(e.competitors()).Where(function(c) { return c.isDirty == true}).ToArray().length > 0
                    //})
                    .OrderBy(function (e) { return e.order() })
                    .Select(function (e) {
                        return {
                            id: e.id(),
                            order: e.order(),
                            competitors: Enumerable.From(e.competitors())
                                //.Where(function (c) { return c.isDirty() == true })
                                .OrderBy(function (c) { return c.order() })
                                .Select(function (c) { return { id: c.id(), order: c.order() } }).ToArray()

                        }
                    }).ToArray()
            }
        })
        .ToArray();

        $.ajax({
            type: "POST",
            url: _ScheduleController + "/savechanges",
            data: JSON.stringify(result),
            success: function () {

                alert('Save Done!');
            },
            error: function () {

                alert('ERROR');
            },
            dataType: 'json',
            contentType: 'application/json'
        });

    }

    self.selectedCompetition.subscribe(function (newSelectedCompetition) {

        self.refresh(newSelectedCompetition.id);

    }.bind(self));

    /*   self.allowCompetitorDrop = function (args) {
                           
           return Clicked
           var items = args();
           
           
           var type = "None";
           for (var i = 0; i < items.length; i++) {
               
               
               if (i == 0)
               {
                   type = items[i].ItemType;
               }
               else if (type != items[i].ItemType) {
                   
                   return 0;
               }
               //items[i]);
           }

           

                  
           var result = type != "None";
           
           return result; //self.clickedItemType() == args()[0].ItemType;

           
           //if (typeof selectedTask == 'undefined') { return false; }

           

           //return selectedTask.ItemType == parent.ItemType;
       }*/
    /*
    self.moveCompetitor = function (sourceCompetitorId, targetEventId) {

        var target = {};
        var source = {};

        // loop through panels
        ko.utils.arrayForEach(self.panels(), function (panel) {
        
            // loop events
            ko.utils.arrayForEach(panel.events(), function (event) {                        
                if (event.id == targetEventId) {
                    target = { panel: panel, event: event };
                }
            
                ko.utils.arrayForEach(event.competitors(), function (competitor) {
                    if (competitor.id == sourceCompetitorId) {
                        source = { panel: panel, event: event, competitor: competitor };
                    }
                });

            });

        });


        if (source.event.id == target.event.id) {
            alert('Target & Source are the same');
        }
        else {
            // remove Competitor From Source Event
            source.event.removeCompetitor(source.competitor);

            // add Competitor to Target Source
            target.event.includeCompetitor(source.competitor);
        }

    }*/

    self.lookupEventType = function (eventType) {

        switch (eventType) {
            case 0: return 'None';
            case 1: return 'Champ';
            case 2: return 'Drama';
            case 3: return 'Entert';
            case 4: return 'Art';
            case 5: return 'Show';
            case 6: return 'All';
            case 7: return 'Groups';
            //case 8: return 'Lyra';
            case 8: return 'DTF';
            //case 9: return 'Qualifier';
            case 9: return 'Edited';
            case 10: return 'Heels';
            case 11: return 'Freedance';
            case 12: return 'Floorwork';
            case 14: return 'No Pole';
            case 15: return 'RX';
            case 16: return 'Shadow';
            case 19: return 'Sensual';
            case 20: return 'Showstopper';
            case 21: return 'HardStyle';
            default: return 'Unknown (' + eventType + ')';
        }

    }


}
 