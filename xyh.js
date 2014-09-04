/**
 * Created by jasonbyrne on 9/2/14.
 */

var xYourHeart = (function(){
    // Self-reference
    var xYourHeart = {
        STATUS: {
            PENDING: 0,
            FAILURE: -1,
            SUCCESS: 1
        }
    };
    // Private method
    var isFunction = function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    };
    // Make a promise
    xYourHeart.promise = function(action, args) {
        // Self
        var promise = this;
        // Private properties
        var _status = xYourHeart.STATUS.PENDING,
            _args = [],
            _onSuccess = null,
            _onFailure = null,
            _toDo = null,
            _name = null;
        // Private methods
        var _isSuccess = function() {
                if (_onSuccess && _status == xYourHeart.STATUS.SUCCESS) {
                    _onSuccess.apply(promise, _args);
                }
            },
            _isFailure = function() {
                if (_onFailure && _status == xYourHeart.STATUS.FAILURE) {
                    _onFailure.apply(promise, _args);
                }
            };
        // Public methods
        promise.will = function(action, args) {
            if (action) {
                _toDo = {
                    'action': action,
                    'args': args || []
                };
            }
            return promise;
        };
        promise.setArgs = function(args) {
            if (_toDo) {
                _toDo.args = args;
            }
            return promise;
        };
        promise.exec = function() {
            if (_toDo && _toDo.action && _status == xYourHeart.STATUS.PENDING) {
                _toDo.action.apply(promise, _toDo.args);
            }
            return promise;
        };
        promise.kept = function() {
            if (_status == xYourHeart.STATUS.PENDING) {
                _status = xYourHeart.STATUS.SUCCESS;
                _args = Array.prototype.slice.call(arguments);
                _isSuccess();
            }
            return promise;
        };
        promise.broken = function() {
            if (_status == xYourHeart.STATUS.PENDING) {
                _status = xYourHeart.STATUS.FAILURE;
                _args = Array.prototype.slice.call(arguments);
                _isFailure();
            }
            return promise;
        };
        promise.success = function(callback) {
            _onSuccess = callback;
            _isSuccess();
            return promise;
        };
        promise.failure = function(callback) {
            _onFailure = callback;
            _isFailure();
            return promise;
        };
        promise.name = function(str) {
            if (typeof(str) != 'undefined') {
                _name = str;
                return promise;
            }
            else {
                return _name;
            }
        };
        promise.getStatus = function() {
            return _status;
        };
        // done
        return promise.will(action, args);
    };
    // Make multiple promises at the same time
    xYourHeart.promises = function() {
        // Self
        var promises = {};
        // Private properties
        var _promises = [],
            _successes = {},
            _failures = {},
            _onDone = null,
            _onSuccess = {},
            _onFailure = {},
            _args = [],
            _syncIndex = 0;
        // Private methods
        var _isDone = function() {
                if (_onDone) {
                    if (promises.countPending() <= 0) {
                        _onDone.apply(promises, [ _failures, _successes ]);
                    }
                }
            },
            _execPromise = function(i) {
                _promises[i]
                    .name(i)
                    .failure(_failed)
                    .success(_succeeded)
                    .exec();
            };
            _failed = function() {
                // Get index
                var index = this.name();
                // Add this to failures
                _failures[index] = this;
                _args[index] = Array.prototype.slice.call(arguments);
                _isFailure(index);
                // Are we done yet?
                _isDone();
            },
            _succeeded = function(){
                // Get index
                var index = this.name();
                // Add this to successes
                _successes[index] = this;
                _args[index] = Array.prototype.slice.call(arguments);
                _isSuccess(index);
                // Are we done yet?
                _isDone();
            },
            _isSuccess = function(index) {
                if (_successes[index] && _onSuccess[index]) {
                    _onSuccess[index].apply(
                        _promises[index],
                        _args[index]
                    );
                }
            },
            _isFailure = function(index) {
                if (_failures[index] && _onFailure[index]) {
                    _onFailure[index].apply(
                        _promises[index],
                        _args[index]
                    );
                }
            };
        // Public methods
        promises.will = function(action, args) {
            _promises.push(
                isFunction(action) ?
                    xYourHeart.promise(action, args) : action
            );
            return promises;
        };
        promises.success = function(callback, index) {
            index = typeof(index) != 'undefined' ? index : (_promises.length - 1);
            _onSuccess[index] = callback;
            _isSuccess(index);
            return promises;
        };
        promises.failure = function(callback, index) {
            index = typeof(index) != 'undefined' ? index : (_promises.length - 1);
            _onFailure[index] = callback;
            _isFailure(index);
            return promises;
        };
        promises.next = function() {
            if (arguments.length > 0) {
                _promises[_syncIndex]
                    .setArgs(Array.prototype.slice.call(arguments));
            }
            return promises.exec();
        };
        promises.exec = function(async) {
            if (async) {
                _syncIndex = promises.countQueue();
                for (var i=0; i < _promises.length; i++) {
                    _execPromise(i);
                }
            }
            else {
                if (_syncIndex < promises.countQueue()) {
                    _execPromise(_syncIndex);
                    _syncIndex++;
                }
            }
            return promises;
        };
        promises.done = function(callback) {
            _onDone = callback;
            _isDone();
            return promises;
        };
        promises.countQueue = function() {
            return _promises.length;
        };
        promises.countSuccesses = function() {
            return Object.keys(_successes).length;
        };
        promises.countFailures = function() {
            return Object.keys(_failures).length;
        };
        promises.countCompleted = function() {
            return promises.countSuccesses() + promises.countFailures();
        };
        promises.countPending = function() {
            return promises.countQueue() - promises.countCompleted();
        };
        promises.getStatus = function() {
            return {
                completed: promises.countCompleted(),
                total: promises.countQueue(),
                pending: promises.countPending(),
                failures: _failures,
                successes: _successes
            };
        };
        // Aliases for readability
        promises.then = promises.will;
        promises.finally = promises.done;
        return promises;
    };
    // Done
    return xYourHeart;
})();
