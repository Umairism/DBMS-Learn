// platform/js/revision/revisionSheet.js

const revisionData = [
    {
        title: "Normal Forms (1NF to BCNF)",
        icon: "fa-layer-group",
        content: `
            <div style="margin-bottom: 20px;">
                <h4 style="color: var(--accent-primary);">1NF (First Normal Form)</h4>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-left: 3px solid var(--accent-primary); margin: 8px 0;">
                    <strong>Rule:</strong> All attributes must be atomic (no multi-valued attributes).
                </div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">
                    <em>Violation:</em> {StudentID: 1, Courses: "DB, OS"}<br>
                    <em>Fix:</em> {StudentID: 1, Course: "DB"}, {StudentID: 1, Course: "OS"}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: var(--accent-warning);">2NF (Second Normal Form)</h4>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-left: 3px solid var(--accent-warning); margin: 8px 0;">
                    <strong>Rule:</strong> Must be in 1NF. No Partial Dependencies. (A non-prime attribute cannot depend on only part of a candidate key).
                </div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">
                    <em>Violation:</em> In {StudentID, CourseID} -> TutorName, if TutorName only depends on CourseID.<br>
                    <em>Fix:</em> Split into (StudentCourse) and (CourseTutor).
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: var(--accent-secondary);">3NF (Third Normal Form)</h4>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-left: 3px solid var(--accent-secondary); margin: 8px 0;">
                    <strong>Rule:</strong> Must be in 2NF. No Transitive Dependencies. (X -> Y, where neither X is a superkey, nor Y is a prime attribute).
                </div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">
                    <em>Violation:</em> StudentID -> DeptID, DeptID -> DeptName.<br>
                    <em>Fix:</em> Split into (Student, DeptID) and (Department, DeptName).
                </div>
            </div>

            <div>
                <h4 style="color: var(--accent-danger);">BCNF (Boyce-Codd Normal Form)</h4>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-left: 3px solid var(--accent-danger); margin: 8px 0;">
                    <strong>Rule:</strong> For every functional dependency X -> Y, X must be a superkey.
                </div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">
                    <em>Note:</em> Stricter than 3NF. Resolves anomalies where a prime attribute depends on a non-prime attribute.
                </div>
            </div>
        `
    },
    {
        title: "ACID Properties",
        icon: "fa-building-columns",
        content: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 4px; border-top: 3px solid var(--accent-primary);">
                    <h4 style="color: var(--accent-primary); margin-bottom: 8px;">Atomicity</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">"All or Nothing". If a transaction crashes, the system rolls back to the initial state.</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 4px; border-top: 3px solid var(--accent-success);">
                    <h4 style="color: var(--accent-success); margin-bottom: 8px;">Consistency</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">Transactions must take the database from one valid state to another valid state, obeying all constraints.</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 4px; border-top: 3px solid var(--accent-warning);">
                    <h4 style="color: var(--accent-warning); margin-bottom: 8px;">Isolation</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">Concurrent transactions execute as if they were running serially. Prevents dirty reads.</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 4px; border-top: 3px solid var(--accent-danger);">
                    <h4 style="color: var(--accent-danger); margin-bottom: 8px;">Durability</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">Once committed, changes survive permanently, even in the event of a power loss or crash.</p>
                </div>
            </div>
        `
    },
    {
        title: "Relational Algebra Core Operations",
        icon: "fa-square-root-variable",
        content: `
            <ul style="color: var(--text-muted); list-style: none; padding: 0;">
                <li style="margin-bottom: 12px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                    <strong style="color: var(--text-primary); font-size: 1.1rem;">Selection (σ)</strong><br>
                    Filters rows based on a condition.<br>
                    <code style="color: var(--accent-success);">σ<sub>age > 20</sub>(Students)</code>
                </li>
                <li style="margin-bottom: 12px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                    <strong style="color: var(--text-primary); font-size: 1.1rem;">Projection (π)</strong><br>
                    Filters columns, eliminating duplicates automatically.<br>
                    <code style="color: var(--accent-primary);">π<sub>name, major</sub>(Students)</code>
                </li>
                <li style="margin-bottom: 12px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                    <strong style="color: var(--text-primary); font-size: 1.1rem;">Cartesian Product (×)</strong><br>
                    Combines every row of A with every row of B.<br>
                    <code style="color: var(--accent-warning);">Students × Courses</code>
                </li>
                <li style="padding: 10px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                    <strong style="color: var(--text-primary); font-size: 1.1rem;">Natural Join (⨝)</strong><br>
                    Combines tables based on common attributes, dropping the duplicate column.<br>
                    <code style="color: var(--accent-secondary);">Students ⨝ Departments</code>
                </li>
            </ul>
        `
    }
];

function renderRevisionSheet() {
    const container = document.getElementById('app-content');
    
    let html = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: var(--accent-success);"><i class="fa-solid fa-book-open"></i> Master Revision Sheet</h1>
                <p style="color: var(--text-secondary);">Expand the sections below for structured rules, formulas, and examples.</p>
                <button class="btn btn-secondary" style="margin-top: 10px;" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Cheat Sheet</button>
            </div>
    `;
    
    revisionData.forEach((section, idx) => {
        html += `
            <div class="card glass-panel" style="padding: 0; overflow: hidden; border: 1px solid var(--border-light);">
                <div class="revision-header" style="padding: 16px 20px; background: rgba(0,0,0,0.4); cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleRevisionSection(${idx})">
                    <h3 style="color: var(--text-primary); margin: 0;"><i class="fa-solid ${section.icon}" style="margin-right: 10px; color: var(--accent-primary);"></i> ${section.title}</h3>
                    <i class="fa-solid fa-chevron-down" id="rev-icon-${idx}" style="color: var(--text-muted); transition: transform 0.3s;"></i>
                </div>
                <div class="revision-content" id="rev-content-${idx}" style="padding: 20px; display: none; border-top: 1px solid rgba(255,255,255,0.05);">
                    ${section.content}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Auto-open first section
    toggleRevisionSection(0);
}

window.toggleRevisionSection = function(idx) {
    const content = document.getElementById(`rev-content-${idx}`);
    const icon = document.getElementById(`rev-icon-${idx}`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
};

window.renderRevisionSheet = renderRevisionSheet;
