// PriorityQueue
define([], function () {
    /**
     * @private
     */
    var prioritySortLow = function(a, b) {
        return b.priority - a.priority;
    };

    /**
     * @private
     */
    var prioritySortHigh = function(a, b) {
        return a.priority - b.priority;
    };

    /*global PriorityQueue */
    /**
     * @constructor
     * @class PriorityQueue manages a queue of elements with priorities. Default
     * is highest priority first.
     *
     * @param [options] If low is set to true returns lowest first.
     */
    var PriorityQueue = function(options) {
        var contents = [];

        var sorted = false;
        var sortStyle;

        if (options && options.low) {
            sortStyle = prioritySortLow;
        } else {
            sortStyle = prioritySortHigh;
        }

        /**
         * @private
         */
        var sort = function() {
            contents.sort(sortStyle);
            sorted = true;
        };

        var self = {
            contents: contents,
            /**
             * Removes and returns the next element in the queue.
             * @member PriorityQueue
             * @return The next element in the queue. If the queue is empty returns
             * undefined.
             *
             * @see PrioirtyQueue#top
             */
            pop: function() {
                if (!sorted) {
                    sort();
                }

                var element = contents.pop();

                if (element) {
                    return element.object;
                } else {
                    return undefined;
                }
            },

            /**
             * Returns but does not remove the next element in the queue.
             * @member PriorityQueue
             * @return The next element in the queue. If the queue is empty returns
             * undefined.
             *
             * @see PriorityQueue#pop
             */
            top: function() {
                if (!sorted) {
                    sort();
                }

                var element = contents[contents.length - 1];

                if (element) {
                    return element.object;
                } else {
                    return undefined;
                }
            },

            result: function () {
                if (!sorted) {
                    sort();
                }

                return contents;
            },

            /**
             * @member PriorityQueue
             * @param object The object to check the queue for.
             * @returns true if the object is in the queue, false otherwise.
             */
            includes: function(object) {
                for (var i = contents.length - 1; i >= 0; i--) {
                    if (contents[i].object === object) {
                        return true;
                    }
                }

                return false;
            },

            /**
             * @member PriorityQueue
             * @param object The object to check the queue for.
             * @returns true if the object is in the queue, false otherwise.
             */
            remove: function(object) {
                for (var i = contents.length - 1; i >= 0; i--) {
                    if (contents[i].object === object) {
                        delete contents[i];
                        for (var j = i; j < contents.length - 1; j++) {
                            contents[j] = contents[j+1];
                        }
                        contents.length --;
                        return true;
                    }
                }
                return false;
            },

            /**
             * @member PriorityQueue
             * @returns the current number of elements in the queue.
             */
            size: function() {
                return contents.length;
            },

            /**
             * @member PriorityQueue
             * @returns true if the queue is empty, false otherwise.
             */
            empty: function() {
                return contents.length === 0;
            },

            /**
             * @member PriorityQueue
             * @param object The object to be pushed onto the queue.
             * @param priority The priority of the object.
             */
            push: function(object, priority) {
                contents.push({
                    object: object,
                    priority: priority
                });
                sorted = false;
            }
        };

        return self;
    };

    return PriorityQueue;
});