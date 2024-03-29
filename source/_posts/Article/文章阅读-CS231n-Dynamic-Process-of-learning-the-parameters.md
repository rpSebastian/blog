---
title: '[文章阅读]-CS231n Dynamic Process of learning the parameters'
mathjax: true
date: 2022-04-20 15:00:11
categories:
	- Article
tags:
	- ML
	- Article
---
| 标题 | [文章阅读]-CS231n Dynamic Process of learning the parameters |
| ---- | -------------------------------------------------------- |
| 作者 | CS231n                                                  |
| 领域 | ML                                                     |
| 链接 | https://cs231n.github.io/neural-networks-3/#update |

## Gradient Checks

在实际中，梯度检查更复杂，容易出错。

### 使用中心化公式

$$
\frac{d f(x)}{d x}=\frac{f(x+h)-f(x-h)}{2 h}
$$

中心化公式更精确，误差项为$\mathcal{O}(h^2)$。$h$采用近似1e-5。

### 使用相对误差进行比较

使用绝对误差$|f_a' - f_n'|$进行比较，在梯度很小时会出错。更合适的方法是比较相对误差。

$$
\frac{|f_a'-f_n'|}{\max(|f_a'|, |f_n'|)}
$$

- 相对误差大于1e-2。表示误差大概率是错的。
- 相对误差在1e-2到1e-4之间，误差可能是错的。
- 相对误差小于1e-4，如果没有使用kinks（比如tanh，softmax）是可以的。否则1e-4过高了。
- 1e-7或更小误差是正确的。

网络越深想对误差越大。所以如果输入数据是10层网络，相对误差1e-2是可以的。

### 使用双精度

单精度浮点数可能获得更高的相对误差。

### 注意浮点数的实际范围

在神经网络中，通常会将损失函数根据批进行归一化。然而如果每个数据点的梯度很小，那么额外除以数据点数量可能会得到很小的数值，进而带来更多数值问题。因此建议始终打印原始的数值梯度，确保梯度不是特别小（比如1e-10以下不大行）。如果梯度很小，可能可以缩放损失函数一个常数，使得浮点数更密集的范围。

### 目标函数中的kinks

kinks指目标函数中不可微分的部分，比如ReLU。考虑ReLU函数在x=1e-6时，由于$x<0$，因此解析梯度应该是0，然而数值梯度会计算得到非0梯度，因为$f(x+h)$跨越了kinks，引入了非零贡献。在真实情况中非常常见。一种检测方式是统计kinks发生的次数，比如$max(x, y)$中$x$获胜的次数。

### 使用更少的数据点

一种减轻kinks问题的方法是使用更少的数据点，损失函数包含越少的数据点，发生kinks的次数越少。使用更少的数据点也使得梯度检查更快，更高效。

### 当心步长h

中心化公式中的步长并不是越小越好。h很小时，可能会遇到数值精度问题。

### 个性模式操作下进行梯度检查

随机数据点进行梯度检查存在偶然性，无法代表所有数据点。一种合适的方式是在网络进行学习，损失开始下降后进行梯度检查。在一开始就进行数据检查的问题是可以会引起病态的边界问题，掩盖错误的梯度实现。

### 不要让正则化压倒数据

通常损失函数是数据损失和正则化损失之和。如果正则化损失压倒了数据损失，那么梯度将会主要来自于正则化项，掩盖了数据损失梯度的不正确实现。解决方法是关闭正则化损失，或者减少正则化项权重。

### 关闭dropout和数据增广 / 固定随机种子

在执行梯度检查时，关闭网络中的非确定性影响，否则在评估数值梯度时会引入很大错误。然而，这样会无法评估dropout的梯度。更好的方法是固定随机种子。

### 检查一些维度

检查所有参数的一些维度，而不是检查一些参数的所有维度。

## 学习前准备：健全检查建议

### 在随机表现下检查损失是否正确

确保初始化较小参数后，得到了期望的损失。比如使用softmax的10分类问题，随机初始化下每个类别的概率为0.1，因此softmax损失应该为 $-\ln(0.1) = 2.302$。

### 提高正则化权重应提高损失

### 过拟合小数据集

在完整的数据集下训练前，应该在部分数据集下进行训练，将正则化项权重设置为零，确保最后能得到零损失。

