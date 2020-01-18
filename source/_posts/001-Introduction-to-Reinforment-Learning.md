---
title: 001-Introduction to Reinforment Learning
date: 2019-08-28 17:11:51
mathjax: true
categories:
    - RL(David Silver)
tags:
    - RL
---
### RL Problem

Reinforcement Learning is based on the **reward hypothesis**

> All goals can be described by the maximisation of expected cumulative reward

#### History and state

The history is the sequence of observations, actions, rewards

$$
H_t = O_1, R_1, A_1,...,A_{t-1},O_t,R_t
$$

State is the information used to determine what happens next. State is a function of the history.

$$
S_t = f(H_t)
$$

* Environment State
* Agent State


* Full Observability --> ES = AS --> Markov decision process  
* Partial Observability --> ES ≠ AS --> Partially observable MDP

### RL Agent

Three Compoents:
#### Pollcy

* agent's behavior function 
* map from state to action
$$
a = \pi(s) \\
\pi(a|s)=P[A_t = a | S_t = s]
$$

#### Value function

* how good is each state and/or action
* used to evaluate state
$$
V_\pi(s)=E\pi[R_{t+1}+\gamma R_{t+2}+\gamma ^2R_{t+3}+...|S_t=s]
$$

#### Model

* agent's representation of the environment 
* predict what the environment will do next
* P predict the next state
* R predict the next reward
$$
P_{ss'}^a=P[S_{t+1}=s'|S_t=s,A_t=a] \\
R_s^a=E[R_{t+1}|S_t=s,A_t=a]
$$
#### Method
![image](https://ww1.sinaimg.cn/large/006A69aEly1g5nyslmwfvj30gs0exq52.jpg)

### Problems with RL

#### Learning and Planning

* Reinforcement Learning
    * Environment is unknown
    * agent interacts with the environment
    * agent imporves its policy
* Planning
    * model of the environment is known 
    * agent performs computation with its model
    * agent imporves its policy

#### Exploration and Exploitation

* Exploration: finds more information about the environment 
* Exploitation: exploit known information to maximise reward

#### Prediction and Control

* Prediction: evaluate the future / Given the policy
    * Policy --> Value function
* Control: optimise the future / Find the best policy
    * Optimal Value function and Optimal Policy 