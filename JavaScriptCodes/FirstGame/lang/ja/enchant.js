/**
 * enchant.js v0.8.3
 * http://enchantjs.com
 *
 * Copyright UEI Corporation
 * Released under the MIT license.
 */

(function(window, undefined) {

// ECMA-262 5th edition Functions
if (typeof Object.defineProperty !== 'function') {
    Object.defineProperty = function(obj, prop, desc) {
        if ('value' in desc) {
            obj[prop] = desc.value;
        }
        if ('get' in desc) {
            obj.__defineGetter__(prop, desc.get);
        }
        if ('set' in desc) {
            obj.__defineSetter__(prop, desc.set);
        }
        return obj;
    };
}
if (typeof Object.defineProperties !== 'function') {
    Object.defineProperties = function(obj, descs) {
        for (var prop in descs) {
            if (descs.hasOwnProperty(prop)) {
                Object.defineProperty(obj, prop, descs[prop]);
            }
        }
        return obj;
    };
}
if (typeof Object.create !== 'function') {
    Object.create = function(prototype, descs) {
        function F() {
        }

        F.prototype = prototype;
        var obj = new F();
        if (descs != null) {
            Object.defineProperties(obj, descs);
        }
        return obj;
    };
}
if (typeof Object.getPrototypeOf !== 'function') {
    Object.getPrototypeOf = function(obj) {
        return obj.__proto__;
    };
}

if (typeof Function.prototype.bind !== 'function') {
    Function.prototype.bind = function(thisObject) {
        var func = this;
        var args = Array.prototype.slice.call(arguments, 1);
        var Nop = function() {
        };
        var bound = function() {
            var a = args.concat(Array.prototype.slice.call(arguments));
            return func.apply(
                this instanceof Nop ? this : thisObject || window, a);
        };
        Nop.prototype = func.prototype;
        bound.prototype = new Nop();
        return bound;
    };
}

window.getTime = (function() {
    var origin;
    if (window.performance && window.performance.now) {
        origin = Date.now();
        return function() {
            return origin + window.performance.now();
        };
    } else if (window.performance && window.performance.webkitNow) {
        origin = Date.now();
        return function() {
            return origin + window.performance.webkitNow();
        };
    } else {
        return Date.now;
    }
}());

// define requestAnimationFrame
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function() {
        var lastTime = window.getTime();
        var frame = 1000 / 60;
        return function(func) {
            var _id = setTimeout(function() {
                lastTime = window.getTime();
                func(lastTime);
            }, Math.max(0, lastTime + frame - window.getTime()));
            return _id;
        };
    }());

/**
 * グローバルにライブラリのクラスをエクスポートする.
 *
 * 引数に何も渡さない場合enchant.jsで定義されたクラス及びプラグインで定義されたクラス
 * 全てがエクスポートされる. 引数が一つ以上の場合はenchant.jsで定義されたクラスのみ
 * がデフォルトでエクスポートされ, プラグインのクラスをエクスポートしたい場合は明示的に
 * プラグインの識別子を引数として渡す必要がある.
 *
 * @example
 * enchant();     // 全てのクラスがエクスポートされる
 * enchant('');   // enchant.js本体のクラスのみがエクスポートされる
 * enchant('ui'); // enchant.js本体のクラスとui.enchant.jsのクラスがエクスポートされる
 *
 * @param {...String} [modules] エクスポートするモジュール. 複数指定できる.
 * @function
 * @global
 * @name enchant
 */
var enchant = function(modules) {
    if (modules != null) {
        if (!(modules instanceof Array)) {
            modules = Array.prototype.slice.call(arguments);
        }
        modules = modules.filter(function(module) {
            return [module].join();
        });
    }
    (function include(module, prefix) {
        var submodules = [],
            i, len;
        for (var prop in module) {
            if (module.hasOwnProperty(prop)) {
                if (typeof module[prop] === 'function') {
                    window[prop] = module[prop];
                } else if (typeof module[prop] === 'object' && module[prop] !== null && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                    if (modules == null) {
                        submodules.push(prop);
                    } else {
                        i = modules.indexOf(prefix + prop);
                        if (i !== -1) {
                            submodules.push(prop);
                            modules.splice(i, 1);
                        }
                    }
                }
            }
        }

        for (i = 0, len = submodules.length; i < len; i++) {
            include(module[submodules[i]], prefix + submodules[i] + '.');
        }
    }(enchant, ''));

    // issue 185
    if (enchant.Class.getInheritanceTree(window.Game).length <= enchant.Class.getInheritanceTree(window.Core).length) {
        window.Game = window.Core;
    }

    if (modules != null && modules.length) {
        throw new Error('Cannot load module: ' + modules.join(', '));
    }
};

// export enchant
window.enchant = enchant;

window.addEventListener("message", function(msg, origin) {
    try {
        var data = JSON.parse(msg.data);
        if (data.type === "event") {
            enchant.Core.instance.dispatchEvent(new enchant.Event(data.value));
        } else if (data.type === "debug") {
            switch (data.value) {
                case "start":
                    enchant.Core.instance.start();
                    break;
                case "pause":
                    enchant.Core.instance.pause();
                    break;
                case "resume":
                    enchant.Core.instance.resume();
                    break;
                case "tick":
                    enchant.Core.instance._tick();
                    break;
                default:
                    break;
            }
        }
    } catch (e) {
        // ignore
    }
}, false);

/**
 * @name enchant.Class
 * @class
 * クラスのクラス.
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} [definition] クラス定義.
 * @constructor
 */
enchant.Class = function(superclass, definition) {
    return enchant.Class.create(superclass, definition);
};

/**
 * クラスを作成する.
 *
 * ほかのクラスを継承したクラスを作成する場合, コンストラクタはデフォルトで
 * 継承元のクラスのものが使われる. コンストラクタをオーバーライドする場合継承元の
 * コンストラクタを適用するには明示的に呼び出す必要がある.
 *
 * @example
 * var Ball = Class.create({ // 何も継承しないクラスを作成する
 *     initialize: function(radius) { ... }, // メソッド定義
 *     fall: function() { ... }
 * });
 *
 * var Ball = Class.create(Sprite);  // Spriteを継承したクラスを作成する
 * var Ball = Class.create(Sprite, { // Spriteを継承したクラスを作成する
 *     initialize: function(radius) { // コンストラクタを上書きする
 *         Sprite.call(this, radius * 2, radius * 2); // 継承元のコンストラクタを適用する
 *         this.image = core.assets['ball.gif'];
 *     }
 * });
 *
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} [definition] クラス定義.
 * @static
 */
enchant.Class.create = function(superclass, definition) {
    if (superclass == null && definition) {
        throw new Error("superclass is undefined (enchant.Class.create)");
    } else if (superclass == null) {
        throw new Error("definition is undefined (enchant.Class.create)");
    }

    if (arguments.length === 0) {
        return enchant.Class.create(Object, definition);
    } else if (arguments.length === 1 && typeof arguments[0] !== 'function') {
        return enchant.Class.create(Object, arguments[0]);
    }

    for (var prop in definition) {
        if (definition.hasOwnProperty(prop)) {
            if (typeof definition[prop] === 'object' && definition[prop] !== null && Object.getPrototypeOf(definition[prop]) === Object.prototype) {
                if (!('enumerable' in definition[prop])) {
                    definition[prop].enumerable = true;
                }
            } else {
                definition[prop] = { value: definition[prop], enumerable: true, writable: true };
            }
        }
    }
    var Constructor = function() {
        if (this instanceof Constructor) {
            Constructor.prototype.initialize.apply(this, arguments);
        } else {
            return new Constructor();
        }
    };
    Constructor.prototype = Object.create(superclass.prototype, definition);
    Constructor.prototype.constructor = Constructor;
    if (Constructor.prototype.initialize == null) {
        Constructor.prototype.initialize = function() {
            superclass.apply(this, arguments);
        };
    }

    var tree = this.getInheritanceTree(superclass);
    for (var i = 0, l = tree.length; i < l; i++) {
        if (typeof tree[i]._inherited === 'function') {
            tree[i]._inherited(Constructor);
            break;
        }
    }

    return Constructor;
};

/**
 * クラスの継承関係を取得する.
 * @param {Function} コンストラクタ.
 * @return {Function[]} 親のコンストラクタ.
 */
enchant.Class.getInheritanceTree = function(Constructor) {
    var ret = [];
    var C = Constructor;
    var proto = C.prototype;
    while (C !== Object) {
        ret.push(C);
        proto = Object.getPrototypeOf(proto);
        C = proto.constructor;
    }
    return ret;
};

/**
 * @namespace
 * enchant.js の環境変数.
 * new Core() を呼ぶ前に変更することで変更することで, 動作設定を変えることができる.
 */
enchant.ENV = {
    /**
     * enchant.jsのバージョン.
     * @type String
     */
    VERSION: '0.8.3',
    /**
     * 実行中のブラウザの種類.
     * @type String
     */
    BROWSER: (function(ua) {
        if (/Eagle/.test(ua)) {
            return 'eagle';
        } else if (/Opera/.test(ua)) {
            return 'opera';
        } else if (/MSIE|Trident/.test(ua)) {
            return 'ie';
        } else if (/Chrome/.test(ua)) {
            return 'chrome';
        } else if (/(?:Macintosh|Windows).*AppleWebKit/.test(ua)) {
            return 'safari';
        } else if (/(?:iPhone|iPad|iPod).*AppleWebKit/.test(ua)) {
            return 'mobilesafari';
        } else if (/Firefox/.test(ua)) {
            return 'firefox';
        } else if (/Android/.test(ua)) {
            return 'android';
        } else {
            return '';
        }
    }(navigator.userAgent)),
    /**
     * 実行中のブラウザに対応するCSSのベンダープレフィックス.
     * @type String
     */
    VENDOR_PREFIX: (function() {
        var ua = navigator.userAgent;
        if (ua.indexOf('Opera') !== -1) {
            return 'O';
        } else if (/MSIE|Trident/.test(ua)) {
            return 'ms';
        } else if (ua.indexOf('WebKit') !== -1) {
            return 'webkit';
        } else if (navigator.product === 'Gecko') {
            return 'Moz';
        } else {
            return '';
        }
    }()),
    /**
     * ブラウザがタッチ入力をサポートしているかどうか.
     * @type Boolean
     */
    TOUCH_ENABLED: (function() {
        var div = document.createElement('div');
        div.setAttribute('ontouchstart', 'return');
        return typeof div.ontouchstart === 'function';
    }()),
    /**
     * 実行中の環境がRetina DisplayのiPhoneかどうか.
     * @type Boolean
     */
    RETINA_DISPLAY: (function() {
        if (navigator.userAgent.indexOf('iPhone') !== -1 && window.devicePixelRatio === 2) {
            var viewport = document.querySelector('meta[name="viewport"]');
            if (viewport == null) {
                viewport = document.createElement('meta');
                document.head.appendChild(viewport);
            }
            viewport.setAttribute('content', 'width=640');
            return true;
        } else {
            return false;
        }
    }()),
    /**
     * サウンドの再生にHTMLAudioElement/WebAudioの代わりにflashのプレーヤーを使うかどうか.
     * @type Boolean
     */
    USE_FLASH_SOUND: (function() {
        var ua = navigator.userAgent;
        var vendor = navigator.vendor || "";
        // non-local access, not on mobile mobile device, not on safari
        return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1);
    }()),
    /**
     * クリック/タッチ時の規定の動作を許可するhtmlタグ名.
     * ここに追加したhtmlタグへのイベントはpreventDefaultされない.
     * @type String[]
     */
    USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],
    /**
     * SurfaceのメソッドとしてアクセスできるようにするCanvasRenderingContext2Dのメソッド.
     * @type String[]
     */
    CANVAS_DRAWING_METHODS: [
        'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
        'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
    ],
    /**
     * キーバインドのテーブル.
     * デフォルトで 'left, 'up', 'right', 'down' のイベントが使用可能.
     * @example
     * enchant.ENV.KEY_BIND_TABLE = {
     *     37: 'left',
     *     38: 'up',
     *     39: 'right',
     *     40: 'down',
     *     32: 'a', //-> スペースキーをaボタンとして使う.
     * };
     * @type Object
     */
    KEY_BIND_TABLE: {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    },
    /**
     * キー押下時の規定の動作を抑止するキーコード.
     * ここに追加したキーによるイベントはpreventDefaultされる.
     * @type Number[]
     */
    PREVENT_DEFAULT_KEY_CODES: [37, 38, 39, 40],
    /**
     * Mobile Safariでサウンドの再生を有効にするかどうか.
     * @type Boolean
     */
    SOUND_ENABLED_ON_MOBILE_SAFARI: true,
    /**
     * "touch to start" のシーンを使用するかどうか.
     * Mobile SafariでWebAudioのサウンドを再生するためには,
     * 一度タッチイベントハンドラ内で音声を流す必要があるため,
     * Mobile Safariでの実行時にはこのシーンが追加される.
     * falseにすることで, このシーンを表示しないようにできるが,
     * その場合は, 自身の責任でサウンドを有効化する必要がある.
     * @type Boolean
     */
    USE_TOUCH_TO_START_SCENE: true,
    /**
     * WebAudioを有効にするどうか.
     * trueならサウンドの再生の際HTMLAudioElementの代わりにWebAudioAPIを使用する.
     * @type Boolean
     */
    USE_WEBAUDIO: (function() {
        return location.protocol !== 'file:';
    }()),
    /**
     * アニメーション機能を有効にするかどうか.
     * trueだと, Node#tlにTimelineオブジェクトが作成される.
     * @type Boolean
     */
    USE_ANIMATION: true,
    /**
     * タッチ位置の判定範囲.
     * 判定範囲はCOLOR_DETECTION_LEVEL * 2 + 1の正方形になる.
     * @type Boolean
     */
    COLOR_DETECTION_LEVEL: 2
};

/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
     * @name enchant.Event
     * @class
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @param {String} type Eventのタイプ
     * @constructs
     */
    initialize: function(type) {
        /**
         * イベントのタイプ.
         * @type String
         */
        this.type = type;
        /**
         * イベントのターゲット.
         * @type *
         */
        this.target = null;
        /**
         * イベント発生位置のx座標.
         * @type Number
         */
        this.x = 0;
        /**
         * イベント発生位置のy座標.
         * @type Number
         */
        this.y = 0;
        /**
         * イベントを発行したオブジェクトを基準とするイベント発生位置のx座標.
         * @type Number
         */
        this.localX = 0;
        /**
         * イベントを発行したオブジェクトを基準とするイベント発生位置のy座標.
         * @type Number
         */
        this.localY = 0;
    },
    _initPosition: function(pageX, pageY) {
        var core = enchant.Core.instance;
        this.x = this.localX = (pageX - core._pageX) / core.scale;
        this.y = this.localY = (pageY - core._pageY) / core.scale;
    }
});

/**
 * Coreのロード完了時に発生するイベント.
 *
 * 画像のプリロードを行う場合ロードが完了するのを待ってゲーム開始時の処理を行う必要がある.
 * 発行するオブジェクト: {@link enchant.Core}
 *
 * @example
 * var core = new Core(320, 320);
 * core.preload('player.gif');
 * core.onload = function() {
 *     ... // ゲーム開始時の処理を記述
 * };
 * core.start();
 * @type String
 */
enchant.Event.LOAD = 'load';

/**
 * エラーの発生をCoreに伝える際に発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
 */
enchant.Event.ERROR = 'error';

/**
 * 表示サイズが変わったときに発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 @type String
 */
enchant.Event.CORE_RESIZE = 'coreresize';

/**
 * Coreのロード進行中に発生するイベント.
 * プリロードする画像が一枚ロードされる度に発行される. 発行するオブジェクト: {@link enchant.LoadingScene}
 * @type String
 */
enchant.Event.PROGRESS = 'progress';

/**
 * フレーム開始時に発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Node}
 * @type String
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 * フレーム終了時に発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}
 * @type String
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 * Sceneが開始したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Scene}
 * @type String
 */
enchant.Event.ENTER = 'enter';

/**
 * Sceneが終了したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Scene}
 * @type String
 */
enchant.Event.EXIT = 'exit';

/**
 * Nodeに子が追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.CHILD_ADDED = 'childadded';

/**
 * NodeがGroupに追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 * @type String
 */
enchant.Event.ADDED = 'added';

/**
 * NodeがSceneに追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 * @type String
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 * Nodeから子が削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
 * @type String
 * @type String
 */
enchant.Event.CHILD_REMOVED = 'childremoved';

/**
 * NodeがGroupから削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 * @type String
 */
enchant.Event.REMOVED = 'removed';

/**
 * NodeがSceneから削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 * @type String
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 * Nodeに対するタッチが始まったとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 * @type String
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 * Nodeに対するタッチが移動したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 * @type String
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 * Nodeに対するタッチが終了したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 * @type String
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 * Entityがレンダリングされるときに発生するイベント.
 * 発行するオブジェクト: {@link enchant.Entity}
 * @type String
 */
enchant.Event.RENDER = 'render';

/**
 * ボタン入力が始まったとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 * ボタン入力が変化したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 * ボタン入力が終了したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.INPUT_END = 'inputend';

/**
 * 入力が変化したとき発生するイベント.
 * ボタン入力が変化したとき発生する内部的なイベント.
 * 発行するオブジェクト: {@link enchant.InputSource}
 * @type String
 */
enchant.Event.INPUT_STATE_CHANGED = 'inputstatechanged';

/**
 * leftボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 * leftボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 * rightボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 * rightボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 * upボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 * upボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 * aボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 * aボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 * bボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 * bボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 * @type String
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';

/**
 * アクションがタイムラインに追加された時に発行されるイベント.
 * looped が設定されている時も, アクションは一度タイムラインから削除されもう一度追加される.
 * @type String
 */
enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";

/**
 * アクションがタイムラインから削除された時に発行されるイベント.
 * looped が設定されている時も, アクションは一度タイムラインから削除されもう一度追加される.
 * @type String
 */
enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";

/**
 * アクションが開始された時に発行されるイベント.
 * @type String
 */
enchant.Event.ACTION_START = "actionstart";

/**
 * アクションが終了するときに発行されるイベント.
 * @type String
 */
enchant.Event.ACTION_END = "actionend";

/**
 * アクションが1フレーム経過するときに発行されるイベント.
 * @type String
 */
enchant.Event.ACTION_TICK = "actiontick";

/**
 * アクションが追加された時に, タイムラインに対して発行されるイベント.
 * @type String
 */
enchant.Event.ACTION_ADDED = "actionadded";

/**
 * アクションが削除された時に, タイムラインに対して発行されるイベント.
 * @type String
 */
enchant.Event.ACTION_REMOVED = "actionremoved";

/**
 * フレームアニメーションが終了したときに発生するイベント. フレームの再生がnullに到達したことを意味する.
 * @type String
 */
enchant.Event.ANIMATION_END = "animationend";

/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     * @name enchant.EventTarget
     * @class
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @constructs
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     * イベントリスナを追加する.
     * @param {String} type イベントのタイプ.
     * @param {Function(e:enchant.Event)} listener 追加するイベントリスナ.
     */
    addEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) === -1) {
            listeners.unshift(listener);

        }
    },
    /**
     * addEventListener と同じ.
     * @param {String} type イベントのタイプ.
     * @param {Function(e:enchant.Event)} listener 追加するイベントリスナ.
     * @see enchant.EventTarget#addEventListener
     */
    on: function() {
        this.addEventListener.apply(this, arguments);
    },
    /**
     * イベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     * @param {Function(e:enchant.Event)} listener 削除するイベントリスナ.
     */
    removeEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners != null) {
            var i = listeners.indexOf(listener);
            if (i !== -1) {
                listeners.splice(i, 1);
            }
        }
    },
    /**
     * すべてのイベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     */
    clearEventListener: function(type) {
        if (type != null) {
            delete this._listeners[type];
        } else {
            this._listeners = {};
        }
    },
    /**
     * イベントを発行する.
     * @param {enchant.Event} e 発行するイベント.
     */
    dispatchEvent: function(e) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null){
            this['on' + e.type](e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e);
            }
        }
    }
});