## 监控学习过程

在神经网络的训练中，有很多有用的指标，根据指标绘制图来监控学习过程。绘图的横坐标总是epochs而不是iterations，因为iterations依赖于batch size。

### 损失函数

![image.png](https://s2.loli.net/2022/04/20/8LUl9nXrJSIbFEk.png)

较高的学习率在前期能快速降低损失，但是最后陷入较差值。因为优化中存在过多能量，使得参数在混乱中跳越，无法到达一个合适的位置。

有时以对数打印损失函数更好，因为损失函数以指数下降。

### 训练/验证准确率

![image _1_.png](https://s2.loli.net/2022/04/20/ipBrwGX6SZAVhDa.png)

训练准确率和验证准确率表明过拟合程度。在过拟合时，可以增加正则化程度（更大的L2权重，更多的dropout，收集更多数据）。

另一种可能性是验证准确度和训练准确度相差很小，表明模型容量不够大，可以增加网络参数。

### 权重更新比例

权重更新大小和权重本身的比率。（权重更新，而不是原始梯度）。

评估跟踪比率每个参数集合。一个粗略的启发式是权重更新比率应该为1e-3，如果比例太小，说明学习率可能太小了。如果比率太大了，学习率可能太高了。

```Python
# assume parameter vector W and its gradient vector dW
param_scale = np.linalg.norm(W.ravel())
update = -learning_rate*dW # simple SGD update
update_scale = np.linalg.norm(update.ravel())
W += update # the actual update
print update_scale / param_scale # want ~1e-3
```

### 每层的激活分布和梯度分布

错误的初始化会减速甚至阻碍学习过程。一种诊断方法是打印每层网络的激活/梯度直方图。直观上将，看到任何奇怪分布是错误的信号。比如tanh神经元下，期望看到分布在[-1,1]之间，而不是所有神经元输出0，或者所有神经元完全是-1或1。

### 第一层可视化

![image _2_.png](https://s2.loli.net/2022/04/20/WJZQSRKEPyfAsTH.png)

## 参数更新

在通过反向传播计算完解析梯度后，梯度用来执行参数更新。

### SGD

#### 朴素更新

参数沿着负梯度方向更新，因为梯度表明了数值增加的方向，而一般希望最小化损失函数。

```Python
x += -lr * dx
```

#### Momentum 更新

损失可以理解为山的高度（势能$U=mgh$）。初始化参数等价于将某个粒子以零初速度放在某个位置。优化过程等价于模拟参数向量（即粒子）在山地上滚动。

粒子受到的外力和势能的梯度相关（$F=-\nabla U$），也就是损失函数的梯度。另外$F=ma$，所以梯度与粒子的加速度成比例。SGD中梯度直接影响位置，而物理解释中梯度只影响速度，间接影响位置。

```Python
v = mu * v - lr * dx
x += v 
```

超参数mu（默认0.9）代表momentum，实际物理意义是摩擦系数。该变量有效地抑制了速度，降低了系统的动能，否则粒子不会再山谷底部停下。在交叉验证时，该参数通常设置为[0.5, 0.9, 0.95, 0.99]。类似学习率退火，momentum系数也可以调节，在学习后期增大。一种方式是初始化为0.5，逐渐增大到0.99.

> 进行Momentum更新时，参数向量将在梯度一致的任何方向上建立速度。

#### Nesterov Momentum

当前的参数向量在位置$x$处时，仅仅看momentum的更新，可以直到momentum项将推动参数向量$mu*v$，到达 $x+mu*v$。因此可以计算在$x+mu*v$位置的加速度，而不是旧位置$x$。

![image _3_.png](https://s2.loli.net/2022/04/20/7AuIp2jJyq6TvXC.png)

```Python
x_ahead = x + mu * v
# evaluate dx_ahead (the gradient at x_ahead instead of at x)
v = mu * v - learning_rate * dx_ahead
x += v
```

在实际实现时，保存的是x_ahead，而不是x，从而算法和之前具有相同的形式。

```Python
v_prev = v
v = mu * v - lr * dx
x += -mu * v_prev + (1 + mu) * v
```

原始版本中

- 初始点为`x`，速度为`v`
- momentum step后到达点为`x_ahead = x + mu * v`, 速度为`v_head = mu * v`,
- 实际更新后的点为 `x' = x + mu * v - lr * dx_ahead`, 速度为 `v' = mu * v - lr * dx_ahead`。

修改版本中

- `x`保存的是 `x_head, v`保存的是 `v`。
- 初始点为 `x - mu * v`
- 那么`momentum step`后到达点为 `x`, 速度为 `v_head = mu * v`
- 实际更新后的点为 `x' = x - lr * dx_ahead`, 速度为 `v' = mu * v - lr * dx_ahead`
- `x`需要保存更新后的`x'_head = x' + mu * v' = x - lr * dx_ahead + mu * v' = x + v' - mu * v + mu * v' = x - mu * v + (1 + mu) * v'`

### 学习速率退火

较高的学习速率下系统包含太多的动能，参数向量混乱跳动，无法在进入损失函数更深更狭窄的部分。知道什么时候降低学习率很棘手：缓慢衰减会浪费大量时间混乱跳动，提升很小；过于激进衰减会使系统冷却过快，无法到达最佳位置。

- 步长衰减：每一定epoch后以一定系数衰减学习率，通常每5个epoch后减少一半，或者每20步后乘0.1。一种启发式方法时使用固定学习率训练时观察验证集误差，在验证集误差停止提升时学习率乘0.5。
- 指数衰减。$\alpha = \alpha_0 e^{-kt}$，其中$\alpha_0, k$是超参数，$t$是迭代次数或者epoch。
- 1/t 衰减。$\alpha = \alpha_0 / (1 + kt)$，其中$\alpha_0, k$是超参数，$t$是迭代次数或者epoch。

### 二阶方法

第二类优化方法基于牛顿法

$$
x \leftarrow x - [Hf(x)]^{-1}\nabla f(x)
$$

其中$Hf(x)$是海森矩阵，表示函数的二阶微分导数， $\nabla f(x)$表示梯度向量。直观上讲，海森矩阵描述了损失函数的局部曲率，可以用来执行更有效的更新。乘以海森矩阵的逆使得**优化在低曲率的方向上前进更多步，高曲率的方向上前进较少步**。在更新中没有学习率超参数，是该方法相比于一阶方法的重要优点。

然而在实际应用中计算海森矩阵需要耗费大量的时间和空间，因而提出了许多拟牛顿算法来近似海森矩阵的逆。最流行的算法是L-BFGS，使用梯度随时间的变化信息来近似。L-BFGS的缺点是必须要在完整的数据集中计算，与mini-batch SGD不同，L-BFGS在mini-batch下实现比较棘手。

实际上不怎么实用拟牛顿算法，而是实用基于Momentum的SGS变体。

### 逐参数自适应学习率算法

之前讨论的算法中，所有参数的学习率相同。调整学习率是一个昂贵的过程，许多工作致力于自动调节学习率，甚至调节每个参数的学习率。

#### Adagrad

```Python
# Assume the gradient dx and parameter vector x
cache += dx**2
x += - learning_rate * dx / (np.sqrt(cache) + eps)
```

变量cache等价于梯度的大小，跟踪每个参数的梯度的平方的和。然后使用cache来归一化参数更新步长。具有较高梯度的权重将会减少学习率，获得较小梯度或不频繁更新的权重将会增加学习率。平方根运算很重要。光滑项eps通常设置为1e-4到1e-8，避免被零除。AdaGrad的一个缺点是在深度学习中，单调的学习率通常被证明过于激进，过早地停止学习。

#### RMSprop

RMSprop以一种十分简单的方式来调整Adagrad算法，缩减其激进性（单调下降学习率）。具体而言，RMSprop采用梯度的华东平均

```Python
cache = decay_rate * cache + (1 - decay_rate) * dx**2
x += - learning_rate * dx / (np.sqrt(cache) + eps)
```

`decay_rate`是超参数，通常取[0.9, 0.99, 0.999]。RMSprop得到的是一个均衡的效果，而不是学习率的单调减小。

#### Adam

Adam类似于RMSProp和momentum的结合。

```Python
m = beta1 * m + (1 - beta1) * dx
v = beta2 * v + (1 - beta2) * (dx**2)
x += - learning_rate * m / (np.sqrt(v) + eps)
```

默认值`eps` , `beta1=0.9`, `beta2=0.999`。

实践中推荐使用Adam，略优于RMSProp。然而也值得使用SGD+Nesterov Momentum。

完整的Adam更新引入了**误差修正机制**，补偿了在前几步m和v被初始化为0，因而其偏差为0。在添加了误差修正机制后的Adam：

```Python
# t is your iteration counter going from 1 to infinity
m = beta1 * m + (1-beta1) * dx
mt = m / (1 - beta1**t)
v = beta2 * v + (1-beta2) * (dx**2)
vt = v / (1 - beta2**t)
x += - learning_rate * mt / (np.sqrt(vt) + eps)
```

![](https://cs231n.github.io/assets/nn3/opt2.gif) 

![](https://cs231n.github.io/assets/nn3/opt1.gif)

## 超参数优化

训练神经网络包含许多超参数设定。最常见的超参数包括

- 初始学习率
- 学习率衰减调度
- 正则项

然而也有许多相对不敏感的超参数，比如Adam中的momentum和调度策略的设定。下面描述执行超参数搜索的方法。

### 实现

- 设计一个worker，连续采样随机超参数并执行优化。在训练时，worker跟踪每个epoch后的验证集性能，将模型参数、验证集性能、统计数据等写入到文件中，可以直接将验证集性能写入到文件名以方便排序。
- 设计一个master，启动和杀死worker，检查worker的保存点，绘制训练统计。

### 单一验证而不是交叉验证

单一验证集可以简化代码。

### 超参数范围

在对数范围内搜索超参数。比如一个典型的学习率范围是`learning_rate=10**uniform(-6, 1)` 。直观地说，这是因为学习速率和正则化强度对训练动态具有倍增效应.

### 随机搜索优于网格搜索

### 当心边界的最佳值

有时会在错误的范围内搜索超参数。检查最终结果是否在区间的边界，那样的话可能错过了边界外的最优参数。

### 划分搜索从粗糙到精细

 首先在粗糙的范围内搜索，然后根据最佳结果来缩小范围。 也可以仅训练1个epoch下在粗糙范围中搜索超参数，然后在训练5个epoch下进行精细搜索，最后在进行完整的搜索。

### 贝叶斯超参数优化

平衡不同超参数之间的探索和利用。然而很难在精心设计的区间下打败随机搜索。

## 评价

### 模型集成

训练多个独立模型，在测试时平均预测值。随者集成模型数量的增加，实际性能也显著增加。此外，随着模型的多样性增加，实际性能也会增加。

#### 相同模型，不同初始化

使用交叉验证来决定最好的超参数，然后用最好的超参数、在不同的随机初始化下训练多个模型。坏处在于多形性仅依赖于初始化。

#### 交叉验证中发现的最好模型

使用交叉验证来决定最好的超参数，然后选择排行靠前的模型来集成。好处是不需要额外的训练。

#### 单一模型的不同保存点

如果训练十分昂贵，使用单一模型的不同保存点来集成。这种方法缺少多样性，但在实际表现也不错。该方法的优点是比较简单。

#### 训练过程中参数的运行平均

在训练过程中维护模型参数的指数加权平均。在最后几步的加权平均版本总是能获得更好的验证集误差。 直观理解是网络在碗装的目标函数中跳跃，所以平均参数更有可能达到碗的底部。

使用模型集成的一个缺点是需要在测试集上花费更多的时间。

## 概括

训练神经网络注意点

- 在小批次数据上检查梯度，注意一些陷阱。
- 健全性检查，确保初始损失是正确的，在少量数据上能得到100%的准确度。
- 在训练时监控损失函数，训练/验证 准确率，参数更新比例大约为 1e-3，可视化卷积神经网络的第一层。
- 推荐的优化方法，SGD+Nesterov Momentum 或 Adam。
- 在训练过程中衰减学习率。比如在固定次数的迭代或者验证准确度停滞时。
- 使用随机搜索而不是网格搜索来搜索合适的超参数。从粗糙的范围（广泛的范围，只训练1-5个轮次）到精细的范围（狭窄的范围，更多的训练轮次）。
- 使用网络集成来获得额外性能。