
(function($) {
    
    $.fn.MouseTracker = function(settings) {
        
        // Set up default settings for the object
        settings = $.extend({
            type: "click",      // Tracking type, can be click or precision
            delay: 200,         // Delay between checks
            interval: null,     // Stores the window Interval
            data: [],           // Data stored by tracker, recorded for simulator
            time: 0             // Keeps track of time since tracker begins
        }, settings);
        
        // Object fields
        // Some migrated from the defaults for data
        var fields = {
            data: settings.data,
            time: settings.time,
            prev: 0
        };
        
        // Object functions
        var functions = {
            
            // Your main tracking function. call this to start tracking
            track: function() {
            
                var context = this;
            
                if(this.settings.interval != null) return null;
                
                // Set up timer
                // Increases every 10 milliseconds
                this.settings.interval = window.setInterval(function() {
                    context.time += 10;
                }, 10);
            
                // Set up mouselistener 
                $(document).on("mousemove.tracker", function(e) {

                    if(context.settings.type == "precision" ||
                            context.settings.type == "hybrid") {
                            
                        // Check delay
                        if(context.prev + context.settings.delay > context.time) {
                            context.data.push({
                                t: context.time,
                                x: e.pageX,
                                y: e.pageY,
                                a: 0
                            });
                            context.prev = context.time;
                        }
                    }
                
                    if(context.data.length == 0) {
                        context.data.push({
                            t: context.time,
                            x: e.pageX,
                            y: e.pageY,
                            a: 0
                        });
                        context.prev = context.time;
                    }
                    
                });
                
                // Tracking clicks
                if(this.settings.type == "click" || this.settings.type == "hybrid") {
                
                    // Set up click listener
                    $(document).on("click.tracker", function(e) {
                        context.data.push({
                            t: context.time,
                            x: e.pageX,
                            y: e.pageY,
                            a: 1
                        });
                    });
                
                } 
            },
        
            // Stops tracking and listeners and simulators
            stop: function() {
                $(document).off(".tracker");
                window.clearInterval(this.settings.interval);
                this.settings.interval = null;
                
                // Testing:
                console.log(this.data);
            },
            
            // Resets data collection. Does not stop listeners.
            reset: function() {
                this.data = [];
                this.time = 0;
            }
        };    
    
        return $.extend({settings:settings}, fields, functions);
    
    };


} (jQuery));