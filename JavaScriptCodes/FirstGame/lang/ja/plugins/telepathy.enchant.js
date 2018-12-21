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
 * デフォルトの送信APIのURL.
 * @type String
 */
enchant.telepathy.SEND_API_URL = 'http://skylab.enchantmoon.com/moonblock/add_data/';
/**
 * デフォルトの受信APIのURL.
 * @type String
 */
enchant.telepathy.RECV_API_URL = 'http://skylab.enchantmoon.com/moonblock/watch/';

/**
 * オブジェクトににアプリケーション外からのメッセージ(テレパシー)を与えるイベント.
 * 発行するオブジェクト: {@link enchant.telepathy.TelepathySence}
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
     * アプリケーション外からのメッセージを表すイベントオブジェクト.
     * @param {String} channel チャンネル.
     * @param {*} data データ.
     * @constructs
     * @extends enchant.Event
     */
    initialize: function(channel, data) {
        enchant.Event.call(this, enchant.Event.TELEPATHY);

        /**
         * テレパシーのチャンネルを表す.
         * @type String
         */
        this.channel = channel;
        /**
         * テレパシーの内容を表す.
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
     * テレパシーの送受信を行うためのオブジェクト.
     * @construct
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        /**
         * Telepathyの受信者を保持するオブジェクト.
         * @type Object
         */
        this.channelers = {};
        /**
         * Telepathyの受信に使用するEventSourceを保持するオブジェクト.
         * @type Object
         */
        this.eventSources = {};
        /**
         * 最後に受信したTelepathyオブジェクト.
         * @type enchant.telepathy.Telepathy
         */
        this.lastTelepathy = null;
        /**
         * テレパシー送信APIのURL.
         * @type String
         */
        this.sendAPI = enchant.telepathy.SEND_API_URL;
        /**
         * テレパシー受信APIのURL.
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
     * オブジェクトをTelepathyの受信者に設定する.
     * @param {String} channel 対象のチャンネル.
     * @param {enchant.EventTarget} target 対象のオブジェクト.
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
     * オブジェクトをTelepathyの受信者から除外する.
     * @param {String} channel 対象のチャンネル.
     * @param {enchant.EventTarget} target 対象のオブジェクト.
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
     * テレパシーを送信する.
     * @param {String} channel 対象のチャンネル.
     * @param {*} message 送信するデータ.
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
     * テレパシーの受信を開始する.
     * @param {String} channel 対象のチャンネル.
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
     * テレパシーの受信を終了する.
     * @param {String} channel 対象のチャンネル.
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
     * 全てのチャンネルについてテレパシーの受信を終了する.
     */
    closeAll: function() {
        for (var channel in this.eventSources) {
            this.close(channel);
        }
    },
    /**
     * TelepathySenseの後処理を行う.
     */
    finalize: function() {
        this.clearEventListener();
        this.closeAll();
        this.channelers = {};
    }
});

}());
