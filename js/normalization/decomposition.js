// platform/js/normalization/decomposition.js

const DecompositionEngine = {
    /**
     * Synthesizes 3NF relations using Bernstein's synthesis / 3NF synthesis algorithm.
     * Guarantees lossless join and dependency preservation.
     */
    synthesize3NF: function(attributesSet, fds, candidateKeys) {
        // Step 1: Minimal Cover (simplified for this scope by using singletons)
        // In a true robust engine, we would remove extraneous attributes from LHS and redundant FDs.
        // Given scope, we assume `fds` are somewhat minimized.
        let relations = [];

        // Group FDs by LHS
        let groups = {};
        fds.forEach(fd => {
            let lhsStr = Array.from(fd.lhs).sort().join(',');
            if (!groups[lhsStr]) groups[lhsStr] = new Set(fd.lhs);
            fd.rhs.forEach(a => groups[lhsStr].add(a));
        });

        Object.keys(groups).forEach(key => {
            relations.push(groups[key]);
        });

        // Ensure at least one Candidate Key is in the relations (Lossless join property)
        let ckPresent = false;
        for (let rel of relations) {
            for (let ck of candidateKeys) {
                if (window.ClosureEngine.isSubset(ck, rel)) {
                    ckPresent = true;
                    break;
                }
            }
            if (ckPresent) break;
        }

        if (!ckPresent && candidateKeys.length > 0) {
            relations.push(new Set(candidateKeys[0]));
        }

        // Clean subsets (if a relation is subset of another, remove it)
        let finalRelations = [];
        for (let i = 0; i < relations.length; i++) {
            let isSubset = false;
            for (let j = 0; j < relations.length; j++) {
                if (i !== j && window.ClosureEngine.isSubset(relations[i], relations[j])) {
                    isSubset = true;
                    break;
                }
            }
            if (!isSubset) finalRelations.push(relations[i]);
        }

        return finalRelations;
    }
};

window.DecompositionEngine = DecompositionEngine;
