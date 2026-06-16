// platform/js/ui/userNormalizer.js

function renderUserNormalizer() {
    const container = document.getElementById('app-content');
    
    // Check if ER Builder exported a schema
    let defaultAttrs = "A, B, C, D";
    let defaultFDs = "A -> B\nC -> D";
    
    const erAttrs = localStorage.getItem('er_to_norm_attrs');
    const erFDs = localStorage.getItem('er_to_norm_fds');
    
    if (erAttrs && erFDs) {
        defaultAttrs = erAttrs;
        defaultFDs = erFDs;
        // Clear them so they only load once
        localStorage.removeItem('er_to_norm_attrs');
        localStorage.removeItem('er_to_norm_fds');
    }

    container.innerHTML = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <h1 style="color: var(--accent-success);">Algorithmic Normalizer</h1>
            <p style="color: var(--text-secondary);">Input your table attributes and functional dependencies. The engine will mathematically deduce Candidate Keys, verify Normal Forms, and decompose to 3NF.</p>
            
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <!-- Input Panel -->
                <div class="card glass-panel" style="flex: 1; min-width: 300px;">
                    <h3 style="color: var(--text-primary); margin-bottom: 12px;">Relation Definition</h3>
                    
                    <label style="color: var(--text-muted); font-size: 0.9rem;">Attributes (comma separated)</label>
                    <input type="text" id="norm-attributes" value="${defaultAttrs}" style="width: 100%; padding: 10px; margin-bottom: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-light); color: var(--text-primary); border-radius: 4px;">
                    
                    <label style="color: var(--text-muted); font-size: 0.9rem;">Functional Dependencies (one per line, use ->)</label>
                    <textarea id="norm-fds" rows="5" style="width: 100%; padding: 10px; margin-bottom: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-light); color: var(--text-primary); border-radius: 4px; font-family: var(--font-code);">${defaultFDs}</textarea>
                    
                    <button class="btn btn-primary" style="width: 100%;" onclick="executeNormalization()">Analyze Relation</button>
                    
                    <div id="norm-errors" style="margin-top: 16px; color: var(--accent-danger); font-size: 0.9rem;"></div>
                </div>

                <!-- Results Panel -->
                <div class="card glass-panel" style="flex: 2; min-width: 300px; display: flex; flex-direction: column; gap: 16px;" id="norm-results">
                    <div style="color: var(--text-muted); text-align: center; margin-top: 40px;">Results will appear here.</div>
                </div>
            </div>
        </div>
    `;
}

window.executeNormalization = function() {
    const rawAttr = document.getElementById('norm-attributes').value;
    const rawFDs = document.getElementById('norm-fds').value;
    const errorBox = document.getElementById('norm-errors');
    const resultsBox = document.getElementById('norm-results');
    
    errorBox.innerHTML = '';
    resultsBox.innerHTML = '';

    // 1. Raw Validation
    const rawErrors = window.NormValidator.validateRawInput(rawAttr, rawFDs);
    if (rawErrors.length > 0) {
        errorBox.innerHTML = rawErrors.join('<br>');
        return;
    }

    // 2. Parsing
    const parsed = window.NormParser.parse(rawAttr, rawFDs);
    
    // 3. Parsed Validation
    const parsedErrors = window.NormValidator.validateParsedFDs(parsed.attributes, parsed.fds);
    if (parsedErrors.length > 0) {
        errorBox.innerHTML = parsedErrors.join('<br>');
        return;
    }

    // 4. Core Math (Candidate Keys)
    const cks = window.CandidateKeyEngine.findCandidateKeys(parsed.attributes, parsed.fds);
    
    // 5. Normal Forms
    const nfStatus = window.NormalFormsEngine.checkNormalForms(parsed.attributes, parsed.fds, cks);
    
    // 6. Decomposition
    const decomposed = window.DecompositionEngine.synthesize3NF(parsed.attributes, parsed.fds, cks);

    // Build Results UI
    let html = `
        <h3 style="color: var(--accent-success); border-bottom: 1px solid var(--border-light); padding-bottom: 8px;">Analysis Results</h3>
        
        <div>
            <strong style="color: var(--text-primary);">Candidate Keys:</strong>
            <div style="color: var(--accent-warning); font-family: var(--font-code); margin-top: 4px;">
                ${cks.map(ck => `{${Array.from(ck).join(', ')}}`).join(' , ')}
            </div>
        </div>

        <div>
            <strong style="color: var(--text-primary);">Highest Normal Form:</strong>
            <div style="font-size: 1.5rem; font-weight: bold; color: ${nfStatus.highestForm === 'BCNF' ? 'var(--accent-success)' : 'var(--accent-danger)'}; margin-top: 4px;">
                ${nfStatus.highestForm}
            </div>
        </div>
    `;

    if (nfStatus.violations.length > 0) {
        html += `
            <div>
                <strong style="color: var(--text-primary);">Violations Detected:</strong>
                <ul style="color: var(--accent-danger); margin-top: 4px; padding-left: 20px;">
                    ${nfStatus.violations.map(v => `<li>{${Array.from(v.fd.lhs).join(',')}} -> {${Array.from(v.fd.rhs).join(',')}} : ${v.type}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (nfStatus.highestForm !== '3NF' && nfStatus.highestForm !== 'BCNF') {
        html += `
            <div style="margin-top: 10px; padding: 12px; background: rgba(0, 240, 255, 0.1); border-left: 4px solid var(--accent-primary);">
                <strong style="color: var(--accent-primary);">Recommended 3NF Decomposition (Lossless & Dependency Preserving):</strong>
                <ul style="color: var(--text-secondary); margin-top: 8px; padding-left: 20px;">
                    ${decomposed.map((rel, i) => `<li><strong>R${i+1}</strong> = {${Array.from(rel).join(', ')}}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    resultsBox.innerHTML = html;
};

window.renderUserNormalizer = renderUserNormalizer;
