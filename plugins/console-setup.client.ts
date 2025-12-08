// plugins/console-art.client.ts
export default defineNuxtPlugin(() => {
  // 定义深蓝色变量，方便统一修改
  const deepBlue = '#1a237e'; // 一种深沉的靛蓝色
  // 定义一个稍微亮一点的蓝色用于强调文字
  const accentBlue = '#283593';

  // 将 "Le Yi Li" 和 "煤球精灵" 拼接在同一个字符串中
  // 通过空格进行视觉上的对齐
  const combinedArt = `
  _          __   __  _      _       _ 
 | |         \\ \\ / / (_)    | |     (_)
 | |     ___  \\ V /   _     | |      _        (o o)
 | |    / _ \\  | |   | |    | |     | |      (  -  )
 | |___|  __/  | |   | |    | |___  | |     --m---m--
 |______\\___|  |_|   |_|    |_____| |_|
  `;

  // 1. 打印组合好的字符画 (使用深蓝色)
  console.log(
    `%c${combinedArt}`,
    `color: ${deepBlue}; font-family: monospace; font-weight: bold; line-height: 1.2;`
  );

  // 2. 打印欢迎语 (颜色也调整为蓝色系)
  console.log(
    `%c 👋 Welcome to my corner.`,
    `color: ${accentBlue}; font-family: sans-serif; font-size: 14px; padding-top: 5px; font-weight: bold;`
  );
  
  // 3. 底部技术栈小标签 (配色同步更新)
  console.log(
    '%c Powered by %c @Le Yi Li',
    `background: ${deepBlue}; color: #fff; border-radius: 3px 0 0 3px; padding: 2px 6px;`,
    `background: #e8eaf6; color: ${deepBlue}; border-radius: 0 3px 3px 0; padding: 2px 6px;` // e8eaf6 是一种很浅的蓝灰色背景
  );
});




