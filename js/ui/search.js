// platform/js/ui/search.js

const searchableKeywords = [
    { key: "Normal Forms", desc: "1NF, 2NF, 3NF, BCNF", route: "normalization-tutor" },
    { key: "Transactions", desc: "ACID Properties, Rollbacks, Commits", route: "acid-simulator" },
    { key: "Concurrency", desc: "Locks, Deadlocks, Waits", route: "deadlock-simulator" },
    { key: "Indexing", desc: "B-Trees, Search complexity, Scanning", route: "index-demonstrator" },
    { key: "Relational Algebra", desc: "Selection, Projection, Join, Union", route: "relational-algebra" },
    { key: "SQL", desc: "Queries, DDL, DML, Playgound", route: "sql-playground" },
    { key: "ER Diagram", desc: "Entities, Attributes, Relationships", route: "er-builder" }
];

function initSearch() {
    // Inject search UI into the sidebar or top bar.
    // For now, we will add a floating search button at the bottom right.
    const searchBtn = document.createElement('div');
    searchBtn.innerHTML = `
        <div id="floating-search" style="position: fixed; bottom: 30px; right: 30px; background: var(--accent-primary); color: var(--bg-dark); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; box-shadow: 0 4px 15px rgba(0, 240, 255, 0.4); z-index: 1000; transition: transform 0.2s;">
            <i class="fa-solid fa-search"></i>
        </div>
    `;
    document.body.appendChild(searchBtn);

    // Modal
    const modal = document.createElement('div');
    modal.id = "search-modal";
    modal.style.cssText = `
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1001; align-items: flex-start; justify-content: center; padding-top: 100px;
    `;
    modal.innerHTML = `
        <div class="card glass-panel animate-fade-in" style="width: 90%; max-width: 600px;">
            <div style="display: flex; gap: 10px; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 10px;">
                <i class="fa-solid fa-search" style="color: var(--accent-primary); font-size: 1.5rem;"></i>
                <input type="text" id="search-input" placeholder="Search for concepts (e.g. Normalization, Deadlock)..." style="flex: 1; background: transparent; border: none; color: var(--text-primary); font-size: 1.2rem; outline: none; padding: 10px;">
                <i class="fa-solid fa-times" id="close-search" style="cursor: pointer; color: var(--text-muted); font-size: 1.5rem;"></i>
            </div>
            <div id="search-results" style="max-height: 300px; overflow-y: auto;">
                <p style="color: var(--text-muted); text-align: center; margin-top: 20px;">Type to search across the platform.</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Events
    document.getElementById('floating-search').addEventListener('click', () => {
        modal.style.display = 'flex';
        document.getElementById('search-input').focus();
    });

    document.getElementById('close-search').addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('search-input').value = '';
        document.getElementById('search-results').innerHTML = '';
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const resultsEl = document.getElementById('search-results');
        
        if (!val) {
            resultsEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 20px;">Type to search across the platform.</p>';
            return;
        }

        const matches = searchableKeywords.filter(k => k.key.toLowerCase().includes(val) || k.desc.toLowerCase().includes(val));
        
        if (matches.length === 0) {
            resultsEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 20px;">No results found.</p>';
            return;
        }

        let html = '';
        matches.forEach(m => {
            html += `
                <div style="padding: 12px; border-bottom: 1px solid var(--border-light); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'" onclick="navigateFromSearch('${m.route}')">
                    <div style="color: var(--accent-primary); font-weight: bold; font-size: 1.1rem;">${m.key}</div>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">${m.desc}</div>
                </div>
            `;
        });
        resultsEl.innerHTML = html;
    });
}

window.navigateFromSearch = function(route) {
    document.getElementById('search-modal').style.display = 'none';
    
    // Simulate clicking the nav item so the router handles it
    const navItem = document.querySelector(`.nav-item[data-route="${route}"]`);
    if (navItem) {
        navItem.click();
    }
};

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', initSearch);
