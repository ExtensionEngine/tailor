import '@babel/polyfill';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';
import { EventSource } from 'event-source-polyfill';
window.EventSource = EventSource;
