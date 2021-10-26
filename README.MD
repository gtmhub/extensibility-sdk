# Gtmhub plugins-sdk

This repository contains the code of the plugin software development kit, which allows external developers to build on top of the Gtmhub platform.

## Build & run locally

To install the dependencies, you need to run the following command:

```bash
npm i
```

To start the local server, you need to run the following command:

```bash
npm start
```

## How does it work?

The web application loads an external document through an iframe (we will call it a plugin).
The plugin itself loads this repository software development kit.
The SDK exposes a few methods that enable interaction with the web application and the plugin itself.
When a plugin calls SDK method it starts event-driven communication between the two documents, for example:
The SDK methods used by each plugin should be specified in the plugin manifest file in order to trigger the corresponding method calls in the web application.

```bash
1 - When webapp initialises it starts listening to DOM events from anywhere.
2 - The plugin calls sdk.getCurrentItem() method -> posts an event to the web application.
3 - The webapp understands the event and starts the necessary flow and depending on the context of current item it will respond back with an another event either with a goal or a metric.
4 - The plugin sdk listens to events coming from the webapp application and resolves the method sdk.getCurrentItem promise, passing the current item into the .then callback functions
5 - The plugin receives the data and performs it\'s flow with the requested resource.
```
