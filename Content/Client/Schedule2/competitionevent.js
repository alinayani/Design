function CompetitionEventVisualizer() {
    var self = this;

    self.minCompetitorHeight = ko.observable(20);
    self.maxCompetitorHeight = ko.observable(30);

    self.minEventHeight = ko.observable(40);
    self.minHeaderHeight = ko.observable(20);
    self.maxHeaderHeight = ko.observable(40);

    self.minFooterReserve = ko.observable(2);
    self.maxFooterHeight = ko.observable(920); //20
    self.maxCollectionPadding = ko.observable(20);

    self.eventSpacerHeight = ko.observable(10);
    self.horizontalBorderPixels = ko.observable(4);

    self.pixelsPerMinute = ko.observable(competitorViewPixelsPerMinute);
}

function CompetitionEvent(id, name) {
    var self = this;

    if (id == 0) {
        if (typeof CompetitionEvent.TempNewId == 'undefined') {
            CompetitionEvent.TempNewId = 0;
        }
        CompetitionEvent.TempNewId--;
        id = CompetitionEvent.TempNewId;
    }

    // ** Model ***
    self.id = ko.observable(id);
    self.name = ko.observable(name);
    self.description = ko.observable();
    self.order = ko.observable(1);
    self.eventType = ko.observable(0);
    self.skillLevel = ko.observable(0);
    self.eventStarted = ko.observable(false);
    self.isCatchAll = ko.observable(false);
    self.isConcluded = ko.observable(false);
    self.isWinnerCalculated = ko.observable(false);
    self.schedulePadding = ko.observable();
    //********************

    self.isDirty = ko.observable(false);
    self.const_EventSpacer = 10;
    self.const_MinimumHeight = 40;
    
    self.ItemType = 'Event';
    self.allowDrop = ko.observable(false);
    self.startTime = ko.observable();
    self.endTime = ko.observable();

    self.eventPrefixMinutes = ko.observable(2);
    self.showCompetitors = ko.observable(true);

    self.defaultCompetitorDuration = ko.observable(7);

    self.visualizer = ko.observable(new CompetitionEventVisualizer());

    self.headerHeight = ko.observable();
    self.competitorSlotHeight = ko.observable();
    self.collectionPadding = ko.observable();
    self.footerHeight = ko.observable();
    self.spacerHeight = ko.observable();
    
    self.applyModel = function(data, ignoreCompetitors)
    {
        var mapping = {
            'competitors': {
                /*key: function (mapObj) {
                    return ko.utils.unwrapObservable(mapObj.id);
                },*/
                create: function (options) {                    
                    return new EventCompetitor().applyModel(options.data);
                }/*,
                update: function (options) {
                    return options.data.applyModel(options.data);
                }*/
            }
        };
                
        if (ignoreCompetitors == true) {
            mapping = { ignore: ["competitors"] };            
        }
                
        ko.mapping.fromJS(data, mapping, self);
        return self;
    }
        

    self.preventReOrder = ko.computed(function () {
        return self.eventStarted() == false;
    });

    self.competitors = ko.observableArray([
      /*  new EventCompetitor(0, 'Person ASDF #'),
        new EventCompetitor(0, 'Person ASDF #'),
        new EventCompetitor(0, 'Person ASDF #'),
        new EventCompetitor(0, 'Person ASDF #'),
        new EventCompetitor(0, 'Person ASDF #'),*/
    ]);

    self.addCompetitor = function (id, name) {
        self.competitors.push(new EventCompetitor(id, name));
    }

    self.addCompetitorFromModel = function (model) {
        var competitor = new EventCompetitor().applyModel(model);
        competitor.parentEvent(self);
        self.competitors.push(competitor);
        return competitor
    }

    self.includeCompetitor = function (competitor) {
        self.competitors.push(competitor);
    }

    self.removeCompetitor = function (competitor) { self.competitors.remove(competitor); }

    self.competitorCount = ko.computed(function () {

        var count = self.competitors().length;
        return count;
    });

    self.duration = ko.computed(function () {

        var count = self.competitorCount();

        //self.eventPrefixMinutes() +  // x minutes for per/post setup
        var minutes = 
            (count * self.defaultCompetitorDuration()); // x min per competitor

        if (count >= 4) {
            minutes += 4;// + (count * 0.5);
        }

        if (minutes < 20) {
            return 20;
        }
        else {        
            var ret = self.roundUpTo(minutes, 5);            
            return ret;
        }

        //var cumulativeDurations = 0;
        //ko.utils.arrayForEach(self.competitors(), function (competitor) {
        //cumulativeDurations = cumulativeDurations + competitor.duration();                    
        //});

        //return cumulativeDurations;
    });

    self.roundUpTo = function(n, by) {
        //return (n + (by-1)) / by * by;
        return Math.ceil(n/by) * by;    
    };


    self.targetHeight = ko.computed(function () {

        var v = self.visualizer();
        return Math.max(v.minEventHeight(), Math.round(self.duration() * v.pixelsPerMinute())) - v.eventSpacerHeight();
    });

    /*   self.calculateVisualization = function () {

           var count = self.competitorCount();
           var v = self.visualizer();

           var minCompetitorHeight = v.minCompetitorHeight();
           if (self.showCompetitors() == false) { minCompetitorHeight = 0; }

           // **** Calculate Header Height ***
           var freeSpace = self.targetHeight()
               - v.horizontalBorderPixels()
               - (minCompetitorHeight * count);

           var _headerHeight = Math.min(Math.max(freeSpace, v.minHeaderHeight()), v.maxHeaderHeight());
                                              
           // **** Calculate Competitor Height ***
           freeSpace = freeSpace - _headerHeight + (minCompetitorHeight * count);
               
           var freeSpaceDivided = Math.round(freeSpace / count) - 1;

           var _competitorHeight = Math.min(Math.max(freeSpaceDivided, v.minCompetitorHeight()), v.maxCompetitorHeight());

           // **** Calculate Competitor Collection Padding ***                                        
           freeSpace -= freeSpace - v.minFooterReserve() - (_competitorHeight * count);
           var _collectionPadding = Math.min(freeSpace, v.maxCollectionPadding());

           // **** Calculate Footer Height & Spacer Height **********

           var _footerHeight = 0;
           var _spacerHeight = 0;

           if (self.showCompetitors() == false) {
               _footerHeight = self.targetHeight() - _headerHeight;                        
           }
           else if (count > 0) {
               freeSpace = freeSpace - _collectionPadding;
               _footerHeight = Math.min(freeSpace, v.maxFooterHeight());

               freeSpace = freeSpace - _footerHeight;
               _spacerHeight = Math.round(freeSpace / count);
           }                                                          

           self.headerHeight(_headerHeight);
           self.competitorSlotHeight(_competitorHeight);
           self.collectionPadding(_collectionPadding);
           self.footerHeight(_footerHeight);
           self.spacerHeight(_spacerHeight);
       }

       self.triggerVisualization = ko.computed(function () {

           var count = self.competitors().length;
           self.calculateVisualization();
           return count;
       });
       */

    self.headerHeight = ko.computed(function () {

        var count = self.competitorCount();
        var v = self.visualizer();

        var minCompetitorHeight = v.minCompetitorHeight();
        if (self.showCompetitors() == false) { minCompetitorHeight = 0; }

        var freeSpace =
             self.targetHeight()
            - v.horizontalBorderPixels()
            - (minCompetitorHeight * count);

        return Math.min(Math.max(freeSpace, v.minHeaderHeight()), v.maxHeaderHeight());

    });

    self.competitorSlotHeight = ko.computed(function () {

        var count = self.competitorCount();
        var v = self.visualizer();

        var freeSpace = self.targetHeight()
            - v.horizontalBorderPixels()
            - self.headerHeight();

        var freeSpaceDivided = Math.round(freeSpace / count) - 1;

        return Math.min(Math.max(freeSpaceDivided, v.minCompetitorHeight()), v.maxCompetitorHeight());

    });

    self.collectionPadding = ko.computed(function () {

        var count = self.competitorCount();
        var v = self.visualizer();

        var freeSpace = self.targetHeight()
            - v.minFooterReserve()
            - v.horizontalBorderPixels()
            - self.headerHeight()
            - (self.competitorSlotHeight() * count);

        return Math.min(freeSpace, v.maxCollectionPadding());
    });

    self.footerHeight = ko.computed(function () {

        if (self.showCompetitors() == false) {
            return self.targetHeight() - self.headerHeight();
        }

        var count = self.competitorCount();

        if (count == 0) { return 0; }

        var v = self.visualizer();

        var freeSpace = self.targetHeight()
            - self.headerHeight()
            - v.horizontalBorderPixels()
            - self.collectionPadding()
            - (self.competitorSlotHeight() * count);

        //console.log('targetHeight: '+ self.targetHeight());
        //console.log('borders: ' + self.borders);
        //console.log('collectionPadding: ' + self.collectionPadding());
        //console.log('SLots: ' + (self.competitorSlotHeight() * count));
        //console.log('-- TOTAL: ' + freeSpace);

        return Math.min(freeSpace, v.maxFooterHeight());

    });

    self.spacerHeight = ko.computed(function () {

        var count = self.competitorCount();

        if (count <= 5) {
            return 0;
        }

        var v = self.visualizer();

        var freeSpace = self.targetHeight()
          - self.headerHeight()
          - self.footerHeight()
          - v.horizontalBorderPixels()
          - self.collectionPadding()
          - (self.competitorSlotHeight() * count);

        var spacer = Math.round(freeSpace / count);

        return spacer;

    });

}

/*
CompetitionEvent.prototype.toJSON = function () {    
    var copy = ko.toJS(this);
    delete copy.name;
    delete copy.eventStarted;
    delete copy.eventStarted;   
    
    return copy;
};*/