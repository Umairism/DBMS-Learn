// platform/js/normalization/closureEngine.js

const ClosureEngine = {
    /**
     * Calculates the attribute closure (X+) for a given set of attributes X under a set of FDs.
     * @param {Set<string>} X - Initial set of attributes
     * @param {Array<Object>} fds - Array of functional dependencies {lhs: Set, rhs: Set}
     * @returns {Set<string>} - The closure X+
     */
    computeClosure: function(X, fds) {
        let closure = new Set(X);
        let changed = true;

        while (changed) {
            changed = false;
            for (let fd of fds) {
                // Check if LHS is subset of closure
                let lhsSubset = true;
                for (let attr of fd.lhs) {
                    if (!closure.has(attr)) {
                        lhsSubset = false;
                        break;
                    }
                }

                if (lhsSubset) {
                    for (let attr of fd.rhs) {
                        if (!closure.has(attr)) {
                            closure.add(attr);
                            changed = true;
                        }
                    }
                }
            }
        }
        return closure;
    },
    
    // Helper to check if set A and set B are equal
    areSetsEqual: function(a, b) {
        if (a.size !== b.size) return false;
        for (let item of a) {
            if (!b.has(item)) return false;
        }
        return true;
    },

    // Helper to check if a is a subset of b
    isSubset: function(a, b) {
        for (let item of a) {
            if (!b.has(item)) return false;
        }
        return true;
    }
};

window.ClosureEngine = ClosureEngine;
