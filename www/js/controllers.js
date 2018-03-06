angular.module('tracker.controller', ['ionic'])

.controller('HomeCtrl', function($scope, parserService, $cordovaNativeAudio, $cordovaFile, $timeout) {

    // parameters
    $scope.actionDelay = 3000;
    $scope.currentTreeElement = undefined;
    $scope.currentTreeIndices = undefined;
    $scope.action = undefined;
    $scope.loop = undefined;
    $scope.loopLength = undefined;
    $scope.output = "";
    var filename = "eva-logs/EVA_log_" + moment.tz("America/Phoenix").format('YYYYMMDD-HHmm') + ".txt";

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
        $scope.output += (moment.tz("America/Phoenix").format().substring(0,19) + " - " + title + "\n");
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
            $scope.addEntry(($scope.action + ' | ' + $scope.currentTreeElement.name).substring(10));
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
        $cordovaNativeAudio
        .preloadSimple(songname, 'audio/' + songname + '.mp3')
        .then(function (msg) {
            $cordovaNativeAudio.play(songname,
            function (msg) {
                console.log(msg);
                setTimeout(function() {
                    $cordovaNativeAudio.unload(msg.id);
                }, 2500);
            }, function (err) {
                console.log(err);
            });

        }, function (error) {
            alert("Problem loading " + to_load[i] + " voice:\n" + error);
        });

    };


    /***
    MAIN (ran after one second)
    ***/
    setTimeout(function() {
        // Initialisation of variables;
        $cordovaFile.readAsText(cordova.file.externalRootDirectory, "tree.config")
        .then(function (_str) {
            // success
            var _aux = parserService.readAndParse(_str + '*'); // Add '*' to let parser add last entry
            console.log(_aux);
            $scope.actionTree = _aux[0];
            $scope.initTree();
            console.log($scope.actionTree);
            // Keeping awake with insomnia
            window.plugins.insomnia.keepAwake(function(data){
                console.log(data);
            },
            function(err) {
                console.log(err);
            });

            /*
            var _index = 0;
            // play all songs to test them
            setTimeout(function () {
                for (var i = 0; i < to_load.length; i++) {
                    setTimeout(function () {
                        $scope.sound(to_load[_index]);
                        _index ++;
                    }, i*2000);
                };
            }, 2000);
            */

        }, function (error) {
            // error
            console.log('Problem Loading Tree: \n', error);
        });

    }, 1000);
});