(function() {
    var core;
    /**
     * @scope enchant.Core.prototype
     */
    enchant.Core = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.Core
         * @class
         * アプリケーションのメインループ, シーンを管理するクラス.
         *
         * インスタンスは一つしか存在することができず, すでにインスタンスが存在する状態で
         * コンストラクタを実行した場合既存のものが上書きされる. 存在するインスタンスには
         * {@link enchant.Core.instance} からアクセスできる.
         *
         * @param {Number} [width=320] 画面の横幅.
         * @param {Number} [height=320] 画面の高さ.
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(width, height) {
            if (window.document.body === null) {
                // @TODO postpone initialization after window.onload
                throw new Error("document.body is null. Please excute 'new Core()' in window.onload.");
            }

            enchant.EventTarget.call(this);
            var initial = true;
            if (core) {
                initial = false;
                core.stop();
            }
            core = enchant.Core.instance = this;

            this._calledTime = 0;
            this._mousedownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;

            this._scenes = [];

            width = width || 320;
            height = height || 320;

            var stage = document.getElementById('enchant-stage');
            var scale, sWidth, sHeight;
            if (!stage) {
                stage = document.createElement('div');
                stage.id = 'enchant-stage';
                stage.style.position = 'absolute';

                if (document.body.firstChild) {
                    document.body.insertBefore(stage, document.body.firstChild);
                } else {
                    document.body.appendChild(stage);
                }
                scale = Math.min(
                    window.innerWidth / width,
                    window.innerHeight / height
                );
                this._pageX = stage.getBoundingClientRect().left;
                this._pageY = stage.getBoundingClientRect().top;
            } else {
                var style = window.getComputedStyle(stage);
                sWidth = parseInt(style.width, 10);
                sHeight = parseInt(style.height, 10);
                if (sWidth && sHeight) {
                    scale = Math.min(
                        sWidth / width,
                        sHeight / height
                    );
                } else {
                    scale = 1;
                }
                while (stage.firstChild) {
                    stage.removeChild(stage.firstChild);
                }
                stage.style.position = 'relative';

                var bounding = stage.getBoundingClientRect();
                this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left);
                this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top);
            }
            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
            this._element = stage;

            this.addEventListener('coreresize', this._oncoreresize);

            this._width = width;
            this._height = height;
            this.scale = scale;

            /**
             * フレームレート.
             * @type Number
             */
            this.fps = 30;
            /**
             * アプリの開始からのフレーム数.
             * @type Number
             */
            this.frame = 0;
            /**
             * アプリが実行可能な状態かどうか.
             * @type Boolean
             */
            this.ready = false;
            /**
             * アプリが実行状態かどうか.
             * @type Boolean
             */
            this.running = false;
            /**
             * ロードされた画像をパスをキーとして保存するオブジェクト.
             * @type Object
             */
            this.assets = {};
            var assets = this._assets = [];
            (function detectAssets(module) {
                if (module.assets) {
                    enchant.Core.instance.preload(module.assets);
                }
                for (var prop in module) {
                    if (module.hasOwnProperty(prop)) {
                        if (typeof module[prop] === 'object' && module[prop] !== null && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                            detectAssets(module[prop]);
                        }
                    }
                }
            }(enchant));

            /**
             * 現在のScene. Sceneスタック中の一番上のScene.
             * @type enchant.Scene
             */
            this.currentScene = null;
            /**
             * ルートScene. Sceneスタック中の一番下のScene.
             * @type enchant.Scene
             */
            this.rootScene = new enchant.Scene();
            this.pushScene(this.rootScene);
            /**
             * ローディング時に表示されるScene.
             * @type enchant.Scene
             */
            this.loadingScene = new enchant.LoadingScene();

            /**
             * 一度でも {@link enchant.Core#start} が呼ばれたことがあるかどうか.
             [/lang:ja]
             * Indicates whether or not {@link enchant.Core#start} has been called.
             [/lang]
             * @type Boolean
             * @private
             */
            this._activated = false;

            this._offsetX = 0;
            this._offsetY = 0;

            /**
             * アプリに対する入力状態を保存するオブジェクト.
             * @type Object
             */
            this.input = {};

            this.keyboardInputManager = new enchant.KeyboardInputManager(window.document, this.input);
            this.keyboardInputManager.addBroadcastTarget(this);
            this._keybind = this.keyboardInputManager._binds;

            if (!enchant.ENV.KEY_BIND_TABLE) {
                enchant.ENV.KEY_BIND_TABLE = {};
            }

            for (var prop in enchant.ENV.KEY_BIND_TABLE) {
                this.keybind(prop, enchant.ENV.KEY_BIND_TABLE[prop]);
            }

            if (initial) {
                stage = enchant.Core.instance._element;
                var evt;
                document.addEventListener('keydown', function(e) {
                    core.dispatchEvent(new enchant.Event('keydown'));
                    if (enchant.ENV.PREVENT_DEFAULT_KEY_CODES.indexOf(e.keyCode) !== -1) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, true);

                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchstart', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('touchmove', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('touchend', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                }
                stage.addEventListener('mousedown', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        core._mousedownID++;
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                stage.addEventListener('mousemove', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                stage.addEventListener('mouseup', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                core._touchEventTarget = {};
                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchstart', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_START);
                        var touches = e.changedTouches;
                        var touch, target;
                        for (var i = 0, l = touches.length; i < l; i++) {
                            touch = touches[i];
                            evt._initPosition(touch.pageX, touch.pageY);
                            target = core.currentScene._determineEventTarget(evt);
                            core._touchEventTarget[touch.identifier] = target;
                            target.dispatchEvent(evt);
                        }
                    }, false);
                    stage.addEventListener('touchmove', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                        var touches = e.changedTouches;
                        var touch, target;
                        for (var i = 0, l = touches.length; i < l; i++) {
                            touch = touches[i];
                            target = core._touchEventTarget[touch.identifier];
                            if (target) {
                                evt._initPosition(touch.pageX, touch.pageY);
                                target.dispatchEvent(evt);
                            }
                        }
                    }, false);
                    stage.addEventListener('touchend', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_END);
                        var touches = e.changedTouches;
                        var touch, target;
                        for (var i = 0, l = touches.length; i < l; i++) {
                            touch = touches[i];
                            target = core._touchEventTarget[touch.identifier];
                            if (target) {
                                evt._initPosition(touch.pageX, touch.pageY);
                                target.dispatchEvent(evt);
                                delete core._touchEventTarget[touch.identifier];
                            }
                        }
                    }, false);
                }
                stage.addEventListener('mousedown', function(e) {
                    var core = enchant.Core.instance;
                    var evt = new enchant.Event(enchant.Event.TOUCH_START);
                    evt._initPosition(e.pageX, e.pageY);
                    var target = core.currentScene._determineEventTarget(evt);
                    core._touchEventTarget[core._mousedownID] = target;
                    target.dispatchEvent(evt);
                }, false);
                stage.addEventListener('mousemove', function(e) {
                    var core = enchant.Core.instance;
                    var evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                    evt._initPosition(e.pageX, e.pageY);
                    var target = core._touchEventTarget[core._mousedownID];
                    if (target) {
                        target.dispatchEvent(evt);
                    }
                }, false);
                stage.addEventListener('mouseup', function(e) {
                    var core = enchant.Core.instance;
                    var evt = new enchant.Event(enchant.Event.TOUCH_END);
                    evt._initPosition(e.pageX, e.pageY);
                    var target = core._touchEventTarget[core._mousedownID];
                    if (target) {
                        target.dispatchEvent(evt);
                    }
                    delete core._touchEventTarget[core._mousedownID];
                }, false);
            }
        },
        /**
         * 画面の横幅.
         * @type Number
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(w) {
                this._width = w;
                this._dispatchCoreResizeEvent();
            }
        },
        /**
         * 画面の高さ.
         * @type Number
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(h) {
                this._height = h;
                this._dispatchCoreResizeEvent();
            }
        },
        /**
         * 画面の表示倍率.
         * @type Number
         */
        scale: {
            get: function() {
                return this._scale;
            },
            set: function(s) {
                this._scale = s;
                this._dispatchCoreResizeEvent();
            }
        },
        _dispatchCoreResizeEvent: function() {
            var e = new enchant.Event('coreresize');
            e.width = this._width;
            e.height = this._height;
            e.scale = this._scale;
            this.dispatchEvent(e);
        },
        _oncoreresize: function(e) {
            this._element.style.width = Math.floor(this._width * this._scale) + 'px';
            this._element.style.height = Math.floor(this._height * this._scale) + 'px';
            var scene;
            for (var i = 0, l = this._scenes.length; i < l; i++) {
                scene = this._scenes[i];
                scene.dispatchEvent(e);
            }
        },
        /**
         * ファイルのプリロードを行う.
         *
         * プリロードを行うよう設定されたファイルは {@link enchant.Core#start} が実行されるとき
         * ロードが行われる. 全てのファイルのロードが完了したときはCoreオブジェクトからload
         * イベントが発行され, Coreオブジェクトのassetsプロパティから画像ファイルの場合は
         * Surfaceオブジェクトとして, 音声ファイルの場合はSoundオブジェクトとして,
         * その他の場合は文字列としてアクセスできるようになる.
         *
         * なおこのSurfaceオブジェクトは {@link enchant.Surface.load} を使って作成されたものである
         * ため直接画像操作を行うことはできない. enchant.Surface.loadの項を参照.
         *
         * @example
         * core.preload('player.gif');
         * core.onload = function() {
         *     var sprite = new Sprite(32, 32);
         *     sprite.image = core.assets['player.gif']; // パス名でアクセス
         *     ...
         * };
         * core.start();
         *
         * @param {...String|String[]} assets プリロードするファイルのパス. 複数指定できる.
         * @return {enchant.Core} this
         */
        preload: function(assets) {
            var a;
            if (!(assets instanceof Array)) {
                if (typeof assets === 'object') {
                    a = [];
                    for (var name in assets) {
                        if (assets.hasOwnProperty(name)) {
                            a.push([ assets[name], name ]);
                        }
                    }
                    assets = a;
                } else {
                    assets = Array.prototype.slice.call(arguments);
                }
            }
            Array.prototype.push.apply(this._assets, assets);
            return this;
        },
        /**
         * ファイルのロードを行う.
         *
         * @param {String} src ロードするファイルのパス.
         * @param {String} [alias] ロードするファイルに設定したい名前.
         * @param {Function} [callback] ファイルのロードが完了したときに呼び出される関数.
         * @param {Function} [onerror] ファイルのロードに失敗したときに呼び出される関数.
         * @return {enchant.Deferred} ファイル読み込み後に起動するDeferredオブジェクト.
         */
        load: function(src, alias, callback, onerror) {
            var assetName;
            if (typeof arguments[1] === 'string') {
                assetName = alias;
                callback = callback || function() {};
                onerror = onerror || function() {};
            } else {
                assetName = src;
                var tempCallback = callback;
                callback = arguments[1] || function() {};
                onerror = tempCallback || function() {};
            }

            var ext = enchant.Core.findExt(src);

            return enchant.Deferred.next(function() {
                var d = new enchant.Deferred();
                var _callback = function(e) {
                    d.call(e);
                    callback.call(this, e);
                };
                var _onerror = function(e) {
                    d.fail(e);
                    onerror.call(this, e);
                };
                if (enchant.Core._loadFuncs[ext]) {
                    enchant.Core.instance.assets[assetName] = enchant.Core._loadFuncs[ext](src, ext, _callback, _onerror);
                } else {
                    var req = new XMLHttpRequest();
                    req.open('GET', src, true);
                    req.onreadystatechange = function() {
                        if (req.readyState === 4) {
                            if (req.status !== 200 && req.status !== 0) {
                                // throw new Error(req.status + ': ' + 'Cannot load an asset: ' + src);
                                var e = new enchant.Event('error');
                                e.message = req.status + ': ' + 'Cannot load an asset: ' + src;
                                _onerror.call(enchant.Core.instance, e);
                            }

                            var type = req.getResponseHeader('Content-Type') || '';
                            if (type.match(/^image/)) {
                                core.assets[assetName] = enchant.Surface.load(src, _callback, _onerror);
                            } else if (type.match(/^audio/)) {
                                core.assets[assetName] = enchant.Sound.load(src, type, _callback, _onerror);
                            } else {
                                core.assets[assetName] = req.responseText;
                                _callback.call(enchant.Core.instance, new enchant.Event('load'));
                            }
                        }
                    };
                    req.send(null);
                }
                return d;
            });
        },
        /**
         * アプリを起動する.
         *
         * enchant.Core#fpsで設定されたフレームレートに従って {@link enchant.Core#currentScene} の
         * フレームの更新が行われるようになる. プリロードする画像が存在する場合はロードが
         * 始まりローディング画面が表示される.
         * @return {enchant.Deferred} ローディング画面終了後に起動するDeferredオブジェクト.
         */
        start: function(deferred) {
            var onloadTimeSetter = function() {
                this.frame = 0;
                this.removeEventListener('load', onloadTimeSetter);
            };
            this.addEventListener('load', onloadTimeSetter);

            this.currentTime = window.getTime();
            this.running = true;
            this.ready = true;

            if (!this._activated) {
                this._activated = true;
                if (enchant.ENV.BROWSER === 'mobilesafari' &&
                    enchant.ENV.USE_WEBAUDIO &&
                    enchant.ENV.USE_TOUCH_TO_START_SCENE) {
                    var d = new enchant.Deferred();
                    var scene = this._createTouchToStartScene();
                    scene.addEventListener(enchant.Event.TOUCH_START, function waitTouch() {
                        this.removeEventListener(enchant.Event.TOUCH_START, waitTouch);
                        var a = new enchant.WebAudioSound();
                        a.buffer = enchant.WebAudioSound.audioContext.createBuffer(1, 1, 48000);
                        a.play();
                        core.removeScene(scene);
                        core.start(d);
                    }, false);
                    core.pushScene(scene);
                    return d;
                }
            }

            this._requestNextFrame(0);

            var ret = this._requestPreload()
                .next(function() {
                    enchant.Core.instance.loadingScene.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
                });

            if (deferred) {
                ret.next(function(arg) {
                    deferred.call(arg);
                })
                .error(function(arg) {
                    deferred.fail(arg);
                });
            }

            return ret;
        },
        _requestPreload: function() {
            var o = {};
            var loaded = 0,
                len = 0,
                loadFunc = function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = len;
                    core.loadingScene.dispatchEvent(e);
                };
            this._assets
                .reverse()
                .forEach(function(asset) {
                    var src, name;
                    if (asset instanceof Array) {
                        src = asset[0];
                        name = asset[1];
                    } else {
                        src = name = asset;
                    }
                    if (!o[name]) {
                        o[name] = this.load(src, name, loadFunc);
                        len++;
                    }
                }, this);

            this.pushScene(this.loadingScene);
            return enchant.Deferred.parallel(o);
        },
        _createTouchToStartScene: function() {
            var label = new enchant.Label('Touch to Start'),
                size = Math.round(core.width / 10),
                scene = new enchant.Scene();

            label.color = '#fff';
            label.font = (size - 1) + 'px bold Helvetica,Arial,sans-serif';
            label.textAlign = 'center';
            label.width = core.width;
            label.height = label._boundHeight;
            label.y = (core.height - label.height) / 2;

            scene.backgroundColor = '#000';
            scene.addChild(label);

            return scene;
        },
        /**
         * アプリをデバッグモードで開始する.
         *
         * {@link enchant.Core#_debug} フラグを true にすることでもデバッグモードをオンにすることができる
         * @return {enchant.Deferred} ローディング画面終了後に起動するDeferredオブジェクト.
         */
        debug: function() {
            this._debug = true;
            return this.start();
        },
        actualFps: {
            get: function() {
                return this._actualFps || this.fps;
            }
        },
        /**
         * 次のフレームの実行を要求する.
         * @param {Number} delay requestAnimationFrameを呼び出すまでの遅延時間.
         * @private
         */
        _requestNextFrame: function(delay) {
            if (!this.ready) {
                return;
            }
            if (this.fps >= 60 || delay <= 16) {
                this._calledTime = window.getTime();
                window.requestAnimationFrame(this._callTick);
            } else {
                setTimeout(function() {
                    var core = enchant.Core.instance;
                    core._calledTime = window.getTime();
                    window.requestAnimationFrame(core._callTick);
                }, Math.max(0, delay));
            }
        },
        /**
         * Core#_tickを呼び出す.
         * @param {Number} time 呼び出し時の時間.
         * @private
         */
        _callTick: function(time) {
            enchant.Core.instance._tick(time);
        },
        _tick: function(time) {
            var e = new enchant.Event('enterframe');
            var now = window.getTime();
            var elapsed = e.elapsed = now - this.currentTime;
            this.currentTime = now;

            this._actualFps = elapsed > 0 ? (1000 / elapsed) : 0;

            var nodes = this.currentScene.childNodes.slice();
            var push = Array.prototype.push;
            while (nodes.length) {
                var node = nodes.pop();
                node.age++;
                node.dispatchEvent(e);
                if (node.childNodes) {
                    push.apply(nodes, node.childNodes);
                }
            }

            this.currentScene.age++;
            this.currentScene.dispatchEvent(e);
            this.dispatchEvent(e);

            this.dispatchEvent(new enchant.Event('exitframe'));
            this.frame++;
            now = window.getTime();
            
            this._requestNextFrame(1000 / this.fps - (now - this._calledTime));
        },
        getTime: function() {
            return window.getTime();
        },
        /**
         * アプリを停止する.
         *
         * フレームは更新されず, ユーザの入力も受け付けなくなる.
         * {@link enchant.Core#resume} で再開できる.
         */
        stop: function() {
            this.ready = false;
            this.running = false;
        },
        /**
         * アプリを一時停止する.
         *
         * フレームは更新されず, ユーザの入力は受け付ける.
         * {@link enchant.Core#resume} で再開できる.
         */
        pause: function() {
            this.ready = false;
        },
        /**
         * アプリを再開する.
         */
        resume: function() {
            if (this.ready) {
                return;
            }
            this.currentTime = window.getTime();
            this.ready = true;
            this.running = true;
            this._requestNextFrame(0);
        },

        /**
         * 新しいSceneに移行する.
         *
         * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
         * enchant.Core#pushSceneを行うとSceneをスタックの一番上に積むことができる. スタックの
         * 一番上のSceneに対してはフレームの更新が行われる.
         *
         * @param {enchant.Scene} scene 移行する新しいScene.
         * @return {enchant.Scene} 新しいScene.
         */
        pushScene: function(scene) {
            this._element.appendChild(scene._element);
            if (this.currentScene) {
                this.currentScene.dispatchEvent(new enchant.Event('exit'));
            }
            this.currentScene = scene;
            this.currentScene.dispatchEvent(new enchant.Event('enter'));
            return this._scenes.push(scene);
        },
        /**
         * 現在のSceneを終了させ前のSceneに戻る.
         *
         * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
         * enchant.Core#popSceneを行うとスタックの一番上のSceneを取り出すことができる.
         *
         * @return {enchant.Scene} 終了させたScene.
         */
        popScene: function() {
            if (this.currentScene === this.rootScene) {
                return this.currentScene;
            }
            this._element.removeChild(this.currentScene._element);
            this.currentScene.dispatchEvent(new enchant.Event('exit'));
            this.currentScene = this._scenes[this._scenes.length - 2];
            this.currentScene.dispatchEvent(new enchant.Event('enter'));
            return this._scenes.pop();
        },
        /**
         * 現在のSceneを別のSceneにおきかえる.
         *
         * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene}を同時に行う.
         *
         * @param {enchant.Scene} scene おきかえるScene.
         * @return {enchant.Scene} 新しいScene.
         */
        replaceScene: function(scene) {
            this.popScene();
            return this.pushScene(scene);
        },
        /**
         * Sceneを削除する.
         *
         * Sceneスタック中からSceneを削除する.
         *
         * @param {enchant.Scene} scene 削除するScene.
         * @return {enchant.Scene} 削除したScene.
         */
        removeScene: function(scene) {
            if (this.currentScene === scene) {
                return this.popScene();
            } else {
                var i = this._scenes.indexOf(scene);
                if (i !== -1) {
                    this._scenes.splice(i, 1);
                    this._element.removeChild(scene._element);
                    return scene;
                } else {
                    return null;
                }
            }
        },
        _buttonListener: function(e) {
            this.currentScene.dispatchEvent(e);
        },
        /**
         * キーバインドを設定する.
         *
         * @param {Number} key キーバインドを設定するキーコード.
         * @param {String} button 割り当てるボタン.
         * @return {enchant.Core} this
         */
        keybind: function(key, button) {
            this.keyboardInputManager.keybind(key, button);
            this.addEventListener(button + 'buttondown', this._buttonListener);
            this.addEventListener(button + 'buttonup', this._buttonListener);
            return this;
        },
        /**
         * キーバインドを削除する.
         * @param {Number} key 削除するキーコード.
         * @return {enchant.Core} this
         */
        keyunbind: function(key) {
            var button = this._keybind[key];
            this.keyboardInputManager.keyunbind(key);
            this.removeEventListener(button + 'buttondown', this._buttonListener);
            this.removeEventListener(button + 'buttonup', this._buttonListener);
            return this;
        },
        changeButtonState: function(button, bool) {
            this.keyboardInputManager.changeState(button, bool);
        },
        /**
         * Core#startが呼ばれてから経過した時間を取得する.
         * @return {Number} 経過した時間 (秒)
         */
        getElapsedTime: function() {
            return this.frame / this.fps;
        }
    });

    /**
     * 拡張子に対応したアセットのロード関数.
     * ロード関数はファイルのパス, 拡張子, コールバックを引数に取り,
     * 対応したクラスのインスタンスを返す必要がある.
     * コールバックはEvent.LOADとEvent.ERRORでハンドルする.
     * @static
     * @private
     * @type Object
     */
    enchant.Core._loadFuncs = {};
    enchant.Core._loadFuncs['jpg'] =
        enchant.Core._loadFuncs['jpeg'] =
            enchant.Core._loadFuncs['gif'] =
                enchant.Core._loadFuncs['png'] =
                    enchant.Core._loadFuncs['bmp'] = function(src, ext, callback, onerror) {
                        return enchant.Surface.load(src, callback, onerror);
                    };
    enchant.Core._loadFuncs['mp3'] =
        enchant.Core._loadFuncs['aac'] =
            enchant.Core._loadFuncs['m4a'] =
                enchant.Core._loadFuncs['wav'] =
                    enchant.Core._loadFuncs['ogg'] = function(src, ext, callback, onerror) {
                        return enchant.Sound.load(src, 'audio/' + ext, callback, onerror);
                    };

    /**
     * ファイルパスを取り, 拡張子を返す.
     * @param {String} path ファイルパス.
     * @return {*}
     */
    enchant.Core.findExt = function(path) {
        var matched = path.match(/\.\w+$/);
        if (matched && matched.length > 0) {
            return matched[0].slice(1).toLowerCase();
        }

        // for data URI
        if (path.indexOf('data:') === 0) {
            return path.split(/[\/;]/)[1].toLowerCase();
        }
        return null;
    };

    /**
     * 現在のCoreインスタンス.
     * @type enchant.Core
     * @static
     */
    enchant.Core.instance = null;
}());

