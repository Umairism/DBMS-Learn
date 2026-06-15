// platform/js/tools/simulators.js

// ----------------------------------------------------
// ACID Banking Simulator
// ----------------------------------------------------
function renderAcidSimulator() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <h1 style="color: var(--accent-danger);">ACID Banking Simulator</h1>
            <p style="color: var(--text-secondary);">Understand Transactions, Atomicity, and Rollbacks by transferring money.</p>
            
            <div style="display: flex; gap: 20px; justify-content: space-around;">
                <div class="card glass-panel" style="text-align: center; min-width: 200px;">
                    <h3 style="color: var(--accent-primary);">Account A</h3>
                    <div id="acc-a-bal" style="font-size: 2.5rem; font-weight: bold; margin: 20px 0;">$1000</div>
                </div>
                
                <div class="card glass-panel" style="text-align: center; min-width: 200px;">
                    <h3 style="color: var(--accent-success);">Account B</h3>
                    <div id="acc-b-bal" style="font-size: 2.5rem; font-weight: bold; margin: 20px 0;">$500</div>
                </div>
            </div>

            <div class="card glass-panel">
                <h4>Transaction: Transfer $300 from A to B</h4>
                <div style="display: flex; gap: 10px; margin-top: 16px;">
                    <button class="btn btn-primary" onclick="runTransaction(false)">Normal Transfer (Commit)</button>
                    <button class="btn btn-secondary" style="border-color: var(--accent-danger); color: var(--accent-danger);" onclick="runTransaction(true)">Simulate Crash midway (Rollback)</button>
                    <button class="btn btn-secondary" onclick="resetBank()">Reset Balances</button>
                </div>
            </div>

            <div class="card glass-panel">
                <h4>Transaction Log</h4>
                <div id="txn-log" style="font-family: var(--font-code); font-size: 0.9rem; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 16px; border-radius: var(--radius-sm); min-height: 150px; overflow-y: auto;">
                    System ready.
                </div>
            </div>
        </div>
    `;
    
    // Initial State
    window.bankState = { A: 1000, B: 500 };
}

window.resetBank = function() {
    window.bankState = { A: 1000, B: 500 };
    document.getElementById('acc-a-bal').textContent = `$1000`;
    document.getElementById('acc-b-bal').textContent = `$500`;
    document.getElementById('txn-log').innerHTML = `System ready.`;
};

window.runTransaction = async function(simulateCrash) {
    const log = document.getElementById('txn-log');
    const aBal = document.getElementById('acc-a-bal');
    const bBal = document.getElementById('acc-b-bal');
    const btnNodes = document.querySelectorAll('button');
    
    // Disable buttons during txn
    btnNodes.forEach(b => b.disabled = true);
    
    // Snapshot for rollback (Atomicity)
    const snapshot = { ...window.bankState };

    const appendLog = (msg, color = 'var(--text-primary)') => {
        log.innerHTML += `<br><span style="color: ${color}">> ${msg}</span>`;
        log.scrollTop = log.scrollHeight;
    };

    appendLog('BEGIN TRANSACTION;', 'var(--accent-warning)');
    await new Promise(r => setTimeout(r, 800));
    
    appendLog('UPDATE Accounts SET Balance = Balance - 300 WHERE ID = A;');
    window.bankState.A -= 300;
    aBal.textContent = `$${window.bankState.A}`;
    aBal.style.color = 'var(--accent-danger)';
    
    await new Promise(r => setTimeout(r, 1000));
    
    if (simulateCrash) {
        appendLog('SYSTEM CRASH DETECTED! Database server went offline!', 'var(--accent-danger)');
        await new Promise(r => setTimeout(r, 1200));
        appendLog('Recovering... Applying ROLLBACK (Atomicity - All or Nothing).', 'var(--accent-warning)');
        
        window.bankState = { ...snapshot };
        aBal.textContent = `$${window.bankState.A}`;
        bBal.textContent = `$${window.bankState.B}`;
        
        appendLog('ROLLBACK complete. Database is consistent.', 'var(--accent-success)');
    } else {
        appendLog('UPDATE Accounts SET Balance = Balance + 300 WHERE ID = B;');
        window.bankState.B += 300;
        bBal.textContent = `$${window.bankState.B}`;
        bBal.style.color = 'var(--accent-success)';
        
        await new Promise(r => setTimeout(r, 800));
        appendLog('COMMIT; (Durability achieved)', 'var(--accent-success)');
    }

    aBal.style.color = 'inherit';
    bBal.style.color = 'inherit';
    btnNodes.forEach(b => b.disabled = false);
};

// ----------------------------------------------------
// Normalization Tutor
// ----------------------------------------------------
function renderNormalizationTutor() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <h1 style="color: var(--accent-secondary);">Normalization Tutor</h1>
            <p style="color: var(--text-secondary);">Learn how to remove redundancies and anomalies step-by-step.</p>
            
            <div class="card glass-panel">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 id="norm-title">Unnormalized Form (UNF)</h3>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-primary" id="btn-next-nf" onclick="advanceNormalization()">Decompose to 1NF</button>
                    </div>
                </div>
                
                <div id="norm-tables-container">
                    <!-- Tables injected here -->
                </div>
                
                <div id="norm-explanation" style="margin-top: 20px; padding: 16px; background: rgba(0,0,0,0.2); border-left: 4px solid var(--accent-warning);">
                    This table has multi-valued attributes (multiple subjects per student in one row). This violates 1NF.
                </div>
            </div>
        </div>
    `;

    window.normState = 0;
    renderNormStage();
}

