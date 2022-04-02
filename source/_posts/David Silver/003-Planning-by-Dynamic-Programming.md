---
title: 003-Planning by Dynamic Programming
mathjax: true
date: 2019-08-28 17:27:24
categories:
    - RL(David Silver)
tags:
    - RL
---
### Planning

Dynamic programming assumes full knowledge of the MDP

* Prediction
    * Input: MDP $\lt S, A, P, R, \gamma\gt$ policy $\pi$
    * Input: MRP $\lt S, P^\pi, R^\pi, \gamma\gt$
    * Output: value function $V_\pi$
* Control
    * Input: MDP $ \lt S, A, P, R, \gamma\gt $ 
    * Output: optimal value function $V_*$
    * Output: optimal policy $\pi_*$

### Policy Evaluation

* Problem: evaluate a given policy $\pi$
* Solution: iterative application of Bellman expectation backup
* $V_1 \rightarrow V_2 \rightarrow ... \rightarrow V_\pi$
* synchronout backups
    * At each iteration $k+1$
    * For all states $s\in S$
    * Update $V_{k+1}(s)$ from $V_k(s')$

### Policy Iteration

* Evaluate the policy $\pi$
* imporve the policy by acting greedily with respect to $V_\pi$
$$
\pi' = greedy(V_\pi)
$$
this process of policy iteration always converges to $\pi_*$

### Value Iteration

* Problem: find optimal policy $\pi$
* Solution: iterative application of Bellman opimality backup
* $V_1 \rightarrow V_2 \rightarrow ... \rightarrow V_*$
* sychronous backup
    * At each iteration $k+1$
    * For all state $s\in S$
    * Update $V_{k+1}(s)$ from $V_k(s')$

### Summary

Problem | Bellman Equation | Algorithm
--- |--- | ---
Prediction | Bellman Expectation Equation | Iterative Policy Evaluation
Control | Bellman Expection Equation + Greedy Policy Improvement | Policy Iteration
Control | Bllman Optimaliry Equation | Value Iteration 