/**
 * @name enchant.Game
 * @class
 * enchant.Game is moved to {@link enchant.Core} from v0.6
 * @deprecated
 */
enchant.Game = enchant.Core;

/**
 * @scope enchant.InputManager.prototype
 */
enchant.InputManager = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.InputManager
     * @class
     * 入力を管理するためのクラス.
     * @param {*} valueStore 入力の状態を保持させるオブジェクト.
     * @param {*} [source=this] イベントに付加される入力のソース.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(valueStore, source) {
        enchant.EventTarget.call(this);

        /**
         * 入力の変化を通知する対象を保持する配列.
         * @type enchant.EventTarget[]
         */
        this.broadcastTarget = [];
        /**
         * 入力の状態を保持する連想配列.
         * @type Object
         */
        this.valueStore = valueStore;
        /**
         * イベントに付加される入力のソース.
         * @type Object
         */
        this.source = source || this;

        this._binds = {};

        this._stateHandler = function(e) {
            var id = e.source.identifier;
            var name = this._binds[id];
            this.changeState(name, e.data);
        }.bind(this);
    },
    /**
     * 特定の入力に名前をつける.
     * 入力はフラグとイベントで監視できるようになる.
     * @param {enchant.InputSource} inputSource {@link enchant.InputSource} のインスタンス.
     * @param {String} name 入力につける名前.
     */
    bind: function(inputSource, name) {
        inputSource.addEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
        this._binds[inputSource.identifier] = name;
    },
    /**
     * 入力のバインドを解除する.
     * @param {enchant.InputSource} inputSource {@link enchant.InputSource} のインスタンス.
     */
    unbind: function(inputSource) {
        inputSource.removeEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
        delete this._binds[inputSource.identifier];
    },
    /**
     * 入力の変化を通知する対象を追加する.
     * @param {enchant.EventTarget} eventTarget イベントの通知を設定したい対象.
     */
    addBroadcastTarget: function(eventTarget) {
        var i = this.broadcastTarget.indexOf(eventTarget);
        if (i === -1) {
            this.broadcastTarget.push(eventTarget);
        }
    },
    /**
     * 入力の変化を通知する対象を削除する.
     * @param {enchant.EventTarget} eventTarget イベントの通知を削除したい対象.
     */
    removeBroadcastTarget: function(eventTarget) {
        var i = this.broadcastTarget.indexOf(eventTarget);
        if (i !== -1) {
            this.broadcastTarget.splice(i, 1);
        }
    },
    /**
     * イベントを {@link enchant.InputManager#broadcastTarget} に発行する.
     * @param {enchant.Event} e イベント.
     */
    broadcastEvent: function(e) {
        var target = this.broadcastTarget;
        for (var i = 0, l = target.length; i < l; i++) {
            target[i].dispatchEvent(e);
        }
    },
    /**
     * 入力の状態を変更する.
     * @param {String} name 入力の名前.
     * @param {*} data 入力の状態.
     */
    changeState: function(name, data) {
    }
});

/**
 * @scope enchant.InputSource.prototype
 */
enchant.InputSource = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.InputSource
     * @class
     * 任意の入力をラップするクラス.
     * @param {String} identifier 入力のid.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(identifier) {
        enchant.EventTarget.call(this);
        /**
         * 入力のid.
         * @type String
         */
        this.identifier = identifier;
    },
    /**
     * 入力の状態変更をイベントで通知する.
     * @param {*} data 新しい状態.
     */
    notifyStateChange: function(data) {
        var e = new enchant.Event(enchant.Event.INPUT_STATE_CHANGED);
        e.data = data;
        e.source = this;
        this.dispatchEvent(e);
    }
});

/**
 * @scope enchant.BinaryInputManager.prototype
 */
enchant.BinaryInputManager = enchant.Class.create(enchant.InputManager, {
    /**
     * @name enchant.BinaryInputManager
     * @class
     * 入力を管理するためのクラス.
     * @param {*} flagStore 入力のフラグを保持させるオブジェクト.
     * @param {String} activeEventNameSuffix イベント名の接尾辞.
     * @param {String} inactiveEventNameSuffix イベント名の接尾辞.
     * @param {*} [source=this] イベントに付加される入力のソース.
     * @constructs
     * @extends enchant.InputManager
     */
    initialize: function(flagStore, activeEventNameSuffix, inactiveEventNameSuffix, source) {
        enchant.InputManager.call(this, flagStore, source);
        /**
         * アクティブな入力の数.
         * @type Number
         */
        this.activeInputsNum = 0;
        /**
         * BinaryInputManagerが発行するイベント名の接尾辞.
         * @type String
         */
        this.activeEventNameSuffix = activeEventNameSuffix;
        /**
         * BinaryInputManagerが発行するイベント名の接尾辞.
         * @type String
         */
        this.inactiveEventNameSuffix = inactiveEventNameSuffix;
    },
    /**
     * 特定の入力に名前をつける.
     * @param {enchant.BinaryInputSource} inputSource {@link enchant.InputSource}のインスタンス.
     * @param {String} name 入力につける名前.
     * @see enchant.InputManager#bind
     */
    bind: function(binaryInputSource, name) {
        enchant.InputManager.prototype.bind.call(this, binaryInputSource, name);
        this.valueStore[name] = false;
    },
    /**
     * 入力のバインドを解除する.
     * @param {enchant.BinaryInputSource} inputSource {@link enchant.InputSource}のインスタンス.
     * @see enchant.InputManager#unbind
     */
    unbind: function(binaryInputSource) {
        var name = this._binds[binaryInputSource.identifier];
        enchant.InputManager.prototype.unbind.call(this, binaryInputSource);
        delete this.valueStore[name];
    },
    /**
     * 入力の状態を変更する.
     * @param {String} name 入力の名前.
     * @param {Boolean} bool 入力の状態.
     */
    changeState: function(name, bool) {
        if (bool) {
            this._down(name);
        } else {
            this._up(name);
        }
    },
    _down: function(name) {
        var inputEvent;
        if (!this.valueStore[name]) {
            this.valueStore[name] = true;
            inputEvent = new enchant.Event((this.activeInputsNum++) ? 'inputchange' : 'inputstart');
            inputEvent.source = this.source;
            this.broadcastEvent(inputEvent);
        }
        var downEvent = new enchant.Event(name + this.activeEventNameSuffix);
        downEvent.source = this.source;
        this.broadcastEvent(downEvent);
    },
    _up: function(name) {
        var inputEvent;
        if (this.valueStore[name]) {
            this.valueStore[name] = false;
            inputEvent = new enchant.Event((--this.activeInputsNum) ? 'inputchange' : 'inputend');
            inputEvent.source = this.source;
            this.broadcastEvent(inputEvent);
        }
        var upEvent = new enchant.Event(name + this.inactiveEventNameSuffix);
        upEvent.source = this.source;
        this.broadcastEvent(upEvent);
    }
});

/**
 * @scope enchant.BinaryInputSource.prototype
 */
enchant.BinaryInputSource = enchant.Class.create(enchant.InputSource, {
    /**
     * @name enchant.BinaryInputSource
     * @class
     * 任意の2値入力をラップするクラス.
     * @param {String} identifier 入力のid.
     * @constructs
     * @extends enchant.InputSource
     */
    initialize: function(identifier) {
        enchant.InputSource.call(this, identifier);
    }
});

/**
 * @scope enchant.KeyboardInputManager.prototype
 */
enchant.KeyboardInputManager = enchant.Class.create(enchant.BinaryInputManager, {
    /**
     * @name enchant.KeyboardInputManager
     * @class
     * キーボード入力を管理するためのクラス.
     * @param {HTMLElement} dom element that will be watched.
     * @param {*} flagStore object that store input flag.
     * @constructs
     * @extends enchant.BinaryInputManager
     */
    initialize: function(domElement, flagStore) {
        enchant.BinaryInputManager.call(this, flagStore, 'buttondown', 'buttonup');
        this._attachDOMEvent(domElement, 'keydown', true);
        this._attachDOMEvent(domElement, 'keyup', false);
    },
    /**
     * キーコードに対応したBinaryInputSourceを使って{@link enchant.BinaryInputManager#bind} を呼び出す.
     * @param {Number} keyCode キーコード.
     * @param {String} name 入力の名前.
     */
    keybind: function(keyCode, name) {
        this.bind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode), name);
    },
    /**
     * キーコードに対応したBinaryInputSourceを使って{@link enchant.BinaryInputManager#unbind} を呼び出す.
     * @param {Number} keyCode キーコード.
     */
    keyunbind: function(keyCode) {
        this.unbind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode));
    },
    _attachDOMEvent: function(domElement, eventType, state) {
        domElement.addEventListener(eventType, function(e) {
            var core = enchant.Core.instance;
            if (!core || !core.running) {
                return;
            }
            var code = e.keyCode;
            var source = enchant.KeyboardInputSource._instances[code];
            if (source) {
                source.notifyStateChange(state);
            }
        }, true);
    }
});

/**
 * @scope enchant.KeyboardInputSource.prototype
 */
enchant.KeyboardInputSource = enchant.Class.create(enchant.BinaryInputSource, {
    /**
     * @name enchant.KeyboardInputSource
     * @class
     * キーボード入力をラップするBinaryInputSource.
     * キーコードをidとして持つ.
     * @param {String} keyCode キーコード.
     * @constructs
     * @extends enchant.BinaryInputSource
     */
    initialize: function(keyCode) {
        enchant.BinaryInputSource.call(this, keyCode);
    }
});
/**
 * @private
 */
enchant.KeyboardInputSource._instances = {};
/**
 * @static
 * キーコードに対応したインスタンスを取得する.
 * @param {Number} keyCode キーコード.
 * @return {enchant.KeyboardInputSource} instance.
 */
enchant.KeyboardInputSource.getByKeyCode = function(keyCode) {
    if (!this._instances[keyCode]) {
        this._instances[keyCode] = new enchant.KeyboardInputSource(keyCode);
    }
    return this._instances[keyCode];
};

/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Node
     * @class
     * Sceneをルートとした表示オブジェクトツリーに属するオブジェクトの基底クラス.
     * 直接使用することはない.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._dirty = false;

        this._matrix = [ 1, 0, 0, 1, 0, 0 ];

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         * Nodeが画面に表示されてから経過したフレーム数.
         * {@link enchant.Event.ENTER_FRAME} イベントを受け取る前にインクリメントされる.
         * (ENTER_FRAME イベントのリスナが初めて実行される時に 1 となる.)
         * @type Number
         */
        this.age = 0;

        /**
         * Nodeの親Node.
         * @type enchant.Group
         */
        this.parentNode = null;
        /**
         * Nodeが属しているScene.
         * @type enchant.Scene
         */
        this.scene = null;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });

        // Nodeが生成される際に, tl プロパティに Timeline オブジェクトを追加している.
        if (enchant.ENV.USE_ANIMATION) {
            this.tl = new enchant.Timeline(this);
        }
    },
    /**
     * Nodeを移動する.
     * @param {Number} x 移動先のx座標.
     * @param {Number} y 移動先のy座標.
     */
    moveTo: function(x, y) {
        this.x = x;
        this.y = y;
    },
    /**
     * Nodeを移動する.
     * @param {Number} x 移動するx軸方向の距離.
     * @param {Number} y 移動するy軸方向の距離.
     */
    moveBy: function(x, y) {
        this.x += x;
        this.y += y;
    },
    /**
     * Nodeのx座標.
     * @type Number
     */
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            if(this._x !== x) {
                this._x = x;
                this._dirty = true;
            }
        }
    },
    /**
     * Nodeのy座標.
     * @type Number
     */
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            if(this._y !== y) {
                this._y = y;
                this._dirty = true;
            }
        }
    },
    _updateCoordinate: function() {
        var node = this;
        var tree = [ node ];
        var parent = node.parentNode;
        var scene = this.scene;
        while (parent && node._dirty) {
            tree.unshift(parent);
            node = node.parentNode;
            parent = node.parentNode;
        }
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var mat = [];
        var newmat, ox, oy;
        stack.push(tree[0]._matrix);
        for (var i = 1, l = tree.length; i < l; i++) {
            node = tree[i];
            newmat = [];
            matrix.makeTransformMatrix(node, mat);
            matrix.multiply(stack[stack.length - 1], mat, newmat);
            node._matrix = newmat;
            stack.push(newmat);
            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        }
        matrix.reset();
    },
    remove: function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        if (this.childNodes) {
            var childNodes = this.childNodes.slice();
            for(var i = childNodes.length-1; i >= 0; i--) {
                childNodes[i].remove();
            }
        }
        
        this.clearEventListener();
    }
});

var _intersectBetweenClassAndInstance = function(Class, instance) {
    var ret = [];
    var c;
    for (var i = 0, l = Class.collection.length; i < l; i++) {
        c = Class.collection[i];
        if (instance._intersectOne(c)) {
            ret.push(c);
        }
    }
    return ret;
};

var _intersectBetweenClassAndClass = function(Class1, Class2) {
    var ret = [];
    var c1, c2;
    for (var i = 0, l = Class1.collection.length; i < l; i++) {
        c1 = Class1.collection[i];
        for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
            c2 = Class2.collection[j];
            if (c1._intersectOne(c2)) {
                ret.push([ c1, c2 ]);
            }
        }
    }
    return ret;
};

var _intersectStrictBetweenClassAndInstance = function(Class, instance) {
    var ret = [];
    var c;
    for (var i = 0, l = Class.collection.length; i < l; i++) {
        c = Class.collection[i];
        if (instance._intersectStrictOne(c)) {
            ret.push(c);
        }
    }
    return ret;
};

var _intersectStrictBetweenClassAndClass = function(Class1, Class2) {
    var ret = [];
    var c1, c2;
    for (var i = 0, l = Class1.collection.length; i < l; i++) {
        c1 = Class1.collection[i];
        for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
            c2 = Class2.collection[j];
            if (c1._intersectStrictOne(c2)) {
                ret.push([ c1, c2 ]);
            }
        }
    }
    return ret;
};

var _staticIntersect = function(other) {
    if (other instanceof enchant.Entity) {
        return _intersectBetweenClassAndInstance(this, other);
    } else if (typeof other === 'function' && other.collection) {
        return _intersectBetweenClassAndClass(this, other);
    }
    return false;
};

var _staticIntersectStrict = function(other) {
    if (other instanceof enchant.Entity) {
        return _intersectStrictBetweenClassAndInstance(this, other);
    } else if (typeof other === 'function' && other.collection) {
        return _intersectStrictBetweenClassAndClass(this, other);
    }
    return false;
};

var _nodePrototypeClearEventListener = enchant.Node.prototype.clearEventListener;

/**
 * @scope enchant.Entity.prototype
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
     * @name enchant.Entity
     * @class
     * DOM上で表示する実体を持ったクラス. 直接使用することはない.
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        var core = enchant.Core.instance;
        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._touchEnabled = true;
        this._clipping = false;

        this._originX = null;
        this._originY = null;

        this._width = 0;
        this._height = 0;
        this._backgroundColor = null;
        this._debugColor = '#0000ff';
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        this._style = {};
        this.__styleStatus = {};

        this._isContainedInCollection = false;

        /**
         * Entityを描画する際の合成処理を設定する.
         * Canvas上に描画する際のみ有効.
         * CanvasのコンテキストのglobalCompositeOperationにセットされる.
         * @type String
         */
        this.compositeOperation = null;

        /**
         * Entityにボタンの機能を設定する.
         * Entityに対するタッチ, クリックをleft, right, up, down, a, bいずれかの
         * ボタン入力として割り当てる.
         * @type String
         */
        this.buttonMode = null;
        /**
         * Entityが押されているかどうか.
         * {@link enchant.Entity.buttonMode} が設定されているときだけ機能する.
         * @type Boolean
         */
        this.buttonPressed = false;
        this.addEventListener('touchstart', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = true;
            this.dispatchEvent(new enchant.Event(this.buttonMode + 'buttondown'));
            core.changeButtonState(this.buttonMode, true);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = false;
            this.dispatchEvent(new enchant.Event(this.buttonMode + 'buttonup'));
            core.changeButtonState(this.buttonMode, false);
        });

        this.enableCollection();
    },
    /**
     * Entityの横幅.
     * @type Number
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            if(this._width !== width) {
                this._width = width;
                this._dirty = true;
            }
        }
    },
    /**
     * Entityの高さ.
     * @type Number
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            if(this._height !== height) {
                this._height = height;
                this._dirty = true;
            }
        }
    },
    /**
     * Entityの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type String
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = color;
        }
    },
    /**
     * Entityのデバッグの枠色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type String
     */
    debugColor: {
        get: function() {
            return this._debugColor;
        },
        set: function(color) {
            this._debugColor = color;
        }
    },
    /**
     * Entityの透明度.
     * 0から1までの値を設定する(0が完全な透明, 1が完全な不透明).
     * @type Number
     */
    opacity: {
        get: function() {
            return this._opacity;
        },
        set: function(opacity) {
            this._opacity = parseFloat(opacity);
        }
    },
    /**
     * Entityを表示するかどうかを指定する.
     * @type Boolean
     */
    visible: {
        get: function() {
            return this._visible;
        },
        set: function(visible) {
            this._visible = visible;
        }
    },
    /**
     * Entityのタッチを有効にするかどうかを指定する.
     * @type Boolean
     */
    touchEnabled: {
        get: function() {
            return this._touchEnabled;
        },
        set: function(enabled) {
            this._touchEnabled = enabled;
            if (enabled) {
                this._style.pointerEvents = 'all';
            } else {
                this._style.pointerEvents = 'none';
            }
        }
    },
    /**
     * Entityの矩形が交差しているかどうかにより衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @return {Boolean} 衝突判定の結果.
     */
    intersect: function(other) {
        if (other instanceof enchant.Entity) {
            return this._intersectOne(other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectBetweenClassAndInstance(other, this);
        }
        return false;
    },
    _intersectOne: function(other) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        return this._offsetX < other._offsetX + other.width && other._offsetX < this._offsetX + this.width &&
            this._offsetY < other._offsetY + other.height && other._offsetY < this._offsetY + this.height;
    },
    intersectStrict: function(other) {
        if (other instanceof enchant.Entity) {
            return this._intersectStrictOne(other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectStrictBetweenClassAndInstance(other, this);
        }
        return false;
    },
    _intersectStrictOne: function(other) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        var rect1 = this.getOrientedBoundingRect(),
            rect2 = other.getOrientedBoundingRect(),
            lt1 = rect1.leftTop, rt1 = rect1.rightTop,
            lb1 = rect1.leftBottom, rb1 = rect1.rightBottom,
            lt2 = rect2.leftTop, rt2 = rect2.rightTop,
            lb2 = rect2.leftBottom, rb2 = rect2.rightBottom,
            ltx1 = lt1[0], lty1 = lt1[1], rtx1 = rt1[0], rty1 = rt1[1],
            lbx1 = lb1[0], lby1 = lb1[1], rbx1 = rb1[0], rby1 = rb1[1],
            ltx2 = lt2[0], lty2 = lt2[1], rtx2 = rt2[0], rty2 = rt2[1],
            lbx2 = lb2[0], lby2 = lb2[1], rbx2 = rb2[0], rby2 = rb2[1],
            t1 = [ rtx1 - ltx1, rty1 - lty1 ],
            r1 = [ rbx1 - rtx1, rby1 - rty1 ],
            b1 = [ lbx1 - rbx1, lby1 - rby1 ],
            l1 = [ ltx1 - lbx1, lty1 - lby1 ],
            t2 = [ rtx2 - ltx2, rty2 - lty2 ],
            r2 = [ rbx2 - rtx2, rby2 - rty2 ],
            b2 = [ lbx2 - rbx2, lby2 - rby2 ],
            l2 = [ ltx2 - lbx2, lty2 - lby2 ],
            cx1 = (ltx1 + rtx1 + lbx1 + rbx1) >> 2,
            cy1 = (lty1 + rty1 + lby1 + rby1) >> 2,
            cx2 = (ltx2 + rtx2 + lbx2 + rbx2) >> 2,
            cy2 = (lty2 + rty2 + lby2 + rby2) >> 2,
            i, j, poss1, poss2, dirs1, dirs2, pos1, pos2, dir1, dir2,
            px1, py1, px2, py2, dx1, dy1, dx2, dy2, vx, vy, c, c1, c2;
        if (t1[0] * (cy2 - lty1) - t1[1] * (cx2 - ltx1) > 0 &&
            r1[0] * (cy2 - rty1) - r1[1] * (cx2 - rtx1) > 0 &&
            b1[0] * (cy2 - rby1) - b1[1] * (cx2 - rbx1) > 0 &&
            l1[0] * (cy2 - lby1) - l1[1] * (cx2 - lbx1) > 0) {
            return true;
        } else if (t2[0] * (cy1 - lty2) - t2[1] * (cx1 - ltx2) > 0 &&
            r2[0] * (cy1 - rty2) - r2[1] * (cx1 - rtx2) > 0 &&
            b2[0] * (cy1 - rby2) - b2[1] * (cx1 - rbx2) > 0 &&
            l2[0] * (cy1 - lby2) - l2[1] * (cx1 - lbx2) > 0) {
            return true;
        } else {
            poss1 = [ lt1, rt1, rb1, lb1 ];
            poss2 = [ lt2, rt2, rb2, lb2 ];
            dirs1 = [ t1, r1, b1, l1 ];
            dirs2 = [ t2, r2, b2, l2 ];
            for (i = 0; i < 4; i++) {
                pos1 = poss1[i];
                px1 = pos1[0]; py1 = pos1[1];
                dir1 = dirs1[i];
                dx1 = dir1[0]; dy1 = dir1[1];
                for (j = 0; j < 4; j++) {
                    pos2 = poss2[j];
                    px2 = pos2[0]; py2 = pos2[1];
                    dir2 = dirs2[j];
                    dx2 = dir2[0]; dy2 = dir2[1];
                    c = dx1 * dy2 - dy1 * dx2;
                    if (c !== 0) {
                        vx = px2 - px1;
                        vy = py2 - py1;
                        c1 = (vx * dy1 - vy * dx1) / c;
                        c2 = (vx * dy2 - vy * dx2) / c;
                        if (0 < c1 && c1 < 1 && 0 < c2 && c2 < 1) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    },
    /**
     * Entityの中心点どうしの距離により衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @param {Number} [distance] 衝突したと見なす最大の距離. デフォルト値は二つのEntityの横幅と高さの平均.
     * @return {Boolean} 衝突判定の結果.
     */
    within: function(other, distance) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        if (distance == null) {
            distance = (this.width + this.height + other.width + other.height) / 4;
        }
        var _;
        return (_ = this._offsetX - other._offsetX + (this.width - other.width) / 2) * _ +
            (_ = this._offsetY - other._offsetY + (this.height - other.height) / 2) * _ < distance * distance;
    },
    /**
     * Entityを拡大縮小する.
     * @param {Number} x 拡大するx軸方向の倍率.
     * @param {Number} [y] 拡大するy軸方向の倍率.
     */
    scale: function(x, y) {
        this._scaleX *= x;
        this._scaleY *= (y != null) ? y : x;
        this._dirty = true;
    },
    /**
     * Entityを回転する.
     * @param {Number} deg 回転する角度 (度数法).
     */
    rotate: function(deg) {
        this.rotation += deg;
    },
    /**
     * Entityのx軸方向の倍率.
     * @type Number
     */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            if(this._scaleX !== scaleX) {
                this._scaleX = scaleX;
                this._dirty = true;
            }
        }
    },
    /**
     * Entityのy軸方向の倍率.
     * @type Number
     */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            if(this._scaleY !== scaleY) {
                this._scaleY = scaleY;
                this._dirty = true;
            }
        }
    },
    /**
     * Entityの回転角 (度数法).
     * @type Number
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            if(this._rotation !== rotation) {
                this._rotation = rotation;
                this._dirty = true;
            }
        }
    },
    /**
     * 回転・拡大縮小の基準点のX座標
     * @type Number
     */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            if(this._originX !== originX) {
                this._originX = originX;
                this._dirty = true;
            }
        }
    },
    /**
     * 回転・拡大縮小の基準点のY座標
     * @type Number
     */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            if(this._originY !== originY) {
                this._originY = originY;
                this._dirty = true;
            }
        }
    },
    /**
     * インスタンスをコレクションの対象にする.
     * デフォルトで呼び出される.
     */
    enableCollection: function() {
        this.addEventListener('addedtoscene', this._addSelfToCollection);
        this.addEventListener('removedfromscene', this._removeSelfFromCollection);
        if (this.scene) {
            this._addSelfToCollection();
        }
    },
    /**
     * インスタンスをコレクションの対象から除外する.
     */
    disableCollection: function() {
        this.removeEventListener('addedtoscene', this._addSelfToCollection);
        this.removeEventListener('removedfromscene', this._removeSelfFromCollection);
        if (this.scene) {
            this._removeSelfFromCollection();
        }
    },
    /**#nocode+*/
    clearEventListener: function() {
        _nodePrototypeClearEventListener.apply(this,arguments);
        if (this.scene) {
            this._removeSelfFromCollection();
        }
    },
    /**#nocode-*/
    _addSelfToCollection: function() {
        if (this._isContainedInCollection) {
            return;
        }

        var Constructor = this.getConstructor();
        Constructor._collectionTarget.forEach(function(C) {
            C.collection.push(this);
        }, this);

        this._isContainedInCollection = true;
    },
    _removeSelfFromCollection: function() {
        if (!this._isContainedInCollection) {
            return;
        }

        var Constructor = this.getConstructor();
        Constructor._collectionTarget.forEach(function(C) {
            var i = C.collection.indexOf(this);
            if (i !== -1) {
                C.collection.splice(i, 1);
            }
        }, this);

        this._isContainedInCollection = false;
    },
    getBoundingRect: function() {
        var w = this.width || 0;
        var h = this.height || 0;
        var mat = this._matrix;
        var m11w = mat[0] * w, m12w = mat[1] * w,
            m21h = mat[2] * h, m22h = mat[3] * h,
            mdx = mat[4], mdy = mat[5];
        var xw = [ mdx, m11w + mdx, m21h + mdx, m11w + m21h + mdx ].sort(function(a, b) { return a - b; });
        var yh = [ mdy, m12w + mdy, m22h + mdy, m12w + m22h + mdy ].sort(function(a, b) { return a - b; });

        return {
            left: xw[0],
            top: yh[0],
            width: xw[3] - xw[0],
            height: yh[3] - yh[0]
        };
    },
    getOrientedBoundingRect: function() {
        var w = this.width || 0;
        var h = this.height || 0;
        var mat = this._matrix;
        var m11w = mat[0] * w, m12w = mat[1] * w,
            m21h = mat[2] * h, m22h = mat[3] * h,
            mdx = mat[4], mdy = mat[5];

        return {
            leftTop: [ mdx, mdy ],
            rightTop: [ m11w + mdx, m12w + mdy ],
            leftBottom: [ m21h + mdx, m22h + mdy ],
            rightBottom: [ m11w + m21h + mdx, m12w + m22h + mdy ]
        };
    },
    getConstructor: function() {
        return Object.getPrototypeOf(this).constructor;
    }
});

