const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');
const errorPath = path.join(distPath, '404.html');

try {
    if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, errorPath);
        console.log('✅ 404.html creado exitosamente.');
    } else {
        console.error('❌ Error: index.html no se encontró en la carpeta dist.');
    }
} catch (err) {
    console.error('❌ Error al copiar 404.html:', err);
}