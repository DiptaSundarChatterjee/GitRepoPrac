function countWays(n, coins, sum) {
    let dp = Array(sum + 1).fill(0);
    dp[0] = 1;

    for (let i = 0; i < n; i++) {
        for (let j = coins[i]; j <= sum; j++) {
            dp[j] += dp[j - coins[i]];
        }
    }
    return dp[sum];
}
let n = 3;
let coins = [1, 2, 5];
let targetSum = 5;
console.log(countWays(n, coins, targetSum)); 