const normData = {
    0: { // UNF
        title: "Unnormalized Form (UNF)",
        explanation: "This table has multi-valued attributes (Bob has multiple courses in a single cell). This causes insertion and deletion anomalies. We must make it 1NF by ensuring atomicity.",
        btnText: "Decompose to 1NF",
        tables: [
            {
                name: "Student_Report",
                cols: ["StudentID", "Name", "Courses", "Tutor", "TutorPhone"],
                rows: [
                    [1, "Alice", "DB", "Dr. Smith", "555-1234"],
                    [2, "Bob", "DB, OS", "Dr. Smith", "555-1234"]
                ]
            }
        ]
    },
    1: { // 1NF
        title: "First Normal Form (1NF)",
        explanation: "Now every cell holds a single value. But look! The primary key is now composite: (StudentID, Course). Notice that 'Name' depends ONLY on StudentID, not Course. This is a Partial Dependency. We must move to 2NF.",
        btnText: "Decompose to 2NF",
        tables: [
            {
                name: "Student_Report_1NF",
                cols: ["StudentID (PK)", "Course (PK)", "Name", "Tutor", "TutorPhone"],
                rows: [
                    [1, "Alice", "DB", "Dr. Smith", "555-1234"],
                    [2, "Bob", "DB", "Dr. Smith", "555-1234"],
                    [2, "Bob", "OS", "Dr. Smith", "555-1234"]
                ]
            }
        ]
    },
    2: { // 2NF
        title: "Second Normal Form (2NF)",
        explanation: "Partial dependencies are removed. We split it into two tables. However, in the Student table, 'TutorPhone' depends on 'Tutor', not the StudentID. This is a Transitive Dependency. We must move to 3NF.",
        btnText: "Decompose to 3NF",
        tables: [
            {
                name: "Student_2NF",
                cols: ["StudentID (PK)", "Name", "Tutor", "TutorPhone"],
                rows: [
                    [1, "Alice", "Dr. Smith", "555-1234"],
                    [2, "Bob", "Dr. Smith", "555-1234"]
                ]
            },
            {
                name: "Student_Course",
                cols: ["StudentID (FK)", "Course (PK)"],
                rows: [
                    [1, "DB"], [2, "DB"], [2, "OS"]
                ]
            }
        ]
    },
    3: { // 3NF
        title: "Third Normal Form (3NF)",
        explanation: "Excellent! Transitive dependencies are removed. The database is now completely normalized to 3NF. No more anomalies!",
        btnText: "Reset",
        tables: [
            {
                name: "Student_3NF",
                cols: ["StudentID (PK)", "Name", "Tutor (FK)"],
                rows: [ [1, "Alice", "Dr. Smith"], [2, "Bob", "Dr. Smith"] ]
            },
            {
                name: "Tutor_3NF",
                cols: ["Tutor (PK)", "TutorPhone"],
                rows: [ ["Dr. Smith", "555-1234"] ]
            },
            {
                name: "Student_Course",
                cols: ["StudentID (FK)", "Course (PK)"],
                rows: [ [1, "DB"], [2, "DB"], [2, "OS"] ]
            }
        ]
    }
};

function renderNormStage() {
    const stage = normData[window.normState];
    document.getElementById('norm-title').textContent = stage.title;
    document.getElementById('norm-explanation').textContent = stage.explanation;
    document.getElementById('btn-next-nf').textContent = stage.btnText;
    
    let tablesHtml = '';
    stage.tables.forEach(t => {
        tablesHtml += `<h4 style="color:var(--accent-primary); margin-top: 16px;">${t.name}</h4><table class="results-table" style="width: 100%; margin-bottom: 20px;"><thead><tr>`;
        t.cols.forEach(c => tablesHtml += `<th>${c}</th>`);
        tablesHtml += `</tr></thead><tbody>`;
        t.rows.forEach(r => {
            tablesHtml += `<tr>`;
            r.forEach(v => tablesHtml += `<td>${v}</td>`);
            tablesHtml += `</tr>`;
        });
        tablesHtml += `</tbody></table>`;
    });
    
    document.getElementById('norm-tables-container').innerHTML = tablesHtml;
}

window.advanceNormalization = function() {
    window.normState++;
    if (window.normState > 3) window.normState = 0;
    renderNormStage();
};