var _collectizeConstructor = function(Constructor) {
    if (Constructor._collective) {
        return;
    }
    var rel = enchant.Class.getInheritanceTree(Constructor);
    var i = rel.indexOf(enchant.Entity);
    if (i !== -1) {
        Constructor._collectionTarget = rel.splice(0, i + 1);
    } else {
        Constructor._collectionTarget = [];
    }
    Constructor.intersect = _staticIntersect;
    Constructor.intersectStrict = _staticIntersectStrict;
    Constructor.collection = [];
    Constructor._collective = true;
};

_collectizeConstructor(enchant.Entity);

enchant.Entity._inherited = function(subclass) {
    _collectizeConstructor(subclass);
};

/**
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Sprite
     * @class
     * 画像表示機能を持ったクラス. Entity を継承している.
     * @param {Number} width Spriteの横幅.
     * @param {Number} height Spriteの高さ.
     *
     * @example
     * var bear = new Sprite(32, 32);
     * bear.image = core.assets['chara1.gif'];
     *
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(width, height) {
        enchant.Entity.call(this);

        this.width = width;
        this.height = height;
        this._image = null;
        this._debugColor = '#ff0000';
        this._frameLeft = 0;
        this._frameTop = 0;
        this._frame = 0;
        this._frameSequence = null;
    },
    /**
     * Spriteで表示する画像.
     * @type enchant.Surface
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            if (image === undefined) {
                throw new Error('Assigned value on Sprite.image is undefined. Please double-check image path, and check if the image you want to use is preload before use.');
            }
            if (image === this._image) {
                return;
            }
            this._image = image;
            this._computeFramePosition();
        }
    },
    /**
     * 表示するフレームのインデックス.
     * Spriteと同じ横幅と高さを持ったフレームが{@link enchant.Sprite#image}プロパティの画像に左上から順に
     * 配列されていると見て, 0から始まるインデックスを指定することでフレームを切り替える.
     *
     * 数値の配列が指定された場合, それらを毎フレーム順に切り替える.
     * ループするが, null値が含まれているとそこでループをストップする.
     *
     * @example
     * var sprite = new Sprite(32, 32);
     * sprite.frame = [0, 1, 0, 2]
     * //-> 0, 1, 0, 2, 0, 1, 0, 2,..
     * sprite.frame = [0, 1, 0, 2, null]
     * //-> 0, 1, 0, 2, (2, 2,.. :stop)
     *
     * @type Number|Array
     */
    frame: {
        get: function() {
            return this._frame;
        },
        set: function(frame) {
            if (((this._frameSequence == null) && (this._frame === frame)) || (this._deepCompareToPreviousFrame(frame))) {
                return;
            }
            if (frame instanceof Array) {
                this._frameSequence = frame;
            } else {
                this._frameSequence = null;
                this._frame = frame;
                this._computeFramePosition();
            }
        }
    },
    _frameSequence: {
        get: function() {
            return this.__frameSequence;
        },
        set: function(frameSequence) {
            if(frameSequence && !this.__frameSequence) {
                this.addEventListener(enchant.Event.ENTER_FRAME, this._rotateFrameSequence);
            } else if(!frameSequence && this.__frameSequence) {
                this.removeEventListener(enchant.Event.ENTER_FRAME, this._rotateFrameSequence);
            }
            if(frameSequence) {
                this.__frameSequence = frameSequence.slice();
                this._originalFrameSequence = frameSequence.slice();
                this._rotateFrameSequence();
            } else {
                this.__frameSequence = null;
                this._originalFrameSequence = null;
            }
        }
    },
    /**
     * @private
     */
    _deepCompareToPreviousFrame: function(frameArray) {
        if (frameArray === this._originalFrameSequence) {
            return true;
        }
        if (frameArray == null || this._originalFrameSequence == null) {
            return false;
        }
        if (!(frameArray instanceof Array)) {
            return false;
        }
        if (frameArray.length !== this._originalFrameSequence.length) {
            return false;
        }
        for (var i = 0; i < frameArray.length; ++i) {
            if (frameArray[i] !== this._originalFrameSequence[i]){
                return false;
            }
        }
        return true;
    },
    /**
     * 0 <= frame
     * 0以下の動作は未定義.
     * @private
     */
    _computeFramePosition: function() {
        var image = this._image;
        var row;
        if (image != null) {
            row = image.width / this._width | 0;
            this._frameLeft = (this._frame % row | 0) * this._width;
            this._frameTop = (this._frame / row | 0) * this._height % image.height;
        }
    },
    _rotateFrameSequence: function() {
        var frameSequence = this._frameSequence;
        if (frameSequence && frameSequence.length !== 0) {
            var nextFrame = frameSequence.shift();
            if (nextFrame === null) {
                this._frameSequence = null;
                this.dispatchEvent(new enchant.Event(enchant.Event.ANIMATION_END));
            } else {
                this._frame = nextFrame;
                this._computeFramePosition();
                frameSequence.push(nextFrame);
            }
        }
    },
    /**#nocode+*/
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._computeFramePosition();
            this._dirty = true;
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._computeFramePosition();
            this._dirty = true;
        }
    },
    /**#nocode-*/
    cvsRender: function(ctx) {
        var image = this._image,
            w = this._width, h = this._height,
            iw, ih, elem, sx, sy, sw, sh;
        if (image && w !== 0 && h !== 0) {
            iw = image.width;
            ih = image.height;
            if (iw < w || ih < h) {
                ctx.fillStyle = enchant.Surface._getPattern(image);
                ctx.fillRect(0, 0, w, h);
            } else {
                elem = image._element;
                sx = this._frameLeft;
                sy = Math.min(this._frameTop, ih - h);
                // IE9 doesn't allow for negative or 0 widths/heights when drawing on the CANVAS element
                sw = Math.max(0.01, Math.min(iw - sx, w));
                sh = Math.max(0.01, Math.min(ih - sy, h));
                ctx.drawImage(elem, sx, sy, sw, sh, 0, 0, w, h);
            }
        }
    },
    domRender: (function() {
        if (enchant.ENV.VENDOR_PREFIX === 'ms') {
            return function(element) {
                if (this._image) {
                    if (this._image._css) {
                        this._style['background-image'] = this._image._css;
                        this._style['background-position'] =
                            -this._frameLeft + 'px ' +
                            -this._frameTop + 'px';
                    } else if (this._image._element) {
                    }
                }
            };
        } else {
            return function(element) {
                if (this._image) {
                    if (this._image._css) {
                        this._style['background-image'] = this._image._css;
                        this._style['background-position'] =
                            -this._frameLeft + 'px ' +
                            -this._frameTop + 'px';
                    } else if (this._image._element) {
                    }
                }
            };
        }
    }())
});

/**
 * @scope enchant.Label.prototype
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Label
     * @class
     * Label クラス.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.text = text || '';
        this.width = 300;
        this.font = '14px serif';
        this.textAlign = 'left';

        this._debugColor = '#ff0000';
    },
    /**#nocode+*/
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._dirty = true;
            // issue #164
            this.updateBoundArea();
        }
    },
    /**#nocode-*/
    /**
     * 表示するテキスト.
     * DOM レンダラを利用している場合 (DOMScene 以下にある場合) 改行タグ (br) も利用できますが,
     * ユーザから入力したり, サーバから取得した文字列を表示する場合, XSS 脆弱性などに注意してください.
     * Canvas レンダラを利用できる場合でも, 改行タグ (br, BR) は改行に変換されます.
     * @type String
     */
    text: {
        get: function() {
            return this._text;
        },
        set: function(text) {
            text = '' + text;
            if(this._text === text) {
                return;
            }
            this._text = text;
            text = text.replace(/<br ?\/?>/gi, '<br/>');
            this._splitText = text.split('<br/>');
            this.updateBoundArea();
            for (var i = 0, l = this._splitText.length; i < l; i++) {
                text = this._splitText[i];
                var metrics = this.getMetrics(text);
                this._splitText[i] = {};
                this._splitText[i].text = text;
                this._splitText[i].height = metrics.height;
                this._splitText[i].width = metrics.width;
            }
        }
    },
    /**
     * テキストの水平位置の指定.
     * CSSの'text-align'プロパティと同様の形式で指定できる.
     * @type String
     */
    textAlign: {
        get: function() {
            return this._style['text-align'];
        },
        set: function(textAlign) {
            this._style['text-align'] = textAlign;
            this.updateBoundArea();
        }
    },
    /**
     * フォントの指定.
     * CSSの'font'プロパティと同様の形式で指定できる.
     * @type String
     */
    font: {
        get: function() {
            return this._style.font;
        },
        set: function(font) {
            this._style.font = font;
            this.updateBoundArea();
        }
    },
    /**
     * 文字色の指定.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type String
     */
    color: {
        get: function() {
            return this._style.color;
        },
        set: function(color) {
            this._style.color = color;
        }
    },
    cvsRender: function(ctx) {
        var x, y = 0;
        var labelWidth = this.width;
        var charWidth, amount, line, text, c, buf, increase, length;
        var bufWidth;
        if (this._splitText) {
            ctx.textBaseline = 'top';
            ctx.font = this.font;
            ctx.fillStyle = this.color || '#000000';
            charWidth = ctx.measureText(' ').width;
            amount = labelWidth / charWidth;
            for (var i = 0, l = this._splitText.length; i < l; i++) {
                line = this._splitText[i];
                text = line.text;
                c = 0;
                while (text.length > c + amount || ctx.measureText(text.slice(c, c + amount)).width > labelWidth) {
                    buf = '';
                    increase = amount;
                    length = 0;
                    while (increase > 0) {
                        if (ctx.measureText(buf).width < labelWidth) {
                            length += increase;
                            buf = text.slice(c, c + length);
                        } else {
                            length -= increase;
                            buf = text.slice(c, c + length);
                        }
                        increase = increase / 2 | 0;
                    }
                    ctx.fillText(buf, 0, y);
                    y += line.height - 1;
                    c += length;
                }
                buf = text.slice(c, c + text.length);
                if (this.textAlign === 'right') {
                    x = labelWidth - ctx.measureText(buf).width;
                } else if (this.textAlign === 'center') {
                    x = (labelWidth - ctx.measureText(buf).width) / 2;
                } else {
                    x = 0;
                }
                ctx.fillText(buf, x, y);
                y += line.height - 1;
            }
        }
    },
    domRender: function(element) {
        if (element.innerHTML !== this._text) {
            element.innerHTML = this._text;
        }
    },
    detectRender: function(ctx) {
        ctx.fillRect(this._boundOffset, 0, this._boundWidth, this._boundHeight);
    },
    updateBoundArea: function() {
        var metrics = this.getMetrics();
        this._boundWidth = metrics.width;
        this._boundHeight = metrics.height;
        if (this.textAlign === 'right') {
            this._boundOffset = this.width - this._boundWidth;
        } else if (this.textAlign === 'center') {
            this._boundOffset = (this.width - this._boundWidth) / 2;
        } else {
            this._boundOffset = 0;
        }
    },
    getMetrics: function(text) {
        var ret = {};
        var div, width, height;
        if (document.body) {
            div = document.createElement('div');
            for (var prop in this._style) {
                if(prop !== 'width' && prop !== 'height') {
                    div.style[prop] = this._style[prop];
                }
            }
            text = text || this._text;
            div.innerHTML = text.replace(/ /g, '&nbsp;');
            div.style.whiteSpace = 'noWrap';
            div.style.lineHeight = 1;
            document.body.appendChild(div);
            var computedStyle = getComputedStyle(div);
            ret.height = parseInt(computedStyle.height, 10) + 1;
            div.style.position = 'absolute';
            ret.width = parseInt(computedStyle.width, 10) + 1;
            document.body.removeChild(div);
        } else {
            ret.width = this.width;
            ret.height = this.height;
        }
        return ret;
    }
});

