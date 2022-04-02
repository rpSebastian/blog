---
title: 005-Model Free Control
mathjax: true
date: 2019-08-28 17:27:44
categories:
    - RL(David Silver)
tags:
    - RL
---
optimise the valuefunction of an unknown MDP

### On-policy and Off-policy

* On-policy learning
    * Learn on the job
    * Learn about policy π from experience sampled from π 
* Off-policy learning
    * Look over someone’s shoulder
    * Learn about policy π from experience sampled from µ

### On-policy Monte-Carlo Learning

#### $\epsilon$-Greedy Exploration

$$
 \pi(a|s)=\left\{
\begin{aligned}
&\epsilon / m + 1 - \epsilon \;& if a^* = \arg\max_{a\in A} Q(s, a)\\
&\epsilon / m    & otherwise
\end{aligned}
\right.
$$

#### Monte-Carlo Policy Iteration

* Policy Evaluation: Monte-Carlo policy Evalutaion, $Q=q_\pi$
* Pollicy Improvement: $\epsilon$-greedy policy improvement

#### GLIE Monte-Carlo Control(Greedy in the Limit with Infinite Exploration)

* 对于使用$\pi$的第k次采样序列: $\{S_1, A_1, R_2, ..., S_T\}$
* 更新每一个状态和动作
$$
\begin{aligned}
N(S_t, A_t) &\leftarrow N(S_t, A_t) + 1 \\
Q(S_t, A_r) &\leftarrow Q(S_t, A_t) + \frac{1}{N(S_t, A_t)}(G_t - Q(S_t, A_t))
\end{aligned}
$$
* 优化策略
$$
\begin{aligned}
\epsilon &\leftarrow 1 / k \\
\pi & \leftarrow \epsilon-greedy(Q)
\end{aligned}
$$

### On-Policy Temporal-Difference Learning

#### Sarsa

$$
Q(S, A) \leftarrow Q(S, A) + \alpha(R + \gamma Q(S', A') - Q(S, A)
$$
![](https://ww1.sinaimg.cn/large/006A69aEly1g5zckgpzehj30j1078whp.jpg)
#### n-step Sarsa

Q-return
$$
q_t(n) = R_{t+1} + \gamma R_{t+2} + ... + \gamma ^ {n - 1} R_{t + n} + \gamma^n Q(S_{t+n}) 
$$
n-step Sarsa
$$
Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha(q_t^{(n)} - Q(S_t, A_t))
$$

#### Forward View Sarsa($\lambda$)

$$
q_t^\lambda = (1 - \lambda)\sum_{n=1}^\infty \lambda^{n-1}q_t^{(n)}
$$
Sarsa($\lambda$)
$$
Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha(q_t^{\lambda} - Q(S_t, A_t))
$$

#### Backward View Sarsa($\lambda$)

Eligible Trace
$$
E_t(s, a) = \gamma\lambda E_{t-1}(s, a) + I(S_t=s, A_t=a)
$$
Update for every state s and action a
$$
\begin{aligned}
\delta_t &= R_{t+1}+\gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t) \\ 
Q(s, a) &\leftarrow Q(s, a) + \alpha \delta_t E_t(s, a)
\end{aligned}
$$

#### Backward View Sarsa($\lambda$) Algorithm
![image](https://ww1.sinaimg.cn/large/006A69aEly1g5scilvdj6j30i60aatbw.jpg)

### Off-Policy Learning

* evaluate target policy $\pi(a|s)$ to compute $v_\pi(s)$ or $q_\pi(s, a)$
* While following behaviour policy $\mu(a|s)$
$$
\{S_1, A_1, R_2, ..., S_T \} ∼ \mu
$$

#### Importance Sampling for off-policy Monte-Carlo

$$
G_t^{\pi/\mu}=\frac{\pi(A_t|S_t)\pi(A_{t+1}|S_{t+1})}{\mu(A_t|S_t)\mu(A_{t+1}|S_{t+1})}...\frac{\pi(A_T|S_T)}{\mu(A_T|S_T)}G_t
$$
$$
V(S_t) \leftarrow V(S_t) + \alpha(G_t^{\pi/\mu}-V(S_t))
$$
Importance sampling can dramatically increase variance

#### Importance Sampling for off-policy TD  
$$
V(S_t) \leftarrow V(S_t) + \alpha(\frac{\pi(A_t|S_t)}{\mu(A_t|S_t)}(R_{t+1}+\gamma V(S_{t+1})-V(S_t))
$$

#### Q-learning

* Next action is chosen using behavior policy $A_{t+1} \sim \mu(·|S_t) $
* Consider Alternative successor action $A' \sim \pi(·|S_t)$

$$
Q(S_t, A_t) \leftarrow Q(S_t, A_r) + \alpha(R_{t+1} + \gamma Q(S_{t+1}, A') - Q(S_t, A_t))
$$

#### Off-policy Q-learning
$$
Q(S, A) \leftarrow Q(S, A) + \alpha(R + \gamma \max_a'Q(S', a') - Q(S, A))
$$
![](https://ww1.sinaimg.cn/large/006A69aEly1g5zcice89cj30j406lwgt.jpg)

