---
title: 组合数学
published: 2024-04-09
description: '关于组合数学的各种总结'
image: '../guide/cover.jpeg'
tags: [总结, 数学, 组合数学]
category: '数学'
draft: false 
---

# 基础
## 排列

* 从 $n$ 个不同的物品中不重复地取出 $r$ 个，排列数 $P_n^r = n!/(n-r)!$ 
* 从 $n$ 个不同的物品中可重复地取出 $r$ 个，排列数为 $n^r$
* 圆排列的排列数：从 $n$ 个元素中选 $r$ 个的圆排列的排列数为 $\frac{P_n^r}{r}=\frac{n!}{r(n-r)!}$ 
* $S$ 是一个多重集，有 $k$ 个不同的元素，每个元素都有无穷重复个数，那么 $S$ 的 $r$ 排列个数为 $k^r$ 
* $S$ 是一个多重集，有 $k$ 个不同的元素，每个元素的重数分别为 $n_1,\cdots,n_k$，$n=n_1+n_2+\cdots+n_k$，则 $S$ 的 $n$ 排列的个数为 $\frac{n!}{n_1!n_2! \cdots n_k!}$ 
* 
## 组合
* 从 $n$ 个不同物品中选 $r$ 个元素的组合为 $C_n^r$ 
* $S$ 是一个多重集，有 $k$ 个不同的元素，每个元素都有无穷个，$S$ 的 $r$ 组合的个数为 $C_{r+k-1}^{k-1}$ 可以不定方程隔板法证明
# 求组合数
1. 利用公式 $C_a^b = C_{a-1}^b + C_{a - 1}^{b-1}$
	数据范围 $a,b \le 2000$ 左右
	代码如下
```c++
void init() {
    for (int i = 0; i < N; i ++ )
        for (int j = 0; j <= i; j ++ ) {
            if (!j) C[i][j] = 1;
            else C[i][j] = (C[i - 1][j] + C[i - 1][j - 1]) % MOD;
        }
}	
```
2. 利用公式 $C_a^b = \frac{a!}{b!(a-b)!}$ ，因此可以预处理阶乘和取除法的模所需逆元
	数据范围大概在 $10^5$ 左右
	**注意**：模数得是素数
	代码如下：
```c++
/*
使用：C_a^b = fact[a] * inv[b] * inv[a - b]
*/
int fact[N];
int inv[N];

int kpow(int a, int k, int m) {
    int res = 1;
    while (k) {
        if (k & 1) res = 1ll * res * a % m;
        k >>= 1;
        a = 1ll * a * a % m;
    }
    return res;
}

void init() {
    inv[0] = fact[0] = 1;
    for (int i = 1; i < N; i ++ )
        fact[i] = 1ll * fact[i - 1] * i % MOD, inv[i] = kpow(fact[i], MOD - 2, MOD);
}
```
3. Lucas 定理，$p$ 为素数，使用限制 $a \ge p$ 
	时间复杂度 $O(n)$ 
$$
C_a^b \equiv C_{a \ mod \ p} ^ {b \ mod \ p} * C_{a / p} ^ {b / p} (mod \ p)
$$
可以证明：
先将 a, b 分别写成 p 进制
$$
a = a_0 + a_1p + a_2p^2 + \cdots + a_kp^k
$$

$$
b = b_0 + b_1p + b_2p^2 + \cdots + b_kp^k
$$
由于 $(1+x)^p=1 + C_p^1x + C_p^2x^2 + \cdots + C_p^px^p$，而 p 又是质数，因此 $(1+x)^p \equiv 1 + x^p (mod \ p)$
同理，也可知 $(1+x)^{p^k} \equiv 1 + x^{p^k} (mod \ p)$ ，其中 $k \ge 1$
可以利用生成函数证明，由于
$$
(1 + x)^a = (1+x)^{a_0 + a_1p + a_2p^2 + \cdots + a_kp^k} = (1 + x)^{a_0}((1+x)^p)^{a_1} \cdots ((1+x)^{p^k})^{a_k}
$$
故
$$
(1 + x)^a \equiv (1+x)^{a_0}(1+x^p)^{a_1}\cdots (1+x^{p^k})^{a_k} (mod \ p)
$$
左边关于 $x^b$ 的系数为 $C_a^b$ ，右边关于 $x_b$ 即 $x^{b_0 + b_1p + b_2p^2 + \cdots + b_kp^k}$ 为
$$
C_{a_0}^{b_0}C_{a_1}^{b_1}\cdots C_{a_k}^{b_k}
$$
由于 $b \ mod \ p = b_0, a \ mod \ p = a_0$ ，故 $C_{a_0}^{b_0} = C_{a \ mod \ p} ^ {b \ mod \ p}$
又 $a / p = a_1 + a_2p^1 + \cdots + a_kp^{k-1}$，$b / p = b_1 + b_2p^1 + \cdots + b_kp^{k-1}$
由上述求解 $C_a^b$ 的过程同理可得 $C_{a / p}^{b / p} = C_{a_1}^{b_1}\cdots C_{a_k}^{b_k}$
因此原命题得证