/**
 * @scope enchant.Map.prototype
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Map
     * @class
     * タイルセットからマップを生成して表示するクラス.
     * @param {Number} tileWidth タイルの横幅.
     * @param {Number} tileHeight タイルの高さ.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(tileWidth, tileHeight) {
        var core = enchant.Core.instance;

        enchant.Entity.call(this);

        var surface = new enchant.Surface(core.width, core.height);
        this._surface = surface;
        var canvas = surface._element;
        canvas.style.position = 'absolute';
        if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
            canvas.width = core.width * 2;
            canvas.height = core.height * 2;
            this._style.webkitTransformOrigin = '0 0';
            this._style.webkitTransform = 'scale(0.5)';
        } else {
            canvas.width = core.width;
            canvas.height = core.height;
        }
        this._context = canvas.getContext('2d');

        this._tileWidth = tileWidth || 0;
        this._tileHeight = tileHeight || 0;
        this._image = null;
        this._data = [
            [
                []
            ]
        ];
        this._dirty = false;
        this._tight = false;

        this.touchEnabled = false;

        /**
         * タイルが衝突判定を持つかを表す値の二元配列.
         * @type Number[][]
         */
        this.collisionData = null;

        this._listeners['render'] = null;
        this.addEventListener('render', function() {
            if(this._dirty) {
                this._previousOffsetX = this._previousOffsetY = null;
            }
        });
    },
    /**
     * データを設定する.
     * タイルががimageプロパティの画像に左上から順に配列されていると見て, 0から始まる
     * インデックスの二元配列を設定する.複数指定された場合は後のものから順に表示される.
     * @param {...Number[][]} data タイルのインデックスの二元配列. 複数指定できる.
     */
    loadData: function(data) {
        this._data = Array.prototype.slice.apply(arguments);
        this._dirty = true;

        this._tight = false;
        for (var i = 0, len = this._data.length; i < len; i++) {
            var c = 0;
            data = this._data[i];
            for (var y = 0, l = data.length; y < l; y++) {
                for (var x = 0, ll = data[y].length; x < ll; x++) {
                    if (data[y][x] >= 0) {
                        c++;
                    }
                }
            }
            if (c / (data.length * data[0].length) > 0.2) {
                this._tight = true;
                break;
            }
        }
    },
    /**
     * ある座標のタイルが何か調べる.
     * @param {Number} x マップ上の点のx座標.
     * @param {Number} y マップ上の点のy座標.
     * @return {*} ある座標のタイルのデータ.
     */
    checkTile: function(x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        //		return this._data[y][x];
        var data = this._data[0];
        return data[y][x];
    },
    /**
     * Map上に障害物があるかどうかを判定する.
     * @param {Number} x 判定を行うマップ上の点のx座標.
     * @param {Number} y 判定を行うマップ上の点のy座標.
     * @return {Boolean} 障害物があるかどうか.
     */
    hitTest: function(x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        if (this.collisionData != null) {
            return this.collisionData[y] && !!this.collisionData[y][x];
        } else {
            for (var i = 0, len = this._data.length; i < len; i++) {
                var data = this._data[i];
                var n;
                if (data[y] != null && (n = data[y][x]) != null &&
                    0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0)) {
                    return true;
                }
            }
            return false;
        }
    },
    /**
     * Mapで表示するタイルセット画像.
     * @type enchant.Surface
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            var core = enchant.Core.instance;

            this._image = image;
            if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
                var img = new enchant.Surface(image.width * 2, image.height * 2);
                var tileWidth = this._tileWidth || image.width;
                var tileHeight = this._tileHeight || image.height;
                var row = image.width / tileWidth | 0;
                var col = image.height / tileHeight | 0;
                for (var y = 0; y < col; y++) {
                    for (var x = 0; x < row; x++) {
                        img.draw(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight,
                            x * tileWidth * 2, y * tileHeight * 2, tileWidth * 2, tileHeight * 2);
                    }
                }
                this._doubledImage = img;
            }
            this._dirty = true;
        }
    },
    /**
     * Mapのタイルの横幅.
     * @type Number
     */
    tileWidth: {
        get: function() {
            return this._tileWidth;
        },
        set: function(tileWidth) {
            if(this._tileWidth !== tileWidth) {
                this._tileWidth = tileWidth;
                this._dirty = true;
            }
        }
    },
    /**
     * Mapのタイルの高さ.
     * @type Number
     */
    tileHeight: {
        get: function() {
            return this._tileHeight;
        },
        set: function(tileHeight) {
            if(this._tileHeight !== tileHeight) {
                this._tileHeight = tileHeight;
                this._dirty = true;
            }
        }
    },
    /**
     * @private
     */
    width: {
        get: function() {
            return this._tileWidth * this._data[0][0].length;
        }
    },
    /**
     * @private
     */
    height: {
        get: function() {
            return this._tileHeight * this._data[0].length;
        }
    },
    /**
     * @private
     */
    redraw: function(x, y, width, height) {
        if (this._image == null) {
            return;
        }

        var image, tileWidth, tileHeight, dx, dy;
        if (this._doubledImage) {
            image = this._doubledImage;
            tileWidth = this._tileWidth * 2;
            tileHeight = this._tileHeight * 2;
            dx = -this._offsetX * 2;
            dy = -this._offsetY * 2;
            x *= 2;
            y *= 2;
            width *= 2;
            height *= 2;
        } else {
            image = this._image;
            tileWidth = this._tileWidth;
            tileHeight = this._tileHeight;
            dx = -this._offsetX;
            dy = -this._offsetY;
        }
        var row = image.width / tileWidth | 0;
        var col = image.height / tileHeight | 0;
        var left = Math.max((x + dx) / tileWidth | 0, 0);
        var top = Math.max((y + dy) / tileHeight | 0, 0);
        var right = Math.ceil((x + dx + width) / tileWidth);
        var bottom = Math.ceil((y + dy + height) / tileHeight);

        var source = image._element;
        var context = this._context;
        var canvas = context.canvas;
        context.clearRect(x, y, width, height);
        for (var i = 0, len = this._data.length; i < len; i++) {
            var data = this._data[i];
            var r = Math.min(right, data[0].length);
            var b = Math.min(bottom, data.length);
            for (y = top; y < b; y++) {
                for (x = left; x < r; x++) {
                    var n = data[y][x];
                    if (0 <= n && n < row * col) {
                        var sx = (n % row) * tileWidth;
                        var sy = (n / row | 0) * tileHeight;
                        context.drawImage(source, sx, sy, tileWidth, tileHeight,
                            x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight);
                    }
                }
            }
        }
    },
    /**
     * @private
     */
    updateBuffer: function() {
        if (this._visible === undefined || this._visible) {
            var core = enchant.Core.instance;
            if (this._dirty || this._previousOffsetX == null) {
                this.redraw(0, 0, core.width, core.height);
            } else if (this._offsetX !== this._previousOffsetX ||
                    this._offsetY !== this._previousOffsetY) {
                if (this._tight) {
                    var x = -this._offsetX;
                    var y = -this._offsetY;
                    var px = -this._previousOffsetX;
                    var py = -this._previousOffsetY;
                    var w1 = x - px + core.width;
                    var w2 = px - x + core.width;
                    var h1 = y - py + core.height;
                    var h2 = py - y + core.height;
                    if (w1 > this._tileWidth && w2 > this._tileWidth &&
                            h1 > this._tileHeight && h2 > this._tileHeight) {
                        var sx, sy, dx, dy, sw, sh;
                        if (w1 < w2) {
                            sx = 0;
                            dx = px - x;
                            sw = w1;
                        } else {
                            sx = x - px;
                            dx = 0;
                            sw = w2;
                        }
                        if (h1 < h2) {
                            sy = 0;
                            dy = py - y;
                            sh = h1;
                        } else {
                            sy = y - py;
                            dy = 0;
                            sh = h2;
                        }

                        if (core._buffer == null) {
                            core._buffer = document.createElement('canvas');
                            core._buffer.width = this._context.canvas.width;
                            core._buffer.height = this._context.canvas.height;
                        }
                        var context = core._buffer.getContext('2d');
                        if (this._doubledImage) {
                            context.clearRect(0, 0, sw * 2, sh * 2);
                            context.drawImage(this._context.canvas,
                                    sx * 2, sy * 2, sw * 2, sh * 2, 0, 0, sw * 2, sh * 2);
                            context = this._context;
                            context.clearRect(dx * 2, dy * 2, sw * 2, sh * 2);
                            context.drawImage(core._buffer,
                                    0, 0, sw * 2, sh * 2, dx * 2, dy * 2, sw * 2, sh * 2);
                        } else {
                            context.clearRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                    sx, sy, sw, sh, 0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(core._buffer,
                                    0, 0, sw, sh, dx, dy, sw, sh);
                        }

                        if (dx === 0) {
                            this.redraw(sw, 0, core.width - sw, core.height);
                        } else {
                            this.redraw(0, 0, core.width - sw, core.height);
                        }
                        if (dy === 0) {
                            this.redraw(0, sh, core.width, core.height - sh);
                        } else {
                            this.redraw(0, 0, core.width, core.height - sh);
                        }
                    } else {
                        this.redraw(0, 0, core.width, core.height);
                    }
                } else {
                    this.redraw(0, 0, core.width, core.height);
                }
            }
            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        }
    },
    cvsRender: function(ctx) {
        if (this.width !== 0 && this.height !== 0) {
            var core = enchant.Core.instance;
            this.updateBuffer();
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            var cvs = this._context.canvas;
                ctx.drawImage(cvs, 0, 0, core.width, core.height);
            ctx.restore();
        }
    },
    domRender: function(element) {
        if (this._image) {
            this.updateBuffer();
            this._style['background-image'] = this._surface._css;
            // bad performance
            this._style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(1, 0, 0, 1, 0, 0)';
        }
    }
});


/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
     * @name enchant.Group
     * @class
     * 複数の {@link enchant.Node} を子に持つことができるクラス.
     *
     * @example
     * var stage = new Group();
     * stage.addChild(player);
     * stage.addChild(enemy);
     * stage.addChild(map);
     * stage.addEventListener('enterframe', function() {
     *     // playerの座標に従って全体をスクロールする
     *     if (this.x > 64 - player.x) {
     *         this.x = 64 - player.x;
     *     }
     * });
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        /**
         * 子のNode.
         * @type enchant.Node[]
         */
        this.childNodes = [];

        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._originX = null;
        this._originY = null;

        this.__dirty = false;

        [enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE]
            .forEach(function(event) {
                this.addEventListener(event, function(e) {
                    this.childNodes.forEach(function(child) {
                        child.scene = this.scene;
                        child.dispatchEvent(e);
                    }, this);
                });
            }, this);
    },
    /**
     * GroupにNodeを追加する.
     * @param {enchant.Node} node 追加するNode.
     */
    addChild: function(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        childAdded.next = null;
        this.dispatchEvent(childAdded);
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            node.scene = this.scene;
            var addedToScene = new enchant.Event('addedtoscene');
            node.dispatchEvent(addedToScene);
        }
    },
    /**
     * GroupにNodeを挿入する.
     * @param {enchant.Node} node 挿入するNode.
     * @param {enchant.Node} reference 挿入位置の前にあるNode.
     */
    insertBefore: function(node, reference) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        var i = this.childNodes.indexOf(reference);
        if (i !== -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = reference;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        } else {
            this.addChild(node);
        }
    },
    /**
     * GroupからNodeを削除する.
     * @param {enchant.Node} node 削除するNode.
     */
    removeChild: function(node) {
        var i;
        if ((i = this.childNodes.indexOf(node)) !== -1) {
            this.childNodes.splice(i, 1);
            node.parentNode = null;
            var childRemoved = new enchant.Event('childremoved');
            childRemoved.node = node;
            this.dispatchEvent(childRemoved);
            node.dispatchEvent(new enchant.Event('removed'));
            if (this.scene) {
                node.scene = null;
                var removedFromScene = new enchant.Event('removedfromscene');
                node.dispatchEvent(removedFromScene);
            }
        }
    },
    /**
     * 最初の子Node.
     * @type enchant.Node
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     * 最後の子Node.
     * @type enchant.Node
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length - 1];
        }
    },
    /**
    * Groupの回転角 (度数法).
    * @type Number
    */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            if(this._rotation !== rotation) {
                this._rotation = rotation;
                this._dirty = true;
            }
        }
    },
    /**
    * Groupのx軸方向の倍率.
    * @type Number
    * @see enchant.Group#originX
    * @see enchant.Group#originY
    */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scale) {
            if(this._scaleX !== scale) {
                this._scaleX = scale;
                this._dirty = true;
            }
        }
    },
    /**
    * Groupのy軸方向の倍率.
    * @type Number
    * @see enchant.Group#originX
    * @see enchant.Group#originY
    */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scale) {
            if(this._scaleY !== scale) {
                this._scaleY = scale;
                this._dirty = true;
            }
        }
    },
    /**
    * 回転・拡大縮小の基準点のX座標
    * @type Number
    */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            if(this._originX !== originX) {
                this._originX = originX;
                this._dirty = true;
            }
        }
    },
    /**
    * 回転・拡大縮小の基準点のX座標
    * @type Number
    */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            if(this._originY !== originY) {
                this._originY = originY;
                this._dirty = true;
            }
        }
    },
    /**#nocode+*/
    _dirty: {
        get: function() {
            return this.__dirty;
        },
        set: function(dirty) {
            dirty = !!dirty;
            this.__dirty = dirty;
            if (dirty) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i]._dirty = true;
                }
            }
        }
    }
    /**#nocode-*/
});

enchant.Matrix = enchant.Class.create({
    initialize: function() {
        this.reset();
    },
    reset: function() {
        this.stack = [];
        this.stack.push([ 1, 0, 0, 1, 0, 0 ]);
    },
    makeTransformMatrix: function(node, dest) {
        var x = node._x;
        var y = node._y;
        var width = node.width || 0;
        var height = node.height || 0;
        var rotation = node._rotation || 0;
        var scaleX = (typeof node._scaleX === 'number') ? node._scaleX : 1;
        var scaleY = (typeof node._scaleY === 'number') ? node._scaleY : 1;
        var theta = rotation * Math.PI / 180;
        var tmpcos = Math.cos(theta);
        var tmpsin = Math.sin(theta);
        var w = (typeof node._originX === 'number') ? node._originX : width / 2;
        var h = (typeof node._originY === 'number') ? node._originY : height / 2;
        var a = scaleX * tmpcos;
        var b = scaleX * tmpsin;
        var c = scaleY * tmpsin;
        var d = scaleY * tmpcos;
        dest[0] = a;
        dest[1] = b;
        dest[2] = -c;
        dest[3] = d;
        dest[4] = (-a * w + c * h + x + w);
        dest[5] = (-b * w - d * h + y + h);
    },
    multiply: function(m1, m2, dest) {
        var a11 = m1[0], a21 = m1[2], adx = m1[4],
            a12 = m1[1], a22 = m1[3], ady = m1[5];
        var b11 = m2[0], b21 = m2[2], bdx = m2[4],
            b12 = m2[1], b22 = m2[3], bdy = m2[5];

        dest[0] = a11 * b11 + a21 * b12;
        dest[1] = a12 * b11 + a22 * b12;
        dest[2] = a11 * b21 + a21 * b22;
        dest[3] = a12 * b21 + a22 * b22;
        dest[4] = a11 * bdx + a21 * bdy + adx;
        dest[5] = a12 * bdx + a22 * bdy + ady;
    },
    multiplyVec: function(mat, vec, dest) {
        var x = vec[0], y = vec[1];
        var m11 = mat[0], m21 = mat[2], mdx = mat[4],
            m12 = mat[1], m22 = mat[3], mdy = mat[5];
        dest[0] = m11 * x + m21 * y + mdx;
        dest[1] = m12 * x + m22 * y + mdy;
    }
});
enchant.Matrix.instance = new enchant.Matrix();

enchant.DetectColorManager = enchant.Class.create({
    initialize: function(reso, max) {
        this.reference = [];
        this.colorResolution = reso || 16;
        this.max = max || 1;
        this.capacity = Math.pow(this.colorResolution, 3);
        for (var i = 1, l = this.capacity; i < l; i++) {
            this.reference[i] = null;
        }
    },
    attachDetectColor: function(sprite) {
        var i = this.reference.indexOf(null);
        if (i === -1) {
            i = 1;
        }
        this.reference[i] = sprite;
        return this._getColor(i);
    },
    detachDetectColor: function(sprite) {
        var i = this.reference.indexOf(sprite);
        if (i !== -1) {
            this.reference[i] = null;
        }
    },
    _getColor: function(n) {
        var C = this.colorResolution;
        var d = C / this.max;
        return [
            parseInt((n / C / C) % C, 10) / d,
            parseInt((n / C) % C, 10) / d,
            parseInt(n % C, 10) / d,
            1.0
        ];
    },
    _decodeDetectColor: function(color, i) {
        i = i || 0;
        var C = this.colorResolution;
        return ~~(color[i] * C * C * C / 256) +
            ~~(color[i + 1] * C * C / 256) +
            ~~(color[i + 2] * C / 256);
    },
    getSpriteByColor: function(color) {
        return this.reference[this._decodeDetectColor(color)];
    },
    getSpriteByColors: function(rgba) {
        var i, l, id, result,
            score = 0,
            found = {};

        for (i = 0, l = rgba.length; i < l; i+= 4) {
            id = this._decodeDetectColor(rgba, i);
            found[id] = (found[id] || 0) + 1;
        }
        for (id in found) {
            if (found[id] > score) {
                score = found[id];
                result = id;
            }
        }

        return this.reference[result];
    }
});

enchant.DomManager = enchant.Class.create({
    initialize: function(node, elementDefinition) {
        var core = enchant.Core.instance;
        this.layer = null;
        this.targetNode = node;
        if (typeof elementDefinition === 'string') {
            this.element = document.createElement(elementDefinition);
        } else if (elementDefinition instanceof HTMLElement) {
            this.element = elementDefinition;
        }
        this.style = this.element.style;
        this.style.position = 'absolute';
        this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0px 0px';
        if (core._debug) {
            this.style.border = '1px solid blue';
            this.style.margin = '-1px';
        }

        var manager = this;
        this._setDomTarget = function() {
            manager.layer._touchEventTarget = manager.targetNode;
        };
        this._attachEvent();
    },
    getDomElement: function() {
        return this.element;
    },
    getDomElementAsNext: function() {
        return this.element;
    },
    getNextManager: function(manager) {
        var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
        if (i !== this.targetNode.parentNode.childNodes.length - 1) {
            return this.targetNode.parentNode.childNodes[i + 1]._domManager;
        } else {
            return null;
        }
    },
    addManager: function(childManager, nextManager) {
        var nextElement;
        if (nextManager) {
            nextElement = nextManager.getDomElementAsNext();
        }
        var element = childManager.getDomElement();
        if (element instanceof Array) {
            element.forEach(function(child) {
                if (nextElement) {
                    this.element.insertBefore(child, nextElement);
                } else {
                    this.element.appendChild(child);
                }
            }, this);
        } else {
            if (nextElement) {
                this.element.insertBefore(element, nextElement);
            } else {
                this.element.appendChild(element);
            }
        }
        this.setLayer(this.layer);
    },
    removeManager: function(childManager) {
        if (childManager instanceof enchant.DomlessManager) {
            childManager._domRef.forEach(function(element) {
                this.element.removeChild(element);
            }, this);
        } else {
            this.element.removeChild(childManager.element);
        }
        this.setLayer(this.layer);
    },
    setLayer: function(layer) {
        this.layer = layer;
        var node = this.targetNode;
        var manager;
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                manager = node.childNodes[i]._domManager;
                if (manager) {
                    manager.setLayer(layer);
                }
            }
        }
    },
    render: function(inheritMat) {
        var node = this.targetNode;
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var dest = [];
        matrix.makeTransformMatrix(node, dest);
        matrix.multiply(stack[stack.length - 1], dest, dest);
        matrix.multiply(inheritMat, dest, inheritMat);
        node._matrix = inheritMat;
        var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
        var vec = [ ox, oy ];
        matrix.multiplyVec(dest, vec, vec);

        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        if(node.parentNode && !(node.parentNode instanceof enchant.Group)) {
            node._offsetX += node.parentNode._offsetX;
            node._offsetY += node.parentNode._offsetY;
        }
        if (node._dirty) {
            this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(' +
                dest[0].toFixed(10) + ',' +
                dest[1].toFixed(10) + ',' +
                dest[2].toFixed(10) + ',' +
                dest[3].toFixed(10) + ',' +
                dest[4].toFixed(10) + ',' +
                dest[5].toFixed(10) +
            ')';
        }
        this.domRender();
    },
    domRender: function() {
        var node = this.targetNode;
        if(!node._style) {
            node._style = {};
        }
        if(!node.__styleStatus) {
            node.__styleStatus = {};
        }
        if (node.width !== null) {
            node._style.width = node.width + 'px';
        }
        if (node.height !== null) {
            node._style.height = node.height + 'px';
        }
        node._style.opacity = node._opacity;
        node._style['background-color'] = node._backgroundColor;
        if (typeof node._visible !== 'undefined') {
            node._style.display = node._visible ? 'block' : 'none';
        }
        if (typeof node.domRender === 'function') {
            node.domRender(this.element);
        }
        var value;
        for (var prop in node._style) {
            value = node._style[prop];
            if(node.__styleStatus[prop] !== value && value != null) {
                this.style.setProperty(prop, '' + value);
                node.__styleStatus[prop] = value;
            }
        }
    },
    _attachEvent: function() {
        if (enchant.ENV.TOUCH_ENABLED) {
            this.element.addEventListener('touchstart', this._setDomTarget, true);
        }
        this.element.addEventListener('mousedown', this._setDomTarget, true);
    },
    _detachEvent: function() {
        if (enchant.ENV.TOUCH_ENABLED) {
            this.element.removeEventListener('touchstart', this._setDomTarget, true);
        }
        this.element.removeEventListener('mousedown', this._setDomTarget, true);
    },
    remove: function() {
        this._detachEvent();
        this.element = this.style = this.targetNode = null;
    }
});

enchant.DomlessManager = enchant.Class.create({
    initialize: function(node) {
        this._domRef = [];
        this.targetNode = node;
    },
    _register: function(element, nextElement) {
        var i = this._domRef.indexOf(nextElement);
        if (element instanceof Array) {
            if (i === -1) {
                Array.prototype.push.apply(this._domRef, element);
            } else {
                Array.prototype.splice.apply(this._domRef, [i, 0].concat(element));
            }
        } else {
            if (i === -1) {
                this._domRef.push(element);
            } else {
                this._domRef.splice(i, 0, element);
            }
        }
    },
    getNextManager: function(manager) {
        var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
        if (i !== this.targetNode.parentNode.childNodes.length - 1) {
            return this.targetNode.parentNode.childNodes[i + 1]._domManager;
        } else {
            return null;
        }
    },
    getDomElement: function() {
        var ret = [];
        this.targetNode.childNodes.forEach(function(child) {
            ret = ret.concat(child._domManager.getDomElement());
        });
        return ret;
    },
    getDomElementAsNext: function() {
        if (this._domRef.length) {
            return this._domRef[0];
        } else {
            var nextManager = this.getNextManager(this);
            if (nextManager) {
                return nextManager.element;
            } else {
                return null;
            }
        }
    },
    addManager: function(childManager, nextManager) {
        var parentNode = this.targetNode.parentNode;
        if (parentNode) {
            if (nextManager === null) {
                nextManager = this.getNextManager(this);
            }
            if (parentNode instanceof enchant.Scene) {
                parentNode._layers.Dom._domManager.addManager(childManager, nextManager);
            } else {
                parentNode._domManager.addManager(childManager, nextManager);
            }
        }
        var nextElement = nextManager ? nextManager.getDomElementAsNext() : null;
        this._register(childManager.getDomElement(), nextElement);
        this.setLayer(this.layer);
    },
    removeManager: function(childManager) {
        var dom;
        var i = this._domRef.indexOf(childManager.element);
        if (i !== -1) {
            dom = this._domRef[i];
            dom.parentNode.removeChild(dom);
            this._domRef.splice(i, 1);
        }
        this.setLayer(this.layer);
    },
    setLayer: function(layer) {
        this.layer = layer;
        var node = this.targetNode;
        var manager;
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                manager = node.childNodes[i]._domManager;
                if (manager) {
                    manager.setLayer(layer);
                }
            }
        }
    },
    render: function(inheritMat) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var node = this.targetNode;
        var dest = [];
        matrix.makeTransformMatrix(node, dest);
        matrix.multiply(stack[stack.length - 1], dest, dest);
        matrix.multiply(inheritMat, dest, inheritMat);
        node._matrix = inheritMat;
        var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
        var vec = [ ox, oy ];
        matrix.multiplyVec(dest, vec, vec);
        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        stack.push(dest);
    },
    remove: function() {
        this._domRef = [];
        this.targetNode = null;
    }
});

