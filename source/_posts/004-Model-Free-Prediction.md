---
title: 004-Model Free Prediction
mathjax: true
date: 2019-08-28 17:27:35
categories:
    - RL(David Silver)
tags:
    - RL
---
Estimate the value function of an unknown MDP

### Monte-Carlo Reinforcement Learning

* Learn directly from episodes of experiecnce
* model-free
* complete episodes: no bootstraping
* simplest possible idea: value = mean return

#### First visit Monte-Carlo

* evaluate state s
* **first** time-step t that state is visited in an episode
* $N(s) \leftarrow N(s) + 1$
* $S(s) \leftarrow S(s) + G_t$
*  $V(s) = S(s) / N(s)$

#### Every-visit Monte-Carlo

* evaluate state s
* **every** time-step t that state is visited in an episode
* $N(s) \leftarrow N(s) + 1$
* $S(s) \leftarrow S(s) + G_t$
*  $V(s)\;=\;S(s) / N(s)$

#### Incremental Mean

$$
\begin{aligned}
\mu_k &= \frac{1}{k}\sum_{j=1}^k x_j \\
      &= \frac{1}{k}(x_k + (k-1)\mu_{k-1}) \\
      &= \mu_{k-1} + \frac{1}{k}(x_k - \mu_{k-1})
\end{aligned}
$$

#### Incremental Monte-Carlo Updates

Update $V(s)$ incrementally after episode $S_1, A_1, R_1, ..., S_T$

$$
\begin{aligned}
&N(S_t) \leftarrow N(S_t) + 1 \\
&V(S_t) \leftarrow V(S_t) + \frac{1}{N(S_t)}(G_t - V(S_t)
\end{aligned}
$$
forget old episodes
$$
V(S_t) \leftarrow V(S_t) + \alpha(G_t - V(S_t))
$$

### Timeporal Difference Learning

* Learn directly from episodes of experiecnce
* model-free
* incomplete episodes: by bootstraping
* update a guess towards a guess

#### TD(0)

$$
\begin{aligned}
\delta &= R_{t+1}+\gamma V(S_{t+1}) - V(S_t)\\
V(S_t) &\leftarrow V(S_t) + \alpha * \delta
\end{aligned}
$$

#### Forward View TD($\lambda$)

Compelete Episodes

N-step Return
$$
G_t^{(n)} = R_{t+1} + \gamma R_{t+2} + ... + \gamma ^{n-1}R_{t+n}+\gamma^n V(S_{t+n})
$$

$\lambda$-Return 
$$
G_t^{\lambda} = (1-\lambda)\sum_{n=1}^{\infin}\lambda^{n-1}G_t^{(n)}
$$
Forward view TD($\lambda$)
$$
V(S_t) \leftarrow V(S_t) + \alpha(G_t^\lambda - V(S_t))
$$

#### Backward View TD($\lambda$)

* Forward view provides theory
* Backward view provides mechanism
* Update online, every step, from incomplete sequences
 
Eligibility trace
$$
\begin{aligned}
E_0(s) &= 0 \\
E_t(s) &= \gamma\lambda E_{t-1}(s)+I(S_t=s) 
\end{aligned}
$$

Backward View TD($\lambda$)
* Keep an eligibility trace for every state s
* Update value V(s) for every state s
$$
\begin{aligned}
\delta_t &= R_{t+1}+\gamma V(S_{t+1}) - V(S_t) \\ 
V(S) &\leftarrow V(S) + \alpha\delta_t E_t(S)
\end{aligned}
$$