const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

function fibonacci(n) {
  if (n <= 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

if (isMainThread) {
  const start = process.hrtime.bigint();

  const worker = new Worker(__filename, {
    workerData: 40 
  });

  worker.on('message', (result) => {
    const end = process.hrtime.bigint();
    const timeDiff = end - start;
    console.log(`Time taken with worker threads: ${timeDiff / BigInt(1e6)} milliseconds`);
  });
  
} else {
  const result = fibonacci(workerData);
  parentPort.postMessage(result);
}
