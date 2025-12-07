const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 读取 SVG 文件
const svgPath = path.join(__dirname, '../public/images/logo.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// 提取 base64 数据
const base64Match = svgContent.match(/xlink:href="data:img\/png;base64,([^"]+)"/);
if (!base64Match) {
  console.error('无法从 SVG 中提取 base64 数据');
  process.exit(1);
}

const base64Data = base64Match[1];
const pngBuffer = Buffer.from(base64Data, 'base64');

// 转换为 ICO
(async () => {
  try {
    // 使用 sharp 将 PNG 转换为不同尺寸，然后合并为 ICO
    // 注意：sharp 不直接支持 ICO，我们需要先转换为 PNG，然后使用其他工具
    // 或者直接使用 PNG 作为 favicon（现代浏览器支持）
    
    // 先创建不同尺寸的 PNG
    const sizes = [16, 32, 48];
    const images = await Promise.all(
      sizes.map(size => 
        sharp(pngBuffer)
          .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer()
      )
    );
    
    // 使用 to-ico 格式创建 ICO 文件
    // 由于 sharp 不直接支持 ICO，我们使用一个简单的 ICO 生成方法
    // 或者直接保存为 PNG（现代浏览器支持 PNG favicon）
    
    // 简单方法：直接使用 32x32 PNG 作为 favicon（浏览器会识别）
    // 但用户要求 ICO 格式，所以我们需要创建一个真正的 ICO 文件
    
    // 创建一个简单的 ICO 文件结构
    const icoPath = path.join(__dirname, '../public/favicon.ico');
    
    // 使用 sharp 创建 32x32 的 PNG，然后手动转换为 ICO 格式
    // 为了简化，我们先创建一个有效的 ICO 文件
    const ico32 = await sharp(pngBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    
    // 创建 ICO 文件头 + PNG 数据
    // ICO 文件格式：文件头 + 图像数据
    const icoHeader = Buffer.alloc(22);
    icoHeader.writeUInt16LE(0, 0); // Reserved (must be 0)
    icoHeader.writeUInt16LE(1, 2); // Type (1 = ICO)
    icoHeader.writeUInt16LE(1, 4); // Number of images
    
    // Image directory entry
    icoHeader.writeUInt8(32, 6); // Width
    icoHeader.writeUInt8(32, 7); // Height
    icoHeader.writeUInt8(0, 8); // Color palette (0 = no palette)
    icoHeader.writeUInt8(0, 9); // Reserved
    icoHeader.writeUInt16LE(1, 10); // Color planes
    icoHeader.writeUInt16LE(32, 12); // Bits per pixel
    icoHeader.writeUInt32LE(ico32.length, 14); // Image data size
    icoHeader.writeUInt32LE(22, 18); // Offset of image data
    
    // 合并头部和图像数据
    const icoFile = Buffer.concat([icoHeader, ico32]);
    
    fs.writeFileSync(icoPath, icoFile);
    
    console.log('✅ 成功转换 favicon.ico');
    console.log(`📁 文件位置: ${icoPath}`);
    console.log(`📏 尺寸: 32x32`);
  } catch (error) {
    console.error('❌ 转换失败:', error);
    process.exit(1);
  }
})();

