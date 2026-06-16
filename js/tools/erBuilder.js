// platform/js/tools/erBuilder.js

let entities = [];
let connections = [];
let draggedEntity = null;
let selectedItem = null; // { type: 'entity'|'connection', id: string }
let offsetX = 0;
let offsetY = 0;

function renderErBuilder() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="height: 100%; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div>
                    <h1 style="color: var(--accent-success); margin-bottom: 4px;">Advanced ER Builder</h1>
                    <p style="color: var(--text-secondary);">Model complex schemas with Cardinality, Ordinality, and Normalization analysis.</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button id="btn-analyze-schema" class="btn btn-warning" style="background: var(--accent-warning); color: #000;"><i class="fa-solid fa-microchip"></i> Analyze Schema</button>
                    <button id="btn-add-entity" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add Entity</button>
                    <button id="btn-clear-canvas" class="btn btn-secondary"><i class="fa-solid fa-trash"></i> Clear</button>
                </div>
            </div>
            
            <div style="display: flex; flex: 1; min-height: 0; gap: 10px;">
                <div class="er-canvas" id="er-canvas" style="flex: 1;">
                    <svg id="er-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></svg>
                    <!-- Entities injected here -->
                </div>
                
                <div class="er-inspector glass-panel" id="er-inspector">
                    <div style="color: var(--text-muted); text-align: center; margin-top: 50px;">Select an entity or relationship line to edit its properties.</div>
                </div>
            </div>
        </div>
    `;

    bindErEvents();
    if(entities.length > 0) {
        updateCanvas();
    }
}

function bindErEvents() {
    const btnAdd = document.getElementById('btn-add-entity');
    const btnClear = document.getElementById('btn-clear-canvas');
    const btnAnalyze = document.getElementById('btn-analyze-schema');
    const canvas = document.getElementById('er-canvas');

    btnAdd.addEventListener('click', () => {
        const id = 'ent-' + Date.now();
        entities.push({
            id: id,
            name: "NewEntity",
            type: "strong",
            x: 50 + (Math.random() * 100),
            y: 50 + (Math.random() * 100),
            attributes: [
                { id: 'attr-' + Date.now(), name: 'id', type: 'PK' }
            ]
        });
        selectItem('entity', id);
        updateCanvas();
    });

    btnClear.addEventListener('click', () => {
        if (confirm("Clear the entire canvas?")) {
            entities = [];
            connections = [];
            selectedItem = null;
            updateCanvas();
            renderInspector();
        }
    });

    btnAnalyze.addEventListener('click', analyzeSchema);

    // Global drag events
    canvas.addEventListener('mousemove', (e) => {
        if (!draggedEntity) return;
        const rect = canvas.getBoundingClientRect();
        
        let newX = e.clientX - rect.left - offsetX;
        let newY = e.clientY - rect.top - offsetY;
        
        newX = Math.max(0, Math.min(newX, canvas.clientWidth - 150));
        newY = Math.max(0, Math.min(newY, canvas.clientHeight - 100));

        const ent = entities.find(el => el.id === draggedEntity);
        if (ent) {
            ent.x = newX;
            ent.y = newY;
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
        }
    });

    canvas.addEventListener('mouseleave', () => {
        draggedEntity = null;
    });
}

function selectItem(type, id) {
    selectedItem = { type, id };
    renderInspector();
    updateCanvas(); // To show selection highlight
}

function updateCanvas() {
    const canvas = document.getElementById('er-canvas');
    if (!canvas) return;

    // Remove old entities (keep svg)
    Array.from(canvas.children).forEach(child => {
        if (child.tagName.toLowerCase() !== 'svg') {
            canvas.removeChild(child);
        }
    });

    entities.forEach(ent => {
        const el = document.createElement('div');
        el.className = 'er-entity ' + (ent.type === 'weak' ? 'weak' : '');
        el.id = ent.id;
        el.style.left = ent.x + 'px';
        el.style.top = ent.y + 'px';
        
        if (selectedItem && selectedItem.type === 'entity' && selectedItem.id === ent.id) {
            el.style.boxShadow = '0 0 0 2px var(--accent-warning)';
        }
        
        let attrHtml = ent.attributes.map(a => {
            let cls = '';
            if (a.type === 'PK') cls = 'pk';
            if (a.type === 'Partial') cls = 'partial';
            if (a.type === 'Multi') cls = 'multi';
            return `<div class="er-attribute ${cls}">${a.name}</div>`;
        }).join('');

        el.innerHTML = `
            <div class="er-entity-header">${ent.name}</div>
            <div class="er-entity-body">
                ${attrHtml}
                <button class="btn-connect" style="background:none; border:none; color:var(--text-muted); font-size:0.8rem; cursor:pointer; width:100%; text-align:left; margin-top:8px;"><i class="fa-solid fa-link"></i> Connect to...</button>
            </div>
        `;

        // Click to select
        el.addEventListener('mousedown', (e) => {
            // Prevent selection if clicking connect
            if (e.target.closest('.btn-connect')) return;
            selectItem('entity', ent.id);
        });

        // Drag start
        const header = el.querySelector('.er-entity-header');
        header.style.cursor = 'grab';
        header.addEventListener('mousedown', (e) => {
            draggedEntity = ent.id;
            const rect = el.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        });

        // Connect
        el.querySelector('.btn-connect').addEventListener('click', (e) => {
            e.stopPropagation();
            if (entities.length < 2) {
                alert("Need another entity to connect to.");
                return;
            }
            const targetName = prompt("Enter exact name of target entity:");
            const targetEnt = entities.find(e => e.name.toLowerCase() === targetName?.toLowerCase());
            if (targetEnt && targetEnt.id !== ent.id) {
                const connId = 'conn-' + Date.now();
                connections.push({
                    id: connId,
                    from: ent.id,
                    to: targetEnt.id,
                    label: "relates_to",
                    type: "non-identifying",
                    fromCard: "1", fromOrd: "Mandatory",
                    toCard: "N", toOrd: "Optional"
                });
                selectItem('connection', connId);
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
    
    svg.innerHTML = ''; 

    connections.forEach(conn => {
        const fromEl = document.getElementById(conn.from);
        const toEl = document.getElementById(conn.to);
        
        if (fromEl && toEl) {
            const fromX = parseInt(fromEl.style.left) + (fromEl.offsetWidth / 2);
            const fromY = parseInt(fromEl.style.top) + (fromEl.offsetHeight / 2);
            const toX = parseInt(toEl.style.left) + (toEl.offsetWidth / 2);
            const toY = parseInt(toEl.style.top) + (toEl.offsetHeight / 2);

            const isSelected = selectedItem && selectedItem.type === 'connection' && selectedItem.id === conn.id;

            // Draw interaction area (thick transparent line for easier clicking)
            const ghostPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            ghostPath.setAttribute('d', `M ${fromX} ${fromY} L ${toX} ${toY}`);
            ghostPath.setAttribute('stroke', 'transparent');
            ghostPath.setAttribute('stroke-width', '20');
            ghostPath.setAttribute('fill', 'none');
            ghostPath.style.cursor = 'pointer';
            ghostPath.style.pointerEvents = 'stroke';
            ghostPath.addEventListener('mousedown', () => selectItem('connection', conn.id));
            svg.appendChild(ghostPath);

            // Draw visible line
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${fromX} ${fromY} L ${toX} ${toY}`);
            path.setAttribute('stroke', isSelected ? 'var(--accent-warning)' : 'rgba(0, 240, 255, 0.6)');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            
            if (conn.type === 'non-identifying') {
                path.setAttribute('stroke-dasharray', '5,5');
            }
            svg.appendChild(path);

            // Calculate min-max notation strings
            // At 'from' side, we show how many 'to' elements can relate. Actually standard UML/ER: 
            // The notation near 'to' describes 'to' participation.
            const fromMin = conn.fromOrd === 'Optional' ? '0' : '1';
            const toMin = conn.toOrd === 'Optional' ? '0' : '1';
            
            const fromTextStr = `(${fromMin}, ${conn.fromCard})`;
            const toTextStr = `(${toMin}, ${conn.toCard})`;

            // Positions at 20% and 80% along the line
            const dx = toX - fromX;
            const dy = toY - fromY;
            const len = Math.sqrt(dx*dx + dy*dy);
            
            // Only draw text if line is long enough
            if (len > 60) {
                // Near From
                drawText(svg, fromTextStr, fromX + dx*0.2, fromY + dy*0.2);
                // Near To
                drawText(svg, toTextStr, fromX + dx*0.8, fromY + dy*0.8);
            }

            // Relationship Label in middle
            if (conn.label) {
                drawText(svg, conn.label, fromX + dx*0.5, fromY + dy*0.5, true);
            }
        }
    });
}