enchant.DomLayer = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var core = enchant.Core.instance;
        enchant.Group.call(this);

        this._touchEventTarget = null;

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';

        this._domManager = new enchant.DomManager(this, this._element);
        this._domManager.layer = this;

        this.width = core.width;
        this.height = core.height;

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this._scene) {
                    this._scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var next = e.next;
            var self = e.target;
            var nextManager = next ? next._domManager : null;
            enchant.DomLayer._attachDomManager(child, __onchildadded, __onchildremoved);
            self._domManager.addManager(child._domManager, nextManager);
            var render = new enchant.Event(enchant.Event.RENDER);
            child._dirty = true;
            self._domManager.layer._rendering(child, render);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            self._domManager.removeManager(child._domManager);
            enchant.DomLayer._detachDomManager(child, __onchildadded, __onchildremoved);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

    },
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._element.style.width = width + 'px';
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._element.style.height = height + 'px';
        }
    },
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        childAdded.next = null;
        this.dispatchEvent(childAdded);
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            node.scene = this.scene;
            var addedToScene = new enchant.Event('addedtoscene');
            node.dispatchEvent(addedToScene);
        }
    },
    insertBefore: function(node, reference) {
        var i = this.childNodes.indexOf(reference);
        if (i !== -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = reference;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        } else {
            this.addChild(node);
        }
    },
    _startRendering: function() {
        this.addEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _stopRendering: function() {
        this.removeEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _onexitframe: function() {
        this._rendering(this, new enchant.Event(enchant.Event.RENDER));
    },
    _rendering: function(node, e, inheritMat) {
        var child;
        if (!inheritMat) {
            inheritMat = [ 1, 0, 0, 1, 0, 0 ];
        }
        node.dispatchEvent(e);
        node._domManager.render(inheritMat);
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child, e, inheritMat.slice());
            }
        }
        if (node._domManager instanceof enchant.DomlessManager) {
            enchant.Matrix.instance.stack.pop();
        }
        node._dirty = false;
    },
    _determineEventTarget: function() {
        var target = this._touchEventTarget;
        this._touchEventTarget = null;
        return (target === this) ? null : target;
    }
});

enchant.DomLayer._attachDomManager = function(node, onchildadded, onchildremoved) {
    var child;
    if (!node._domManager) {
        node.addEventListener('childadded', onchildadded);
        node.addEventListener('childremoved', onchildremoved);
        if (node instanceof enchant.Group) {
            node._domManager = new enchant.DomlessManager(node);
        } else {
            if (node._element) {
                node._domManager = new enchant.DomManager(node, node._element);
            } else {
                node._domManager = new enchant.DomManager(node, 'div');
            }
        }
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.DomLayer._attachDomManager(child, onchildadded, onchildremoved);
            node._domManager.addManager(child._domManager, null);
        }
    }
};

enchant.DomLayer._detachDomManager = function(node, onchildadded, onchildremoved) {
    var child;
    node.removeEventListener('childadded', onchildadded);
    node.removeEventListener('childremoved', onchildremoved);
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            node._domManager.removeManager(child._domManager, null);
            enchant.DomLayer._detachDomManager(child, onchildadded, onchildremoved);
        }
    }
    node._domManager.remove();
    delete node._domManager;
};

/**
 * @scope enchant.CanvasLayer.prototype
 */
enchant.CanvasLayer = enchant.Class.create(enchant.Group, {
    /**
     * @name enchant.CanvasLayer
     * @class
     * Canvas を用いた描画を行うクラス.
     * 子を Canvas を用いた描画に切り替えるクラス.
     * @constructs
     * @extends enchant.Group
     */
    initialize: function() {
        var core = enchant.Core.instance;

        enchant.Group.call(this);

        this._cvsCache = {
            matrix: [1, 0, 0, 1, 0, 0],
            detectColor: '#000000'
        };
        this._cvsCache.layer = this;

        this._element = document.createElement('canvas');
        this._element.style.position = 'absolute';
        // issue 179
        this._element.style.left = this._element.style.top = '0px';

        this._detect = document.createElement('canvas');
        this._detect.style.position = 'absolute';
        this._lastDetected = 0;

        this.context = this._element.getContext('2d');
        this._dctx = this._detect.getContext('2d');
        this._setImageSmoothingEnable();

        this._colorManager = new enchant.DetectColorManager(16, 256);

        this.width = core.width;
        this.height = core.height;

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this._scene) {
                    this._scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var self = e.target;
            var layer;
            if (self instanceof enchant.CanvasLayer) {
                layer = self._scene._layers.Canvas;
            } else {
                layer = self.scene._layers.Canvas;
            }
            enchant.CanvasLayer._attachCache(child, layer, __onchildadded, __onchildremoved);
            var render = new enchant.Event(enchant.Event.RENDER);
            if (self._dirty) {
                self._updateCoordinate();
            }
            child._dirty = true;
            enchant.Matrix.instance.stack.push(self._matrix);
            enchant.CanvasRenderer.instance.render(layer.context, child, render);
            enchant.Matrix.instance.stack.pop(self._matrix);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            var layer;
            if (self instanceof enchant.CanvasLayer) {
                layer = self._scene._layers.Canvas;
            } else {
                layer = self.scene._layers.Canvas;
            }
            enchant.CanvasLayer._detachCache(child, layer, __onchildadded, __onchildremoved);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

    },
    /**
     * CanvasLayerの横幅.
     * @type Number
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._element.width = this._detect.width = width;
            this._setImageSmoothingEnable();
        }
    },
    /**
     * CanvasLayerの高さ.
     * @type Number
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._element.height = this._detect.height = height;
            this._setImageSmoothingEnable();
        }
    },
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        childAdded.next = null;
        this.dispatchEvent(childAdded);
        node.dispatchEvent(new enchant.Event('added'));
    },
    insertBefore: function(node, reference) {
        var i = this.childNodes.indexOf(reference);
        if (i !== -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = reference;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
        } else {
            this.addChild(node);
        }
    },
    /**
     * レンダリングを開始する.
     * @private
     */
    _startRendering: function() {
        this.addEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    /**
     * レンダリングを停止する.
     * @private
     */
    _stopRendering: function() {
        this.removeEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _onexitframe: function() {
        var core = enchant.Core.instance;
        var ctx = this.context;
        ctx.clearRect(0, 0, core.width, core.height);
        var render = new enchant.Event(enchant.Event.RENDER);
        enchant.CanvasRenderer.instance.render(ctx, this, render);
    },
    _determineEventTarget: function(e) {
        return this._getEntityByPosition(e.x, e.y);
    },
    _getEntityByPosition: function(x, y) {
        var core = enchant.Core.instance;
        var ctx = this._dctx;
        if (this._lastDetected < core.frame) {
            ctx.clearRect(0, 0, this.width, this.height);
            enchant.CanvasRenderer.instance.detectRender(ctx, this);
            this._lastDetected = core.frame;
        }
        var extra = enchant.ENV.COLOR_DETECTION_LEVEL - 1;
        var rgba = ctx.getImageData(x - extra, y - extra, 1 + extra * 2, 1 + extra * 2).data;
        return this._colorManager.getSpriteByColors(rgba);
    },
    _setImageSmoothingEnable: function() {
        this._dctx.imageSmoothingEnabled =
                this._dctx.msImageSmoothingEnabled =
                this._dctx.mozImageSmoothingEnabled =
                this._dctx.webkitImageSmoothingEnabled = false;
    }
});

enchant.CanvasLayer._attachCache = function(node, layer, onchildadded, onchildremoved) {
    var child;
    if (!node._cvsCache) {
        node._cvsCache = {};
        node._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
        node._cvsCache.detectColor = 'rgba(' + layer._colorManager.attachDetectColor(node) + ')';
        node.addEventListener('childadded', onchildadded);
        node.addEventListener('childremoved', onchildremoved);
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._attachCache(child, layer, onchildadded, onchildremoved);
        }
    }
};

enchant.CanvasLayer._detachCache = function(node, layer, onchildadded, onchildremoved) {
    var child;
    if (node._cvsCache) {
        layer._colorManager.detachDetectColor(node);
        node.removeEventListener('childadded', onchildadded);
        node.removeEventListener('childremoved', onchildremoved);
        delete node._cvsCache;
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._detachCache(child, layer, onchildadded, onchildremoved);
        }
    }
};

enchant.CanvasRenderer = enchant.Class.create({
    render: function(ctx, node, e) {
        var width, height, child;
        ctx.save();
        node.dispatchEvent(e);
        // transform
        this.transform(ctx, node);
        if (typeof node._visible === 'undefined' || node._visible) {
            width = node.width;
            height = node.height;
            // composite
            if (node.compositeOperation) {
                ctx.globalCompositeOperation = node.compositeOperation;
            }
            ctx.globalAlpha = (typeof node._opacity === 'number') ? node._opacity : 1.0;
            // render
            if (node._backgroundColor) {
                ctx.fillStyle = node._backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }

            if (node.cvsRender) {
                node.cvsRender(ctx);
            }

            if (enchant.Core.instance._debug && node._debugColor) {
                ctx.strokeStyle = node._debugColor;
                ctx.strokeRect(0, 0, width, height);
            }
            if (node._clipping) {
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                ctx.clip();
            }
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    child = node.childNodes[i];
                    this.render(ctx, child, e);
                }
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    detectRender: function(ctx, node) {
        var width, height, child;
        if (typeof node._visible === 'undefined' || node._visible) {
            width = node.width;
            height = node.height;
            ctx.save();
            this.transform(ctx, node);
            ctx.fillStyle = node._cvsCache.detectColor;
            if (node._touchEnabled) {
                if (node.detectRender) {
                    node.detectRender(ctx);
                } else {
                    ctx.fillRect(0, 0, width, height);
                }
            }
            if (node._clipping) {
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                ctx.clip();
            }
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    child = node.childNodes[i];
                    this.detectRender(ctx, child);
                }
            }
            ctx.restore();
            enchant.Matrix.instance.stack.pop();
        }
    },
    transform: function(ctx, node) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var newmat, ox, oy, vec;
        if (node._dirty) {
            matrix.makeTransformMatrix(node, node._cvsCache.matrix);
            newmat = [];
            matrix.multiply(stack[stack.length - 1], node._cvsCache.matrix, newmat);
            node._matrix = newmat;
            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
            vec = [ ox, oy ];
            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        } else {
            newmat = node._matrix;
        }
        stack.push(newmat);
        ctx.setTransform.apply(ctx, newmat);
    }
});
enchant.CanvasRenderer.instance = new enchant.CanvasRenderer();

/**
 * @scope enchant.Scene.prototype
 */
enchant.Scene = enchant.Class.create(enchant.Group, {
    /**
     * @name enchant.Scene
     * @class
     * 表示オブジェクトツリーのルートになるクラス.
     * シーンはレイヤーを持っていて, 子として追加されたオブジェクト ({@link Entity}) は描画方法に応じてレイヤーに振り分けられる.
     * Scene クラスは最も汎用的なシーンの実装で, ({@link enchant.DOMLayer} と {@link enchant.CanvasLayer}) を持っており,
     * それぞれ DOM, Canvas を用いて描画される. 描画順は DOM が手前, Canvas が奥で,
     * 各レイヤーの間では新しく追加されたオブジェクトほど手前に表示される.
     * Scene クラスを継承することで, 新しい種類の Layer を持つシーンクラスを作ることができる.
     *
     * @example
     * var scene = new Scene();
     * scene.addChild(player);
     * scene.addChild(enemy);
     * core.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
     */
    initialize: function() {
        var core = enchant.Core.instance;

        // Call initialize method of enchant.Group
        enchant.Group.call(this);

        // All nodes (entities, groups, scenes) have reference to the scene that it belongs to.
        this.scene = this;

        this._backgroundColor = null;

        // Create div tag which possesses its layers
        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';

        this._layers = {};
        this._layerPriority = [];

        this.addEventListener(enchant.Event.CHILD_ADDED, this._onchildadded);
        this.addEventListener(enchant.Event.CHILD_REMOVED, this._onchildremoved);
        this.addEventListener(enchant.Event.ENTER, this._onenter);
        this.addEventListener(enchant.Event.EXIT, this._onexit);

        var that = this;
        this._dispatchExitframe = function() {
            var layer;
            for (var prop in that._layers) {
                layer = that._layers[prop];
                layer.dispatchEvent(new enchant.Event(enchant.Event.EXIT_FRAME));
            }
        };

        this.addEventListener(enchant.Event.CORE_RESIZE, this._oncoreresize);

        this._oncoreresize(core);
    },
    /**#nocode+*/
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            this._x = x;
            for (var type in this._layers) {
                this._layers[type].x = x;
            }
        }
    },
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            this._y = y;
            for (var type in this._layers) {
                this._layers[type].y = y;
            }
        }
    },
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            for (var type in this._layers) {
                this._layers[type].width = width;
            }
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            for (var type in this._layers) {
                this._layers[type].height = height;
            }
        }
    },
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            for (var type in this._layers) {
                this._layers[type].rotation = rotation;
            }
        }
    },
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            for (var type in this._layers) {
                this._layers[type].scaleX = scaleX;
            }
        }
    },
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            for (var type in this._layers) {
                this._layers[type].scaleY = scaleY;
            }
        }
    },
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = this._element.style.backgroundColor = color;
        }
    },
    remove: function() {
        this.clearEventListener();

        while (this.childNodes.length > 0) {
            this.childNodes[0].remove();
        }

        return enchant.Core.instance.removeScene(this);
    },
    /**#nocode-*/
    _oncoreresize: function(e) {
        this._element.style.width = e.width + 'px';
        this.width = e.width;
        this._element.style.height = e.height + 'px';
        this.height = e.height;
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + e.scale + ')';

        for (var type in this._layers) {
            this._layers[type].dispatchEvent(e);
        }
    },
    addLayer: function(type, i) {
        var core = enchant.Core.instance;
        if (this._layers[type]) {
            return;
        }
        var layer = new enchant[type + 'Layer']();
        if (core.currentScene === this) {
            layer._startRendering();
        }
        this._layers[type] = layer;
        var element = layer._element;
        if (typeof i === 'number') {
            var nextSibling = this._element.childNodes[i];
            if (nextSibling) {
                this._element.insertBefore(element, nextSibling);
            } else {
                this._element.appendChild(element);
            }
            this._layerPriority.splice(i, 0, type);
        } else {
            this._element.appendChild(element);
            this._layerPriority.push(type);
        }
        layer._scene = this;
    },
    _determineEventTarget: function(e) {
        var layer, target;
        for (var i = this._layerPriority.length - 1; i >= 0; i--) {
            layer = this._layers[this._layerPriority[i]];
            target = layer._determineEventTarget(e);
            if (target) {
                break;
            }
        }
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        var target, i;
        if (child._element) {
            target = 'Dom';
            i = 1;
        } else {
            target = 'Canvas';
            i = 0;
        }
        if (!this._layers[target]) {
            this.addLayer(target, i);
        }
        child._layer = this._layers[target];
        this._layers[target].insertBefore(child, next);
        child.parentNode = this;
    },
    _onchildremoved: function(e) {
        var child = e.node;
        child._layer.removeChild(child);
        child._layer = null;
    },
    _onenter: function() {
        for (var type in this._layers) {
            this._layers[type]._startRendering();
        }
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        for (var type in this._layers) {
            this._layers[type]._stopRendering();
        }
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});

/**
 * @scope enchant.LoadingScene.prototype
 */
enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
    /**
     * @name enchant.LoadingScene
     * @class
     * デフォルトのローディングシーン. ローディングアニメーションを書き換えたい場合は,
     * enchant.LoadingSceneを上書きする.
     *
     * @example
     * enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
     *     initialize: function() {
     *         enchant.Scene.call(this);
     *         this.backgroundColor = 'red';
     *         // ...
     *         this.addEventListener('progress', function(e) {
     *             progress = e.loaded / e.total;
     *         });
     *         this.addEventListener('enterframe', function() {
     *             // animation
     *         });
     *     }
     * });
     * @constructs
     * @extends enchant.Scene
     */
    initialize: function() {
        enchant.Scene.call(this);
        this.backgroundColor = '#000';
        var barWidth = this.width * 0.4 | 0;
        var barHeight = this.width * 0.05 | 0;
        var border = barWidth * 0.03 | 0;
        var bar = new enchant.Sprite(barWidth, barHeight);
        bar.disableCollection();
        bar.x = (this.width - barWidth) / 2;
        bar.y = (this.height - barHeight) / 2;
        var image = new enchant.Surface(barWidth, barHeight);
        image.context.fillStyle = '#fff';
        image.context.fillRect(0, 0, barWidth, barHeight);
        image.context.fillStyle = '#000';
        image.context.fillRect(border, border, barWidth - border * 2, barHeight - border * 2);
        bar.image = image;
        var progress = 0, _progress = 0;
        this.addEventListener('progress', function(e) {
            // avoid #167 https://github.com/wise9/enchant.js/issues/177
            progress = e.loaded / e.total * 1.0;
        });
        bar.addEventListener('enterframe', function() {
            _progress *= 0.9;
            _progress += progress * 0.1;
            image.context.fillStyle = '#fff';
            image.context.fillRect(border, 0, (barWidth - border * 2) * _progress, barHeight);
        });
        this.addChild(bar);
        this.addEventListener('load', function(e) {
            var core = enchant.Core.instance;
            core.removeScene(core.loadingScene);
            core.dispatchEvent(e);
        });
    }
});

/**
 * @scope enchant.CanvasScene.prototype
 */
enchant.CanvasScene = enchant.Class.create(enchant.Scene, {
    /**
     * @name enchant.CanvasScene
     * @class
     * すべての子をCanvasに描画するScene.
     * @constructs
     * @extends enchant.Scene
     */
    initialize: function() {
        enchant.Scene.call(this);
        this.addLayer('Canvas');
    },
    _determineEventTarget: function(e) {
        var target = this._layers.Canvas._determineEventTarget(e);
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        child._layer = this._layers.Canvas;
        this._layers.Canvas.insertBefore(child, next);
    },
    _onenter: function() {
        this._layers.Canvas._startRendering();
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Canvas._stopRendering();
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});

/**
 * @scope enchant.DOMScene.prototype
 */
enchant.DOMScene = enchant.Class.create(enchant.Scene, {
    /**
     * @name enchant.DOMScene
     * @class
     * すべての子をDOMで描画するScene.
     * @constructs
     * @extends enchant.Scene
     */
    initialize: function() {
        enchant.Scene.call(this);
        this.addLayer('Dom');
    },
    _determineEventTarget: function(e) {
        var target = this._layers.Dom._determineEventTarget(e);
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        child._layer = this._layers.Dom;
        this._layers.Dom.insertBefore(child, next);
    },
    _onenter: function() {
        this._layers.Dom._startRendering();
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Dom._stopRendering();
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});

/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Surface
     * @class
     * canvas要素をラップしたクラス.
     *
     * {@link enchant.Sprite} や {@link enchant.Map} のimageプロパティに設定して表示させることができる.
     * Canvas APIにアクセスしたいときは {@link enchant.Surface#context} プロパティを用いる.
     *
     * @example
     * // 円を表示するSpriteを作成する
     * var ball = new Sprite(50, 50);
     * var surface = new Surface(50, 50);
     * surface.context.beginPath();
     * surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     * surface.context.fill();
     * ball.image = surface;
     *
     * @param {Number} width Surfaceの横幅.
     * @param {Number} height Surfaceの高さ.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var core = enchant.Core.instance;

        /**
         * Surfaceの横幅.
         * @type Number
         */
        this.width = Math.ceil(width);
        /**
         * Surfaceの高さ.
         * @type Number
         */
        this.height = Math.ceil(height);
        /**
         * Surfaceの描画コンテクスト.
         * @type CanvasRenderingContext2D
         */
        this.context = null;

        var id = 'enchant-surface' + core._surfaceID++;
        if (document.getCSSCanvasContext) {
            this.context = document.getCSSCanvasContext('2d', id, width, height);
            this._element = this.context.canvas;
            this._css = '-webkit-canvas(' + id + ')';
            var context = this.context;
        } else if (document.mozSetImageElement) {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._css = '-moz-element(#' + id + ')';
            this.context = this._element.getContext('2d');
            document.mozSetImageElement(id, this._element);
        } else {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';
            this.context = this._element.getContext('2d');

            enchant.ENV.CANVAS_DRAWING_METHODS.forEach(function(name) {
                var method = this.context[name];
                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                };
            }, this);
        }
    },
    /**
     * Surfaceから1ピクセル取得する.
     * @param {Number} x 取得するピクセルのx座標.
     * @param {Number} y 取得するピクセルのy座標.
     * @return {Number[]} ピクセルの情報を[r, g, b, a]の形式で持つ配列.
     */
    getPixel: function(x, y) {
        return this.context.getImageData(x, y, 1, 1).data;
    },
    /**
     * Surfaceに1ピクセル設定する.
     * @param {Number} x 設定するピクセルのx座標.
     * @param {Number} y 設定するピクセルのy座標.
     * @param {Number} r 設定するピクセルのrの値.
     * @param {Number} g 設定するピクセルのgの値.
     * @param {Number} b 設定するピクセルのbの値.
     * @param {Number} a 設定するピクセルの透明度.
     */
    setPixel: function(x, y, r, g, b, a) {
        var pixel = this.context.createImageData(1, 1);
        pixel.data[0] = r;
        pixel.data[1] = g;
        pixel.data[2] = b;
        pixel.data[3] = a;
        this.context.putImageData(pixel, x, y);
    },
    /**
     * Surfaceの全ピクセルをクリアし透明度0の黒に設定する.
     */
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    /**
     * Surfaceに対して引数で指定されたSurfaceを描画する.
     *
     * Canvas APIのdrawImageをラップしており, 描画する矩形を同様の形式で指定できる.
     *
     * @example
     * var src = core.assets['src.gif'];
     * var dst = new Surface(100, 100);
     * dst.draw(src);         // ソースを(0, 0)に描画
     * dst.draw(src, 50, 50); // ソースを(50, 50)に描画
     * // ソースを(50, 50)に縦横30ピクセル分だけ描画
     * dst.draw(src, 50, 50, 30, 30);
     * // ソースの(10, 10)から縦横40ピクセルの領域を(50, 50)に縦横30ピクセルに縮小して描画
     * dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image 描画に用いるSurface.
     */
    draw: function(image) {
        image = image._element;
        if (arguments.length === 1) {
            this.context.drawImage(image, 0, 0);
        } else {
            var args = arguments;
            args[0] = image;
            this.context.drawImage.apply(this.context, args);
        }
    },
    /**
     * Surfaceを複製する.
     * @return {enchant.Surface} 複製されたSurface.
     */
    clone: function() {
        var clone = new enchant.Surface(this.width, this.height);
        clone.draw(this);
        return clone;
    },
    /**
     * SurfaceからdataスキームのURLを生成する.
     * @return {String} Surfaceを表すdataスキームのURL.
     */
    toDataURL: function() {
        var src = this._element.src;
        if (src) {
            if (src.slice(0, 5) === 'data:') {
                return src;
            } else {
                return this.clone().toDataURL();
            }
        } else {
            return this._element.toDataURL();
        }
    }
});

