// platform/js/ui/renderer.js

/**
 * Renders a learning module based on its ID.
 */
function renderModule(moduleId) {
    const container = document.getElementById('app-content');
    const moduleData = window.modulesData.find(m => m.id === moduleId);

    if (!moduleData) {
        container.innerHTML = `<div class="animate-fade-in"><h2>Module not found</h2><button class="btn btn-secondary" onclick="app.navigate('dashboard')">Back to Dashboard</button></div>`;
        return;
    }

    const isComplete = window.appState.state.completedModules.includes(moduleId);
    
    // Build Checklist UI
    let checklistHtml = '';
    if (moduleData.checklist && moduleData.checklist.length > 0) {
        const items = moduleData.checklist.map((item, idx) => `
            <div class="checklist-item" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <input type="checkbox" id="chk-${moduleId}-${idx}" class="module-checkbox" ${isComplete ? 'checked disabled' : ''} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent-primary);">
                <label for="chk-${moduleId}-${idx}" style="cursor: pointer; color: var(--text-primary); font-size: 1rem;">${item}</label>
            </div>
        `).join('');

        checklistHtml = `
            <div class="card glass-panel" style="margin-top: 40px; border-color: var(--accent-primary);">
                <h3 style="color: var(--accent-primary);"><i class="fa-solid fa-list-check"></i> End-of-Module Checklist</h3>
                <p style="color: var(--text-muted); margin-bottom: 20px;">Check off these items to complete the module and earn XP.</p>
                ${items}
                <button id="complete-btn" class="btn btn-primary" style="margin-top: 20px; width: 100%;" ${isComplete ? 'disabled' : ''}>
                    ${isComplete ? 'Module Completed <i class="fa-solid fa-check-circle"></i>' : 'Mark as Complete <i class="fa-solid fa-award"></i>'}
                </button>
            </div>
        `;
    }

    let html = `
        <div class="module-view animate-fade-in" style="max-width: 800px; margin: 0 auto; padding-bottom: 60px;">
            <button class="btn btn-secondary" style="margin-bottom: 24px;" onclick="app.navigate('dashboard')"><i class="fa-solid fa-arrow-left"></i> Back</button>
            
            <h1 style="font-size: 2.5rem; margin-bottom: 8px; color: var(--accent-primary);">${moduleData.title}</h1>
            <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 32px; border-bottom: 1px solid var(--border-light); padding-bottom: 24px;">${moduleData.description}</p>
            
            <div class="module-content" style="font-size: 1.05rem; line-height: 1.8;">
                ${moduleData.content}
            </div>

            ${checklistHtml}
        </div>
    `;

    container.innerHTML = html;

    // Add CSS for module content
    const styleId = 'module-specific-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .lesson-section { margin-bottom: 40px; }
            .lesson-section h3 { color: var(--text-primary); border-left: 4px solid var(--accent-secondary); padding-left: 12px; margin-top: 32px; margin-bottom: 16px; }
            .lesson-section h4 { color: var(--accent-primary); margin-bottom: 8px; }
            .lesson-section ul { padding-left: 20px; color: var(--text-secondary); margin-bottom: 16px; }
            .lesson-section li { margin-bottom: 8px; }
            .analogy-box { padding: 20px; border-left: 4px solid var(--accent-warning); margin: 24px 0; background: rgba(245, 158, 11, 0.05); }
            .comparison-table table { width: 100%; border-collapse: collapse; margin-top: 16px; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm); overflow: hidden; }
            .comparison-table th, .comparison-table td { border: 1px solid var(--border-light); padding: 12px 16px; text-align: left; }
            .comparison-table th { background: rgba(0, 240, 255, 0.1); color: var(--accent-primary); font-weight: 600; }
            .architecture-diagram { padding: 24px; text-align: center; }
            .architecture-diagram .level { padding: 16px; margin: 8px auto; max-width: 400px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); }
            .architecture-diagram .external { background: rgba(0, 240, 255, 0.1); border-color: var(--accent-primary); }
            .architecture-diagram .logical { background: rgba(138, 43, 226, 0.1); border-color: var(--accent-secondary); }
            .architecture-diagram .physical { background: rgba(16, 185, 129, 0.1); border-color: var(--accent-success); }
            .architecture-diagram .level-arrow { font-size: 1.5rem; margin: 4px 0; opacity: 0.7; }
        `;
        document.head.appendChild(style);
    }

    // Attach Checklist Logic
    if (!isComplete && moduleData.checklist && moduleData.checklist.length > 0) {
        const checkboxes = container.querySelectorAll('.module-checkbox');
        const completeBtn = document.getElementById('complete-btn');
        
        // completeBtn starts disabled or visual only? Let's make it clickable only if all checked.
        completeBtn.style.opacity = '0.5';
        completeBtn.style.cursor = 'not-allowed';

        const updateBtnState = () => {
            const allChecked = Array.from(checkboxes).every(chk => chk.checked);
            if (allChecked) {
                completeBtn.style.opacity = '1';
                completeBtn.style.cursor = 'pointer';
                completeBtn.disabled = false;
            } else {
                completeBtn.style.opacity = '0.5';
                completeBtn.style.cursor = 'not-allowed';
                completeBtn.disabled = true;
            }
        };

        checkboxes.forEach(chk => chk.addEventListener('change', updateBtnState));
        updateBtnState();

        completeBtn.addEventListener('click', () => {
            if (completeBtn.disabled) return;
            window.appState.markModuleComplete(moduleId);
            completeBtn.innerHTML = 'Module Completed <i class="fa-solid fa-check-circle"></i>';
            completeBtn.disabled = true;
            completeBtn.style.opacity = '1';
            completeBtn.style.cursor = 'default';
            completeBtn.style.backgroundColor = 'var(--accent-success)';
            completeBtn.style.color = '#fff';
            
            checkboxes.forEach(chk => chk.disabled = true);

            // Navigate to dashboard after short delay or show toast
            setTimeout(() => {
                window.app.navigate('dashboard');
            }, 1500);
        });
    }
}

window.renderModule = renderModule;
