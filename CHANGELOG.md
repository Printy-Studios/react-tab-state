# Changelog

## 2.2.1

Added `useTabStateControl` hook which allows you to use any state management library
together with this one.

## 1.1.0

Changed from using BroadcastChannel API to 
[SharedWorker API](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker).
This change was made for 2 main reasons:

1. It's not possible to have a single source of truth, which is necessary for
having a main tab
2. Using BroadcastChannel lead to some infinite loops which were easily fixed
by using a Worker

**Note:** I'm not discouraging the use of BroadcastChannel, but for this specific
library a worker was a better option.

## 1.0.0

Base library