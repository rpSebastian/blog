---
title: >-
  [论文阅读]DeepStack: Expert-Level Artificial Intelligence in Heads-Up No-Limit
  Poker
mathjax: true
date: 2020-01-18 17:09:12
categories:
	- Paper
tags:
	- RL
	- CFR
---

| 标题 | DeepStack: Expert-Level Artificial Intelligence in Heads-Up No-Limit Poker |
| ---- | ------------------------------------------------------------ |
| 团队 | Alberta                                                      |
| 时间 | 2017                                                         |
| 出处 | Science                                                      |

## 论文梗概

Deepstack论文于2017年发表在《science》杂志上，主要成果是训练出了达到专家水平的无限注双人德州扑克AI，在举办的比赛中打败了人类专家选手。Deepstack使用的方法是基于CFR算法进行递归思考，处理信息不对称，结合CFR-D算法使用分解来进行局部的计算，避免对完整的博弈树进行遍历，融合深度学习的方法，对一个阶段内的反事实后悔值进行拟合，称之为一种直觉。

## Deep Conterfactual Value Network

Deepstack将博弈树按照德州扑克的四个轮次，划分成了四个阶段，分别称为 pre-flop, flop, turn, river。在flop和turn阶段分别训练了一个神经网络，用了预测该阶段每颗子树的根节点CFV值，在之后每次迭代到根节点时直接使用神经网络进行预测，避免迭代全部博弈树，节省了时间。

除了flop-network和turn-network外，还针对pre-flop的最后一个阶段训练了一个辅助网络。

由于pre-flop的最后一个阶段是发牌阶段，需要发3张公共牌，可能的情况数很多，针对与具体的每一种情况，还需要调用flop-network来计算CFV值，计算量很大。辅助网络对这种情况进行优化计算，对于每一个发牌节点，直接输出加权之后的CFV值。

### 网络输入

神经网络的原始输入为三部分：

- 双方玩家的总加注额与加注上限的比例
- 双方玩家的隐藏手牌概率分布(range)，即持有每一种手牌的概率
- 牌桌公共牌

其中range和总加注额可以代表加注序列。

给定了隐藏手牌和公共牌后，可以组合出最强的一手牌，从而可以得到目前最强手牌的概率分布。将所有最强手牌根据牌力特征使用 k 均值进行聚类，最后得到 1000种类别的概率分布。

网络的实际输入为两部分

- 双方玩家的总加注额与加注上限的比例
- 聚类之后的每种类别的概率分布

由于辅助网络只有169种策略上不同的手牌，对于辅助网络不进行聚类，直接使用最强手牌组合作为输入。

### 网络输出

神经网络的输出为每个玩家每一种可能手牌对应的CFV值。

### 网络结构

