---
title: sarsa(λ)推导
mathjax: true
date: 2019-09-04 17:13:36
categories:  
    - RL(David Silver)
tags:
    - RL
---

在阅读David Silver中提到了 Forward View Sarsa(λ) 和 Backward View Sarsa(λ)， 下面对这两种方法之间的转化进行推导，并比较两者之间的关系。

### Forward View Sarsa(λ)

假设一个片段为
$$
S_t, A_t, R_{t+1}, S_{t+1},A_{t+1},R_{t+2},...,R_{T-1},S_{T-1},A_{T-1},R_{T},S_T
$$
在估计 $S_t, A_t$ 的价值时 Sarsa 采用的是
$$
R_{t+1} + \gamma Q(S_{t+1},A_{t+1})
$$
n-step Sarsa采用的是
$$
q_t^{(n)} = R_{t+1} + \gamma R_{t+2} + ... + \gamma^{n-1}R_{t+n} + \gamma^n Q(S_{t+n}, A_{t+n})
$$
对该片段展开得
$$
\begin{aligned}
q_t^{(1)} & = R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) \\
q_t^{(2)} & = R_{t+1} + \gamma R_{t+2} + \gamma^2 Q(S_{t+2}, A_{t+2}) \\
...\\
q_t^{(T-t -1)}&=R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + ... + \gamma^{T-t-2}R_{T-1} +\gamma^{T-t-1}Q(S_{T-1},A_{T-1}) \\
q_t^{T-t} &=R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3}  + ... + \gamma^{T-t-2}R_{T-1} + \gamma^{T-t-1}R_T
\end{aligned}
$$

Sarsa(λ) 对 所有的 $q_t^{n}$ 进行加权
$$
q_t^\lambda = (1-\lambda)q_t^{(1)} + (1-\lambda)\lambda q_t^{(2)} + (1-\lambda)\lambda^2 q_t^{(3)} + ... + (1-\lambda)\lambda^{T-t-2}q_t^{T-t-1} + \lambda^{T-t-1}q_t^{T-t}
$$

对该片段，并合并同类项得
$$
\begin{aligned}
q_t^\lambda = &[(1-\lambda)(1 + \lambda+\lambda^2+...+\lambda^{T-t-2} )+\lambda^{T-t-1}] R_{t+1} + \\
&[(1-\lambda)(\lambda + \lambda^2 + ...+ \lambda^{T-t-2}) + \lambda^{T-t-1}]\gamma R_{t+2} + \\
& ...\\
&[(1-\lambda)(\lambda^{T-t-2}) + \lambda^{T-t-1}]\gamma^{T-t-2}R_{T-1}  + \\
&\lambda^{T-t-1}\gamma^{T-t-1}R_{T} +\\
&(1-\lambda)\gamma Q(S_{t+1},A_{t+1}) + \\
&(1-\lambda)\lambda\gamma^2Q(S_{t+2}, A_{t+2}) + \\
&... \\
&(1-\lambda)\lambda^{T-t-2}\gamma^{T-t-1}Q(S_{T-1}, A_{T-1})

\end{aligned}
$$
利用等比数列公式化简可得
$$
\begin{aligned}
q_t^\lambda = &R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) +\\
&\lambda\gamma (R_{t+2} + \gamma Q(S_{t+2}, A_{t+2} - Q(S_{t+1}, A_{t+1})) +\\
&...\\
& \lambda^{T-t-2}\gamma^{T-t-2}(R_{T-1}+\gamma Q(S_{T-1}, A_{T-1}) -Q(S_{T-2}, A_{T-2}) +\\
&\lambda^{T-t-1}\gamma^{T-t-1}R_{T}
\end{aligned}
$$
对于$S_t, A_t$ 的TD更新误差为
$$
\delta_t = R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)
$$
则对于$S_t, A_t$ 的 Sarsa(λ)的更新误差为
$$
\begin{aligned}
\Delta_t &= q_t^\lambda  - Q(S_t, A_t) \\
&= \delta_t + \gamma\lambda \delta_{t+1} + ... + \lambda^{T-t-2}\gamma^{T-t-2}\delta_{T-2} + \gamma^{T-t-1}\gamma^{T-t-1}\delta_{T-1}
\end{aligned}
$$

### Backward View Sarsa(λ)

从上述误差计算公式可以看出Forward View Sarsa(λ)不需要在计算完整个片段之后再计算，可以和TD一样，每计算完一次误差，对前面所有经过的状态的误差进行更新。

对于每一个误差的权重，初始值为1，每经过一次，衰减$\gamma\lambda$，即Eligibility_trace的作用。

![image](https://ww1.sinaimg.cn/large/006A69aEly1g5scilvdj6j30i60aatbw.jpg)

### Backward View 和 Forward View 比较

在off-line中，即优化的策略和选取下一个动作的策略是不同时，Backward View 和 Forward View是相同的。

而在on-line中，两者有轻微的区别。因为对于前面到达的状态的估计值是不完全的，当且仅当整个片段完成后，对一个状态的更新才完成。若在片段中可能会使用不完全的估计值来选取下一个动作。

当 λ = 0 时，则 Sarsa(λ) 和 TD 完全相同，Backward View 和 Forward View也完全相同。

当 λ = 1时， 则 Forward View Sarsa(λ) 和 MC 相同。

