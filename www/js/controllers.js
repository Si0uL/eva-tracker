angular.module('tracker.controller', ['ionic'])

.controller('HomeCtrl', function($scope, parserService, $cordovaNativeAudio, $timeout) {

    // parameters
    $scope.actionDelay = 5000;
    $scope.currentTreeElement = undefined;
    $scope.currentTreeIndices = undefined;
    $scope.action = undefined;
    $scope.loop = undefined;
    $scope.loopLength = undefined;

    // Initialisation of variables;
    var _str = `
    *eva-status
        **beginning
        **end

    *displacement
        **departure
        **arrival

    *engineering-check
        **beginning
        **end
        **water-tank
            ***beginning
            ***end

    *sismometer
        **beginning
        **end
    `;

    $scope.actionTree = parserService.readAndParse(_str);

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
            $scope.sound('aborting_sound');
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

    $scope.click = function() {
        clearTimeout($scope.loop);
        if ($scope.currentTreeElement.next.length === 0) {
            console.log('You chose');
            console.log($scope.action + ' | ' + $scope.currentTreeElement.name);
            $scope.sound('validation_double_beep');
            $scope.initTree();
        } else {
            $scope.sound('validation_beep');
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

    // Sound system
    setTimeout(function(){
        $cordovaNativeAudio.preloadSimple('click', 'audio/pieces-1.mp3').then(function (msg) {
            console.log(msg);
            }, function (error) {
                alert(error);
            });
    }, 2000);

    $scope.sound = function (songname) {
        console.log('*** ~~~~ Song Playing ~~~~ ***');
        console.log(songname);
        /*
        $cordovaNativeAudio.play(songname);

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
    $scope.initTree();
});
