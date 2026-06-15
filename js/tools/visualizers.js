// platform/js/tools/visualizers.js

const tableA = [
    { id: 1, name: 'Alice', dept_id: 10 },
    { id: 2, name: 'Bob', dept_id: 20 },
    { id: 3, name: 'Charlie', dept_id: 10 }
];

const tableB = [
    { dept_id: 10, dept_name: 'HR' },
    { dept_id: 20, dept_name: 'IT' },
    { dept_id: 30, dept_name: 'Sales' }
];

function generateTableHtml(data, title, highlightIds = [], tableId = '') {
    if (!data || data.length === 0) return `<div class="card glass-panel" style="padding: 10px; text-align: center;">Empty Table</div>`;
    const keys = Object.keys(data[0]);
    
    let html = `<div class="card glass-panel" id="${tableId}" style="overflow-x: auto; margin-bottom: 20px;">`;
    if (title) html += `<h4 style="color: var(--accent-primary); margin-bottom: 8px;">${title}</h4>`;
    html += `<table class="results-table" style="width: 100%;"><thead><tr>`;
    keys.forEach(k => html += `<th>${k}</th>`);
    html += `</tr></thead><tbody>`;
    
    data.forEach((row, idx) => {
        // Simple highlighting logic
        const isHighlight = highlightIds.includes(idx);
        const style = isHighlight ? `background-color: rgba(0, 240, 255, 0.2); transition: background-color 0.5s ease;` : '';
        html += `<tr style="${style}">`;
        keys.forEach(k => html += `<td>${row[k]}</td>`);
        html += `</tr>`;
    });
    
    html += `</tbody></table></div>`;
    return html;
}

// ----------------------------------------------------
// Relational Algebra Visualizer
// ----------------------------------------------------
function renderRelationalAlgebra() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <h1 style="color: var(--accent-success);">Relational Algebra Visualizer</h1>
            <p style="color: var(--text-secondary);">Select an operation to apply it to the base tables.</p>
            
            <div style="display: flex; gap: 20px;">
                <div style="flex: 1;">${generateTableHtml(tableA, 'Table A (Employees)')}</div>
                <div style="flex: 1;">${generateTableHtml(tableB, 'Table B (Departments)')}</div>
            </div>

            <div class="card glass-panel" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="runAlgebra('selection')">σ Selection (dept_id=10)</button>
                <button class="btn btn-secondary" onclick="runAlgebra('projection')">π Projection (name)</button>
                <button class="btn btn-secondary" onclick="runAlgebra('cross')">× Cartesian Product</button>
                <button class="btn btn-secondary" onclick="runAlgebra('join')">⨝ Natural Join</button>
            </div>

            <div id="algebra-result" style="margin-top: 20px; min-height: 200px;">
                <p style="color: var(--text-muted); text-align: center;">Result will appear here.</p>
            </div>
        </div>
    `;
}

window.runAlgebra = function(operation) {
    const resContainer = document.getElementById('algebra-result');
    let resultData = [];
    let title = '';

    if (operation === 'selection') {
        resultData = tableA.filter(r => r.dept_id === 10);
        title = 'Result: Selection (σ dept_id=10 on Table A)';
    } else if (operation === 'projection') {
        resultData = tableA.map(r => ({ name: r.name }));
        title = 'Result: Projection (π name on Table A)';
    } else if (operation === 'cross') {
        tableA.forEach(a => {
            tableB.forEach(b => {
                resultData.push({ ...a, ...b });
            });
        });
        title = 'Result: Cartesian Product (Table A × Table B)';
    } else if (operation === 'join') {
        tableA.forEach(a => {
            const match = tableB.find(b => b.dept_id === a.dept_id);
            if (match) {
                resultData.push({ ...a, dept_name: match.dept_name });
            }
        });
        title = 'Result: Natural Join (Table A ⨝ Table B)';
    }

    resContainer.innerHTML = `<div class="animate-fade-in">${generateTableHtml(resultData, title)}</div>`;
};

// ----------------------------------------------------
// JOIN Visualizer
// ----------------------------------------------------
function renderJoinVisualizer() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <h1 style="color: var(--accent-warning);">JOIN Visualizer</h1>
            <p style="color: var(--text-secondary);">Watch how different JOIN operations combine tables.</p>
            
            <div style="display: flex; gap: 20px;">
                <div style="flex: 1;" id="join-table-a">${generateTableHtml(tableA, 'Table A (Left)')}</div>
                <div style="flex: 1;" id="join-table-b">${generateTableHtml(tableB, 'Table B (Right)')}</div>
            </div>

            <div class="card glass-panel" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="runJoin('inner')">INNER JOIN</button>
                <button class="btn btn-secondary" onclick="runJoin('left')">LEFT JOIN</button>
                <button class="btn btn-secondary" onclick="runJoin('right')">RIGHT JOIN</button>
                <button class="btn btn-secondary" onclick="runJoin('full')">FULL OUTER JOIN</button>
            </div>

            <div id="join-result" style="margin-top: 20px; min-height: 200px;">
                <p style="color: var(--text-muted); text-align: center;">Result will appear here.</p>
            </div>
        </div>
    `;
}