/**
 * 画像ファイルを読み込んでSurfaceオブジェクトを作成する.
 *
 * このメソッドによって作成されたSurfaceはimg要素をラップしており {@link enchant.Surface#context} プロパティに
 * アクセスしたり {@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel},
 * {@link enchant.Surface#setPixel} メソッドなどの呼び出しでCanvas APIを使った画像操作を行うことはできない.
 * ただし{@link enchant.Surface#draw} メソッドの引数とすることはでき,
 * ほかのSurfaceに描画した上で画像操作を行うことはできる(クロスドメインでロードした
 * 場合はピクセルを取得するなど画像操作の一部が制限される).
 *
 * @param {String} src ロードする画像ファイルのパス.
 * @param {Function} callback ロード完了時のコールバック.
 * @param {Function} [onerror] ロード失敗時のコールバック.
 * @static
 * @return {enchant.Surface} Surface
 */
enchant.Surface.load = function(src, callback, onerror) {
    var image = new Image();
    var surface = Object.create(enchant.Surface.prototype, {
        context: { value: null },
        _css: { value: 'url(' + src + ')' },
        _element: { value: image }
    });
    enchant.EventTarget.call(surface);
    onerror = onerror || function() {};
    surface.addEventListener('load', callback);
    surface.addEventListener('error', onerror);
    image.onerror = function() {
        var e = new enchant.Event(enchant.Event.ERROR);
        e.message = 'Cannot load an asset: ' + image.src;
        enchant.Core.instance.dispatchEvent(e);
        surface.dispatchEvent(e);
    };
    image.onload = function() {
        surface.width = image.width;
        surface.height = image.height;
        surface.dispatchEvent(new enchant.Event('load'));
    };
    image.src = src;
    return surface;
};
enchant.Surface._staticCanvas2DContext = document.createElement('canvas').getContext('2d');

enchant.Surface._getPattern = function(surface, force) {
    if (!surface._pattern || force) {
        surface._pattern = this._staticCanvas2DContext.createPattern(surface._element, 'repeat');
    }
    return surface._pattern;
};

if (window.Deferred) {
    enchant.Deferred = window.Deferred;
} else {
    /**
     * @scope enchant.Deferred.prototype
     */
    enchant.Deferred = enchant.Class.create({
        /**
         * @name enchant.Deferred
         * @class
         * 非同期処理を扱うためのクラス.
         * jsdeferredのAPIを模倣している.
         * jQuery.Deferredとの互換性はない.
         * <br/>
         * See: <a href="http://cho45.stfuawsc.com/jsdeferred/">
         * http://cho45.stfuawsc.com/jsdeferred/</a>
         *
         * @example
         * enchant.Deferred
         *     .next(function() {
         *         return 42;
         *     })
         *     .next(function(n) {
         *         console.log(n); // 42
         *     })
         *     .next(function() {
         *         return core.load('img.png'); // wait loading
         *     })
         *     .next(function() {
         *         var img = core.assets['img.png'];
         *         console.log(img instanceof enchant.Surface); // true
         *         throw new Error('!!!');
         *     })
         *     .next(function() {
         *         // skip
         *     })
         *     .error(function(err) {
         *          console.log(err.message); // !!!
         *     });
         *
         * @constructs
         */
        initialize: function() {
            this._succ = this._fail = this._next = this._id = null;
            this._tail = this;
        },
        /**
         * 後続の処理を追加する.
         * @param {Function} func 追加する処理.
         */
        next: function(func) {
            var q = new enchant.Deferred();
            q._succ = func;
            return this._add(q);
        },
        /**
         * エラー処理を追加する.
         * @param {Function} func 追加するエラー処理.
         */
        error: function(func) {
            var q = new enchant.Deferred();
            q._fail = func;
            return this._add(q);
        },
        _add: function(queue) {
            this._tail._next = queue;
            this._tail = queue;
            return this;
        },
        /**
         * 値を伝播させる.
         * @param {*} arg 次の処理に渡す値.
         */
        call: function(arg) {
            var received;
            var queue = this;
            while (queue && !queue._succ) {
                queue = queue._next;
            }
            if (!(queue instanceof enchant.Deferred)) {
                return;
            }
            try {
                received = queue._succ(arg);
            } catch (e) {
                return queue.fail(e);
            }
            if (received instanceof enchant.Deferred) {
                enchant.Deferred._insert(queue, received);
            } else if (queue._next instanceof enchant.Deferred) {
                queue._next.call(received);
            }
        },
        /**
         * エラーを伝播させる.
         * @param {*} arg エラーとして伝播させる値.
         */
        fail: function(arg) {
            var result, err,
                queue = this;
            while (queue && !queue._fail) {
                queue = queue._next;
            }
            if (queue instanceof enchant.Deferred) {
                result = queue._fail(arg);
                queue.call(result);
            } else if (arg instanceof Error) {
                throw arg;
            } else {
                err = new Error('failed in Deferred');
                err.arg = arg;
                throw err;
            }
        }
    });
    enchant.Deferred._insert = function(queue, ins) {
        if (queue._next instanceof enchant.Deferred) {
            ins._tail._next = queue._next;
        }
        queue._next = ins;
    };
    /**
     * タイマーで起動するDeferredオブジェクトを生成する.
     * @param {Function} func
     * @return {enchant.Deferred} 生成されたDeferredオブジェクト.
     * @static
     */
    enchant.Deferred.next = function(func) {
        var q = new enchant.Deferred().next(func);
        q._id = setTimeout(function() { q.call(); }, 0);
        return q;
    };
    /**
     * 複数のDeferredオブジェクトを待つDeferredオブジェクトを生成する.
     * @param {Object|enchant.Deferred[]} arg
     * @return {enchant.Deferred} 生成されたDeferredオブジェクト.
     *
     * @example
     * // array
     * enchant.Deferred
     *     .parallel([
     *         enchant.Deferred.next(function() {
     *             return 24;
     *         }),
     *         enchant.Deferred.next(function() {
     *             return 42;
     *         })
     *     ])
     *     .next(function(arg) {
     *         console.log(arg); // [ 24, 42 ]
     *     });
     * // object
     * enchant.Deferred
     *     .parallel({
     *         foo: enchant.Deferred.next(function() {
     *             return 24;
     *         }),
     *         bar: enchant.Deferred.next(function() {
     *             return 42;
     *         })
     *     })
     *     .next(function(arg) {
     *         console.log(arg.foo); // 24
     *         console.log(arg.bar); // 42
     *     });
     *
     * @static
     */
    enchant.Deferred.parallel = function(arg) {
        var q = new enchant.Deferred();
        q._id = setTimeout(function() { q.call(); }, 0);
        var progress = 0;
        var ret = (arg instanceof Array) ? [] : {};
        var p = new enchant.Deferred();
        for (var prop in arg) {
            if (arg.hasOwnProperty(prop)) {
                progress++;
                /*jshint loopfunc:true */
                (function(queue, name) {
                    queue.next(function(arg) {
                        progress--;
                        ret[name] = arg;
                        if (progress <= 0) {
                            p.call(ret);
                        }
                    })
                    .error(function(err) { p.fail(err); });
                    if (typeof queue._id === 'number') {
                        clearTimeout(queue._id);
                    }
                    queue._id = setTimeout(function() { queue.call(); }, 0);
                }(arg[prop], prop));
            }
        }
        if (!progress) {
            p._id = setTimeout(function() { p.call(ret); }, 0);
        }
        return q.next(function() { return p; });
    };
}

/**
 * @scope enchant.DOMSound.prototype
 */
enchant.DOMSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.DOMSound
     * @class
     * audio要素をラップしたクラス.
     *
     * MP3ファイルの再生はSafari, Chrome, Firefox, Opera, IEが対応
     * (Firefox, OperaではFlashを経由して再生). WAVEファイルの再生は
     * Safari, Chrome, Firefox, Operaが対応している. ブラウザが音声ファイル
     * のコーデックに対応していない場合は再生されない.
     *
     * コンストラクタではなく {@link enchant.DOMSound.load} を通じてインスタンスを作成する.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);
        /**
         * Soundの再生時間 (秒).
         * @type Number
         */
        this.duration = 0;
        throw new Error("Illegal Constructor");
    },
    /**
     * 再生を開始する.
     */
    play: function() {
        if (this._element) {
            this._element.play();
        }
    },
    /**
     * 再生を中断する.
     */
    pause: function() {
        if (this._element) {
            this._element.pause();
        }
    },
    /**
     * 再生を停止する.
     */
    stop: function() {
        this.pause();
        this.currentTime = 0;
    },
    /**
     * Soundを複製する.
     * @return {enchant.DOMSound} 複製されたSound.
     */
    clone: function() {
        var clone;
        if (this._element instanceof Audio) {
            clone = Object.create(enchant.DOMSound.prototype, {
                _element: { value: this._element.cloneNode(false) },
                duration: { value: this.duration }
            });
        } else if (enchant.ENV.USE_FLASH_SOUND) {
            return this;
        } else {
            clone = Object.create(enchant.DOMSound.prototype);
        }
        enchant.EventTarget.call(clone);
        return clone;
    },
    /**
     * 現在の再生位置 (秒).
     * @type Number
     */
    currentTime: {
        get: function() {
            return this._element ? this._element.currentTime : 0;
        },
        set: function(time) {
            if (this._element) {
                this._element.currentTime = time;
            }
        }
    },
    /**
     * ボリューム. 0 (無音) ～ 1 (フルボリューム).
     * @type Number
     */
    volume: {
        get: function() {
            return this._element ? this._element.volume : 1;
        },
        set: function(volume) {
            if (this._element) {
                this._element.volume = volume;
            }
        }
    }
});

/**
 * 音声ファイルを読み込んでDOMSoundオブジェクトを作成する.
 * @param {String} src ロードする音声ファイルのパス.
 * @param {String} [type] 音声ファイルのMIME Type.
 * @param {Function} [callback] ロード完了時のコールバック.
 * @param {Function} [onerror] ロード失敗時のコールバック.
 * @return {enchant.DOMSound} DOMSound
 * @static
 */
enchant.DOMSound.load = function(src, type, callback, onerror) {
    if (type == null) {
        var ext = enchant.Core.findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');
    callback = callback || function() {};
    onerror = onerror || function() {};

    var sound = Object.create(enchant.DOMSound.prototype);
    enchant.EventTarget.call(sound);
    sound.addEventListener('load', callback);
    sound.addEventListener('error', onerror);
    var audio = new Audio();
    if (!enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI &&
        enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
        window.setTimeout(function() {
            sound.dispatchEvent(new enchant.Event('load'));
        }, 0);
    } else {
        if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
            audio.addEventListener('canplaythrough', function canplay() {
                sound.duration = audio.duration;
                sound.dispatchEvent(new enchant.Event('load'));
                audio.removeEventListener('canplaythrough', canplay);
            }, false);
            audio.src = src;
            audio.load();
            audio.autoplay = false;
            audio.onerror = function() {
                var e = new enchant.Event(enchant.Event.ERROR);
                e.message = 'Cannot load an asset: ' + audio.src;
                enchant.Core.instance.dispatchEvent(e);
                sound.dispatchEvent(e);
            };
            sound._element = audio;
        } else if (type === 'audio/mpeg') {
            var embed = document.createElement('embed');
            var id = 'enchant-audio' + enchant.Core.instance._soundID++;
            embed.width = embed.height = 1;
            embed.name = id;
            embed.src = 'sound.swf?id=' + id + '&src=' + src;
            embed.allowscriptaccess = 'always';
            embed.style.position = 'absolute';
            embed.style.left = '-1px';
            sound.addEventListener('load', function() {
                Object.defineProperties(embed, {
                    currentTime: {
                        get: function() {
                            return embed.getCurrentTime();
                        },
                        set: function(time) {
                            embed.setCurrentTime(time);
                        }
                    },
                    volume: {
                        get: function() {
                            return embed.getVolume();
                        },
                        set: function(volume) {
                            embed.setVolume(volume);
                        }
                    }
                });
                sound._element = embed;
                sound.duration = embed.getDuration();
            });
            enchant.Core.instance._element.appendChild(embed);
            enchant.DOMSound[id] = sound;
        } else {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        }
    }
    return sound;
};

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;

/**
 * @scope enchant.WebAudioSound.prototype
 */
enchant.WebAudioSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.WebAudioSound
     * @class
     * WebAudioをラップしたクラス.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        if (!window.AudioContext) {
            throw new Error("This browser does not support WebAudio API.");
        }
        enchant.EventTarget.call(this);
        if (!enchant.WebAudioSound.audioContext) {
          enchant.WebAudioSound.audioContext = new window.AudioContext();
          enchant.WebAudioSound.destination = enchant.WebAudioSound.audioContext.destination;
        }
        this.context = enchant.WebAudioSound.audioContext;
        this.src = this.context.createBufferSource();
        this.buffer = null;
        this._volume = 1;
        this._currentTime = 0;
        this._state = 0;
        this.connectTarget = enchant.WebAudioSound.destination;
    },
    /**
     * 再生を開始する.
     * @param {Boolean} [dup=false] trueならオブジェクトの現在の再生を残したまま新しく音声を再生する.
     */
    play: function(dup) {
        if (this._state === 1 && !dup) {
            this.src.disconnect();
        }
        if (this._state !== 2) {
            this._currentTime = 0;
        }
        var offset = this._currentTime;
        var actx = this.context;
        this.src = actx.createBufferSource();
        if (actx.createGain != null) {
            this._gain = actx.createGain();
        } else {
            this._gain = actx.createGainNode();
        }
        this.src.buffer = this.buffer;
        this._gain.gain.value = this._volume;

        this.src.connect(this._gain);
        this._gain.connect(this.connectTarget);
        if (this.src.start != null) {
            this.src.start(0, offset, this.buffer.duration - offset - 1.192e-7);
        } else {
            this.src.noteGrainOn(0, offset, this.buffer.duration - offset - 1.192e-7);
        }
        this._startTime = actx.currentTime - this._currentTime;
        this._state = 1;
    },
    /**
     * 再生を中断する.
     */
    pause: function() {
        var currentTime = this.currentTime;
        if (currentTime === this.duration) {
            return;
        }
        if (this.src.stop != null) {
            this.src.stop(0);
        } else {
            this.src.noteOff(0);
        }
        this._currentTime = currentTime;
        this._state = 2;
    },
    /**
     * 再生を停止する.
     */
    stop: function() {
        if (this.src.stop != null) {
            this.src.stop(0);
        } else {
            this.src.noteOff(0);
        }
        this._state = 0;
    },
    /**
     * Soundを複製する.
     * @return {enchant.WebAudioSound} 複製されたSound.
     */
    clone: function() {
        var sound = new enchant.WebAudioSound();
        sound.buffer = this.buffer;
        return sound;
    },
    /**
     * Soundの再生時間 (秒).
     * @type Number
     */
    duration: {
        get: function() {
            if (this.buffer) {
                return this.buffer.duration;
            } else {
                return 0;
            }
        }
    },
    /**
     * ボリューム. 0 (無音) ～ 1 (フルボリューム).
     * @type Number
     */
    volume: {
        get: function() {
            return this._volume;
        },
        set: function(volume) {
            volume = Math.max(0, Math.min(1, volume));
            this._volume = volume;
            if (this.src) {
                this._gain.gain.value = volume;
            }
        }
    },
    /**
     * 現在の再生位置 (秒).
     * @type Number
     */
    currentTime: {
        get: function() {
            return Math.max(0, Math.min(this.duration, this.src.context.currentTime - this._startTime));
        },
        set: function(time) {
            this._currentTime = time;
            if (this._state !== 2) {
                this.play(false);
            }
        }
    }
});

/**
 * 音声ファイルを読み込んでWebAudioSoundオブジェクトを作成する.
 * @param {String} src ロードする音声ファイルのパス.
 * @param {String} [type] 音声ファイルのMIME Type.
 * @param {Function} [callback] ロード完了時のコールバック.
 * @param {Function} [onerror] ロード失敗時のコールバック.
 * @return {enchant.WebAudioSound} WebAudioSound
 * @static
 */
enchant.WebAudioSound.load = function(src, type, callback, onerror) {
    var canPlay = (new Audio()).canPlayType(type);
    var sound = new enchant.WebAudioSound();
    callback = callback || function() {};
    onerror = onerror || function() {};
    sound.addEventListener(enchant.Event.LOAD, callback);
    sound.addEventListener(enchant.Event.ERROR, onerror);
    function dispatchErrorEvent() {
        var e = new enchant.Event(enchant.Event.ERROR);
        e.message = 'Cannot load an asset: ' + src;
        enchant.Core.instance.dispatchEvent(e);
        sound.dispatchEvent(e);
    }
    var actx, xhr;
    if (canPlay === 'maybe' || canPlay === 'probably') {
        actx = enchant.WebAudioSound.audioContext;
        xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            actx.decodeAudioData(xhr.response, function(buffer) {
                sound.buffer = buffer;
                sound.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
            }, dispatchErrorEvent);
        };
        xhr.onerror = dispatchErrorEvent;
        xhr.send(null);
    } else {
        setTimeout(dispatchErrorEvent,  50);
    }
    return sound;
};

enchant.Sound = window.AudioContext && enchant.ENV.USE_WEBAUDIO ? enchant.WebAudioSound : enchant.DOMSound;

/*
 * ============================================================================================
 * Easing Equations v2.0
 * September 1, 2003
 * (c) 2003 Robert Penner, all rights reserved.
 * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
 * ============================================================================================
 */

/**
 * @namespace
 * イージング関数ライブラリ.
 * {@link enchant.Easing} 以下にある関数は全て t(現在の時刻), b(初期値), c(変化後の値), d(値の変化にかける時間) の引数を取り, 指定した時刻に取る値を返す.
 * ActionScript で広く使われている Robert Penner による Easing Equations を JavaScript に移植した.
 * <br/>
 * See: <a href="http://www.robertpenner.com/easing/">
 * http://www.robertpenner.com/easing/</a>
 * <br/>
 * See: <a href="http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf">
 * http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf</a>
 */
enchant.Easing = {
    LINEAR: function(t, b, c, d) {
        return c * t / d + b;
    },

    SWING: function(t, b, c, d) {
        return c * (0.5 - Math.cos(((t / d) * Math.PI)) / 2) + b;
    },

    // *** quad
    QUAD_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },

    QUAD_EASEOUT: function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },

    QUAD_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },

    // *** cubic
    CUBIC_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },

    CUBIC_EASEOUT: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },

    CUBIC_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },

    // *** quart
    QUART_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },

    QUART_EASEOUT: function(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },

    QUART_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },

    // *** quint
    QUINT_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },

    QUINT_EASEOUT: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },

    QUINT_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },

    // *** sin
    SIN_EASEIN: function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    SIN_EASEOUT: function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    SIN_EASEINOUT: function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    // *** circ
    CIRC_EASEIN: function(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },

    CIRC_EASEOUT: function(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },

    CIRC_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },

    // *** elastic
    ELASTIC_EASEIN: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }

        if (!p) {
            p = d * 0.3;
        }

        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },

    ELASTIC_EASEOUT: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },

    ELASTIC_EASEINOUT: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },

    // *** bounce
    BOUNCE_EASEOUT: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    },

    BOUNCE_EASEIN: function(t, b, c, d) {
        return c - enchant.Easing.BOUNCE_EASEOUT(d - t, 0, c, d) + b;
    },

    BOUNCE_EASEINOUT: function(t, b, c, d) {
        if (t < d / 2) {
            return enchant.Easing.BOUNCE_EASEIN(t * 2, 0, c, d) * 0.5 + b;
        } else {
            return enchant.Easing.BOUNCE_EASEOUT(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }

    },

    // *** back
    BACK_EASEIN: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },

    BACK_EASEOUT: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },

    BACK_EASEINOUT: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },

    // *** expo
    EXPO_EASEIN: function(t, b, c, d) {
        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    EXPO_EASEOUT: function(t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },

    EXPO_EASEINOUT: function(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
};

/**
 * @scope enchant.ActionEventTarget.prototype
 */
enchant.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.ActionEventTarget
     * @class
     * timelineの {@link enchant.Action} クラス向けに拡張された {@link enchant.EventTarget} クラス.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.apply(this, arguments);
    },
    dispatchEvent: function(e) {
        var target = this.node ? this.node : this;

        e.target = target;
        e.localX = e.x - target._offsetX;
        e.localY = e.y - target._offsetY;

        if (this['on' + e.type] != null) {
            this['on' + e.type].call(target, e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(target, e);
            }
        }
    }
});

