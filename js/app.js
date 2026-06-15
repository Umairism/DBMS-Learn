// platform/js/app.js
/**
 * Main Application Router and Initializer
 */
class App {
    constructor() {
        this.currentRoute = 'dashboard';
        this.contentContainer = document.getElementById('app-content');
        this.init();
    }

    init() {
        this.setupNavigation();
        this.populateModuleSidebar();
        // Load initial route
        this.navigate(this.currentRoute);
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const route = e.currentTarget.getAttribute('data-route');
                if (route) {
                    this.navigate(route);
                }
            });
        });

        // Mobile menu toggle
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    }

    populateModuleSidebar() {
        const container = document.getElementById('module-nav-container');
        if (!container) return;

        // Populate from modulesData
        let html = '';
        window.modulesData.forEach((module, index) => {
            html += `
                <li class="nav-item" data-route="${module.id}">
                    <i class="fa-solid fa-book-open"></i>
                    <span>${index + 1}. ${module.title}</span>
                </li>
            `;
        });
        container.innerHTML = html;

        // Re-attach listeners to new items
        const newItems = container.querySelectorAll('.nav-item');
        newItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const route = e.currentTarget.getAttribute('data-route');
                if (route) {
                    this.navigate(route);
                }
            });
        });
    }

    updateActiveNav(route) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-route') === route) {
                item.classList.add('active');
            }
        });
    }

    navigate(route) {
        this.currentRoute = route;
        this.updateActiveNav(route);
        
        // Mobile: close sidebar on navigation
        document.getElementById('sidebar').classList.remove('open');

        // Clear container
        this.contentContainer.innerHTML = '';

        // Routing Logic
        if (route === 'dashboard') {
            window.renderDashboard();
        } else if (route.startsWith('module-')) {
            window.renderModule(route);
        } else if (route === 'sql-playground') {
            window.renderSqlPlayground();
        } else if (route === 'er-builder') {
            window.renderErBuilder();
        } else if (route === 'relational-algebra') {
            window.renderRelationalAlgebra();
        } else if (route === 'normalization-tutor') {
            window.renderNormalizationTutor();
        } else if (route === 'user-normalizer') {
            window.renderUserNormalizer();
        } else if (route === 'join-visualizer') {
            window.renderJoinVisualizer();
        } else if (route === 'acid-simulator') {
            window.renderAcidSimulator();
        } else if (route === 'deadlock-simulator') {
            window.renderDeadlockSimulator();
        } else if (route === 'index-demonstrator') {
            window.renderIndexDemonstrator();
        } else if (route === 'exam-mode') {
            window.renderExamMode();
        } else if (route === 'revision-sheet') {
            window.renderRevisionSheet();
        } else {
            this.contentContainer.innerHTML = `<div class="animate-fade-in"><h2>${route.replace('-', ' ').toUpperCase()}</h2><p>Under Construction</p></div>`;
        }
    }
}

// Initialize App once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
