---
title: Exponentially Weighted Average
mathjax: true
date: 2022-04-20 20:44:11
categories:
    - ML
tags:
    - ML
---

## 计算公式

指数加权平均用来平滑数据，在线计算数据的滑动平均值。

假设数据为 $x_1, x_2, ..., x_T$，指数加权平均值为$m_1, m_2, ..., m_T$，则指数加权平均值的计算公式为：

$$
m_T = \beta m_{T-1} + (1 - \beta) x_T, \quad m_0 = 0
$$

其中 $\beta$为超参数，一般取0.9, 0.99等。

滑动平均值的计算公式展开后可得：

$$
\begin{aligned}
m_T &= \beta m_{T-1} + (1-\beta)x_T \\
&= \beta^2 m_{T-2} + \beta(1-\beta) x_{T-1}+(1-\beta) x_T \\
&= \beta^{t-1}(1-\beta)x_1 + ... + \beta(1-\beta) x_{t-1} + (1-\beta)x_t\\
&=\sum_{t=1}^T\beta^{T-t}(1-\beta) x_t
\end{aligned} 
$$

## 超参数理解

由于 $(1-\epsilon)^{1/\epsilon} \approx \frac{1}{e}$，所以 $\beta^{1 / (1 - \beta)} \approx \frac{1}{e}\approx 0.36$

将大约最近$\frac{1}{1-\beta}$个数据进行平均，$\beta$越大，拟合曲线越平滑。

## 误差修正

在滑动平均值计算的前期存在误差。

$\beta_1 = (1 - \beta) x_1, \beta_2 = \beta(1-\beta) x_1 + (1-\beta) x_2, ...$

归一化滑动平均值，将滑动平均值除以每个$x$的系数之和, $\sum_{t-1}^T \beta^{T-t}(1-\beta) = 1 - \beta^T$。

$$
\bar{m}_T = \frac{m_T}{1-\beta^T}
$$

## 实验分析

$y=log(x) + \epsilon$，$\beta$=0.99，橙色为修正后的滑动平均值，蓝色为未修正的滑动平均值。

未修正的滑动平均值在前期存在误差，需要一定的启动时间来达到准确估计。

![exp_average.png](https://s2.loli.net/2022/04/20/9GSYWmZVQpauo7J.png)

对比不同的超参数beta的影响。beta越大，平滑的数据量更大。

![](https://s2.loli.net/2022/04/20/ItOec4RCujPLwAv.png)



## 参考

Andrew NG 课程: [P1](https://www.youtube.com/watch?v=lAq96T8FkTw) [P2](https://www.youtube.com/watch?v=NxTFlzBjS-4) [P3](https://www.youtube.com/watch?v=lWzo8CajF5s)

