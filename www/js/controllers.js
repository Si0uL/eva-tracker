angular.module('tracker.controller', ['ionic'])

.controller('HomeCtrl', function($scope, parserService, $cordovaNativeAudio, $cordovaFile, $timeout) {

    // parameters
    $scope.actionDelay = 5000;
    $scope.currentTreeElement = undefined;
    $scope.currentTreeIndices = undefined;
    $scope.action = undefined;
    $scope.loop = undefined;
    $scope.loopLength = undefined;
    $scope.output = "";
    var filename = "eva-logs/EVA_log_" + new Date().toString().slice(0,24) + ".txt";

    $scope.initTree = function() {
        $scope.currentTreeIndices = [];
        $scope.currentTreeElement = $scope.actionTree;
        $scope.action = '';
        $scope.loopLength = $scope.currentTreeElement.next.length;
    };

    $scope.getElement = function(index_array) {
        var depth = 0;
        var to_return = $scope.actionTree;
        while (depth < index_array.length) {
            to_return = to_return.next[index_array[depth]];
            depth ++;
        };
        return to_return;
    };

    $scope.nextState = function() {
        var new_idx = $scope.currentTreeIndices.pop() + 1;
        if (new_idx === $scope.loopLength) {
            $scope.sound('abortion-sound');
            $scope.initTree();
        } else {
            $scope.currentTreeIndices.push(new_idx);
            $scope.currentTreeElement = $scope.getElement($scope.currentTreeIndices);
            $scope.sound($scope.currentTreeElement.name);
            $scope.loop = setTimeout(function() {
                $scope.nextState();
            }, $scope.actionDelay);
        };
    };

    $scope.addEntry = function(title) {
        $scope.output += (new Date().toString().slice(0,24) + " - " + title + "\n");
        console.log(filename);
        $cordovaFile.writeFile(cordova.file.externalRootDirectory, filename, $scope.output, true)
        .then(function (success) {
            // success
            console.log(success);
        }, function (error) {
            // error
            console.log(error);
            alert("Error saving journal file !");
        });
    };

    $scope.click = function() {
        clearTimeout($scope.loop);
        if ($scope.currentTreeElement.next.length === 0) {
            $scope.addEntry($scope.currentTreeElement.name);
            console.log('You chose');
            console.log($scope.action + ' | ' + $scope.currentTreeElement.name);
            $scope.sound('validation-double-beep');
            $scope.initTree();
        } else {
            $scope.sound('validation-beep');
            $scope.action += (' | ' + $scope.currentTreeElement.name);
            $scope.currentTreeIndices.push(0);
            $scope.loopLength = $scope.currentTreeElement.next.length;
            $scope.currentTreeElement = $scope.getElement($scope.currentTreeIndices);
            $scope.sound($scope.currentTreeElement.name);
            $scope.loop = setTimeout(function() {
                $scope.nextState();
            }, $scope.actionDelay);
        };
    };

    $scope.sound = function (songname) {
        console.log('*** ~~~~ Song Playing ~~~~ ***');
        console.log(songname);
        $cordovaNativeAudio.play(songname);
        /*
        // to remove ?
        // stop 'music' loop and unload
        $timeout(function () {
            $cordovaNativeAudio.unload(songname);
        }, 1000 * 60);
        */
    };


    /***
    MAIN
    ***/
    setTimeout(function() {
        // Initialisation of variables;
        $cordovaFile.readAsText(cordova.file.externalRootDirectory, "tree.config")
        .then(function (_str) {
            // success
            var _aux = parserService.readAndParse(_str);
            console.log(_aux);
            $scope.actionTree = _aux[0];
            var to_load = _aux[1];
            for (var i = 0; i < to_load.length; i++) {
                $cordovaNativeAudio
                .preloadSimple(to_load[i], 'audio/' + to_load[i] + '.mp3')
                .then(function (msg) {
                    console.log(msg);
                }, function (error) {
                    alert("Problem loading " + to_load[i] + " voice:\n" + error);
                });
            };
            $scope.initTree();
        }, function (error) {
            // error
            console.log('Problem Loading Tree: \n', error);
        });

    }, 1000);
});
