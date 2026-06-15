// platform/js/tools/erBuilder.js

let entities = [];
let connections = [];
let draggedEntity = null;
let offsetX = 0;
let offsetY = 0;

function renderErBuilder() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="height: 100%; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div>
                    <h1 style="color: var(--accent-success); margin-bottom: 4px;">ER Diagram Builder</h1>
                    <p style="color: var(--text-secondary);">Drag and drop entities to design your schema.</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button id="btn-add-entity" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add Entity</button>
                    <button id="btn-clear-canvas" class="btn btn-secondary"><i class="fa-solid fa-trash"></i> Clear</button>
                </div>
            </div>
            
            <div class="er-canvas" id="er-canvas">
                <svg id="er-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></svg>
                <!-- Entities will be injected here -->
            </div>
        </div>
    `;

    // Clear state on re-render to avoid duplicates if navigating away and back
    entities = [];
    connections = [];
    
    bindErEvents();
}

function bindErEvents() {
    const btnAdd = document.getElementById('btn-add-entity');
    const btnClear = document.getElementById('btn-clear-canvas');
    const canvas = document.getElementById('er-canvas');

    btnAdd.addEventListener('click', () => {
        const id = 'entity-' + Date.now();
        const name = prompt("Enter Entity Name (e.g., Student):", "NewEntity");
        if (!name) return;
        
        entities.push({
            id: id,
            name: name,
            x: 50 + (Math.random() * 100),
            y: 50 + (Math.random() * 100),
            attributes: ['id (PK)']
        });
        updateCanvas();
    });

    btnClear.addEventListener('click', () => {
        if (confirm("Clear the entire canvas?")) {
            entities = [];
            connections = [];
            updateCanvas();
        }
    });

    // Global drag events
    canvas.addEventListener('mousemove', (e) => {
        if (!draggedEntity) return;
        const rect = canvas.getBoundingClientRect();
        
        // Calculate new position
        let newX = e.clientX - rect.left - offsetX;
        let newY = e.clientY - rect.top - offsetY;
        
        // Boundaries
        newX = Math.max(0, Math.min(newX, canvas.clientWidth - 150));
        newY = Math.max(0, Math.min(newY, canvas.clientHeight - 100));

        const ent = entities.find(el => el.id === draggedEntity);
        if (ent) {
            ent.x = newX;
            ent.y = newY;
            
            // Move DOM element directly for performance
            const el = document.getElementById(draggedEntity);
            if (el) {
                el.style.left = newX + 'px';
                el.style.top = newY + 'px';
            }
            drawConnections();
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (draggedEntity) {
            draggedEntity = null;
            // Full re-render to ensure state is clean
            updateCanvas(); 
        }
    });

    canvas.addEventListener('mouseleave', () => {
        draggedEntity = null;
    });
}

function updateCanvas() {
    const canvas = document.getElementById('er-canvas');
    if (!canvas) return;

    // Preserve SVG
    const existingSvg = document.getElementById('er-svg');
    canvas.innerHTML = '';
    if (existingSvg) canvas.appendChild(existingSvg);

    entities.forEach(ent => {
        const el = document.createElement('div');
        el.className = 'er-entity';
        el.id = ent.id;
        el.style.left = ent.x + 'px';
        el.style.top = ent.y + 'px';
        
        let attrHtml = ent.attributes.map(a => 
            `<div class="er-attribute ${a.includes('PK') ? 'pk' : ''}">${a}</div>`
        ).join('');

        el.innerHTML = `
            <div class="er-entity-header">${ent.name}</div>
            <div class="er-entity-body">
                ${attrHtml}
                <button class="btn-add-attr" style="background:none; border:none; color:var(--accent-primary); font-size:0.8rem; cursor:pointer; width:100%; text-align:left; margin-top:8px;">+ Add Attr</button>
                <button class="btn-connect" style="background:none; border:none; color:var(--text-muted); font-size:0.8rem; cursor:pointer; width:100%; text-align:left; margin-top:4px;"><i class="fa-solid fa-link"></i> Connect</button>
            </div>
        `;

        // Drag start
        const header = el.querySelector('.er-entity-header');
        header.style.cursor = 'grab';
        header.addEventListener('mousedown', (e) => {
            draggedEntity = ent.id;
            const rect = el.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        });

        // Add attribute
        el.querySelector('.btn-add-attr').addEventListener('click', () => {
            const attr = prompt("Attribute Name (add 'PK' or 'FK' if applicable):", "new_attr");
            if (attr) {
                ent.attributes.push(attr);
                updateCanvas();
            }
        });

        // Connect
        el.querySelector('.btn-connect').addEventListener('click', () => {
            if (entities.length < 2) {
                alert("Need at least 2 entities to connect.");
                return;
            }
            const targetName = prompt("Enter the exact name of the entity to connect to:");
            const targetEnt = entities.find(e => e.name.toLowerCase() === targetName?.toLowerCase());
            if (targetEnt && targetEnt.id !== ent.id) {
                const label = prompt("Relationship Label (e.g. 'Has', 'Teaches'):", "relates");
                connections.push({ from: ent.id, to: targetEnt.id, label: label || '' });
                updateCanvas();
            } else if (targetName) {
                alert("Entity not found.");
            }
        });

        canvas.appendChild(el);
    });

    drawConnections();
}

function drawConnections() {
    const svg = document.getElementById('er-svg');
    if (!svg) return;
    
    svg.innerHTML = ''; // Clear lines

    connections.forEach(conn => {
        const fromEl = document.getElementById(conn.from);
        const toEl = document.getElementById(conn.to);
        
        if (fromEl && toEl) {
            // Get centers
            const fromX = parseInt(fromEl.style.left) + (fromEl.offsetWidth / 2);
            const fromY = parseInt(fromEl.style.top) + (fromEl.offsetHeight / 2);
            const toX = parseInt(toEl.style.left) + (toEl.offsetWidth / 2);
            const toY = parseInt(toEl.style.top) + (toEl.offsetHeight / 2);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // Basic straight line
            path.setAttribute('d', `M ${fromX} ${fromY} L ${toX} ${toY}`);
            path.setAttribute('stroke', 'rgba(0, 240, 255, 0.5)');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            svg.appendChild(path);

            if (conn.label) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', (fromX + toX) / 2);
                text.setAttribute('y', (fromY + toY) / 2 - 5);
                text.setAttribute('fill', 'var(--text-primary)');
                text.setAttribute('font-size', '12px');
                text.setAttribute('text-anchor', 'middle');
                text.textContent = conn.label;
                
                // Add background rect for text readability
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('fill', 'var(--bg-dark)');
                
                svg.appendChild(rect);
                svg.appendChild(text);

                // Need to get bounding box after appending text to size the rect, simple hack for now:
                rect.setAttribute('x', ((fromX + toX) / 2) - (conn.label.length * 4));
                rect.setAttribute('y', ((fromY + toY) / 2) - 15);
                rect.setAttribute('width', conn.label.length * 8);
                rect.setAttribute('height', 16);
            }
        }
    });
}

window.renderErBuilder = renderErBuilder;
