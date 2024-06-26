function matrixChainMultiplication(p) {
    
    let dimensions = p.split(' ').map(Number);
    let n = dimensions.length - 1; 
    
    
    let m = Array.from({ length: n }, () => Array(n).fill(0));
    let s = Array.from({ length: n }, () => Array(n).fill(0));
    
    
    for (let l = 2; l <= n; l++) {
        for (let i = 0; i < n - l + 1; i++) {
            let j = i + l - 1;
            m[i][j] = Infinity;
            for (let k = i; k < j; k++) {
                let q = m[i][k] + m[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
                if (q < m[i][j]) {
                    m[i][j] = q;
                    s[i][j] = k;
                }
            }
        }
    }
    
    
    function constructOptimalOrder(s, i, j) {
        if (i === j) {
            return `A${i + 1}`;
        } else {
            return `(${constructOptimalOrder(s, i, s[i][j])}${constructOptimalOrder(s, s[i][j] + 1, j)})`;
        }
    }
    
   
    let optimalOrder = constructOptimalOrder(s, 0, n - 1);
    let numOps = m[0][n - 1];
    
    return `${optimalOrder}${numOps}`;
}


let input = "10 20 30 40 30";
console.log(matrixChainMultiplication(input)); 
