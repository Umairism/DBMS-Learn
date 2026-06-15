// platform/js/tools/sqlPlayground.js

let sqlDb = null;
let sqlPlaygroundInitialized = false;

async function initSqlPlayground() {
    if (!sqlPlaygroundInitialized) {
        try {
            const SQL = await window.initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });
            sqlDb = new SQL.Database();
            
            // Seed database
            const seedQueries = `
                CREATE TABLE Students (
                    StudentID INTEGER PRIMARY KEY,
                    Name TEXT NOT NULL,
                    Major TEXT,
                    GPA REAL
                );
                INSERT INTO Students VALUES (1, 'Alice', 'Computer Science', 3.8);
                INSERT INTO Students VALUES (2, 'Bob', 'Mathematics', 3.5);
                INSERT INTO Students VALUES (3, 'Charlie', 'Physics', 3.2);

                CREATE TABLE Courses (
                    CourseID INTEGER PRIMARY KEY,
                    Title TEXT NOT NULL,
                    Credits INTEGER
                );
                INSERT INTO Courses VALUES (101, 'Intro to Databases', 3);
                INSERT INTO Courses VALUES (102, 'Data Structures', 4);
            `;
            sqlDb.exec(seedQueries);
            sqlPlaygroundInitialized = true;
            console.log("SQL.js initialized and DB seeded.");
        } catch (err) {
            console.error("Failed to load SQL.js", err);
        }
    }
}

function renderSqlPlayground() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="height: 100%; display: flex; flex-direction: column;">
            <h1 style="color: var(--accent-primary); margin-bottom: 8px;">SQL Playground</h1>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">Practice real SQL queries using a live in-browser SQLite database.</p>
            
            <div class="playground-container" style="flex-direction: row; flex: 1; overflow: hidden;">
                <!-- Left Sidebar: Database Schema -->
                <div class="db-schema-sidebar" style="flex: 0 0 200px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 16px; overflow-y: auto;">
                    <h3 style="color: var(--text-primary); font-size: 1rem; margin-bottom: 12px; border-bottom: 1px solid var(--border-light); padding-bottom: 8px;"><i class="fa-solid fa-database"></i> Database</h3>
                    <div style="margin-bottom: 12px;">
                        <div style="color: var(--accent-primary); font-weight: 600; margin-bottom: 4px;"><i class="fa-solid fa-table"></i> Students</div>
                        <ul style="color: var(--text-muted); font-size: 0.85rem; padding-left: 20px;">
                            <li>StudentID (PK)</li>
                            <li>Name</li>
                            <li>Major</li>
                            <li>GPA</li>
                        </ul>
                    </div>
                    <div>
                        <div style="color: var(--accent-primary); font-weight: 600; margin-bottom: 4px;"><i class="fa-solid fa-table"></i> Courses</div>
                        <ul style="color: var(--text-muted); font-size: 0.85rem; padding-left: 20px;">
                            <li>CourseID (PK)</li>
                            <li>Title</li>
                            <li>Credits</li>
                        </ul>
                    </div>
                </div>

                <!-- Right Side: Editor & Results -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
                    <div class="playground-editor" style="flex: 0 0 200px;">
                        <textarea id="sql-input" spellcheck="false" placeholder="-- Type your SQL query here. Try: SELECT * FROM Students;">SELECT * FROM Students;</textarea>
                        <div class="editor-toolbar">
                            <span style="color: var(--text-muted); font-size: 0.85rem;"><i class="fa-solid fa-info-circle"></i> Press Ctrl+Enter to run</span>
                            <div style="display: flex; gap: 12px;">
                                <button id="btn-show-schema" class="btn btn-secondary">Show Internal Schema</button>
                                <button id="btn-run-sql" class="btn btn-primary"><i class="fa-solid fa-play"></i> Run Query</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="playground-results" id="sql-results" style="flex: 1;">
                        <p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Results will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (!sqlPlaygroundInitialized) {
        document.getElementById('sql-results').innerHTML = '<p style="color: var(--accent-warning);"><i class="fa-solid fa-spinner fa-spin"></i> Initializing SQL Engine...</p>';
        initSqlPlayground().then(() => {
            bindSqlEvents();
            // Auto run the pre-filled query
            executeSql();
        });
    } else {
        bindSqlEvents();
        executeSql();
    }
}

function bindSqlEvents() {
    const btnRun = document.getElementById('btn-run-sql');
    const btnSchema = document.getElementById('btn-show-schema');
    const input = document.getElementById('sql-input');
    
    btnRun.addEventListener('click', executeSql);
    btnSchema.addEventListener('click', () => {
        input.value = "SELECT name, sql FROM sqlite_master WHERE type='table';";
        executeSql();
    });

    input.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            executeSql();
        }
    });
}

function executeSql() {
    const query = document.getElementById('sql-input').value.trim();
    const resultsContainer = document.getElementById('sql-results');
    
    if (!query) return;

    if (!sqlDb) {
        resultsContainer.innerHTML = '<div class="sql-error">Database engine is not ready.</div>';
        return;
    }

    try {
        const res = sqlDb.exec(query);
        
        if (res.length === 0) {
            resultsContainer.innerHTML = '<p style="color: var(--accent-success);"><i class="fa-solid fa-check"></i> Query executed successfully (no rows returned).</p>';
            return;
        }

        // Render tables
        let html = '';
        res.forEach(table => {
            html += '<table class="results-table">';
            html += '<thead><tr>';
            table.columns.forEach(col => {
                html += `<th>${col}</th>`;
            });
            html += '</tr></thead><tbody>';
            
            table.values.forEach(row => {
                html += '<tr>';
                row.forEach(val => {
                    html += `<td>${val !== null ? val : '<em>NULL</em>'}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table>';
        });

        resultsContainer.innerHTML = html;
        
        // Reward XP for running queries successfully (cap at some amount)
        if (query.toUpperCase().includes("SELECT") || query.toUpperCase().includes("INSERT")) {
            // Simple gamification
            if (Math.random() > 0.5) {
                window.appState.addXP(5);
            }
        }

    } catch (err) {
        resultsContainer.innerHTML = `<div class="sql-error"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Error:</strong> ${err.message}</div>`;
    }
}

window.renderSqlPlayground = renderSqlPlayground;
