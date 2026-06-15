// platform/js/normalization/normalForms.js

const NormalFormsEngine = {
    /**
     * Determines the highest normal form of the relation.
     */
    checkNormalForms: function(attributesSet, fds, candidateKeys) {
        // Find Prime attributes (part of ANY candidate key)
        let primeAttributes = new Set();
        candidateKeys.forEach(ck => {
            ck.forEach(a => primeAttributes.add(a));
        });

        let is2NF = true;
        let is3NF = true;
        let isBCNF = true;
        let violations = [];

        // Check each FD
        fds.forEach(fd => {
            // Trivial FDs (X -> Y where Y subset X) do not violate anything
            if (window.ClosureEngine.isSubset(fd.rhs, fd.lhs)) return;

            let lhsIsSuperkey = false;
            for (let ck of candidateKeys) {
                if (window.ClosureEngine.isSubset(ck, fd.lhs)) {
                    lhsIsSuperkey = true;
                    break;
                }
            }

            // BCNF Check: LHS must be a superkey
            if (!lhsIsSuperkey) {
                isBCNF = false;
                
                // If not BCNF, check 3NF
                // 3NF allows LHS not superkey IF RHS is a Prime Attribute
                let rhsIsPrime = true;
                fd.rhs.forEach(a => {
                    if (!primeAttributes.has(a)) rhsIsPrime = false;
                });

                if (!rhsIsPrime) {
                    is3NF = false;
                    
                    // If not 3NF, check 2NF
                    // 2NF Violation: Partial Dependency (LHS is a PROPER subset of a candidate key, and RHS is non-prime)
                    let isProperSubsetOfCK = false;
                    for (let ck of candidateKeys) {
                        if (window.ClosureEngine.isSubset(fd.lhs, ck) && fd.lhs.size < ck.size) {
                            isProperSubsetOfCK = true;
                            break;
                        }
                    }

                    if (isProperSubsetOfCK) {
                        is2NF = false;
                        violations.push({ fd: fd, type: 'Partial Dependency (Violates 2NF)' });
                    } else {
                        violations.push({ fd: fd, type: 'Transitive Dependency (Violates 3NF)' });
                    }
                } else {
                    violations.push({ fd: fd, type: 'LHS not superkey, RHS is prime (Violates BCNF)' });
                }
            }
        });

        let highestForm = "1NF";
        if (isBCNF) highestForm = "BCNF";
        else if (is3NF) highestForm = "3NF";
        else if (is2NF) highestForm = "2NF";

        return {
            highestForm: highestForm,
            is2NF, is3NF, isBCNF,
            primeAttributes,
            violations
        };
    }
};

window.NormalFormsEngine = NormalFormsEngine;
