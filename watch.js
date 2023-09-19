import { exec } from 'child_process';
import chokidar from 'chokidar';
import { performance, PerformanceObserver } from 'perf_hooks';
import chalk from 'chalk';

const filesToWatch = ['src', 'public']; // 监视的文件或文件夹
const buildCommand = 'npm run build'; // 构建
const minBuildInterval = 1000; // 最小构建间隔（毫秒）

let isBuilding = false; // 标志用于检测是否正在构建中

const watcher = chokidar.watch(filesToWatch);

// 创建性能观察器以测量构建时间
const obs = new PerformanceObserver((list) => {
  const entry = list.getEntries()[0];
  const buildTime = entry.duration.toFixed(2);
  console.log(`\n✅ Build completed in ${chalk.green(`${buildTime} ms`)}`);
  isBuilding = false; // 构建完成后将标志设置为false
});
obs.observe({ entryTypes: ['measure'], buffered: false });

watcher.on('change', (path) => {
  console.info(`\n📁 File ${path} has been changed`);

  // 如果两次保存时间间隔太短，只处理最新的保存
  if (isBuilding) {
    console.log(chalk.yellow(`Waiting for the latest build to complete...`));
    return;
  }

  console.log(chalk.blue(`\n🚧 Building...`));
  isBuilding = true; // 设置为正在构建中

  // 启动构建并测量时间
  const startTime = performance.now();
  exec(buildCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`❌ Error during build: ${error.message}`));
      isBuilding = false; // 构建出错时将标志设置为false
      return;
    }
    const endTime = performance.now();
    performance.mark('build-end');
    performance.measure('build-duration', 'build-start', 'build-end');

    // 等待一段时间后重置构建标志
    setTimeout(() => {
      isBuilding = false;
    }, minBuildInterval);
  });
  performance.mark('build-start');
});