window.renderAcidSimulator = renderAcidSimulator;
window.renderNormalizationTutor = renderNormalizationTutor;

// ----------------------------------------------------
// Deadlock Simulator
// ----------------------------------------------------
function renderDeadlockSimulator() {
    const container = document.getElementById('app-content');
    
    container.innerHTML = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <h1 style="color: var(--accent-danger);">Deadlock Simulator</h1>
            <p style="color: var(--text-secondary);">Watch how a deadlock occurs when two transactions wait for each other's resources.</p>
            
            <div style="display: flex; gap: 40px; justify-content: center; margin-top: 20px;">
                <div class="card glass-panel" style="text-align: center; width: 250px;">
                    <h3 style="color: var(--accent-primary);">Transaction 1 (T1)</h3>
                    <div id="t1-status" style="margin-top: 10px; color: var(--text-muted);">Idle</div>
                    <ul id="t1-locks" style="list-style:none; padding:0; margin-top: 10px; color: var(--accent-success);"></ul>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 20px; justify-content: center;">
                    <div class="card glass-panel" id="res-a" style="text-align: center; border-color: var(--border-light);">
                        <h4>Resource A</h4>
                        <div id="res-a-owner" style="color: var(--text-muted); font-size: 0.8rem;">Unlocked</div>
                    </div>
                    <div class="card glass-panel" id="res-b" style="text-align: center; border-color: var(--border-light);">
                        <h4>Resource B</h4>
                        <div id="res-b-owner" style="color: var(--text-muted); font-size: 0.8rem;">Unlocked</div>
                    </div>
                </div>

                <div class="card glass-panel" style="text-align: center; width: 250px;">
                    <h3 style="color: var(--accent-secondary);">Transaction 2 (T2)</h3>
                    <div id="t2-status" style="margin-top: 10px; color: var(--text-muted);">Idle</div>
                    <ul id="t2-locks" style="list-style:none; padding:0; margin-top: 10px; color: var(--accent-success);"></ul>
                </div>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <button id="btn-deadlock-step" class="btn btn-primary" onclick="stepDeadlock()">Next Step</button>
                <button class="btn btn-secondary" onclick="resetDeadlock()">Reset</button>
            </div>
            
            <div id="deadlock-alert" style="margin-top: 20px; text-align: center; font-size: 1.2rem; font-weight: bold; color: var(--accent-danger);"></div>
        </div>
    `;

    window.deadlockStep = 0;
}

window.resetDeadlock = function() {
    window.deadlockStep = 0;
    renderDeadlockSimulator();
};

window.stepDeadlock = function() {
    const t1Status = document.getElementById('t1-status');
    const t2Status = document.getElementById('t2-status');
    const t1Locks = document.getElementById('t1-locks');
    const t2Locks = document.getElementById('t2-locks');
    const resA = document.getElementById('res-a');
    const resAOwner = document.getElementById('res-a-owner');
    const resB = document.getElementById('res-b');
    const resBOwner = document.getElementById('res-b-owner');
    const alertBox = document.getElementById('deadlock-alert');
    const btn = document.getElementById('btn-deadlock-step');

    if (window.deadlockStep === 0) {
        t1Status.textContent = "Acquiring Lock on A...";
        setTimeout(() => {
            t1Status.textContent = "Processing...";
            t1Locks.innerHTML += `<li><i class="fa-solid fa-lock"></i> Lock on A</li>`;
            resA.style.borderColor = 'var(--accent-primary)';
            resAOwner.textContent = 'Locked by T1';
            resAOwner.style.color = 'var(--accent-primary)';
        }, 500);
    } else if (window.deadlockStep === 1) {
        t2Status.textContent = "Acquiring Lock on B...";
        setTimeout(() => {
            t2Status.textContent = "Processing...";
            t2Locks.innerHTML += `<li><i class="fa-solid fa-lock"></i> Lock on B</li>`;
            resB.style.borderColor = 'var(--accent-secondary)';
            resBOwner.textContent = 'Locked by T2';
            resBOwner.style.color = 'var(--accent-secondary)';
        }, 500);
    } else if (window.deadlockStep === 2) {
        t1Status.textContent = "Requesting Lock on B...";
        t1Status.style.color = 'var(--accent-warning)';
    } else if (window.deadlockStep === 3) {
        t2Status.textContent = "Requesting Lock on A...";
        t2Status.style.color = 'var(--accent-warning)';
        
        setTimeout(() => {
            alertBox.innerHTML = `<i class="fa-solid fa-skull-crossbones"></i> DEADLOCK DETECTED! <br><span style="font-size:1rem; color:var(--text-muted); font-weight:normal;">T1 is waiting for B (held by T2), and T2 is waiting for A (held by T1). Neither can proceed.</span>`;
            btn.disabled = true;
        }, 800);
    }
    
    window.deadlockStep++;
};

window.renderDeadlockSimulator = renderDeadlockSimulator;