计算利用lucas计算组合数步骤：（1）线性筛；（2）lucas递归计算；（3）利用质因数的指数求$C_a^b$，其中 $a,b<p$ ，特判 $a<b$ 时组合数为 0，求质因数的指数使用阶乘的质因数分解
	
4. 高精度算 $C_a^b$ ，所需知识点：[[数论&线性代数#阶乘质因数分解]] ；然后利用高精度算乘法
	时间复杂度 $n \le 30000$ ，差不多是比较极限
	代码如下：
```c++
int h[N];
int p[N], cnt = 0;
bool st[N];
// 欧拉筛
void get_euler(int n) {
    
    for (int i = 2; i <= n; i ++ ) {
        if (!st[i]) p[cnt ++ ] = i;
        for (int j = 0; i <= n / p[j]; j ++ ) {
            st[i * p[j]] = true;
            if (i % p[j] == 0) break;
        }
    }
}
// 阶乘质因数分解
void divide(int n, int type) {
    
    for (int i = 0; p[i] <= n; i ++ ) {
        int sum = 0;
        for (int j = n / p[i]; j; j /= p[i]) sum += j;
        h[p[i]] += type * sum;
    }
} 

vector<int> mul(vector<int> &a, int b) {
    vector<int> c;
    for (int i = 0, t = 0; t || i < a.size(); i ++ ) {
        if (i < a.size()) t += b * a[i];
        c.push_back(t % 10);
        t /= 10;
    }
    return c;
}
```



## 组合计数
* 递推法，也就是`dp`状态设计
* 隔板法
	经典应用 $x_1+x_2+\cdots+x_k = n$ 有多少组正整数解，其中的等式可以变成不等式，然后如果 $x_i \ge 0$ ，则可以利用 $y_i=x_i+1,\sum{y_i}=n+k$ 的映射来计算  
* 抽屉法
	通常和整数求余进行结合，把余数用抽屉来处理
* 特殊数列，卡特兰数

# 容斥原理
容斥原理计算公式：
1. 集合 $S$ 中不具有性质 $P_1,P_2,\cdots,P_n$ 的对象个数为
$$
	|\overline{A_1} \cap \overline{A_2} \cap \cdots \cap \overline{A_n}|=|S|-\sum|\overline{A_i}| + \sum|\overline{A_i}\cap \overline{A_j}| + \cdots + (-1)^n|\overline{A_1}\cap \cdots  \overline{A_n}|
$$
2. 集合 $S$ 中至少具有性质 $P_1,P_2,\cdots,P_n$ 之一的对象个数为
$$
|A_1\cup A_2 \cup \cdots \cup A_n| = \sum|A_i| - \sum|A_i \cap A_j| + \cdots  (-1)^{n+1}|A_1\cap A_2 \cap \cdots A_n|
$$
# 卡特兰数 Catalan 数

Catalan 数是一个数列，定义为 $C_n = \frac{1}{n+1}C_{2n}^n$ 
卡特兰数：$1,1,2,5,14,42,132,429,1430,4862,16796$ 

**计算公式**
1.  $C_n=\frac{1}{n+1}C_{2n}^n = C_{2n}^n - C_{2n}^{n+1}$ 
	该计算公式从一个基本模型中推导：把 $n$ 个 $1$ 和 $n$ 个 $0$ 排成一行，使得这一行的任意前 $k$ 个数中的 $1$ 的数量总是大于等于 $0$ 的数量
2. 递推 $C_n=C_0C_{n-1}+C_1C_{n-2}+\cdots+C_{n-1}C_0$ ，$C_0=1$
3. $C_n = \frac{4n-2}{n+1}C_{n-1}, C_0=1$ 
当 $n\le 500$ 时，可以使用公式 $2$，比较大就需要 $1，3$ 公式
## 应用
1. 棋盘问题
2. 括号问题
3. 出栈序列问题
4. 二叉树问题
5. 三角剖分问题
	有 $n+1$ 条边的凸多边形区域，在内部插入不相交的对角线，把凸多边形划分为多个三角形
### 二叉树问题
1. **$n$ 个点形成的所有二叉树共有多少叶子数量？**
	解答：对于每棵有 $n$ 结点，有 $g(n)$ 个叶子的二叉树，将其叶子删掉，将会得到 $g(n)$ 个 $n-1$ 结点的二叉树。而一个 $n - 1$ 结点的二叉树有 $n$ 个位置可以插入叶子，因此每棵 $n-1$ 结点的树被得到了 $n$ 次，因此 $f(n-1)n=g(n) = C_{2n-2}^{n-1}$ 


# 博弈论
## Nim 游戏

Nim 游戏：当一堆石子的数量异或值为 0 时，则为必败态，也即异或值不为 0 时，为必胜态

证明：前置：必胜态转移的必败态只需要某种取法能转移到必败态即可，而必胜态转移到必败态需要无论此时如何操作，下一步转移一定是必败态

1、首先证明，必胜态一定存在一种方式能转移为必败态
设一堆石子的数量为 $a_1, a_2, \cdots, a_n$，由必胜态可知， $a_1 \oplus a_2 \oplus \cdots \oplus  a_n = k \neq 0$, 因此$k$ 一定有高位 1 在第 $bit$ 位，那么一定存在 $a_i$ 的 $bit$ 位为 1。可以证明，若 {$a_i$} 中不存在 $bit$ 为 1，那么这些数异或的值 $k$ 的 $bit$ 位也一定不为 1，矛盾。

因此，我们可以将 $a_i^{\prime} = a_i \oplus k$ ，由于 $k$ 的 $bit$ 位以上的位数为 $0$，因此，$a_i^\prime < a_i$  ，即在第 $i$ 堆取走 $a_i - a_i^\prime$ 个石子，那么此时所有石子数量异或值为 $a_1 \oplus a_2 \oplus \cdots a_i^{\prime} \cdots \oplus  a_n = a_1 \oplus a_2 \oplus \cdots a_i\oplus k \cdots \oplus  a_n = k \oplus k = 0$，这样就由必胜态转移为必败态

2、然后证明，必败态无论如何操作都会转移为必胜态，即证，无论从哪堆石子拿石子，一定会使得其异或值不为 0 

反证法：假设在 $a_i$ 中拿 $a_i - a_i^{\prime} \gt 0$ 个石子，有 $a_1 \oplus a_2 \oplus \cdots a_i^{\prime} \cdots \oplus  a_n = k^{\prime} = 0$ 那么 $k \oplus k^{\prime} = a_i \oplus a_i^{\prime} = 0$，也就是说 $a_i = a_i^{\prime}$，这与假设不符，因此这样就相当于没有拿石子，矛盾。

证毕

## 概念

### 公平组合游戏

若一个游戏满足：
1. 由两名玩家交替行动；
2. 在游戏进程的任意时刻，可以执行的合法行动与轮到哪名玩家无关；
3. 不能行动的玩家判负；
则称该游戏为一个公平组合游戏。
NIM博弈属于公平组合游戏，但城建的棋类游戏，比如围棋，就不是公平组合游戏。因为围棋交战双方分别只能落黑子和白子，胜负判定也比较复杂，不满足条件2和条件3。

### 有向图游戏

给定一个有向无环图，图中有一个唯一的起点，在起点上放有一枚棋子。两名玩家交替地把这枚棋子沿有向边进行移动，每次可以移动一步，无法移动者判负。该游戏被称为有向图游戏。
**任何一个公平组合游戏都可以转化为有向图游戏**。具体方法是，把每个局面看成图中的一个节点，并且从每个局面向沿着合法行动能够到达的下一个局面连有向边。

### Mex 运算

设S表示一个非负整数集合。定义$mex(S)$为求出不属于集合S的最小非负整数的运算，即：
$mex(S) = min\{x\}$, $x$属于自然数，且$x$不属于$S$
比如：$mex(\{0,1,2,4,5\})=3, mex(\{1,4,5,6\})=0$

### SG 函数

在有向图游戏中，对于每个节点$x$，设从$x$出发共有$k$条有向边，分别到达节点$y_1, y_2, …, y_k$，定义$SG(x)$为$x$的后继节点$y_1, y_2, …, y_k$ 的$SG$函数值构成的集合再执行$mex(S)$运算的结果，即：
$$SG(x) = mex({SG(y_1), SG(y_2), …, SG(y_k)})$$
特别地，整个有向图游戏$G$的$SG$函数值被定义为有向图游戏起点$s$的$SG$函数值，即$SG(G) = SG(s)$。

### 有向图游戏的和

设$G_1, G_2, …, G_m$ 是$m$个有向图游戏。定义有向图游戏$G$，它的行动规则是任选某个有向图游戏$Gi$，并在$Gi$上行动一步。$G$被称为有向图游戏$G_1, G_2, …, G_m$的和。
有向图游戏的和的$SG$函数值等于它包含的各个子游戏$SG$函数值的异或和，即：
$$SG(G) = SG(G_1) \oplus SG(G_2) \oplus … \oplus SG(G_m)$$

#### 定理
* 有向图游戏的某个局面必胜，当且仅当该局面对应结点的$SG$函数值大于0
* 有向图游戏的某个局面必败，当且仅当该局面对应结点的$SG$函数值等于0