function drawText(svg, str, x, y, isLabel=false) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + (isLabel ? -5 : 4));
    text.setAttribute('fill', isLabel ? 'var(--text-primary)' : 'var(--accent-secondary)');
    text.setAttribute('font-size', isLabel ? '13px' : '11px');
    if (isLabel) text.setAttribute('font-weight', 'bold');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = str;
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('fill', 'var(--bg-dark)');
    rect.setAttribute('x', x - (str.length * (isLabel? 4 : 3)));
    rect.setAttribute('y', y - (isLabel? 16 : 6));
    rect.setAttribute('width', str.length * (isLabel? 8 : 6));
    rect.setAttribute('height', isLabel? 18 : 12);
    
    svg.appendChild(rect);
    svg.appendChild(text);
}

function renderInspector() {
    const insp = document.getElementById('er-inspector');
    if (!insp) return;

    if (!selectedItem) {
        insp.innerHTML = `<div style="color: var(--text-muted); text-align: center; margin-top: 50px;">Select an entity or relationship line to edit its properties.</div>`;
        return;
    }

    if (selectedItem.type === 'entity') {
        const ent = entities.find(e => e.id === selectedItem.id);
        if (!ent) return;

        let attrHtml = ent.attributes.map((a, i) => `
            <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                <input type="text" value="${a.name}" onchange="updateAttr('${ent.id}', ${i}, 'name', this.value)" style="flex: 1;">
                <select onchange="updateAttr('${ent.id}', ${i}, 'type', this.value)" style="width: 80px;">
                    <option value="Normal" ${a.type==='Normal'?'selected':''}>Normal</option>
                    <option value="PK" ${a.type==='PK'?'selected':''}>PK</option>
                    <option value="Partial" ${a.type==='Partial'?'selected':''}>Partial</option>
                    <option value="Multi" ${a.type==='Multi'?'selected':''}>Multi</option>
                </select>
                <button onclick="removeAttr('${ent.id}', ${i})" style="background:none; border:none; color:var(--accent-danger); cursor:pointer;"><i class="fa-solid fa-times"></i></button>
            </div>
        `).join('');

        insp.innerHTML = `
            <h3>Entity Properties</h3>
            <label>Name</label>
            <input type="text" value="${ent.name}" onchange="updateEntity('${ent.id}', 'name', this.value)">
            
            <label>Type</label>
            <select onchange="updateEntity('${ent.id}', 'type', this.value)">
                <option value="strong" ${ent.type==='strong'?'selected':''}>Strong</option>
                <option value="weak" ${ent.type==='weak'?'selected':''}>Weak</option>
            </select>

            <h4 style="color: var(--text-primary); margin-top: 20px; border-bottom: 1px solid #333; padding-bottom: 4px;">Attributes</h4>
            ${attrHtml}
            <button onclick="addAttr('${ent.id}')" class="btn btn-secondary" style="width: 100%; margin-top: 10px; font-size: 0.8rem; padding: 4px;">+ Add Attribute</button>
            
            <button onclick="deleteEntity('${ent.id}')" class="btn btn-secondary" style="width: 100%; margin-top: 30px; border-color: var(--accent-danger); color: var(--accent-danger);">Delete Entity</button>
        `;
    } 
    else if (selectedItem.type === 'connection') {
        const conn = connections.find(c => c.id === selectedItem.id);
        if (!conn) return;

        const fromEnt = entities.find(e => e.id === conn.from)?.name || "Unknown";
        const toEnt = entities.find(e => e.id === conn.to)?.name || "Unknown";

        insp.innerHTML = `
            <h3>Relationship</h3>
            <div style="color: var(--accent-secondary); margin-bottom: 15px; font-size: 0.8rem;">${fromEnt} &harr; ${toEnt}</div>
            
            <label>Label / Verb</label>
            <input type="text" value="${conn.label}" onchange="updateConn('${conn.id}', 'label', this.value)">
            
            <label>Type</label>
            <select onchange="updateConn('${conn.id}', 'type', this.value)">
                <option value="non-identifying" ${conn.type==='non-identifying'?'selected':''}>Non-Identifying (Dashed)</option>
                <option value="identifying" ${conn.type==='identifying'?'selected':''}>Identifying (Solid)</option>
            </select>

            <h4 style="color: var(--text-primary); margin-top: 20px; font-size: 0.9rem;">Left Side (${fromEnt})</h4>
            <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                    <label style="font-size: 0.8rem;">Cardinality</label>
                    <select onchange="updateConn('${conn.id}', 'fromCard', this.value)">
                        <option value="1" ${conn.fromCard==='1'?'selected':''}>1 (One)</option>
                        <option value="N" ${conn.fromCard==='N'?'selected':''}>N (Many)</option>
                    </select>
                </div>
                <div style="flex: 1;">
                    <label style="font-size: 0.8rem;">Participation</label>
                    <select onchange="updateConn('${conn.id}', 'fromOrd', this.value)">
                        <option value="Mandatory" ${conn.fromOrd==='Mandatory'?'selected':''}>Mandatory</option>
                        <option value="Optional" ${conn.fromOrd==='Optional'?'selected':''}>Optional</option>
                    </select>
                </div>
            </div>

            <h4 style="color: var(--text-primary); margin-top: 20px; font-size: 0.9rem;">Right Side (${toEnt})</h4>
            <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                    <label style="font-size: 0.8rem;">Cardinality</label>
                    <select onchange="updateConn('${conn.id}', 'toCard', this.value)">
                        <option value="1" ${conn.toCard==='1'?'selected':''}>1 (One)</option>
                        <option value="N" ${conn.toCard==='N'?'selected':''}>N (Many)</option>
                    </select>
                </div>
                <div style="flex: 1;">
                    <label style="font-size: 0.8rem;">Participation</label>
                    <select onchange="updateConn('${conn.id}', 'toOrd', this.value)">
                        <option value="Mandatory" ${conn.toOrd==='Mandatory'?'selected':''}>Mandatory</option>
                        <option value="Optional" ${conn.toOrd==='Optional'?'selected':''}>Optional</option>
                    </select>
                </div>
            </div>

            <button onclick="deleteConn('${conn.id}')" class="btn btn-secondary" style="width: 100%; margin-top: 30px; border-color: var(--accent-danger); color: var(--accent-danger);">Delete Relationship</button>
        `;
    }
}

