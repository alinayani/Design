function JudgePanel(id, name) {
    var self = this;

    /// *** Model *****
    self.id = ko.observable(id);
	self.name = ko.observable(name);
	self.startDateTime = ko.observable(new Date(2014, 1, 1, 18, 0, 0, 0));
	self.room = ko.observable('test ROOM');
	self.isUnscheduled = ko.observable(false);
	self.description = ko.observable('test Desc');
    // ******************
    	
	self.events = ko.observableArray([
		new CompetitionEvent(1, 'Default Event')
	]);

	self.addEvent = function (id, name) {
		self.events.push(new CompetitionEvent(id, name));
	}

	self.removeEvent = function (event) { self.events.remove(event); }
    
	self.applyModel = function(data, ignoreEvents)
	{
	    var mapping = {
	        'events': {
	            /*key: function (mapObj) {
	                return ko.utils.unwrapObservable(mapObj.id);
	            },*/
	            create: function (options) {	                
	                return new CompetitionEvent().applyModel(options.data, false);                                                                                
	            }/*,
	            update: function (options)
	            {
	                return options.data.applyModel(options.data);
	            }*/
	        }
	    };

	    if (ignoreEvents == true) {
	        mapping = { ignore: ["events"] };	        
	    }
            
	    
	    ko.mapping.fromJS(data, mapping, self);
                	    
	    return self;
	}
}

/*
JudgePanel.prototype.toJSON = function () {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.startDateTime; //remove an extra property
    return copy; //return the copy to be serialized
};


*/