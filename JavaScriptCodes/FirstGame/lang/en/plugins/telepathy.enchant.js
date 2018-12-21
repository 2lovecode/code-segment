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
 * The default URL of sending API.
 * @type String
 */
enchant.telepathy.SEND_API_URL = 'http://skylab.enchantmoon.com/moonblock/add_data/';
/**
 * The default URL of receiving API.
 * @type String
 */
enchant.telepathy.RECV_API_URL = 'http://skylab.enchantmoon.com/moonblock/watch/';

/**
 * Event which gives foreign message to objects.
 * Issued by {@link enchant.telepathy.TelepathySence}
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
     * Event which represents foreign message.
     * @param {String} channel channel.
     * @param {*} data content.
     * @constructs
     * @extends enchant.Event
     */
    initialize: function(channel, data) {
        enchant.Event.call(this, enchant.Event.TELEPATHY);

        /**
         * Telepathy channel.
         * @type String
         */
        this.channel = channel;
        /**
         * Telepathy content.
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
     * Object for sending and receiving telepathy.
     * @construct
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        /**
         * Object which stores channelers.
         * @type Object
         */
        this.channelers = {};
        /**
         * Object which stores EventSource.
         * @type Object
         */
        this.eventSources = {};
        /**
         * The telepathy object which received lastly.
         * @type enchant.telepathy.Telepathy
         */
        this.lastTelepathy = null;
        /**
         * URL of the send API.
         * @type String
         */
        this.sendAPI = enchant.telepathy.SEND_API_URL;
        /**
         * URL of the receive API.
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
     * Adds objet as telepathy channeler.
     * @param {String} channel target channel.
     * @param {enchant.EventTarget} target target object.
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
     * Removes objet from telepathy channeler.
     * @param {String} channel target channel.
     * @param {enchant.EventTarget} target target object.
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
     * Sends the telepathy.
     * @param {String} channel target channel.
     * @param {*} message data to send.
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
     * Begins to receive the telepathy.
     * @param {String} channel target channel.
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
     * Ends to receive the telepathy.
     * @param {String} channel target channel.
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
     * Closes all telepathy channels.
     */
    closeAll: function() {
        for (var channel in this.eventSources) {
            this.close(channel);
        }
    },
    /**
     * Finalizes TelepathySense.
     */
    finalize: function() {
        this.clearEventListener();
        this.closeAll();
        this.channelers = {};
    }
});

}());
