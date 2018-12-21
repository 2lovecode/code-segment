/**
 * @fileOverview
 * telepathy.enchant.js
 * @version 0.1.0
 * @require enchant.js v0.8.0+
 * @author UEI Corporation
 */
(function() {
/**
 * @namespace enchant.telepathy
 */
enchant.telepathy = {};

/**
 * @type String
 */
enchant.telepathy.SEND_API_URL = 'http://skylab.enchantmoon.com/moonblock/add_data/';
/**
 * @type String
 */
enchant.telepathy.RECV_API_URL = 'http://skylab.enchantmoon.com/moonblock/watch/';

/**
 * @type String
 */
enchant.Event.TELEPATHY = 'telepathy';

/**
 * @scope enchant.telepathy.Telepathy.prototype
 */
enchant.telepathy.Telepathy = enchant.Class.create(enchant.Event, {
    /**
     * @name enchant.telepathy.Telepathy
     * @class
     * @constructs
     * @extends enchant.Event
     */
    initialize: function(channel, data) {
        enchant.Event.call(this, enchant.Event.TELEPATHY);

        /**
         * @type String
         */
        this.channel = channel;
        /**
         * @type *
         */
        this.data = data;
    }
});

/**
 * @scope enchant.telepathy.TelepathySense.prototype
 */
enchant.telepathy.TelepathySense = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.telepathy.TelepathySense
     * @class
     * @construct
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        /**
         * @type Object
         */
        this.channelers = {};
        /**
         * @type Object
         */
        this.eventSources = {};
        /**
         * @type enchant.telepathy.Telepathy
         */
        this.lastTelepathy = null;
        /**
         * @type String
         */
        this.sendAPI = enchant.telepathy.SEND_API_URL;
        /**
         * @type String
         */
        this.recvAPI = enchant.telepathy.RECV_API_URL;

        this.addEventListener(enchant.Event.TELEPATHY, this._ontelepathy);
    },
    /**
     * @param {enchant.Event} evt
     * @private
     */
    _ontelepathy: function(evt) {
        var i, l,
            channelers = this.channelers[evt.channel];

        this.lastTelepathy = evt;

        if (!channelers) {
            return;
        }

        for (i = 0, l = channelers.length; i < l; i++) {
            channelers[i].dispatchEvent(evt);
        }
    },
    /**
     */
    addChanneler: function(channel, target) {
        if (this.channelers[channel]) {
            if (this.channelers[channel].indexOf(target) === -1) {
                this.channelers[channel].push(target);
            }
        } else {
            this.channelers[channel] = [ target ];
        }
    },
    /**
     */
    removeChanneler: function(channel, target) {
        var i;

        if (!this.channelers[channel]) {
            return;
        }

        i = this.channelers[channel].indexOf(target);

        if (i !== -1) {
            this.channelers[channel].splice(i, 1);
        }
    },
    /**
     */
    send: function(channel, message) {
        var xhr = new XMLHttpRequest(),
            data = JSON.stringify({ value: message });

        xhr.open('POST', this.sendAPI + channel, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.addEventListener('error', function(evt) {
            var errorEvent = new enchant.Event(enchant.Event.ERROR);
            errorEvent.message = 'Cannot send telepathy: ' + channel;
            this.dispatchEvent(errorEvent);
        }.bind(this));
        xhr.send('object=' + data);
    },
    /**
     */
    open: function(channel) {
        var eventSource = new EventSource(this.recvAPI + channel);

        eventSource.addEventListener('message', function(evt) {
            var i, l,
                data = JSON.parse(evt.data),
                stream = data.objects;

            for (i = 0, l = stream.length; i < l; i++) {
                this.dispatchEvent(new enchant.telepathy.Telepathy(channel, JSON.parse(stream[i]).value));
            }
        }.bind(this));

        this.eventSources[channel] = eventSource;
    },
    /**
     */
    close: function(channel) {
        var eventSource = this.eventSources[channel];

        if (eventSource) {
            eventSource.close();
            delete this.eventSources[channel];
            delete this.channelers[channel];
        }
    },
    /**
     */
    closeAll: function() {
        for (var channel in this.eventSources) {
            this.close(channel);
        }
    },
    /**
     */
    finalize: function() {
        this.clearEventListener();
        this.closeAll();
        this.channelers = {};
    }
});

}());
