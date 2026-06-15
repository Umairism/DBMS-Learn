// platform/js/normalization/parser.js

const NormParser = {
    parse: function(rawAttributes, rawFDs) {
        // Parse attributes into a Set
        const attrArray = rawAttributes.split(',').map(a => a.trim()).filter(a => a.length > 0);
        const attributesSet = new Set(attrArray);
        
        // Parse FDs
        let fds = [];
        const lines = rawFDs.split('\n');
        
        lines.forEach(line => {
            const t = line.trim();
            if (t === '' || !t.includes('->')) return;
            
            const parts = t.split('->');
            if (parts.length !== 2) return;
            
            const lhsRaw = parts[0].split(',').map(a => a.trim()).filter(a => a.length > 0);
            const rhsRaw = parts[1].split(',').map(a => a.trim()).filter(a => a.length > 0);
            
            if (lhsRaw.length > 0 && rhsRaw.length > 0) {
                fds.push({
                    lhs: new Set(lhsRaw),
                    rhs: new Set(rhsRaw)
                });
            }
        });
        
        // Remove duplicate FDs
        let uniqueFDs = [];
        let seen = new Set();
        fds.forEach(fd => {
            // Sort to ensure A,B is same as B,A
            const lStr = Array.from(fd.lhs).sort().join(',');
            const rStr = Array.from(fd.rhs).sort().join(',');
            const key = lStr + "->" + rStr;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueFDs.push(fd);
            }
        });

        // Split RHS to singletons (Standard practice for algorithms)
        let singletonFDs = [];
        uniqueFDs.forEach(fd => {
            fd.rhs.forEach(rhsAttr => {
                singletonFDs.push({
                    lhs: new Set(fd.lhs),
                    rhs: new Set([rhsAttr])
                });
            });
        });

        return {
            attributes: attributesSet,
            fds: singletonFDs
        };
    }
};

window.NormParser = NormParser;
