'use strict';

(function forEventShim() {
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var _this2 = this;

  var MutationObserverShim = function () {
    function MutationObserverShim(callback) {
      _classCallCheck(this, MutationObserverShim);

      this.callback = callback;
    }

    _createClass(MutationObserverShim, [{
      key: 'observe',
      value: function observe(document) {
        var _this = this;

        var styleElement = document.createElement('style');
        styleElement.innerHTML = '@keyframes nodeInserted {\n  from {\n    opacity: 0.99;\n  }\n  to {\n    opacity: 1;\n  }\n}\n* {\n  animation-duration: 0.001s;\n  animation-name: nodeInserted;\n}';
        document.head.appendChild(styleElement);
        var insertListener = function insertListener(event) {
          if (event.animationName === 'nodeInserted') {
            _this.callback([{
              addedNodes: [event.target]
            }]);
          }
        };
        document.addEventListener('animationstart', insertListener, false);
        document.addEventListener('MSAnimationStart', insertListener, false);
        document.addEventListener('webkitAnimationStart', insertListener, false);
      }
    }]);

    return MutationObserverShim;
  }();

  var MutationObserver = this.WebKitMutationObserver || this.MozMutationObserver || MutationObserverShim;
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.tagName.toLowerCase() === 'script' && node.hasAttributes()) {
          if (!node.attributes.forEventShim && typeof node.attributes.for === 'string' && _this2[node.attributes.for] && typeof _this2[node.attributes.for].addEventHandler === 'function' && typeof node.attributes.event === 'string') {
            (function () {
              node.attributes.forEventShim = true; // eslint-disable-line no-param-reassign
              var parent = node.parentNode;
              node.remove();
              _this2[node.attributes.for].addEventHandler(node.attributes.event, function () {
                parent.appendChild(node);
              });
            })();
          }
        }
      });
    });
  });
  observer.observe(this.document, { childList: true });
}).call(window);
