EVA Logging System
------------------------

# 1. Use
* Install the app with the .apk file
* Put a `tree.config` directly in your mobile intern storage to define your tree. An example is given in this git repository.
* Create a `eva-audio/` directory directly into your mobile intern storage, then fill it with audio samples, with the exact same name than the one used in your tree. An example is given to you in this git in `eva-audio/`.
* Create a `eva-logs/` directory directly in your mobile intern storage to receive the recorded logs.

# 2. Dev Use

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

## Building a .apk executable

To be shared easily with non debug mode phones.

### Build the app
> ionic build --release

Note that this gives you the output path of the unsigned built .apk application

### Create yourself an RSA key

It will then be used to sign it. (Ensures property if you once want to put it on the store). Replace all `<>` values in the command below, typically, `your_pc_path` something like `C:\Progam Files`:
> <your_pc_path>\Java\jdk1.8.0_101\bin\keytool.exe -genkey -v -keystore <my_destination_dir>\my-release-key.keystore -alias <my_alias_name> -keyalg RSA -keysize 2048 -validity 10000

### Sign the .apk using your key

Same, replace the `<>` values:

> <your_pc_path>\Java\jdk1.8.0_101\bin\jarsigner.exe -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore <my_key_path>\my-release-key.keystore <my_app_path>\app-release-unsigned.apk <my_alias_name>

### Optimize your app

Same, on windows, `<your_other_pc_path>` should be something like `C:\Users\<your_name>\`:

> <your_other_pc_path>\AppData\Local\Android\Sdk\build-tools\27.0.2\zipalign.exe -v 7 <my_app_path>\app-release-unsigned.apk app-output.apk

`app-output.apk` can now be shared with any Android user, for him to follow the basic instructions given in first part (see 1. Use).