/**
 * @scope enchant.Timeline.prototype
 */
enchant.Timeline = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Timeline
     * @class
     * アニメーションを管理するためのクラス.
     *
     * 操作するノードひとつに対して, 必ずひとつのタイムラインが対応する.
     * タイムラインクラスは, 自身に様々なアクションを追加するメソッドを持っており,
     * これらを使うことで簡潔にアニメーションや様々な操作をすることができる.
     * タイムラインクラスはフレームとタイムのアニメーションができる.
     * @param {enchant.Node} node 操作の対象となるノード.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(node) {
        enchant.EventTarget.call(this);
        this.node = node;
        this.queue = [];
        this.paused = false;
        this.looped = false;
        this.isFrameBased = true;
        this._parallel = null;
        this._activated = false;
        this.addEventListener(enchant.Event.ENTER_FRAME, this._onenterframe);

        var tl = this;
        this._nodeEventListener = function(e) {
            tl.dispatchEvent(e);
        };
    },
    /**
     * @private
     */
    _deactivateTimeline: function() {
        if (this._activated) {
            this._activated = false;
            this.node.removeEventListener('enterframe', this._nodeEventListener);
        }
    },
    /**
     * @private
     */
    _activateTimeline: function() {
        if (!this._activated && !this.paused) {
            this.node.addEventListener("enterframe", this._nodeEventListener);
            this._activated = true;
        }
    },
    /**
     * @private
     */
    _onenterframe: function(evt) {
        if (this.paused) {
            return;
        }

        this.tick(this.isFrameBased ? 1 : evt.elapsed);
    },
    /**
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに一つの時間単位になる. （デフォルト）
     */
    setFrameBased: function() {
        this.isFrameBased = true;
    },
    /**
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに前のフレームから経過した時間になる.
     */
    setTimeBased: function() {
        this.isFrameBased = false;
    },
    /**
     * キューの先頭にあるアクションを終了し, 次のアクションへ移行する.
     * アクションの中から呼び出されるが, 外から呼び出すこともできる.
     *
     * アクション実行中に, アクションが終了した場合,
     * もう一度 tick() 関数が呼ばれるため, 1フレームに複数のアクションが処理される場合もある.
     *
     * @example
     * sprite.tl.then(function A(){ .. }).then(function B(){ .. });
     * // 最初のフレームで A・B の関数どちらも実行される.
     */
    next: function(remainingTime) {
        var e, action = this.queue.shift();

        if (action) {
            e = new enchant.Event("actionend");
            e.timeline = this;
            action.dispatchEvent(e);

            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);

            if (this.looped) {
                this.add(action);
            }
        }

        if (this.queue.length === 0) {
            this._deactivateTimeline();
            return;
        }

        if (remainingTime > 0 || (this.queue[0] && this.queue[0].time === 0)) {
            var event = new enchant.Event("actiontick");
            event.elapsed = remainingTime;
            event.timeline = this;
            this.queue[0].dispatchEvent(event);
        }
    },
    /**
     * Timelineの時間を進める.
     * (キューの先頭にあるアクションに対して, actionstart/actiontickイベントを発行する)
     * @param {Number} elapsed 経過させる時間.
     */
    tick: function(elapsed) {
        if (this.queue.length > 0) {
            var action = this.queue[0];
            if (action.frame === 0) {
                var f;
                f = new enchant.Event("actionstart");
                f.timeline = this;
                action.dispatchEvent(f);
            }

            var e = new enchant.Event("actiontick");
            e.timeline = this;
            e.elapsed = elapsed;
            action.dispatchEvent(e);
        }
    },
    /**
     * タイムラインにアクションを追加する.
     * @param {enchant.Action} action 追加するアクション.
     * @return {enchant.Timeline} 自身.
     */
    add: function(action) {
        this._activateTimeline();
        if (this._parallel) {
            this._parallel.actions.push(action);
            this._parallel = null;
        } else {
            this.queue.push(action);
        }
        action.frame = 0;

        var e = new enchant.Event("addedtotimeline");
        e.timeline = this;
        action.dispatchEvent(e);

        e = new enchant.Event("actionadded");
        e.action = action;
        this.dispatchEvent(e);

        return this;
    },
    /**
     * アクションを簡単に追加するためのメソッド.
     * 実体は {@link enchant.Timeline#add} のラッパ.
     * @param {Object} params アクションの設定オブジェクト.
     * @return {enchant.Timeline} 自身.
     */
    action: function(params) {
        return this.add(new enchant.Action(params));
    },
    /**
     * トゥイーンを簡単に追加するためのメソッド.
     * 実体は {@link enchant.Timeline#add} のラッパ.
     * @param {Object} params トゥイーンの設定オブジェクト.
     * @return {enchant.Timeline} 自身.
     */
    tween: function(params) {
        return this.add(new enchant.Tween(params));
    },
    /**
     * タイムラインのキューをすべて破棄する. 終了イベントは発行されない.
     * @return {enchant.Timeline} 自身.
     */
    clear: function() {
        var e = new enchant.Event("removedfromtimeline");
        e.timeline = this;

        for (var i = 0, len = this.queue.length; i < len; i++) {
            this.queue[i].dispatchEvent(e);
        }
        this.queue = [];
        this._deactivateTimeline();
        return this;
    },
    /**
     * タイムラインを早送りする.
     * 指定したフレーム数が経過したのと同様の処理を, 瞬時に実行する.
     * 巻き戻しはできない.
     * @param {Number} frames スキップするフレーム数.
     * @return {enchant.Timeline} 自身.
     */
    skip: function(frames) {
        var event = new enchant.Event("enterframe");
        if (this.isFrameBased) {
            event.elapsed = 1;
        } else {
            event.elapsed = frames;
            frames = 1;
        }
        while (frames--) {
            this.dispatchEvent(event);
        }
        return this;
    },
    /**
     * タイムラインの実行を一時停止する.
     * @return {enchant.Timeline} 自身.
     */
    pause: function() {
        if (!this.paused) {
            this.paused = true;
            this._deactivateTimeline();
        }
        return this;
    },
    /**
     * タイムラインの実行を再開する.
     * @return {enchant.Timeline} 自身.
     */
    resume: function() {
        if (this.paused) {
            this.paused = false;
            this._activateTimeline();
        }
        return this;
    },
    /**
     * タイムラインをループさせる.
     * ループしているときに終了したアクションは, タイムラインから取り除かれた後,
     * 再度タイムラインに追加される. このアクションは, ループが解除されても残る.
     * @return {enchant.Timeline} 自身.
     */
    loop: function() {
        this.looped = true;
        return this;
    },
    /**
     * タイムラインのループを解除する.
     * @return {enchant.Timeline} 自身.
     */
    unloop: function() {
        this.looped = false;
        return this;
    },
    /**
     * 指定したフレーム数だけ待ち, 何もしないアクションを追加する.
     * @param {Number} time 待機するフレーム数.
     * @return {enchant.Timeline} 自身.
     */
    delay: function(time) {
        return this.action({
            time: time
        });
    },
    /**
     * @ignore
     * @param {Number} time
     */
    wait: function(time) {
        // reserved
        return this;
    },
    /**
     * 関数を実行し, 即時に次のアクションに移るアクションを追加する.
     * @param {Function} func 実行する関数.
     * @return {enchant.Timeline} 自身.
     */
    then: function(func) {
        return this.action({
            onactiontick: function(evt) {
                func.call(this);
            },
            // if time is 0, next action will be immediately executed
            time: 0
        });
    },
    /**
     * 関数を実行し, 即時に次のアクションに移るアクションを追加する.
     * {@link enchant.Timeline#then} のシノニム.
     * @param {Function} func 実行する関数.
     * @return {enchant.Timeline} 自身.
     */
    exec: function(func) {
        return this.then(func);
    },
    /**
     * 実行したい関数を, フレーム数をキーとした連想配列(オブジェクト)で複数指定し追加する.
     * 内部的には {@link enchant.Timeline#delay}, {@link enchant.Timeline#then} を用いている.
     *
     * @example
     * sprite.tl.cue({
     *     10: function() {}, // 10フレーム経過した後に実行される関数
     *     20: function() {}, // 20フレーム経過した後に実行される関数
     *     30: function() {}  // 30フレーム経過した後に実行される関数
     * });
     *
     * @param {Object} cue キューオブジェクト.
     * @return {enchant.Timeline} 自身.
     */
    cue: function(cue) {
        var ptr = 0;
        for (var frame in cue) {
            if (cue.hasOwnProperty(frame)) {
                this.delay(frame - ptr);
                this.then(cue[frame]);
                ptr = frame;
            }
        }
        return this;
    },
    /**
     * ある関数を指定したフレーム数繰り返し実行するアクションを追加する.
     * @param {Function} func 実行したい関数.
     * @param {Number} time 持続フレーム数.
     * @return {enchant.Timeline} 自身.
     */
    repeat: function(func, time) {
        return this.action({
            onactiontick: function(evt) {
                func.call(this);
            },
            time: time
        });
    },
    /**
     * 複数のアクションを並列で実行したいときに指定する.
     * and で結ばれたすべてのアクションが終了するまで次のアクションには移行しない.
     *
     * @example
     * sprite.tl.fadeIn(30).and().rotateBy(360, 30);
     *
     * // 30フレームでフェードインしながら360度回転する.
     * @return {enchant.Timeline} 自身.
     */
    and: function() {
        var last = this.queue.pop();
        if (last instanceof enchant.ParallelAction) {
            this._parallel = last;
            this.queue.push(last);
        } else {
            var parallel = new enchant.ParallelAction();
            parallel.actions.push(last);
            this.queue.push(parallel);
            this._parallel = parallel;
        }
        return this;
    },
    /**
     * @ignore
     */
    or: function() {
        return this;
    },
    /**
     * @ignore
     */
    doAll: function(children) {
        return this;
    },
    /**
     * @ignore
     */
    waitAll: function() {
        return this;
    },
    /**
     * trueが返るまで, 関数を毎フレーム実行するアクションを追加する.
     *
     * @example
     * sprite.tl.waitUntil(function() {
     *     return --this.x < 0;
     * }).then(function(){ .. });
     * // x座標が負になるまで毎フレームx座標を減算し続ける.
     *
     * @param {Function} func 条件とする関数.
     * @return {enchant.Timeline} 自身.
     */
    waitUntil: function(func) {
        return this.action({
            onactiontick: function(evt) {
                if (func.call(this)) {
                    evt.timeline.next();
                }
            }
        });
    },
    /**
     * Entityの不透明度をなめらかに変えるアクションを追加する.
     * @param {Number} opacity 目標の不透明度.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    fadeTo: function(opacity, time, easing) {
        return this.tween({
            opacity: opacity,
            time: time,
            easing: easing
        });
    },
    /**
     * Entityをフェードインするアクションを追加する.
     * fadeTo(1, time, easing) のエイリアス.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    fadeIn: function(time, easing) {
        return this.fadeTo(1, time, easing);
    },
    /**
     * Entityをフェードアウトするアクションを追加する.
     * fadeTo(1, time, easing) のエイリアス.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    fadeOut: function(time, easing) {
        return this.fadeTo(0, time, easing);
    },
    /**
     * Entityの位置をなめらかに移動させるアクションを追加する.
     * @param {Number} x 目標のx座標.
     * @param {Number} y 目標のy座標.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    moveTo: function(x, y, time, easing) {
        return this.tween({
            x: x,
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     * Entityのx座標をなめらかに移動させるアクションを追加する.
     * @param {Number} x 目標のx座標.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    moveX: function(x, time, easing) {
        return this.tween({
            x: x,
            time: time,
            easing: easing
        });
    },
    /**
     * Entityのy座標をなめらかに移動させるアクションを追加する.
     * @param {Number} y 目標のy座標.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    moveY: function(y, time, easing) {
        return this.tween({
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     * Entityの位置をなめらかに変化させるアクションを追加する.
     * 座標は, アクション開始時からの相対座標で指定する.
     * @param {Number} x x軸方向の移動量.
     * @param {Number} y y軸方向の移動量.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    moveBy: function(x, y, time, easing) {
        return this.tween({
            x: function() {
                return this.x + x;
            },
            y: function() {
                return this.y + y;
            },
            time: time,
            easing: easing
        });
    },
    /**
     * Entityの不透明度を0にする. (即時)
     * @return {enchant.Timeline} 自身.
     */
    hide: function() {
        return this.then(function() {
            this.opacity = 0;
        });
    },
    /**
     * Entityの不透明度を1にする. (即時)
     * @return {enchant.Timeline} 自身.
     */
    show: function() {
        return this.then(function() {
            this.opacity = 1;
        });
    },
    /**
     * Entityをシーンから削除する.
     * シーンから削除された場合,  enterframe イベントは呼ばれなくなるので,
     * タイムラインも止まることに注意.
     * これ以降のアクションは, 再度シーンに追加されるまで実行されない.
     * @return {enchant.Timeline} 自身.
     */
    removeFromScene: function() {
        return this.then(function() {
            this.parentNode.removeChild(this);
        });
    },
    /**
     * Entityをなめらかに拡大・縮小するアクションを追加する.
     * @param {Number} scaleX x軸方向の縮尺.
     * @param {Number} [scaleY] y軸方向の縮尺. 省略した場合 scaleX と同じ.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline} 自身.
     */
    scaleTo: function(scale, time, easing) {
        var scaleX, scaleY;

        if (typeof easing === "number") {
            scaleX = arguments[0];
            scaleY = arguments[1];
            time = arguments[2];
            easing = arguments[3];
        } else {
            scaleX = scaleY = scale;
        }

        return this.tween({
            scaleX: scaleX,
            scaleY: scaleY,
            time: time,
            easing: easing
        });
    },
    /**
     * Entityをなめらかに拡大・縮小させるアクションを追加する.
     * 相対縮尺 (アクション開始時の縮尺のn倍) で指定する.
     * @param {Number} scaleX x軸方向の相対縮尺.
     * @param {Number} [scaleY] y軸方向の相対縮尺. 省略した場合 scaleX と同じ.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    scaleBy: function(scale, time, easing) {
        var scaleX, scaleY;

        if (typeof easing === "number") {
            scaleX = arguments[0];
            scaleY = arguments[1];
            time = arguments[2];
            easing = arguments[3];
        } else {
            scaleX = scaleY = scale;
        }

        return this.tween({
            scaleX: function() {
                return this.scaleX * scaleX;
            },
            scaleY: function() {
                return this.scaleY * scaleY;
            },
            time: time,
            easing: easing
        });
    },
    /**
     * Entityをなめらかに回転させるアクションを追加する.
     * @param {Number} deg 目標の回転角度. (度数法)
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    rotateTo: function(deg, time, easing) {
        return this.tween({
            rotation: deg,
            time: time,
            easing: easing
        });
    },
    /**
     * Entityをなめらかに回転させるアクションを追加する.
     * 角度は相対角度 (アクション開始時の角度から更にn度) で指定する.
     * @param {Number} deg 目標の相対角度. (度数法)
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     */
    rotateBy: function(deg, time, easing) {
        return this.tween({
            rotation: function() {
                return this.rotation + deg;
            },
            time: time,
            easing: easing
        });
    }
});

/**
 * @scope enchant.Action.prototype
 */
enchant.Action = enchant.Class.create(enchant.ActionEventTarget, {
    /**
     * @name enchant.Action
     * @class
     * アニメーションタイムラインを構成する, 実行したい処理を指定するためのクラス.
     *
     * タイムラインに追加されたアクションは順に実行される.
     * アクションが開始・終了された時に actionstart, actionend イベントが発行され,
     * また1フレーム経過した時には actiontick イベントが発行される.
     * これらのイベントのリスナとして実行したい処理を指定する.
     *
     * time で指定されたフレーム数が経過すると自動的に次のアクションに移行するが,
     * null が指定されると, タイムラインの next メソッドが呼ばれるまで移行しない.
     * @param {Object} param
     * @param {Number} [param.time] アクションが持続するフレーム数. null が指定されると無限長.
     * @param {Function} [param.onactionstart] アクションが開始される時のイベントリスナ.
     * @param {Function} [param.onactiontick] アクションが1フレーム経過するときのイベントリスナ.
     * @param {Function} [param.onactionend] アクションがが終了する時のイベントリスナ.
     * @constructs
     * @extends enchant.ActionEventTarget
     */
    initialize: function(param) {
        enchant.ActionEventTarget.call(this);
        this.time = null;
        this.frame = 0;
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                if (param[key] != null) {
                    this[key] = param[key];
                }
            }
        }
        var action = this;

        this.timeline = null;
        this.node = null;

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
            action.timeline = evt.timeline;
            action.node = evt.timeline.node;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
            action.timeline = null;
            action.node = null;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            var remaining = action.time - (action.frame + evt.elapsed);
            if (action.time != null && remaining <= 0) {
                action.frame = action.time;
                evt.timeline.next(-remaining);
            } else {
                action.frame += evt.elapsed;
            }
        });

    }
});

/**
 * @scope enchant.ParallelAction.prototype
 */
enchant.ParallelAction = enchant.Class.create(enchant.Action, {
    /**
     * @name enchant.ParallelAction
     * @class
     * アクションを並列で実行するためのアクション.
     * 子アクションを複数持つことができる.
     * @constructs
     * @extends enchant.Action
     */
    initialize: function(param) {
        enchant.Action.call(this, param);
        /**
         * 子アクション.
         * @type enchant.Action[]
         */
        this.actions = [];
        /**
         * 実行が終了したアクション.
         * @type enchant.Action[]
         */
        this.endedActions = [];
        var that = this;

        this.addEventListener(enchant.Event.ACTION_START, function(evt) {
            for (var i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(evt);
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            var i, len, timeline = {
                next: function(remaining) {
                    var action = that.actions[i];
                    that.actions.splice(i--, 1);
                    len = that.actions.length;
                    that.endedActions.push(action);

                    var e = new enchant.Event("actionend");
                    e.timeline = this;
                    action.dispatchEvent(e);

                    e = new enchant.Event("removedfromtimeline");
                    e.timeline = this;
                    action.dispatchEvent(e);
                }
            };

            var e = new enchant.Event("actiontick");
            e.timeline = timeline;
            e.elapsed = evt.elapsed;
            for (i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(e);
            }

            if (that.actions.length === 0) {
                evt.timeline.next();
            }
        });

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
            for (var i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(evt);
            }
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
            that.actions = that.endedActions;
            that.endedActions = [];
        });

    }
});

/**
 * @scope enchant.Tween.prototype
 */
enchant.Tween = enchant.Class.create(enchant.Action, {
    /**
     * @name enchant.Tween
     * @class
     * オブジェクトの特定のプロパティを, なめらかに変更したい時に用いるためのアクションクラス.
     * アクションを扱いやすく拡張したクラス.
     *
     * コンストラクタに渡す設定オブジェクトに, プロパティの目標値を指定すると,
     * アクションが実行された時に, 目標値までなめらかに値を変更するようなアクションを生成する.
     *
     * トゥイーンのイージングも, easing プロパティで指定できる.
     *
     * @param {Object} params
     * @param {Number} params.time アニメーションにかける時間.
     * @param {Function} [params.easing=enchant.Easing.LINEAR] イージング関数.
     * @constructs
     * @extends enchant.Action
     */
    initialize: function(params) {
        var origin = {};
        var target = {};
        enchant.Action.call(this, params);

        if (this.easing == null) {
            this.easing = enchant.Easing.LINEAR;
        }

        var tween = this;
        this.addEventListener(enchant.Event.ACTION_START, function() {
            // excepted property
            var excepted = ["frame", "time", "callback", "onactiontick", "onactionstart", "onactionend"];
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    // if function is used instead of numerical value, evaluate it
                    var target_val;
                    if (typeof params[prop] === "function") {
                        target_val = params[prop].call(tween.node);
                    } else {
                        target_val = params[prop];
                    }

                    if (excepted.indexOf(prop) === -1) {
                        origin[prop] = tween.node[prop];
                        target[prop] = target_val;
                    }
                }
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            // if time is 0, set property to target value immediately
            var ratio = tween.time === 0 ? 1 : tween.easing(Math.min(tween.time,tween.frame + evt.elapsed), 0, 1, tween.time) - tween.easing(tween.frame, 0, 1, tween.time);

            for (var prop in target){
                if (target.hasOwnProperty(prop)) {
                    if (typeof this[prop] === "undefined"){
                        continue;
                    }
                    tween.node[prop] += (target[prop] - origin[prop]) * ratio;
                    if (Math.abs(tween.node[prop]) < 10e-8){
                        tween.node[prop] = 0;
                    }
                }
            }
        });
    }
});

}(window));
