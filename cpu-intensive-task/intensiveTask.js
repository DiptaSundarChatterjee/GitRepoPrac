function fibonacci(n) {
    if (n <= 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  function performTaskWithoutParallelism() {
    const start = process.hrtime.bigint();
    const result = fibonacci(40); 
  
    const end = process.hrtime.bigint();
    const timeDiff = end - start;
    console.log(`Time taken without parallelism: ${timeDiff / BigInt(1e6)} milliseconds`);
  }
  
  performTaskWithoutParallelism();
  