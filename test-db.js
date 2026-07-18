
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      // ← Empty for XAMPP default
    database: 'insurepro'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL via XAMPP!');
        connection.query('SHOW TABLES', (err, results) => {
            console.log('📋 Tables:', results);
            connection.end();
        });
    }
});//jjjjjjhh