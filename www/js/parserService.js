angular.module('tracker.services', [])

.factory('parserService', function() {

    // get element of an action tree using an index array
    var putElement = function(index_array, tree, new_elt) {
        var depth = 0;
        var _elt = tree;
        while (depth < index_array.length - 1) {
            _elt = _elt.next[index_array[depth]];
            depth ++;
        };
        _elt.next[index_array[depth]] = new_elt;
    };

    return {
        readAndParse: function(str) {

            if (str === undefined) {
                console.log('Problem loading your tree: str is undefined');
            };

            var tree = {
                name: 'root',
                next: [],
            };
            var to_load = ['validation-beep', 'validation-double-beep', 'abortion-sound'];
            var indices = [];
            var currentDepth = 0;
            var currentWord = '';
            var idx = 0;

            while (idx < str.length) {
                if (str[idx] === '*') {
                    // add last keyword if first "*"
                    if (currentWord.length != 0) {
                        currentWord = currentWord.trim();
                        if (currentWord.length != 0) {
                            // go up into action tree
                            if (currentDepth < indices.length) {
                                while (currentDepth < indices.length) {
                                    indices.pop();
                                };
                                indices.push(indices.pop() + 1);
                            // stay at same depth
                            } else if (currentDepth === indices.length) {
                                indices.push(indices.pop() + 1);
                            // go down into action tree
                            } else if (currentDepth === indices.length + 1) {
                                indices.push(0);
                            // error (try to go down of more thant one level of depth at one time)
                            } else {
                                console.log("ERROR while parsing action tree");
                                return null;
                            };
                            newElement = {
                                name: currentWord,
                                next: [],
                            };
                            putElement(indices, tree, newElement);
                            if (!to_load.includes(currentWord)) to_load.push(currentWord);
                            currentWord = '';
                            currentDepth = 0;
                        };
                    };
                    //  in all cases keep counting number of "*" to get next depth
                    currentDepth += 1
                } else {
                    currentWord += str[idx];
                };
                idx ++;
            };
            console.log(tree);
            console.log(to_load);
            return [tree, to_load];
        }
    };
});
