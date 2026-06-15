// platform/js/exam/questionBank.js

const questionBank = {
    easy: [
        { q: "What does DBMS stand for?", options: ["Database Management System", "Data Basic Management Software", "Database Maintenance System", "Data Backup Management System"], answer: 0, topic: "Intro" },
        { q: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Structured Question Logic", "Standard Query Language"], answer: 0, topic: "SQL" },
        { q: "In an ER Diagram, an entity is represented by a...", options: ["Diamond", "Rectangle", "Oval", "Line"], answer: 1, topic: "ER Model" },
        { q: "Which command is used to retrieve data from a database?", options: ["GET", "EXTRACT", "SELECT", "FETCH"], answer: 2, topic: "SQL" },
        { q: "A Primary Key must be...", options: ["Unique and NOT NULL", "Unique but can be NULL", "Not unique but NOT NULL", "Auto-incremented only"], answer: 0, topic: "Relational Model" },
        { q: "Which property ensures a transaction is all-or-nothing?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], answer: 0, topic: "ACID" },
        { q: "A foreign key creates a link between two tables.", options: ["True", "False"], answer: 0, topic: "Relational Model" },
        { q: "Which of these is a DDL command?", options: ["SELECT", "INSERT", "CREATE", "UPDATE"], answer: 2, topic: "SQL" }
    ],
    medium: [
        { q: "Which Normal Form removes partial dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1, topic: "Normalization" },
        { q: "Which JOIN returns all rows from both tables, filling NULLs where no match exists?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answer: 3, topic: "SQL" },
        { q: "What is the time complexity of searching a B-Tree Index?", options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"], answer: 2, topic: "Indexing" },
        { q: "What happens when a transaction crashes midway?", options: ["It is committed anyway", "It is Rolled Back to maintain Atomicity", "The database is corrupted", "It pauses until the server restarts"], answer: 1, topic: "ACID" },
        { q: "In Relational Algebra, which symbol represents Projection?", options: ["σ", "π", "⨝", "×"], answer: 1, topic: "Relational Algebra" },
        { q: "A deadlock occurs when...", options: ["A transaction is too large", "Two transactions wait for locks held by each other", "The database runs out of memory", "An index is missing"], answer: 1, topic: "Concurrency" },
        { q: "Which SQL clause is used to filter the results of a GROUP BY?", options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"], answer: 1, topic: "SQL" },
        { q: "A table is in 3NF if...", options: ["It is in 2NF and has no transitive dependencies", "It has no composite keys", "Every determinant is a candidate key", "It is in 1NF and has no partial dependencies"], answer: 0, topic: "Normalization" },
        { q: "What is the purpose of the Write-Ahead Log (WAL)?", options: ["To speed up SELECT queries", "To ensure Durability and Atomicity in case of a crash", "To normalize tables automatically", "To prevent deadlocks"], answer: 1, topic: "ACID" },
        { q: "Which concurrency problem occurs when a transaction reads uncommitted data?", options: ["Lost Update", "Dirty Read", "Phantom Read", "Unrepeatable Read"], answer: 1, topic: "Concurrency" }
    ],
    hard: [
        { q: "A relation is in BCNF if and only if...", options: ["It is in 3NF", "Every determinant is a superkey", "It has no partial dependencies", "It has no multi-valued attributes"], answer: 1, topic: "Normalization" },
        { q: "In two-phase locking (2PL), a transaction can...", options: ["Release locks during the growing phase", "Acquire locks during the shrinking phase", "Never acquire a lock after it has released a lock", "Only use shared locks"], answer: 2, topic: "Concurrency" },
        { q: "Which anomaly occurs when deleting a record inadvertently deletes unrelated data?", options: ["Insertion Anomaly", "Deletion Anomaly", "Update Anomaly", "Phantom Anomaly"], answer: 1, topic: "Normalization" },
        { q: "What is the primary difference between a Dense Index and a Sparse Index?", options: ["Dense index has an entry for every search key value, Sparse does not.", "Sparse index is faster for updates, Dense is slower for searches.", "Dense index uses B-Trees, Sparse uses Hashing.", "There is no difference."], answer: 0, topic: "Indexing" },
        { q: "In ARIES recovery algorithm, which phase is performed first after a crash?", options: ["Redo phase", "Undo phase", "Analysis phase", "Checkpointing phase"], answer: 2, topic: "Recovery" }
    ]
};

window.questionBank = questionBank;
