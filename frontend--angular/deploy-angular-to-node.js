const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const admZip = require('adm-zip');


const PATHS = {
  ANGULAR_DIST: path.join(__dirname, '/dist/frontend/browser'), 
  NODE_PUBLIC: path.join(__dirname, '../backend--nodejs/public'), 
  NODE_BACKUP: path.join(__dirname, '../backend--nodejs/backup-public'), 
};

console.log(`Angular dist path: ${PATHS.ANGULAR_DIST}`);


function createBackup() {
  if (!fs.existsSync(PATHS.NODE_BACKUP)) {
    fs.mkdirSync(PATHS.NODE_BACKUP, { recursive: true });
  }

  const backupFileName = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
  const backupFilePath = path.join(PATHS.NODE_BACKUP, backupFileName);

  const zip = new admZip();
  if (fs.existsSync(PATHS.NODE_PUBLIC)) {
    zip.addLocalFolder(PATHS.NODE_PUBLIC);
    zip.writeZip(backupFilePath);
    console.log(`🟢 Backup criado: ${backupFilePath}`);
  } else {
    console.log('🟠 Pasta pública não encontrada, nenhum backup necessário.');
  }
}


function cleanPublicFolder() {
  if (fs.existsSync(PATHS.NODE_PUBLIC)) {
    fs.rmSync(PATHS.NODE_PUBLIC, { recursive: true, force: true });
  }
  fs.mkdirSync(PATHS.NODE_PUBLIC, { recursive: true });
}


function copyAngularFiles() {
  if (!fs.existsSync(PATHS.ANGULAR_DIST)) {
    throw new Error('🟠 Pasta de build do Angular não encontrada!');
  }

  
  fs.cpSync(PATHS.ANGULAR_DIST, PATHS.NODE_PUBLIC, { recursive: true });
  console.log('🟢 Arquivos do Angular copiados para a pasta pública do Node.js!');
}


try {
  console.log('⭐⭐⭐Iniciando deploy do Angular para Node.js...');
  createBackup();
  cleanPublicFolder();
  copyAngularFiles();
  console.log('✅ Deploy concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro durante o deploy:', error.message);
}