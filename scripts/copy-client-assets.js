const fs = require('fs');
const path = require('path');

// 源目录：.nuxt/dist/client
const sourceDir = path.join(__dirname, '..', '.nuxt', 'dist', 'client');
// 目标目录：dist/_nuxt
const targetDir = path.join(__dirname, '..', 'dist', '_nuxt');

// 复制目录的函数
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 检查源目录是否存在
if (!fs.existsSync(sourceDir)) {
  console.error(`源目录不存在: ${sourceDir}`);
  process.exit(1);
}

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 复制 assets 目录
const sourceAssets = path.join(sourceDir, 'assets');
const targetAssets = path.join(targetDir, 'assets');

if (fs.existsSync(sourceAssets)) {
  console.log('正在复制客户端资源到 dist/_nuxt/...');
  copyDir(sourceAssets, targetAssets);
  console.log('✅ 客户端资源复制完成！');
} else {
  console.warn(`警告: 源资源目录不存在: ${sourceAssets}`);
}

// 复制 manifest.json（如果存在）
const sourceManifest = path.join(sourceDir, 'manifest.json');
const targetManifest = path.join(targetDir, 'manifest.json');

if (fs.existsSync(sourceManifest)) {
  fs.copyFileSync(sourceManifest, targetManifest);
  console.log('✅ manifest.json 复制完成！');
}

console.log('构建后处理完成！');