// Data Update Helpers exposed to window for inline HTML handlers
window.updateEntity = (id, field, val) => {
    const e = entities.find(x => x.id === id);
    if(e) { e[field] = val; updateCanvas(); renderInspector(); }
};
window.updateAttr = (entId, attrIdx, field, val) => {
    const e = entities.find(x => x.id === entId);
    if(e) { e.attributes[attrIdx][field] = val; updateCanvas(); renderInspector(); }
};
window.addAttr = (entId) => {
    const e = entities.find(x => x.id === entId);
    if(e) { e.attributes.push({ id: 'a-'+Date.now(), name: 'new_attr', type: 'Normal' }); updateCanvas(); renderInspector(); }
};
window.removeAttr = (entId, attrIdx) => {
    const e = entities.find(x => x.id === entId);
    if(e) { e.attributes.splice(attrIdx, 1); updateCanvas(); renderInspector(); }
};
window.deleteEntity = (id) => {
    entities = entities.filter(x => x.id !== id);
    connections = connections.filter(c => c.from !== id && c.to !== id);
    selectedItem = null;
    updateCanvas();
    renderInspector();
};
window.updateConn = (id, field, val) => {
    const c = connections.find(x => x.id === id);
    if(c) { c[field] = val; updateCanvas(); renderInspector(); }
};
window.deleteConn = (id) => {
    connections = connections.filter(x => x.id !== id);
    selectedItem = null;
    updateCanvas();
    renderInspector();
};