window.runJoin = function(type) {
    const resContainer = document.getElementById('join-result');
    let resultData = [];
    let title = '';

    if (type === 'inner') {
        tableA.forEach(a => {
            const bList = tableB.filter(b => b.dept_id === a.dept_id);
            bList.forEach(b => resultData.push({ id: a.id, name: a.name, dept_id: a.dept_id, dept_name: b.dept_name }));
        });
        title = 'INNER JOIN (Matching rows only)';
    } else if (type === 'left') {
        tableA.forEach(a => {
            const bList = tableB.filter(b => b.dept_id === a.dept_id);
            if (bList.length > 0) {
                bList.forEach(b => resultData.push({ id: a.id, name: a.name, dept_id: a.dept_id, dept_name: b.dept_name }));
            } else {
                resultData.push({ id: a.id, name: a.name, dept_id: a.dept_id, dept_name: 'NULL' });
            }
        });
        title = 'LEFT JOIN (All from Left, matching from Right)';
    } else if (type === 'right') {
        tableB.forEach(b => {
            const aList = tableA.filter(a => a.dept_id === b.dept_id);
            if (aList.length > 0) {
                aList.forEach(a => resultData.push({ id: a.id, name: a.name, dept_id: b.dept_id, dept_name: b.dept_name }));
            } else {
                resultData.push({ id: 'NULL', name: 'NULL', dept_id: b.dept_id, dept_name: b.dept_name });
            }
        });
        title = 'RIGHT JOIN (All from Right, matching from Left)';
    } else if (type === 'full') {
        // Inner + Left only + Right only
        const handledBIds = new Set();
        tableA.forEach(a => {
            const bList = tableB.filter(b => b.dept_id === a.dept_id);
            if (bList.length > 0) {
                bList.forEach(b => {
                    resultData.push({ id: a.id, name: a.name, dept_id: a.dept_id, dept_name: b.dept_name });
                    handledBIds.add(b.dept_id);
                });
            } else {
                resultData.push({ id: a.id, name: a.name, dept_id: a.dept_id, dept_name: 'NULL' });
            }
        });
        tableB.forEach(b => {
            if (!handledBIds.has(b.dept_id)) {
                resultData.push({ id: 'NULL', name: 'NULL', dept_id: b.dept_id, dept_name: b.dept_name });
            }
        });
        title = 'FULL OUTER JOIN (All rows from both)';
    }

    resContainer.innerHTML = `<div class="animate-fade-in">${generateTableHtml(resultData, title)}</div>`;
};

window.renderRelationalAlgebra = renderRelationalAlgebra;
window.renderJoinVisualizer = renderJoinVisualizer;

