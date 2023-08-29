import { exec } from 'child_process';
import chokidar from 'chokidar';
const filesToWatch = ['src', 'public']; // 监视的文件或文件夹
const buildCommand = 'npm run build'; // 构建命令

const watcher = chokidar.watch(filesToWatch);

watcher.on('change', (path) => {
  console.info(`File ${path} has been changed`);
  exec(buildCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during build: ${error.message}`);
      return;
    }
    console.log('构建完成😈');
  });
});
