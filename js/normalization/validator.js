// platform/js/normalization/validator.js

const NormValidator = {
    validateRawInput: function(rawAttributes, rawFDs) {
        let errors = [];
        if (!rawAttributes || rawAttributes.trim() === '') {
            errors.push("Attributes field cannot be empty.");
        }
        
        const lines = rawFDs.split('\n');
        lines.forEach((line, idx) => {
            const t = line.trim();
            if (t === '') return;
            
            // Arrow validation
            if (!t.includes('->')) {
                 if (t.includes('=>') || t.includes('- >') || t.includes('->>')) {
                     errors.push(`Line ${idx + 1}: Invalid arrow format. Please use '->'.`);
                 } else {
                     errors.push(`Line ${idx + 1}: Missing functional dependency arrow '->'.`);
                 }
            }
        });
        
        return errors;
    },

    validateParsedFDs: function(attributesSet, fds) {
        let errors = [];
        
        fds.forEach((fd, idx) => {
            // Check if all attributes in LHS and RHS actually exist in the global attributes set
            fd.lhs.forEach(attr => {
                if (!attributesSet.has(attr)) {
                    errors.push(`FD ${idx + 1} LHS contains unknown attribute: '${attr}'`);
                }
            });
            fd.rhs.forEach(attr => {
                if (!attributesSet.has(attr)) {
                    errors.push(`FD ${idx + 1} RHS contains unknown attribute: '${attr}'`);
                }
            });
            
            // Check trivial dependency
            const intersection = new Set([...fd.lhs].filter(x => fd.rhs.has(x)));
            if (intersection.size === fd.rhs.size && fd.rhs.size > 0) {
                // Not an error, but a warning/trivial FD, we can ignore or remove it in parser
            }
        });
        
        return errors;
    }
};

window.NormValidator = NormValidator;
