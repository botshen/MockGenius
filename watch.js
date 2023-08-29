// const fs = require('fs');
import fs from 'fs';
// const chokidar = require('chokidar');
// const { exec } = require('child_process');
import {exec} from 'child_process';
import chokidar from 'chokidar';
const filesToWatch = ['src', 'public']; // 监视的文件或文件夹
const buildCommand = 'npm run build'; // 构建命令

const watcher = chokidar.watch(filesToWatch);

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`);
  // 在文件变更时执行构建命令
  exec(buildCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during build: ${error.message}`);
      return;
    }
    console.log('Build successful');
  });
});
