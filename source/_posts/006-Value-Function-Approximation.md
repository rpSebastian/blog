---
title: 006-Value Function Approximation
mathjax: true
date: 2019-08-28 17:27:54
categories:
    - RL(David Silver)
tags:
    - RL
---
### Introduction

* Estimate value function with function approximation
$$
\hat v(s, w) ≈ v_\pi(s) \\ 
\hat q(s, a, w) ≈ q_\pi(s, a)
$$
* Generalise from seen states to unseen states
Update parameter w using MC or TD learning

![](https://ww1.sinaimg.cn/large/006A69aEly1g5zeudlp2lj30o80cuq3m.jpg)

#### Objective Function

$$
J(w) = E_\pi[(v_\pi(S) - \hat v(S, w))^2]
$$

#### Least Squares Prediction

experice 
$$
D = \{\lt s_1, v_1^\pi\gt, \lt s_2, v_2^\pi\gt, ... , \lt s_T, v_T^\pi\gt\}
$$
loss
$$
LS(w) = \sum_{t=1}^T(v_t^\pi - \hat v(s_t, w))^2
$$
### Deep Q-Network

* DQN uses experience replay and fixed Q-targets
* Take action $a_t$ according to $\epsilon$-greedy policy
* Store transition $(s_t, a_t, r_{t+1}, s_{t+1})$ in replay memory D
* Sample random mini-batch of transitions $(s, a, r, s')$ from D
* Compute Q-learning targets w.r.t. old, fixed parameters $w-$
* Optimise MSE between Q-network and Q-learning targets
$$
L_i(w_i) = E_{s, a, r, s' \sim D_i}[(r + \gamma \max_{a'}Q(s', a'; w_i^-)-Q(s, a; w_i))^2]
$$
* Using variant of stochastic gradient descent

