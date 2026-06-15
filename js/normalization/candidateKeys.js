// platform/js/normalization/candidateKeys.js

const CandidateKeyEngine = {
    /**
     * Finds all candidate keys using an optimized search strategy.
     */
    findCandidateKeys: function(attributesSet, fds) {
        let allAttrs = Array.from(attributesSet);
        
        // 1. Identify LHS-only, RHS-only, and Both attributes
        let lhsAttrs = new Set();
        let rhsAttrs = new Set();
        
        fds.forEach(fd => {
            fd.lhs.forEach(a => lhsAttrs.add(a));
            fd.rhs.forEach(a => rhsAttrs.add(a));
        });

        let core = new Set();
        let both = [];
        
        allAttrs.forEach(a => {
            if (!rhsAttrs.has(a)) {
                core.add(a); // Never on RHS -> MUST be in every CK
            } else if (lhsAttrs.has(a) && rhsAttrs.has(a)) {
                both.push(a); // On both LHS and RHS
            }
        });

        let candidateKeys = [];

        // Check if core alone is a superkey
        let coreClosure = window.ClosureEngine.computeClosure(core, fds);
        if (coreClosure.size === allAttrs.length) {
            candidateKeys.push(core);
            return candidateKeys;
        }

        // Generate combinations of 'both' starting from size 1
        // We will use a BFS approach to guarantee we find minimal keys first
        let queue = [[]]; // Start with empty combination
        let minimalFound = false;
        
        // Helper to generate combinations of a specific size
        const getCombinations = (arr, k) => {
            let i, j, combs, head, tailcombs;
            if (k > arr.length || k <= 0) return [];
            if (k === arr.length) return [arr];
            if (k === 1) {
                combs = [];
                for (i = 0; i < arr.length; i++) combs.push([arr[i]]);
                return combs;
            }
            combs = [];
            for (i = 0; i < arr.length - k + 1; i++) {
                head = arr.slice(i, i + 1);
                tailcombs = getCombinations(arr.slice(i + 1), k - 1);
                for (j = 0; j < tailcombs.length; j++) {
                    combs.push(head.concat(tailcombs[j]));
                }
            }
            return combs;
        };

        for (let size = 1; size <= both.length; size++) {
            let combs = getCombinations(both, size);
            
            for (let comb of combs) {
                // Pruning: Skip if this combination is a superset of an already found candidate key
                let testSet = new Set([...core, ...comb]);
                
                let isSuperset = false;
                for (let ck of candidateKeys) {
                    if (window.ClosureEngine.isSubset(ck, testSet)) {
                        isSuperset = true;
                        break;
                    }
                }
                
                if (isSuperset) continue;

                // Test closure
                let closure = window.ClosureEngine.computeClosure(testSet, fds);
                if (closure.size === allAttrs.length) {
                    candidateKeys.push(testSet);
                }
            }
        }

        // If no candidate keys found from combinations, then (core + all both) is the CK
        if (candidateKeys.length === 0) {
            candidateKeys.push(new Set([...core, ...both]));
        }

        return candidateKeys;
    }
};

window.CandidateKeyEngine = CandidateKeyEngine;
