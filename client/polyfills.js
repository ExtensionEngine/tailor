import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
window.EventSource = NativeEventSource || EventSourcePolyfill;
