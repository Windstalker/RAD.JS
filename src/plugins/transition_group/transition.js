'use strict';

var AnimationEnd = require('../../utils/transition/animationEnd');
var TransitionEnd = require('../../utils/transition/transitionEnd');
var utilsDOM = require('../../utils/DOM_Utils');
var sep = ' ';

function forceReflow(node) {
    return node.offsetWidth;
}

function clearTransitionTimeout(node) {
    if (node.__transitionId) {
        clearTimeout(node.__transitionId);
        node.__transitionId = null;
    }
}

function setTransitionTimeout(node, cb, timeout) {
    node.__transitionId = setTimeout(function() {
        cb(node);
    }, timeout);
}

function hasActiveTransition(node) {
    return node.__transitionId && node.stopActiveTransition;
}

function transition(node, options, timeout, callback) {
    var transitionEnd = new TransitionEnd(node);
    var animationEnd = new AnimationEnd(node);
    var triggers = [
        options.animationEnter,
        options.animationLeave,
        options.enterClass,
        options.leaveClass,
        options.activeClass
    ].join(sep);

    node.stopActiveTransition = function() {
        clearTransitionTimeout(node);
        transitionEnd.unbindAll();
        animationEnd.unbindAll();
        utilsDOM.removeClass(node, triggers);
    };

    function done() {
        node.stopActiveTransition();
        callback && callback(node);
    }

    function onTransitionEnd (e) {
        if (e.target === node) {
            done();
        }
    }

    // handle both animation and transition
    transitionEnd.bind(onTransitionEnd);
    animationEnd.bind(onTransitionEnd);

    if (!timeout) {
        return done();
    }

    setTransitionTimeout(node, done, timeout);

    // Run transition
    utilsDOM.addClass(node, options.activeClass);
}

function transitionLeave(node, options, callback) {
    if (hasActiveTransition(node)) {
        node.stopActiveTransition();
    }

    utilsDOM.addClass(node, [options.animationLeave, options.leaveClass].join(sep));
    utilsDOM.removeClass(node, options.enterClass);

    transition(node, options, options.leaveTimeout, function(node) {
        node.parentNode && node.parentNode.removeChild(node);
        callback && callback();
    });
}

function transitionEnter(node, options, callback) {
    if (hasActiveTransition(node)) {
        node.stopActiveTransition();
    }

    utilsDOM.addClass(node, [options.animationEnter, options.enterClass].join(sep));
    utilsDOM.removeClass(node, options.leaveClass);

    transition(node, options, options.enterTimeout, callback);
}

module.exports.enter = transitionEnter;
module.exports.leave = transitionLeave;