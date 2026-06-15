// platform/js/exam/examMode.js

let currentExamTimer = null;
let examTimeRemaining = 900; // 15 minutes for 15 questions
let userAnswers = {};

function renderExamMode() {
    const container = document.getElementById('app-content');
    
    // Select structured questions: 5 easy, 7 medium, 3 hard
    const qb = window.questionBank;
    const easyQs = [...qb.easy].sort(() => 0.5 - Math.random()).slice(0, 5);
    const medQs = [...qb.medium].sort(() => 0.5 - Math.random()).slice(0, 7);
    const hardQs = [...qb.hard].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine and shuffle the final test array
    const selectedQs = [...easyQs, ...medQs, ...hardQs].sort(() => 0.5 - Math.random());
    
    userAnswers = {};
    examTimeRemaining = 900; 
    if(currentExamTimer) clearInterval(currentExamTimer);
    
    let html = `
        <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="color: var(--accent-warning);"><i class="fa-solid fa-stopwatch"></i> Comprehensive Exam</h1>
                    <p style="color: var(--text-secondary);">15 structured questions spanning the entire syllabus.</p>
                </div>
                <div style="font-size: 2rem; font-weight: bold; color: var(--accent-danger); font-family: var(--font-code);" id="exam-timer">15:00</div>
            </div>
            
            <div class="card glass-panel" id="exam-container">
    `;
    
    selectedQs.forEach((q, idx) => {
        let diffColor = "var(--text-muted)";
        if(qb.hard.some(h => h.q === q.q)) diffColor = "var(--accent-danger)";
        else if(qb.medium.some(m => m.q === q.q)) diffColor = "var(--accent-warning)";
        else diffColor = "var(--accent-success)";

        html += `
            <div class="exam-question" style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--border-light);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <h3 style="color: var(--text-primary);">Q${idx + 1}: ${q.q}</h3>
                    <span style="font-size: 0.8rem; padding: 2px 8px; border-radius: 12px; background: rgba(0,0,0,0.3); color: ${diffColor}; border: 1px solid ${diffColor};">${q.topic}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;
        q.options.forEach((opt, oIdx) => {
            html += `
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'">
                    <input type="radio" name="q${idx}" value="${oIdx}" onchange="userAnswers[${idx}] = ${oIdx}">
                    ${opt}
                </label>
            `;
        });
        html += `</div></div>`;
    });
    
    html += `
                <button class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 12px;" onclick="submitExam()">Submit Comprehensive Exam</button>
            </div>
            <div id="exam-results" style="display: none; margin-top: 20px;"></div>
        </div>
    `;
    
    container.innerHTML = html;
    window.currentExamQuestions = selectedQs;
    startExamTimer();
}

function startExamTimer() {
    const timerEl = document.getElementById('exam-timer');
    currentExamTimer = setInterval(() => {
        examTimeRemaining--;
        if (examTimeRemaining <= 0) {
            clearInterval(currentExamTimer);
            submitExam();
        } else {
            const m = Math.floor(examTimeRemaining / 60).toString().padStart(2, '0');
            const s = (examTimeRemaining % 60).toString().padStart(2, '0');
            timerEl.textContent = `${m}:${s}`;
            if (examTimeRemaining < 60) {
                timerEl.style.color = '#EF4444'; 
                timerEl.style.animation = 'pulse 1s infinite';
            }
        }
    }, 1000);
}

window.submitExam = function() {
    if(currentExamTimer) clearInterval(currentExamTimer);
    
    const qs = window.currentExamQuestions;
    let score = 0;
    
    qs.forEach((q, idx) => {
        if (userAnswers[idx] !== undefined && userAnswers[idx] === q.answer) {
            score++;
        }
    });
    
    const percentage = Math.round((score / qs.length) * 100);
    const resultsEl = document.getElementById('exam-results');
    document.getElementById('exam-container').style.display = 'none';
    
    let message = "";
    let xpGained = 0;
    
    if (percentage === 100) {
        message = "Perfect Score! Master level knowledge.";
        xpGained = 500;
    } else if (percentage >= 80) {
        message = "Excellent! You are definitely ready for the final.";
        xpGained = 300;
    } else if (percentage >= 60) {
        message = "Passing score, but ensure you review Hard/Medium concepts.";
        xpGained = 150;
    } else {
        message = "You need to revisit the interactive simulators and notes.";
        xpGained = 20;
    }
    
    window.appState.addXP(xpGained);
    
    resultsEl.style.display = 'block';
    resultsEl.innerHTML = `
        <div class="card glass-panel" style="text-align: center;">
            <h1 style="color: var(--accent-primary); font-size: 3rem;">${percentage}%</h1>
            <h3 style="color: var(--text-primary); margin-bottom: 10px;">${score} out of ${qs.length} correct</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">${message}</p>
            <div class="xp-badge" style="display: inline-block; font-size: 1.5rem;">+${xpGained} XP</div>
            
            <div style="margin-top: 30px;">
                <button class="btn btn-primary" onclick="renderExamMode()">Retake Comprehensive Exam</button>
            </div>
        </div>
    `;
};

window.renderExamMode = renderExamMode;
