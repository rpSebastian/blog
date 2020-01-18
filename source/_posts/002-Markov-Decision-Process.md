---
title: 002-Markov Decision Process
mathjax: true
date: 2019-08-28 17:27:10
categories:
    - RL(David Silver)
tags:
    - RL
---
### Markov Process 

#### Intro

Markov decision process formally describe an environment for reinforcement learning.

The environment is fully observable

All RL problems can be formalised as MDPs

#### Markov Property

The future is independent of the past given the present.

$$
    P[S_{t+1} | S_t] = P[S_{t+1} | S1, ... , S_t]
$$
#### Markov Process

Markov Process is a tuple $ \lt S, P\gt $

* S is a finite set of states
* P is a state transition probability matrix

### Markov Reward Process

A Markov reward process is a Markov chain with values

A Markov Process is a tuple $ \lt S, P, R, \gamma \gt $
* S is a finite set of states
* P is a state transition probability matrix $P_{ss'} = P[S_{t+1} =s' | S_t = s]$
* R is a reward function $R_s=E[R_{t+1} | S_t=s]$
* $\gamma$ is a discount factor

#### Return
return is the total discounted reward from time-step t
$$
G_t = R_{t+1} + \gamma R_{t+2} + ... = \sum_{k=0}^{\infin}\gamma^k R_{t+k+1}
$$

Discount Reason:

* 数值上方便
* 避免计算循环
* 未来的不确定性
* 人类更偏向于立即收益

#### Value function 

the expected return stating from state s.
$$
v(s)=E[G_t|S_t=s] \\
v(s) = R_s + \gamma * \sum_{s'\in S}P_{ss'}v(s')
$$

### Markov Decision Process

A markov decision process is a Markov reward process with decisions. It is an environment in which all states are Markov.

A markov decision processs is a tuple $ \lt S, A, P, R, \gamma\gt $

* S is a finite set of states
* A is a finite set of actions
* P is a state transition probability matrix $P_{ss'}^a = P[S_{t+1} =s' | S_t = s, A_t=a]$
* R is a reward function $R_s^a=E[R_{t+1} | S_t=s, A_t=a]$
* $\gamma$ is a discount factor

#### Policy

A policy $\pi$ is a distribution over actions givens states.
$$
\pi(a|s) = P[A_t=a|S_t=s]
$$

Given an MDP, M = $ \lt S, A, P, R, \gamma\gt $ and a policy $\pi$

The state sequence is a Markov process $ \lt S, P^\pi\gt $

The state and reward sequence is a Markov reward process $ \lt S, P^\pi, R^\pi, \gamma\gt $

$$
P_{s, s'}^{\pi} = \sum_{a\in A}\pi(a|s)P_{ss'}^a \\
R_s^{\pi} = \sum_{a\in A}\pi(a|s)R_s^a
$$

#### Value function
The state-value function of an MDP is the expected return starting from state S and then following policy $\pi$
$$
V\pi(s) = E_\pi[G_t|S_t=s]
$$
The action-value function of an MDP is the expected return  staring from state S, taking action a and then following policy $\pi$
$$
q_\pi(s, a) = E\pi[G_t|S_t=s, A_t=a]
$$
Bellman Expectation Equation:
$$
V_\pi(s) = \sum_{a\in A}\pi(a|s)q_\pi(s,a)=\sum_{a\in A}\pi(a|s)[R_s^a+\gamma \sum_{s'\in S}P_{ss'}^a V_\pi(s')] 
$$
$$
q_{\pi}(s, a) = R_s^a + \gamma \sum_{s'\in S}P_{ss'}^a V_\pi(s') = R_s^a + \gamma \sum_{s'\in S}P_{ss'}^a\sum_{a'\in A}\pi(a'|s')q_\pi(s', a')
$$
#### Optimal Value Function

The optimal value function is the maximum value function over all policies.
$$
V_*(s) = \max_\pi V_\pi(s) \\ 
q_*(s, a) = \max_\pi q\pi(s, a)
$$
Bellman Optimality Equation
$$
V_*(s) = \max_a q_*(s,a) = \max_a R_s^a + \gamma \sum_{s'\in S}P_{ss'}^a V_*(s') \\
q_*(s,a) = R_s^a + \gamma\sum_{s'\in S} P_{ss'}^a \max_{a'} q_*(s', a')
$$
methods
* Value iteration
* policy iteration
* Q-learning
* Sarsa

### Partially Observable MDPs   

A Partially Observable MDPs is a MDP with hidden states. It is a hidden Markov model with actions.

A PDMDP is a tuple '$ \lt S, A, O, P, R, Z, \gamma\gt $

* S is a finite set of states
* A is a finite set of actions
* O is a finit set of observations
* P is a state transition probability matrix $P_{ss'}^a = P[S_{t+1} =s' | S_t = s, A_t=a]$
* R is a reward function $R_s^a=E[R_{t+1} | S_t=s, A_t=a]$
* Z is an observation function, $Z_{s'o}^a=P[O_{t+1}=o|S_{t+1} =s', A_t=a$
* $\gamma$ is a discount factor

#### Belief States

A belief state b(h) is a probability distribution over states, conditioned on the history h
$$
b(h) = (P[S_t=s^1|H_t=h), ... , P(S_t=s^n | H_t=h)
$$