function analyzeSchema() {
    if (entities.length === 0) {
        alert("Canvas is empty. Add entities first.");
        return;
    }

    let allAttributes = new Set();
    let fds = [];

    // Phase 1: Entities to Relations & FDs
    entities.forEach(ent => {
        let pks = ent.attributes.filter(a => a.type === 'PK').map(a => a.name);
        
        ent.attributes.forEach(a => {
            allAttributes.add(a.name);
            // Strong entities: PK determines all non-key attributes
            if (ent.type === 'strong' && pks.length > 0 && a.type === 'Normal') {
                fds.push(`${pks.join(',')} -> ${a.name}`);
            }
        });
    });

    // Phase 2: Relationships to Foreign Keys & FDs
    connections.forEach(conn => {
        const fromEnt = entities.find(e => e.id === conn.from);
        const toEnt = entities.find(e => e.id === conn.to);
        if (!fromEnt || !toEnt) return;

        let fromPKs = fromEnt.attributes.filter(a => a.type === 'PK').map(a => a.name);
        let toPKs = toEnt.attributes.filter(a => a.type === 'PK').map(a => a.name);

        if (conn.fromCard === '1' && conn.toCard === 'N') {
            // 1:N from -> to. 'to' gets 'from's PK.
            if (fromPKs.length > 0 && toPKs.length > 0) {
                fds.push(`${toPKs.join(',')} -> ${fromPKs.join(',')}`); // Foreign key dependency
                fromPKs.forEach(fk => allAttributes.add(fk)); 
            }
        } else if (conn.fromCard === 'N' && conn.toCard === '1') {
            // N:1 from -> to. 'from' gets 'to's PK.
            if (fromPKs.length > 0 && toPKs.length > 0) {
                fds.push(`${fromPKs.join(',')} -> ${toPKs.join(',')}`);
                toPKs.forEach(fk => allAttributes.add(fk));
            }
        } else if (conn.fromCard === 'N' && conn.toCard === 'N') {
            // M:N creates associative entity (new table)
            // It has PK (fromPK, toPK). No non-key attributes assumed here unless specified.
            if (fromPKs.length > 0 && toPKs.length > 0) {
                // Trivial dependency for algorithmic normalizer: (fromPK, toPK) -> (fromPK, toPK)
                // We'll just ensure the attributes exist.
                fromPKs.forEach(fk => allAttributes.add(fk));
                toPKs.forEach(fk => allAttributes.add(fk));
            }
        }
    });

    const finalAttrs = Array.from(allAttributes).join(', ');
    const finalFDs = fds.join('\n');

    // Save to localStorage so UserNormalizer can pick it up
    localStorage.setItem('er_to_norm_attrs', finalAttrs);
    localStorage.setItem('er_to_norm_fds', finalFDs);

    alert("Schema Analyzed successfully! Redirecting to Algorithmic Normalizer...");
    
    // Trigger navigation
    const navItem = document.querySelector('.nav-item[data-route="user-normalizer"]');
    if (navItem) navItem.click();
}

window.renderErBuilder = renderErBuilder;
