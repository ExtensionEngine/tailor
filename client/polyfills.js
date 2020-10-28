import '@ungap/global-this';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';
import { EventSource } from 'event-source-polyfill';
globalThis.EventSource = EventSource;