![image.png](https://ww1.sinaimg.cn/large/006A69aEly1g8qwhnjzg2j30nh0ebtbo.jpg)

神经网络在输入层之后，添加了7个PReLU激活的全连接线性层，得到了聚类之后每一种手牌的价值。之后有添加了一个零和神经网络，使得到到达概率和手牌价值的加权乘积为0。最后输出得到的聚类之后的每一种手牌的CFV值，映射到聚类之前的每种手牌的CFV值。

### 网络训练

所有的神经网络使用Torch7编写，使用Adam随机梯度下降来最小化平均Huber损失。训练采用 1000 mini-batch和 0.001 学习率，在200次epoch后减少到0.001、网络训练了350次epoch，在一个GPU上训练了2天，最后挑选出最少的验证集loss对应的epoch。

### 数据生成

网络输入的总加注额在一个固定分布中进行采样，持有手牌概率使用特定的随机生成算法进行生成，目的是覆盖实际re-solving使用时的各种持有手牌概率。

随机生成算法为一个迭代的过程。假设某一次处理的手牌集合为 SS , 总可能概率为 pp。若集合大小为1，则持有改手牌的概率为 $p$, 否则将集合分成两半$S1,S2$，在$0−p$ 之间生成一个随机数 p1p1, 令 $p_1=p−p_2$, 分别以$p_1,p_2$ 处理手牌集合 $S_1,S_2$。

在得到总加注额和持有手牌概率后，限定动作为fold，call，固定额bet，all-in，进行1000次的CFR+迭代，得到网络的输出CFV值。

Turn神经网络产生了一千万个训练数据，在6144个CPU核心下总计使用175核心年的计算时间进行solve。

Flop神经网络产生了一百万个训练数据，对CFR迭代进行了深度限定，结合Turn神经网络进行预测，在20个GPU下使用了半个GPU年。

辅助神经网络产生了一千万个训练数据，最后的输出值通过遍历22100种可能的发牌情况，结合Flop神经网络进行预测再计算平均值，作为网络的输出数据。

### 网络训练精度

|              | 训练集Huber loss | 验证集Huber loss |
| ------------ | ---------------- | ---------------- |
| Turn神经网络 | 0.016            | 0.026            |
| Flop神经网络 | 0.008            | 0.034            |
| 辅助神经网络 | 0.000053         | 0.000055         |

### 隐藏层数量

![image.png](https://ww1.sinaimg.cn/large/006A69aEly1g8t1sol48zj30fg0ahjrp.jpg)

根据隐藏层数量和Huber loss进行了实验，最后在验证集误差，GPU内存，执行速度之间进行权衡，选择了7个隐藏层数量。可以预见，如果训练数据继续增大，可以选择更大的神经网络来增加网络的拟合能力。

## Continual re-solving

re-solving 是指对一棵子树进行迭代求出纳什均衡策略，不需要对整棵博弈树进行求解。进行re-solving的前提是需要知道到达该棵子树时，自己的range即各种手牌的概率和对方的反事实后悔值。

Continual re-solving是指不断地进行re-solving，每当需要进行决策时，进行一次re-solving，迭代出最优的策略并相应地选择动作，执行完动作后将策略抛弃不再存储。

### Our range and Opponent CFV

range 和 CFV 在存储时都是一个长度为1326的向量，表示所有私有手牌的情况下对应的值。

在游戏开始时，range为均匀分布，CFV初始化为发到每一种私有手牌时对应的价值。

根据进行决策的玩家不同，分为三种情况进行处理。

- 自己。在求解出策略后，将range和相应动作的策略值相乘并归一化，CFV值保存为对应动作在CFR迭代时得到的CFV值。
- 对手。不进行任何处理。
- 发牌。根据不能有两张相同的手牌，将range中与公共牌相同的牌的概率变为0再归一化，CFV值为上一次求解策略时进行CFR迭代得到。

### Opponent Ranges in Re-Solving

不保存对手的Range，而是在Re-Solving时借助Opponent CFV的限制迭代出来。与CFR-D类似，每次进行re-solve前新建一个对手决策的节点，一个决策是到达T节点，收益为Opponent CFV，另一个决策时到达F节点，即该棵子游戏的根。

对于对手Range的一个合理初始化，可以加快迭代的速度。一种方法是以权重b使用前一次计算出来的range，权重1-b使用均匀分布。另一种可能损失精度的方法时以权重b对前一次计算出来的range进行抽样，以该手牌不进行TF决策直接进行计算，以权重1-b使用均匀分布。

Deepstack只对每一轮的第一个动作使用了评估的对手Range初始化。当对手是第一个做动作时，使用了保守的方法，当自己是第一个做动作时，使用了可能损失精度的方法。b定为0.9。

### Sparse Lookahead Trees

直接进行re-solving需要迭代到整棵子树的末尾，仍然需要消耗大量的时间。在每一轮结束时使用训练好的神经网络来拟合CFV值，限制了树的深度。对进行re-solving的动作进行限定，限制了树的宽度。进行re-solving的动作限制为fold， call，2-3个下注额和all-in。

通过深度和宽度的限制，re-solving的子树缩减到了107107个决策点，可以在一块GTX1080显卡的计算下使用少于5秒的时间进行求解。

对于子树的求解使用的是朴素CFR和CFR+的混合。使用了regret matching+，以及在计算平均策略和平均CFV时，忽略掉了CFR的前几次迭代。

#### 具体参数配置

![image.png](https://ww1.sinaimg.cn/large/006A69aEly1g8twk943gjj30s406ht9j.jpg)

在pre-flop阶段中，在前几次忽略的CFR迭代中，使用辅助神经网络预测最后的CFV值，之后的CFR迭代中借助flop神经网络直接计算CFV值。此外对于re-solving结果进行保存，当同样的下注序列出现时，重新使用缓存结果而不是重新计算。

在flop阶段中，借助turn神经网络预测最后的CFV值。

在turn阶段中，不适用神经网络进行预测，直接求解整棵子树，对于river阶段的动作进行了聚类抽象。

在river阶段中，直接求解整棵子树。

#### Actions in sparse lookahead tree

![image.png](https://ww1.sinaimg.cn/large/006A69aEly1g8twgnm311j30s809ljt0.jpg)

对不同的动作限定对第一层的CFV的影响进行了实验，以限定9个动作和4000次迭代作为基准进行比较。最后比较发现F，C，P，A兼顾了博弈树大小和最后的评估精度。

![image.png](https://ww1.sinaimg.cn/large/006A69aEly1g8twog2wk5j30el04yjrp.jpg)

接着又使用LBR方法对于不同的抽象动作进行了比较，Default为Deepstack版本，结果显示Deepstack的策略很难被利用，且增加抽象动作对结果的影响较小。

## Speed of Play

![image.png](https://ww1.sinaimg.cn/large/006A69aEly1g8twqtan5gj30ff09vaay.jpg)

## Evaluating

整体求解的目标是逼近纳什均衡策略，即得到一个策略具有较低的可利用性。一般评价的方法有两种。

- 对打。对打为可利用性的比较差的估计，对打成绩高并不能说明可利用性低，比如石头剪刀布中的最优策略和一直出石头策略对打，最后的结局时平局。
- 直接求可利用性。利用最佳响应直接求可利用性，需要对整棵博弈树进行一次完整的遍历，在对在双人无限注德州扑克中很难做到。

### 与人类玩家对打

由于扑克牌的随机性和策略的随机性，评价策略的好坏具有很大的方差，往往需要大量的对打来得到一个稳定的结果。Deepstack使用了 AIVAT 的方法进行评价，该方法基于精心设计的结构化控制变量，可以证明在不完全信息游戏评价中进行无偏低方差的估计。AIVAT 需要在每个公共状态下获取一个拥有各种手牌的评估值，根据发牌节点和已知策略玩家选择动作的变化而导致估计值的变化，来计算控制变量。通过 AIVAT 方法获得了 85% 标准差的下降，可以在 3000局的游戏中得到统计学上的显著差异。

![image.png](https://ww1.sinaimg.cn/large/006A69aEly1g8u3zp10sej30kf0eeq3o.jpg)

### Local Best Response

另一种新提出来的方法为局部最佳相应(LBR)，可以找到可利用性的一个下界。LBR在每一次决策中固定了可以选择的动作。该方法可以有效地利用以前提出的基于抽象的方法。

![image.png](https://ww1.sinaimg.cn/large/006A69aEly1g8u3ex9821j30pc0bodht.jpg)

可以看出与之前的方法相比，DeepStack很难被利用。

## Continual re-solving 伪代码

![image.png](https://ww1.sinaimg.cn/large/006A69aEgy1g8u423fiodj30sa042mxx.jpg)

![image.png](https://ww1.sinaimg.cn/large/006A69aEgy1g8u42aqeg3j30rm0df770.jpg)

![image.png](https://ww1.sinaimg.cn/large/006A69aEgy1g8u42se03bj30se0gs422.jpg)

![image.png](https://ww1.sinaimg.cn/large/006A69aEgy1g8u438j0omj30s30a5763.jpg)

![image.png](https://ww1.sinaimg.cn/large/006A69aEgy1g8u43huyuij30ry08qtag.jpg)