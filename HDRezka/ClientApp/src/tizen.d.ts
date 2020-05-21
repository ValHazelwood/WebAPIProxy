interface HTMLVideoElement extends HTMLMediaElement {
  webkitRequestFullScreen(): void;
}

interface Document
  extends Node,
    DocumentAndElementEventHandlers,
    DocumentOrShadowRoot,
    GlobalEventHandlers,
    NonElementParentNode,
    ParentNode,
    XPathEvaluatorBase {
  webkitCancelFullScreen(): Promise<void>;
  webkitIsFullScreen: boolean;
}
