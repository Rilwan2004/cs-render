import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const runMigration = async () => {
    let connection;

    try {
        connection = await mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

        console.log("Connected to Railway MySQL.");

        await connection.query(`
            ALTER TABLE \`user\`
            ADD COLUMN \`phone\` VARCHAR(20) DEFAULT NULL AFTER \`email\`
        `);

        console.log("✅ Phone column added successfully.");
    } catch (error) {
        console.error("❌ Migration failed:");
        console.error(error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

runMigration();