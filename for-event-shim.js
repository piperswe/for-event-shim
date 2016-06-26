(function forEventShim() {
  class MutationObserverShim {
    constructor(callback) {
      this.callback = callback;
    }

    observe(document) {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `@keyframes nodeInserted {
  from {
    opacity: 0.99;
  }
  to {
    opacity: 1;
  }
}
* {
  animation-duration: 0.001s;
  animation-name: nodeInserted;
}`;
      document.head.appendChild(styleElement);
      const insertListener = event => {
        if (event.animationName === 'nodeInserted') {
          this.callback([
            {
              addedNodes: [event.target],
            },
          ]);
        }
      };
      document.addEventListener('animationstart', insertListener, false);
      document.addEventListener('MSAnimationStart', insertListener, false);
      document.addEventListener('webkitAnimationStart', insertListener, false);
    }
  }
  const MutationObserver =
    this.WebKitMutationObserver ||
    this.MozMutationObserver ||
    MutationObserverShim;
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName.toLowerCase() === 'script' && node.hasAttributes()) {
          if (!node.attributes.forEventShim &&
              typeof node.attributes.for === 'string' &&
              this[node.attributes.for] &&
              typeof this[node.attributes.for].addEventHandler === 'function' &&
              typeof node.attributes.event === 'string') {
            node.attributes.forEventShim = true; // eslint-disable-line no-param-reassign
            const parent = node.parentNode;
            node.remove();
            this[node.attributes.for].addEventHandler(node.attributes.event, () => {
              parent.appendChild(node);
            });
          }
        }
      });
    });
  });
  observer.observe(this.document, { childList: true });
}.call(window));
