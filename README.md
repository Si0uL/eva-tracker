EVA Logging System
------------------------

# Use
* Install the app with the .apk file
* Put a `tree.config` directly in your mobile intern storage to define your tree. An example is given in this git repository.
* Use then defined audio samples, with the exact same name than the files contained in `audio/`.
You can add new files, but you then will have to recompile the app (see dev use).
* Create a `eva-logs/` directory directly in your mobile intern storage to receive the recorded logs.

# Dev Use

## Installation

* Install NodeJs LTE

* Install Ionic & Cordova
> npm install -g ionic cordova

* Install Bower
> npm install -g bower

* Clone project
> git clone https://github.com/Si0uL/eva-tracker.git

* Install dependencies
```
npm install
cd www/
bower install
```

* Install Java SDK

* Install Android Studio, then an Android SDK

## Phone Preparation

To run and debug the app from your computer, you'll need to put your phone in Developer mode.

* Activate the hidden developer options by tapping 7 times on your build number in Parameter/About

* A new parameters set is now available, when connecting your device to your pc, set it in tranfer mode, then activate dev tools and USB debug

## Running the app

* Test the app on browser using:
> ionic serve --lab

* Run app on phone using:
> ionic run android
