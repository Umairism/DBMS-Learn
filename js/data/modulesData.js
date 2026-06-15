// platform/js/data/modulesData.js

const modulesData = [
    {
        id: "module-1",
        title: "Introduction to DBMS",
        description: "What is data? What is information? Why do we need databases compared to traditional file systems?",
        content: `
            <div class="lesson-section">
                <h3>1. What is Data?</h3>
                <p><strong>Data</strong> consists of raw facts and figures. It has no meaning on its own. For example, "101", "Ali", "Sales" are just data points.</p>
                
                <h3>2. What is Information?</h3>
                <p><strong>Information</strong> is processed data that carries meaning and helps in decision making. For example, "Employee 101 is Ali who works in Sales."</p>

                <div class="analogy-box glass-panel">
                    <h4>💡 Explain Like I'm New</h4>
                    <p>Imagine <strong>Data</strong> as scattered ingredients: flour, sugar, eggs, and chocolate. On their own, they don't mean much. But when you process them (mix and bake), you get a chocolate cake. That cake is <strong>Information</strong>—it has a purpose and is useful!</p>
                </div>
            </div>

            <div class="lesson-section">
                <h3>3. What is a Database?</h3>
                <p>A Database is an organized collection of structured data. It ensures data is stored in a way that allows it to be easily accessed, managed, and updated. Real-time data processing requires a database.</p>
                <p><strong>Types of Data:</strong></p>
                <ul>
                    <li><strong>Structured:</strong> Tabular data (rows/columns) like a student list.</li>
                    <li><strong>Unstructured:</strong> Data with no specific schema, like videos, images, or audio.</li>
                    <li><strong>Semi-structured:</strong> Both, like web pages (HTML/XML).</li>
                </ul>
            </div>

            <div class="lesson-section">
                <h3>4. File System vs DBMS</h3>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Manual File Processing</th>
                                <th>Database Management System (DBMS)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Data stored in separate files (paperwork/flat files).</td>
                                <td>Data stored in a centralized system.</td>
                            </tr>
                            <tr>
                                <td>High data redundancy (duplication).</td>
                                <td>Redundancy is controlled.</td>
                            </tr>
                            <tr>
                                <td>Poor data security.</td>
                                <td>High data security and user access controls.</td>
                            </tr>
                            <tr>
                                <td>Hard to manipulate and search data.</td>
                                <td>Easy data manipulation using Query Languages (SQL).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        checklist: [
            "I can define Data and Information.",
            "I can explain why databases replaced traditional file systems.",
            "I can differentiate between structured and unstructured data."
        ]
    },
    {
        id: "module-2",
        title: "Database Architecture",
        description: "Understanding how a DBMS is structured: Components and the 3-Level Schema Architecture (ANSI-SPARC).",
        content: `
            <div class="lesson-section">
                <h3>1. Components of DBMS</h3>
                <p>A DBMS environment consists of the following components:</p>
                <ul>
                    <li><strong>Hardware:</strong> Physical devices (computers, hard drives).</li>
                    <li><strong>Software:</strong> The DBMS software itself (e.g., MySQL, Oracle) and OS.</li>
                    <li><strong>Data:</strong> The actual data being stored.</li>
                    <li><strong>Procedures:</strong> Rules and instructions (e.g., backups, login steps).</li>
                    <li><strong>Users:</strong> Database Administrators (DBA), developers, and end-users.</li>
                </ul>
            </div>

            <div class="lesson-section">
                <h3>2. 3-Level Schema Architecture (ANSI-SPARC)</h3>
                <p>The architecture is divided into three levels to achieve <strong>Data Independence</strong> (changing one level shouldn't affect the others).</p>
                
                <div class="architecture-diagram glass-panel">
                    <div class="level external"><strong>External Level (View)</strong> - How users see the data.</div>
                    <div class="level-arrow">⬇️</div>
                    <div class="level logical"><strong>Logical/Conceptual Level</strong> - Entities, attributes, relationships (How data is logically organized).</div>
                    <div class="level-arrow">⬇️</div>
                    <div class="level physical"><strong>Physical/Internal Level</strong> - How data is physically stored on the hard drive.</div>
                </div>

                <div class="analogy-box glass-panel" style="margin-top: 20px;">
                    <h4>💡 Explain Like I'm New</h4>
                    <p>Think of a restaurant:</p>
                    <ul>
                        <li><strong>External Level:</strong> The menu the customer sees. (They don't see how the food is made).</li>
                        <li><strong>Logical Level:</strong> The chef's recipe. (What ingredients go together).</li>
                        <li><strong>Physical Level:</strong> The kitchen shelves and fridge. (Where exactly the ingredients are physically stored).</li>
                    </ul>
                </div>
            </div>
        `,
        checklist: [
            "I know the 5 components of a DBMS.",
            "I can define the 3 levels of ANSI-SPARC architecture.",
            "I understand what Data Independence means."
        ]
    },
    {
        id: "module-3",
        title: "Data Models",
        description: "Hierarchical, Network, Relational, and Object-Oriented models.",
        content: `
            <div class="lesson-section">
                <h3>1. What is a Data Model?</h3>
                <p>A data model represents the logical structure of a database. It describes how data is stored, organized, and manipulated.</p>
            </div>

            <div class="lesson-section">
                <h3>2. Types of Data Models</h3>
                
                <h4>a. Hierarchical Model</h4>
                <p>An old technique where data is organized in a tree-like structure. It supports <strong>1-to-Many</strong> relationships. (e.g., A manager has many employees, but an employee has only one manager).</p>

                <h4>b. Network Model</h4>
                <p>Data is stored in the form of graphs. Unlike hierarchical, it supports <strong>Many-to-Many</strong> relationships. (e.g., A student takes many courses, and a course has many students).</p>

                <h4>c. Relational Model</h4>
                <p>The most widely used model today. Data is stored in 2D tables consisting of rows and columns.</p>

                <h4>d. Object-Based Data Model</h4>
                <p>When object behaviors, actions, and attributes are dealt with using Object-Oriented Programming (OOP) concepts.</p>
            </div>

            <div class="analogy-box glass-panel">
                <h4>💡 Explain Like I'm New</h4>
                <p><strong>Hierarchical</strong> is like a family tree (parents to children). <strong>Network</strong> is like a roadmap connecting many cities to many other cities. <strong>Relational</strong> is like a beautifully organized Excel spreadsheet.</p>
            </div>
        `,
        checklist: [
            "I can list the main types of Data Models.",
            "I can explain the difference between Hierarchical and Network models.",
            "I know what the Relational Model is based on."
        ]
    },
    {
        id: "module-4",
        title: "Entity Relationship (ER) Model",
        description: "Entities, Attributes, Relationships, and Cardinality.",
        content: `
            <div class="lesson-section">
                <h3>1. Entities and Attributes</h3>
                <p><strong>Entity:</strong> A real-world object with independent existence (e.g., Student, Teacher, Car).</p>
                <p><strong>Attribute:</strong> Properties or characteristics of an entity (e.g., Student ID, Name, Age).</p>
            </div>

            <div class="lesson-section">
                <h3>2. Relationships and Cardinality</h3>
                <p>A <strong>Relationship</strong> is how entities are connected to one another.</p>
                <p><strong>Cardinality:</strong> Defines how many instances of one entity are connected to instances of another entity (Business Rules). 
                Min and Max limits.</p>
                <ul>
                    <li>One-to-One (1:1)</li>
                    <li>One-to-Many (1:N)</li>
                    <li>Many-to-Many (M:N)</li>
                </ul>

                <div class="visual-placeholder glass-panel" style="text-align:center; padding: 20px; border: 1px dashed var(--accent-primary);">
                    <i class="fa-solid fa-project-diagram" style="font-size: 2rem; color: var(--accent-primary);"></i>
                    <p>Teacher ---(Teaches)---> Student</p>
                    <p><em>(Interactive ER diagram tool available in Phase 3)</em></p>
                </div>
            </div>

            <div class="analogy-box glass-panel">
                <h4>💡 Explain Like I'm New</h4>
                <p>An <strong>Entity</strong> is a Noun (e.g., Customer). An <strong>Attribute</strong> is an Adjective describing the noun (e.g., Name, Phone). A <strong>Relationship</strong> is the Verb connecting them (e.g., Customer <em>Buys</em> Product).</p>
            </div>
        `,
        checklist: [
            "I can identify an Entity and an Attribute from a scenario.",
            "I can explain what Cardinality means.",
            "I can differentiate between 1:N and M:N relationships."
        ]
    },
    {
        id: "module-5",
        title: "Relational Model",
        description: "Tables, Tuples, Attributes, Domains, and Database Languages.",
        content: `
            <div class="lesson-section">
                <h3>1. The Terminology of Relational DBs</h3>
                <p>In a relational database, everything is stored in tables. But we use specific mathematical terms:</p>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Common Term</th>
                                <th>Relational Term</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Table</td><td>Relation</td></tr>
                            <tr><td>Row / Record</td><td>Tuple</td></tr>
                            <tr><td>Column / Field</td><td>Attribute</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="lesson-section">
                <h3>2. Database Languages</h3>
                <p>SQL (Structured Query Language) is divided into categories:</p>
                <ul>
                    <li><strong>DDL (Data Definition Language):</strong> Define the schema (CREATE, DROP, ALTER).</li>
                    <li><strong>DML (Data Manipulation Language):</strong> Manipulate the data (INSERT, UPDATE, DELETE).</li>
                    <li><strong>DQL (Data Query Language):</strong> Retrieve data (SELECT).</li>
                    <li><strong>DCL (Data Control Language):</strong> Access controls (GRANT, REVOKE).</li>
                    <li><strong>TCL (Transaction Control Language):</strong> Manage transactions (COMMIT, ROLLBACK).</li>
                </ul>
            </div>

            <div class="analogy-box glass-panel">
                <h4>💡 Explain Like I'm New</h4>
                <p><strong>DDL</strong> is building the house (walls, rooms). <strong>DML</strong> is moving furniture into the house. <strong>DQL</strong> is looking through the window to see what furniture is inside!</p>
            </div>
        `,
        checklist: [
            "I know the difference between a Tuple and an Attribute.",
            "I can classify CREATE as DDL and INSERT as DML.",
            "I understand the purpose of TCL commands."
        ]
    }
];

window.modulesData = modulesData;
