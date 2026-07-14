const path = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');
const { spawn } = require('child_process');
const backupRepository = require('../repositories/backup.repository');
const shopRepository = require('../repositories/shop.repository');

const BACKUP_DIR = path.join(__dirname, '../../uploads/backups');

const TABLES_WITH_SHOP_ID = ['categories', 'products', 'stock_transactions', 'shop_schedules'];

function dateStr(now) {
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
}

function safeName(name) {
    return (name || 'Unknown')
        .replace(/[^a-zA-Z0-9_ -]/g, '')
        .trim()
        .replace(/\s+/g, '_');
}

function fileName(shopName, ownerName) {
    return `Tokdak_${safeName(shopName)}_${safeName(ownerName)}_${dateStr(new Date())}.sql`;
}

const getAllBackups = async (page = 1, limit = 10) => {
    return await backupRepository.getAllBackups(page, limit);
};

const getBackupStats = async () => {
    return await backupRepository.getBackupStats();
};

const getBackupById = async (id) => {
    return await backupRepository.getBackupById(id);
};

function runMysqldump(args, filePath) {
    const mysqldump = process.env.MYSQLDUMP_PATH || 'mysqldump';
    return new Promise((resolve, reject) => {
        const child = spawn(mysqldump, args, {
            env: { ...process.env, MYSQL_PWD: process.env.DB_PASSWORD },
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true,
        });
        const outStream = fsSync.createWriteStream(filePath, { flags: 'a' });
        child.stdout.pipe(outStream);
        let stderr = '';
        child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
        child.on('close', (code) => {
            outStream.end();
            if (code === 0 || code === 2) resolve();
            else reject(new Error(stderr || `mysqldump exited with code ${code}`));
        });
        child.on('error', reject);
    });
}

const createBackup = async (backupData) => {
    const shop = await shopRepository.findShopById(backupData.shop_id);

    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const file_name = fileName(shop?.shop_name, shop?.owner_name);
    const filePath = path.join(BACKUP_DIR, file_name);

    const { DB_HOST, DB_PORT, DB_USER, DB_NAME } = process.env;

    const baseArgs = [
        `--host=${DB_HOST}`,
        `--port=${DB_PORT}`,
        `--user=${DB_USER}`,
        `--protocol=tcp`,
        `--single-transaction`,
        `--complete-insert`,
        `--skip-add-locks`,
        `--skip-lock-tables`,
        `--no-tablespaces`,
        `--set-gtid-purged=OFF`,
    ];

    const writeHeader = `-- Tokdak Backup for ${shop?.shop_name}
-- Shop ID: ${backupData.shop_id}
-- Date: ${dateStr(new Date())}
-- ========================================================\n\n`;

    await fs.writeFile(filePath, writeHeader, 'utf8');

    const tableWhere = (table) => {
        if (table === 'stock_transactions') {
            return `product_id IN (SELECT product_id FROM products WHERE shop_id=${backupData.shop_id})`;
        }
        return `shop_id=${backupData.shop_id}`;
    };

    const allTables = ['shops', ...TABLES_WITH_SHOP_ID];

    try {
        for (const table of allTables) {
            const args = baseArgs.concat([
                `--where=${tableWhere(table)}`,
                DB_NAME,
                table,
            ]);
            await runMysqldump(args, filePath);
        }
    } catch (dumpErr) {
        console.error('mysqldump failed:', dumpErr.message);
        const stat = await fs.stat(filePath).catch(() => ({ size: 0 }));
        return await backupRepository.createBackup({
            shop_id: backupData.shop_id,
            user_id: backupData.user_id,
            file_name,
            file_size: stat.size,
            status: 'failed',
            note: backupData.note || `Dump failed: ${dumpErr.message}`,
        });
    }

    const { size } = await fs.stat(filePath);

    return await backupRepository.createBackup({
        shop_id: backupData.shop_id,
        user_id: backupData.user_id,
        file_name,
        file_size: size,
        status: 'success',
        note: backupData.note || null,
    });
};

const getBackupFilePath = async (id) => {
    const backup = await backupRepository.getBackupById(id);
    if (!backup) return null;
    return { backup, filePath: path.join(BACKUP_DIR, backup.file_name) };
};

const deleteBackup = async (id) => {
    const backup = await backupRepository.getBackupById(id);
    if (backup && backup.file_name) {
        const filePath = path.join(BACKUP_DIR, backup.file_name);
        await fs.unlink(filePath).catch(() => {});
    }
    return await backupRepository.deleteBackup(id);
};

module.exports = {
    getAllBackups,
    getBackupStats,
    getBackupById,
    createBackup,
    getBackupFilePath,
    deleteBackup
};
