// platform/js/ui/dashboard.js
/**
 * Renders the dashboard view.
 */
function renderDashboard() {
    const container = document.getElementById('app-content');
    const state = window.appState.state;
    
    // Calculate some basic stats
    const totalModules = 20; // Target
    const completed = state.completedModules.length;
    
    let html = `
        <div class="dashboard animate-fade-in">
            <h1>Welcome Back to DBMS Mastery</h1>
            <p style="color: var(--text-secondary); margin-bottom: 32px;">Pick up where you left off and conquer your database exams.</p>
            
            <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px;">
                
                <div class="card glass-panel">
                    <div class="card-header">
                        <h3 class="card-title">Learning Progress</h3>
                        <i class="fa-solid fa-chart-line" style="color: var(--accent-primary);"></i>
                    </div>
                    <div class="progress-mini" style="margin-bottom: 16px;">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(completed/totalModules)*100}%;"></div>
                        </div>
                        <span id="dash-progress-text" style="color: var(--text-muted); font-size: 0.9rem; text-align: right;">${completed} of ${totalModules} Modules Complete</span>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="app.navigate('module-1')">
                        ${completed === 0 ? 'Start Learning' : 'Continue Learning'} <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>

                <div class="card glass-panel">
                    <div class="card-header">
                        <h3 class="card-title">Exam Readiness</h3>
                        <i class="fa-solid fa-bullseye" style="color: var(--accent-warning);"></i>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; height: 100px;">
                        <div style="text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-primary);">
                                ${state.xp > 0 ? Math.min(100, Math.round(state.xp / 100)) : 0}%
                            </div>
                            <div style="color: var(--text-muted); font-size: 0.85rem;">Estimated Proficiency</div>
                        </div>
                    </div>
                </div>

                <div class="card glass-panel">
                    <div class="card-header">
                        <h3 class="card-title">Weak Concepts</h3>
                        <i class="fa-solid fa-brain" style="color: var(--accent-secondary);"></i>
                    </div>
                    <div id="weak-concepts-list">
                        ${state.weakConcepts.length === 0 
                            ? '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; margin-top: 20px;">No weak concepts identified yet. Take a quiz to assess your knowledge.</p>'
                            : '<ul style="padding-left: 20px; color: var(--text-secondary);">' + state.weakConcepts.map(c => `<li>${c}</li>`).join('') + '</ul>'
                        }
                    </div>
                </div>
            </div>
            
            <h2>Quick Actions</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div class="card glass-panel" style="cursor: pointer; text-align: center; padding: 24px 16px;" onclick="app.navigate('sql-playground')">
                    <i class="fa-solid fa-terminal" style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 12px;"></i>
                    <h4>SQL Playground</h4>
                </div>
                <div class="card glass-panel" style="cursor: pointer; text-align: center; padding: 24px 16px;" onclick="app.navigate('er-builder')">
                    <i class="fa-solid fa-project-diagram" style="font-size: 2rem; color: var(--accent-success); margin-bottom: 12px;"></i>
                    <h4>ER Builder</h4>
                </div>
                <div class="card glass-panel" style="cursor: pointer; text-align: center; padding: 24px 16px;" onclick="app.navigate('exam-mode')">
                    <i class="fa-solid fa-graduation-cap" style="font-size: 2rem; color: var(--accent-warning); margin-bottom: 12px;"></i>
                    <h4>Take Mock Exam</h4>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

window.renderDashboard = renderDashboard;
