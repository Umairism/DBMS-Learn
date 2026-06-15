// platform/js/state.js
/**
 * State Manager utilizing localStorage to persist user progress.
 */
class StateManager {
    constructor() {
        this.storageKey = 'DBMS_Mastery_State';
        this.defaultState = {
            xp: 0,
            streak: 0,
            lastLoginDate: null,
            completedModules: [], // Array of module IDs
            weakConcepts: [], // Array of concept tags
            quizScores: {}, // module_id: score
        };
        this.state = this.loadState();
        this.checkStreak();
    }

    loadState() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                return { ...this.defaultState, ...JSON.parse(saved) };
            } catch (e) {
                console.error("Failed to parse state", e);
                return { ...this.defaultState };
            }
        }
        return { ...this.defaultState };
    }

    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        this.updateUI();
    }

    checkStreak() {
        const today = new Date().toDateString();
        if (this.state.lastLoginDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.state.lastLoginDate === yesterday.toDateString()) {
                this.state.streak += 1;
            } else if (this.state.lastLoginDate !== today) {
                // Reset streak if more than a day missed, unless it's the first time
                this.state.streak = this.state.lastLoginDate ? 0 : 1;
            }
            this.state.lastLoginDate = today;
            this.saveState();
        }
    }

    addXP(amount) {
        this.state.xp += amount;
        this.saveState();
    }

    markModuleComplete(moduleId) {
        if (!this.state.completedModules.includes(moduleId)) {
            this.state.completedModules.push(moduleId);
            this.addXP(100); // Reward for completing a module
            this.saveState();
        }
    }

    getOverallProgress() {
        // Assuming 20 total modules as per requirements
        const totalModules = 20;
        return Math.round((this.state.completedModules.length / totalModules) * 100);
    }

    updateUI() {
        // This is a naive observer pattern. Update common header UI elements.
        const xpEl = document.getElementById('total-xp');
        const streakEl = document.getElementById('streak-count');
        const progressFill = document.getElementById('overall-progress');
        const progressText = document.getElementById('overall-progress-text');

        if(xpEl) xpEl.textContent = `${this.state.xp} XP`;
        if(streakEl) streakEl.textContent = this.state.streak;
        
        const progress = this.getOverallProgress();
        if(progressFill) progressFill.style.width = `${progress}%`;
        if(progressText) progressText.textContent = `${progress}% Complete`;
    }
}

// Initialize Global State
window.appState = new StateManager();
// Initial UI update
window.appState.updateUI();
