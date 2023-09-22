import { exec, ChildProcess } from 'child_process';
import chokidar from 'chokidar';
import { performance, PerformanceObserver } from 'perf_hooks';
import chalk from 'chalk';

const filesToWatch = ['src', 'public']; // 监视的文件或文件夹
const buildCommand = 'npm run build'; // 构建
const minBuildInterval = 1000; // 最小构建间隔（毫秒）

let currentBuildProcess = null; // 当前构建进程

const watcher = chokidar.watch(filesToWatch);

// 创建性能观察器以测量构建时间
const obs = new PerformanceObserver((list) => {
  const entry = list.getEntries()[0];
  const buildTime = entry.duration.toFixed(2);
  console.log(`\n✅ Build completed in ${chalk.green(`${buildTime} ms`)}`);
});
obs.observe({ entryTypes: ['measure'], buffered: false });

watcher.on('change', (path) => {
  console.info(`\n📁 File ${path} has been changed`);

  // 如果当前有正在进行的构建任务，终止它
  if (currentBuildProcess) {
    console.log(chalk.yellow(`Terminating the previous build...`));
    currentBuildProcess.kill();
  }

  console.log(chalk.blue(`\n🚧 Building...`));

  // 启动新的构建并测量时间
  const startTime = performance.now();
  const build = exec(buildCommand, (error, stdout, stderr) => {
    currentBuildProcess = null; // 构建完成后将进程设置为null

    if (error) {
      console.error(chalk.red(`❌ Error during build: ${error.message}`));
      return;
    }
    const endTime = performance.now();
    performance.mark('build-end');
    performance.measure('build-duration', 'build-start', 'build-end');
  });

  currentBuildProcess = build; // 将当前构建进程设置为新的构建进程

  performance.mark('build-start');
});