// ----------------------------------------------------
// Index Demonstrator
// ----------------------------------------------------
function renderIndexDemonstrator() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <h1 style="color: var(--accent-success);">Index Demonstrator</h1>
            <p style="color: var(--text-secondary);">Visualize the performance difference between a Linear Scan (No Index) and a Tree Search (With Index).</p>
            
            <div class="card glass-panel" style="text-align: center;">
                <h3>Target: Find Employee ID <span style="color: var(--accent-primary);">77</span></h3>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 16px;">
                    <button id="btn-no-index" class="btn btn-secondary" onclick="runLinearScan()">Search Without Index (Linear Scan)</button>
                    <button id="btn-with-index" class="btn btn-primary" onclick="runBinarySearch()">Search With Index (B-Tree Log N)</button>
                    <button class="btn btn-secondary" onclick="renderIndexDemonstrator()">Reset</button>
                </div>
            </div>

            <div id="array-container" style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 20px; justify-content: center;">
                <!-- Blocks injected here -->
            </div>
            
            <div id="index-log" style="margin-top: 20px; text-align: center; font-size: 1.2rem; font-weight: bold; color: var(--text-primary);"></div>
        </div>
    `;

    const arrContainer = document.getElementById('array-container');
    let html = '';
    // Generate 100 blocks
    for(let i = 1; i <= 100; i++) {
        html += `<div id="block-${i}" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); border-radius: 4px; font-size: 0.8rem; transition: all 0.2s ease;">${i}</div>`;
    }
    arrContainer.innerHTML = html;
}

window.runLinearScan = async function() {
    const log = document.getElementById('index-log');
    document.getElementById('btn-no-index').disabled = true;
    document.getElementById('btn-with-index').disabled = true;
    
    let steps = 0;
    for(let i = 1; i <= 100; i++) {
        steps++;
        const el = document.getElementById(`block-${i}`);
        el.style.backgroundColor = 'rgba(239, 68, 68, 0.4)'; // Red-ish scanning
        
        log.innerHTML = `Linear Scan... Checking row ${i}. Steps taken: ${steps}`;
        await new Promise(r => setTimeout(r, 50));
        
        if (i === 77) {
            el.style.backgroundColor = 'var(--accent-success)';
            el.style.transform = 'scale(1.2)';
            log.innerHTML = `Found ID 77! <span style="color: var(--accent-danger);">Total Steps: ${steps}</span> (O(N) Complexity)`;
            break;
        } else {
            el.style.backgroundColor = 'rgba(255,255,255,0.05)';
        }
    }
};

window.runBinarySearch = async function() {
    const log = document.getElementById('index-log');
    document.getElementById('btn-no-index').disabled = true;
    document.getElementById('btn-with-index').disabled = true;
    
    let steps = 0;
    let left = 1;
    let right = 100;
    let target = 77;

    while (left <= right) {
        steps++;
        let mid = Math.floor((left + right) / 2);
        
        const el = document.getElementById(`block-${mid}`);
        el.style.backgroundColor = 'var(--accent-primary)';
        
        log.innerHTML = `Index Search... Jumping to middle (${mid}). Steps taken: ${steps}`;
        await new Promise(r => setTimeout(r, 600));

        if (mid === target) {
            el.style.backgroundColor = 'var(--accent-success)';
            el.style.transform = 'scale(1.2)';
            log.innerHTML = `Found ID 77! <span style="color: var(--accent-success);">Total Steps: ${steps}</span> (O(log N) Complexity)`;
            break;
        } else if (mid < target) {
            el.style.backgroundColor = 'rgba(255,255,255,0.05)';
            left = mid + 1;
        } else {
            el.style.backgroundColor = 'rgba(255,255,255,0.05)';
            right = mid - 1;
        }
    }
};

window.renderIndexDemonstrator = renderIndexDemonstrator;
