---
title: 数论和线性代数
published: 2023-10-23
description: '关于数论知识和线性代数知识与代码模板总结'
image: '../guide/cover.jpeg'
tags: [总结, 数学, 数论, 线性代数]
category: 'mathematical'
draft: false 
---

# 数论
## 快速幂

### 快速幂
快速幂主要是能在 $O(log k)$ 的时间复杂度求解 $a^k \% m$ 。其思路在于任何一个数都可以写成以下形式 $k=2^{c_1} + 2^{c_2} + \cdots + 2^{c_y}$ 。{$c_i$} 序列是严格单调递增的。因此 $a^k \ \% \  m$ 可以写成 $a^{2^{c_1} + 2^{c_2} + \cdots + 2^{c_y}} \ \% \ m$ ，从而一步一步往下计算 $a^{2^{c_i}}$ ，最多计算 $logk$ 次即可。

核心代码如下 ：
```c++
int kpow(int a, int k, int m) {
    
    a %= m;
    int ans = 1 % m;
    while (k) {
        if (k & 1) ans = (LL) ans * a % m;
        k >>= 1;
        a = (LL) a * a % m;
    }
    return ans;
}
```
### 龟速乘
龟速乘主要是 $O(logb)$ 的时间内计算 $a*b$，这种计算方法主要应用在 $a*b$会爆掉 `long long` 的情况下，思路和快速幂一致，也是利用 $b$ 的二进制拆分。

核心代码如下：
```c++
LL kmul(LL x, LL y, LL m) {
    LL ans = 0;
    while (y) {
        if (y & 1) ans = (ans + x) % m;
        x = (x + x) % m;
        y >>= 1;
    }
    return ans;
}
```

## 素数筛

首先来看 1-N 中有多少个素数，也就是 $\pi(N) \approx \frac{N}{lnN}$ 。当 $N=1e6$ 时，$\pi(N)=78498$ ; 当 $N=1e7$ 时，$\pi(N)=664579$。了解在什么范围内有多少素数，有利于掌握相应的时间复杂度。

下面给出三种筛法（杜教筛以后学到再说）

* 埃式筛
	时间复杂度为 $O(nloglogn)$ 。
	核心代码如下：
	```c++
	int primes[N], cnt = 0;
	bool st[N];
	
	void get_primes(int n) {
	    cnt = 0;
	    memset(st, false, sizeof st);
	    
	    for (int i = 2; i <= n; i ++ ) {
	        if (st[i]) continue;
	        primes[cnt ++ ] = i;
	        for (int j = i + i; j <= n; j += i)
	            st[j] = true;
	    }
	}
	```
* 线性筛
	时间复杂度为 $O(n)$。
	核心思路在于利用每个数的最小质数将其筛掉
	核心代码如下：
	```c++
	int primes[N], cnt = 0;
	bool st[N];
	
	void get_primes(int n) {
	    cnt = 0;
	    memset(st, 0, sizeof st);
	    
	    for (int i = 2; i <= n; i ++ ) {
	        if (!st[i]) primes[cnt ++ ] = i;
	        for (int j = 0; i <= n / primes[j]; j ++ ) {
	            st[i * primes[j]] = true;
	            if (i % primes[j] == 0) break;
	        }
	    }
	}
	```
* 杜教筛
	时间复杂度为 $O(n^\frac{2}{3})$ 。

## 素数判定

### 试除法

时间复杂度：$\mathcal{O}(\sqrt{n})$ 
当 $n \le 10^{12}$ 时，足够判断
代码如下：
```c++
bool is_prime(int x) {
    
    if (x == 1) return false;
    for (int i = 2; i <= x / i; i ++ )
        if (x % i == 0) return false;
    return true;
}
```
另外，这个方法还可以加快速度，根据[[#唯一分解定理]]，只需要使用 $[2,\sqrt n]$ 里面的素数来判断即可。 因此，这里有个策略是利用线性筛提前预处理好前 $\sqrt n$ 的所有素数，但由于时间和空间限制，这个 $n$ 的范围最大是 $n \le 10^{14}$ 
代码如下：
```c++
bool is_prime(int x) {
    
    if (x == 1) return false;
    for (int i = 0; prime[i] <= x / prime[i]; i ++ )
        if (x % prime[i] == 0) return false;
    return true;
}
```
### Miller-Rabin 算法

#### 费马小定理

设 $n$ 是素数，$a$ 是正整数且与 $n$ 互素，那么有 $a^{n-1} \equiv 1(\text{mod}\ n)$

费马小定理目前作用有二：**1. 这个是判断素数的必要条件；2.同余求逆**

对于应用一：要判断 $n$ 是否为素数，可以随机 $a$ 来判断 $a^{n-1}$ 模 $n$ 是否为 1，如果不为 1 ，一定不是素数，如果为 $1$ ， 可能是素数。因为一定有一些数（Carmichael 数）满足该式子，但是不为素数。但是这种数出现的概率不大。

对于应用二：由于 $a * a^{n-2} \equiv 1(\text{mod} \  n)$ ，**因此 $a^{n-2}$ 是在 $a$ 与 $n$ 互素下同余 $n$ 的关于 $a$ 的逆元**。注意这个后缀很重要，如果不互素，得使用扩展欧几里得

#### 二次探测定理
如果 $p$ 是**一个奇素数**，且 $e \ge 1$，则方程 $x^2 \equiv 1 (\text{mod} \ p^e)$ 仅有两个解：$x=1$ 和 $x=-1$ 。当 $e=1$ 时，方程 $x^2 \equiv 1(\text{mod} \ p)$  仅有两个解 $x=1$ 和 $x=p-1$ 
把 $x=1$ 和 $x=p-1$ 称为“$x$ 对模 $p$ 来说 $1$ 的平凡平方根”

我们利用其逆否命题：对于方程 $x^2 \equiv 1(\text{mod} \ n)$ ，（注意 $n$ 不一定是奇素数），如果对模 $n$ 存在 $1$ 的非平凡平方根，**则 $n$ 不可能是奇素数或者奇素数的幂**

根据上面两个定理，可设计 Miller-Rabin 算法
1. 如果 $n == 1$ ，不是素数
2. 如果 $n==2$ ，是素数
3. 如果 $n\%2 == 0$，不是素数 
4. 那么剩下的就是 $n\gt 2$ ，且 $n$ 是奇数，来判断其是否为素数
	1. 首先随机 $a$ ，判断 $a^{n-1}$ 模$n$ 是否为 1，不是则说明不是素数
	2. 等于 1 的话利用二次探测定理继续判断，因此此时 $n-1$ 是偶数，所以有方程 ${a^{\frac{n-1}{2}\cdot 2} } \equiv 1(\text{mod} \ n)$  ，所以可以判断 $a^{\frac{n-1}{2}}$  是否为 $1$ 或者 $n-1$ ，不是则说明不为素数，是则继续判断直到 $\frac{n-1}{2^t}$ 为奇数 

代码中对 4.2 的利用不太一样，是直接对 $n -1$ 除到一个奇数，然后从这个奇数开始算到 $n-1$，如果都满足二次探测定理，最后则判断其是否满足费马小定理

只考虑 `int` 时间复杂度：$O(klog^3 n)$  ，出错的概率为 $2^{-s}$ 
代码如下：
```c++
#include <random>
random_device rd;
mt19937 gen(rd());

int kpow(int a, int k, int m) {
    
    a %= m;
    int ans = 1;
    while (k) {
        if (k & 1) ans = (LL) ans * a % m;
        k >>= 1;
        a = (LL) a * a % m;
    }
    return ans;
}

bool witness(int a, int n) {
    int u = n - 1, t = 0;
    while ((u & 1) == 0) u >>= 1, t ++ ;
    int x1, x2;
    x1 = kpow(a, u, n);
    for (int i = 0; i < t; i ++ ) {
        x2 = kpow(x1, 2, n);
        if (x2 == 1 && x1 != 1 && x1 != n - 1) return true;
        x1 = x2;
    }
    if (x1 != 1) return true;
    return false;
}

bool miller_rabin(int n, int s) {
    
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    // i < min(s, n)，因为随机数取的是 [1,n-1]，当 s > n 时没啥意义
    for (int i = 0; i < s && i < n; i ++ ) {
        int a = gen() % (n - 1) + 1;
        if (witness(a, n)) return false;
    }
    return true;
}

```

考虑到 `long long` 的乘法会溢出的情况下需要使用龟速乘，时间复杂度为：$O(klog^4 n)$ 。

## 分解质因数

### 唯一分解定理

任何 $n\ge 2$ 的整数都可以分解成若干个质数乘积。也就是说
$$
n = p_1^{x_1}p_2^{x_2}p_3^{x_3}\dots p_k^{x_k}
$$

### 质因数分解

思路：首先利用一个数 $n$ 的质因数中大于 $\sqrt n$ 的最多只有一个的特性，只需要枚举到 $\sqrt n$ 的情形就行，枚举的过程中，$n$ 可以通过枚举到的质因数逐渐变小，最后退出循环后，只要 $n$ 仍旧大于 1，说明这是剩下来的那个质因数。
时间复杂度：$\mathcal{O}(\sqrt{n})$
代码如下：
```c++
void divide(int x) {
    for (int i = 2; i <= x / i; i ++ ) {
        int cnt = 0;
        while (x % i == 0) cnt ++ , x /= i;
        if (cnt) cout << i << ' ' << cnt << endl;
    }
    if (x > 1) cout << x << ' ' << 1 << endl;
}
```

另外，当 $n$ 的范围不是很大的时候，也就是 $10^7$ 左右的时候，可以通过**只枚举素数**来加快速度。时间复杂度大概是 $\mathcal{O}(\sqrt{\frac{n}{ln n}})$

代码如下：
```c++
void divide(int n) {
    
    for (int i = 0; primes[i] <= n / primes[i]; i ++ ) {
        int cnt = 0;
        while (n % primes[i] == 0) cnt ++ , n /= primes[i];
        if (cnt > 0) {
            cout << primes[i] << ' ' << cnt << endl;
        }
    }
    if (n > 1) cout << n << ' ' << 1 << endl;
}
```
另外，如果要存的话，使用差不多 100 大小的数组就能存，**因为对于 `int` 型的数质因数最多有十几个，一个因数的个数最多有三十几个**
#### pollard_rho 启发式方法分解质因数



## 阶乘相关

### 勒让德定理

在正数 $n!$ 的质因数分解中，质数 $p$ 的指数记作 $v_p(n!)$ ，则$$v_p(n!)=\sum_{k\ge 1}\lfloor \frac{n}{p_k} \rfloor$$
### 阶乘质因数分解
思路就是唯一分解定理和勒让德定理的应用。
时间复杂度在 $O(n)$ 左右。
代码如下：
```c++
// 首先是找质数，根据上面的线性筛

// 然后就是勒让德计算
for (int i = 0; i < cnt; i ++ ) {
        int cnt = 0;
        for (int k = n / primes[i]; k > 0; k /= primes[i]) cnt += k;
        cout << primes[i] << ' ' << cnt << endl;
    }
```
### 威尔逊定理
若 $p$ 为素数，则 $p$ 可以整除 $(p-1)!+1$
威尔逊定理四种表示方法：
1. $((p-1)!+1)\text{mod} \ p = 0$
2. $(p-1)!\text{mod} \ p = p-1$
3. $(p-1)!=pq - 1$ ，$q$ 为正整数
4. $(p-1)!\equiv -1(\text{mod} \ p)$
核心记住第一点
## 约数

### 约数相关性质
* 约数个数
	根据唯一分解定理，约数个数 $f(n)=(x_1+1)*(x_2+2)*\cdots*(x_k+1)$
	那么前 $n$ 个数的约数个数之和怎么算呢，可以根据第 $i$ 个数在 $1-n$ 中是多少个数的约数，也就是 $\frac{n}{i}$  个，因此 $\sum f(i) = nln n$ 大概是这个量级。这对分析时间复杂度有帮助。

* 约数之和
	一个数所有约数之和为 $\text{sum}=(1+p_1^1 + \cdots + p_1^{x_1}) * (1+p_2^1 + \cdots + p_2^{x_1}) * \cdots * (1+p_k^1 + \cdots + p_k^{x_k})$ ，这个很容易证明，根据乘法分配法，最后加法分隔开的每个数，都是从每个括号里面选择一个数进行相乘，这样刚好就枚举了所有的约数可能。
	代码如下：
	```c++
	// 第一步分解质因数
	int ans = 1;
    for (auto [u, v]: um) {
        int p = 1, t = 0;
        for (int i = 0; i <= v; i ++ ) t = (t + p) % MOD, p = 1ll * p * u % MOD;
        ans = 1ll * ans * t % MOD;
    }
	```

* 最多的约数个数
	在 `int` 范围内，约数个数最多的数大概有 **1600** 个约数。这对分析时间复杂度相当有帮助。

* 快速求出所有约数
	首先第一步，对数先进行质因数分解，然后 dfs 求得所有约数，根据上述的最多约数个数为 1600 个左右，因此 dfs 的时间一般来说是小于质因数分解的速度的。因此，求所有约数的时间极限变成了**如何快速求质因数分解。**[[#质因数分解]]
	其中，dfs 代码为
	```c++
	void dfs(int cur, int val) {
    if (cur >= idx) {
        res.push_back(val);
        return ;
    }
    for (int i = 0, t = 1; i <= c[cur]; i ++ , t *= p[cur])
        dfs(cur + 1, val * t);
}
	```

#### 最大公约数

##### 欧几里得算法
时间复杂度：$O((log_2a)^3)$
最大公约数的公式 $gcd(a, b)=gcd(b, a \% b)$
	证明：设 $d$ 为 $a, b$ 的任意一个约数，那么 $d$ 也为 $b, a\% b$ 的约数。显然，$d$ 是 $b$ 的约数成立，由于 $a \% b = a - \lfloor \frac{a}{b} \rfloor * b$ ，根据 $(a \pm b) \% d = (a \% d \pm b \% d) \% d$ 。因此，$d$ 也是 $a \% b$ 的约数。那么如果 $d^\prime$ 是 $gcd(a,b)$ 的最大公约数，则 $d^\prime$ 也是 $gcd(b,a \% b)$ 的最大公约数。
	设 $d$ 为 $b, a \% b$ 的任意一个约数，那么 $d$ 也是 $a, b$ 的约数。显然， $d$ 是 $b$ 的约数成立，由于 $a = a \% b + \lfloor \frac{a}{b} \rfloor * b$ 。根据同余公式，则 $d$ 也是 $a$ 的约数。同理，$b, a \% b$ 的最大公约数也是 $a, b$ 的最大公约数。
	综上：$gcd(a,b)=gcd(b,a\%b)$。

代码如下：
```c++
LL gcd(LL a, LL b) {
    return b ? gcd(b, a % b) : a;
}
```
* 拓展
  $gcd(a_1,a_2,a_3,\cdots,a_n)=gcd(a_1,a_2-a_1,\cdots,a_n-a_{n-1})$
  根据此公式，序列的区间 $gcd$ 等价于序列差分数组的 $gcd$ 
##### 更相减损法
时间复杂度 $max(a,b)$ 
$gcd(a,b)=gcd(a, a-b)=gcd(b, a-b)$ 
因此一般使用 $stein$ 算法
##### stein 算法
如果 $a,b$ 都是偶数 $gcd(a, b) = 2*gcd(a/2,b/2)$ 
如果 $a,b$ 其中一个为奇数，根据 $gcd(kx,y)=gcd(x,y)$ 如果 $x,y$ 互质，因此此处 $k$ 取 $2$，则有 $gcd(a,b)=gcd(a/2,b)$，这里适用高精度，但是建议py

#### 裴蜀定理

如果 $a$ 和 $b$ 均为整数，则有整数 $x$ 和 $y$ 使 $ax+by=gcd(a,b)$

因此，有推论：当 $a,b$ 互素时，有整数 $x$ 和 $y$ 使得 $ax+by=1$

## 线性丢番图方程

根据[[#裴蜀定理]] ，方程 $ax+by=c$ 有整数解的充要条件是 $gcd(a,b)$ 是 $c$ 的倍数。假设 $(x_0,y_0)$ 是一组特解，所有通解可以表示为 $x=x_0+(b/d)n,y=y_0-(a/d)n$，$n$ 为任意整数

### 扩展欧几里得求二元线性丢番图的特解

首先利用扩展欧几里得求方程 $ax+by=gcd(a,b)$ 的特解，代码如下
```c++
LL exgcd(LL a, LL b, LL &x, LL &y) {
    if (b == 0) {
        x = 1, y = 0;
        return a;
    }
    LL d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}
```

那么可以根据这个来求 $ax+by=c$ 的特解
1. 判断 $c$ 是否整数 $gcd(a,b)$
2. 求$ax+by=gcd(a,b)$ 的特解 $(x_0, y_0)$
3. 在 $ax_0+by_0=gcd(a,b)$ 两边乘 $c / gcd(a,b)$ ，可得特解为 $(x_0^\prime, y_0^\prime)=(x_0 * c / gcd(a,b), y_0 * c / gcd(a,b)$
4. 通解为 $x=x_0^\prime + (b/d)n, y=y_0^\prime-(a/d)n$，其中 $d=gcd(a,b)$

## 同余

$a\equiv b (\text{mod} \  m)$  称为 $a$ 和 $b$ 同余
同余可以转化成等式存在 $k$，使得 $a = b + mk$ 

### 一元线性同余方程

求解 $ax\equiv b (\text{mod} \  m)$ ，这个同余方程等价于二元丢番图方程，方程有解

**定理**
设 $a,b$ 和 $m$ 是整数，$m>0,gcd(a,m)=d$。若 $d$ 不能整除 $b$，则 $ax \equiv b (\text{mod} \ m)$ 无解；若 $d$ 能够整除 $b$ ，则 $ax \equiv b (\text{mod} \ m)$ 有 $d$ 个模 $m$ 不同余的解

**推论**
$a,m$ 互素，线性同余方程 $ax \equiv b (\text{mod} \ m)$ 有**唯一的模 $m$ 不同余**的解。

### 逆
给定整数 $a$，**且满足 $gcd(a,m)=1$**，则 $ax \equiv 1 (\text{mod} \ m)$ 的一个解为 $a$ 模 $m$ 的逆，记为 $a^{-1}$

#### 求逆
1. [[#费马小定理]]，$m$ 是素数，且 $a,m$ 互素，求 $a^{m-2} \% m$
2. 扩展欧几里得，$a,m$ 互素
3. 递推求逆 $i=1,inv[i]=1;$ 
	$i>1$ 时，假设 $p/i=k$，余数是 $r$，则 $k*i+r\equiv 0 (\text{mod} \ p)$ 
	因此 $r^{-1}i^{-1}ki+r^{-1}i^{-1}r\equiv 0 (\text{mod} \ p)$  等价于 $r^{-1} k + i^{-1} \equiv 0 (\text{mod} \ p)$ 
	移项 $i^{-1} \equiv -r^{-1}k(\text{mod} \ p)$ 等价于 $i^{-1} \equiv (p-p/i)r^{-1}(\text{mod} \ p)$
	$inv[i]=(p-p/i)*inv[p\%i] \% p$

逆可以用来求解同余方程，若$gcd(a,m)=1$，上边的同余方程可以适用下面的式子来求解 $x\equiv a^{-1}b(\text{mod} \ m)$，在模 $m$ 下有唯一解

**定理** 设 $p$ 是素数，正整数 $a$ 是其自身的逆，当且仅当 $a\equiv 1 (\text{mod} \ p)$ 或者 $a\equiv -1 (\text{mod} \ p)$  正如[[#二次探测定理]]

除法取模 $(a/b) \% m = (a/b * b*b^{-1}) \% m =  (ab^{-1}) \% m$ 

### 中国剩余定理
假设有 $m_1,m_2,\cdots, m_n$ **两两互质** ，且 
$$
x \equiv a_i(mod \ m_i)
$$
那么该方程有一个通用解
设 $M = m_1 * m_2 * \cdots * m_n$ , $M_i = M / m_i$ 因此 $M_i$ 一定与 $m_i$ 互质，故M, M设 $M_i^{-1}$ 为 $M_i$ 模 $m_i$ 的逆元
因此可以构造答案
$$
x \equiv a_1 * M_1 * M_1^{-1} + a_2 * M_2 * M_2^{-1} + \cdots + a_n * M_n * M_n^{-1} (\text{mod} \ M)
$$
可以验证此 $x$ 成立

#### 拓展

中国剩余定理的拓展，因为剩余定理求解公式需要满足两两互质的强限制，因此需要更一般的解法

解法:
由于 $x \equiv a_i(mod \ m_i)$ 等价于 $x = k_i * m_i + a_i$ , 其中 $k_i$ 是系数
我们可取前两个等式考虑即 $x = k_1 * m_1 + a_1$ , $x = k_2 * m_2 + a_2$ ，合并得
$$
k_1 * m_1 + a_1 = k2 * m_2 + a_2 
$$
整理得
$$
k_1 * m_1 - k2 * m_2 = a_2 - a_1
$$
根据裴蜀定理, 要想有整数解，则 $a_2 - a_1$ 为 $(m_1,m_2)$ 的倍数
故可根据扩展欧几里得求出特解 $k_1^{\prime}, k_2^{\prime}$
因此可得通解 $\{k_1^{\prime}*\frac{c}{d} + k * \frac{m_2}{(m_1,m_2)}, -k_2^{\prime}*\frac{c}{d} + k * \frac{m_1}{(m_1,m_2)}\}$，其中 k 是系数
带入到求解 $x$ 的式子中得 
$$
x = (k_1^{\prime}*\frac{c}{d} + k * \frac{m_2}{(m_1,m_2)}) * m_1 + a_1
$$
整理得
$$
x = [m_1,m_2] * k + a_1 + k_1^{\prime} * m_1*\frac{c}{d}
$$
可以发现，这是一个与 $x = k_i * m_i + a_i$ 类似的式子，因此，便可以通过这种方式求解 $x$ 
细节注意：$a_2 - a_1$ 的计算可以写成 $(a_2 - a_1 \% m_2 + m_2) \% m_2$；计算 $k_1^{\prime} * m_1*\frac{c}{d}$ 分开求，可能爆 `long long`；最后计算 $a_1+k_1^\prime * m_1$ 最后对 $[m_1,m_2]$ 取模；核心思想在于在这个过程中，让值变得更小

```c++
LL calc() {
    
    LL a1 = a[1], m1 = m[1];
    for (int i = 2; i <= n; i ++ ) {
        LL a2 = a[i], m2 = m[i];
        LL a = a1, b = a2, c = (m2 - m1 % a2 + a2) % a2;
        LL x, y;
        LL d = exgcd(a, b, x, y);
        if (c % d) return -1;
        // b0 的计算也可以龟速乘
        LL k = b / d, b0 = (c / d * x % k + k) % k;
        LL ans = a1 * k;
        // 下面这行可能爆longlong 不行就龟速乘
        m1 = (a1 * b0 % ans + m1) % ans;
        a1 = ans;
    }
    return m1;
}
```

## BSGS 算法

问题描述：若 $gcd(a,p)=1$，求 $a^t \equiv b (\text{mod} \ p)$ 求最小非负正整数解 $t$ 

根据欧拉定理，$a^{\phi(p)} \equiv 1 (\text{mod} \ p)$ ，$a^t \equiv a^{t \  \text{mod} \ \phi(p)} (\text{mod} \ p)$
因此，最小的 $t \in [0,\phi(p)-1]$
在计算的时候可以稍微扩大成 $[0,p]$，避免计算欧拉函数 

枚举是利用分块的思想，首先将这个区间分成 $\sqrt p$ 段，令 $k=\lfloor \sqrt p \rfloor + 1 \gt \sqrt p$    ，$t = kx - y$ ，为了让 $t$ 能够取到 $[0,p]$ 中的所有数，可以设置 $x \in [1,k], y \in [0,k-1]$ ，这样 $t \in [1,k^2]$ ，因为 $k^2 \gt p$ 。**注意，0特判即可**

原式可变形为 $a^{kx} \equiv b \cdot a^y (\text{mod} \ p)$，也就是说，枚举 $x$ 的时候，判断是否有对应的 $y$ 使其同余 $p$ 相等

## 欧拉函数
$1-N$ 中与 $N$ 互质的数的个数被称为欧拉函数，记为 $\phi(N)$
欧拉函数的计算公式为：
$$
\phi(N) = N \times \frac{p_1 - 1}{p_1} \times \cdots \times \frac{p_k - 1}{p_k}
$$
这里提到另外一个本人想到的公式，设 $p$ 为小于 $N$ 的约数，记 $\phi^p(N)$ 为 $x \in [1,N]$ 中 $gcd(x, N) = p$ 的 $x$ 的个数。其计算公式为：
$$
\phi^p(N) = \phi(\frac{N}{p})
$$
欧拉函数计算公式证明：
	证明思路是计算 $1-N$ 中有多少数是 $N$ 的合数，最后用 $N$ 减去这个结果即可。那么 $1-N$ 中有多少是 $N$ 的合数可以根据唯一分解定理计算，一个数是 $N$ 的合数，一定是 $p_1,p_2, \cdots ,p_k$ 的倍数，因此可以通过计算 $1-N$ 中有多少数是这些数的倍数，减掉即可。即：$N - (\frac{N}{p_1} + \cdots + \frac{N}{p_k})$ 。但是，这样还不行，因为像 $p_1 \times p_2$ 的倍数其实被删掉了两次，要重新加回来，这也是通过容斥原理来计算。因此，最终得到的公式为上述公式。
### 线性筛求欧拉函数
欧拉函数可以用筛素数的写法来计算欧拉函数，线性筛的本质是用一个数的最小质数将其筛掉，那么便可以思考一个数的欧拉函数值是否可以通过其最小质数和其相应约数计算得到。

首先，对于 $n$ 为质数，那么 $\phi(n)$ 为 $n-1$。

然后思考线性筛的过程，如果 $i \% primes[j] == 0$ 时，会发生什么，对于 $i*primes[j]$ 来说，$primes[j]$ 就是它的最小质数，但是事实上此时 $primes[j]$ 是$i$ 的约数了，根据欧拉函数与指数没有关系，假设，$\phi(i) = i * x$，那么 $\phi(i*primes[j]) = i * primes[j] * x = primes[j] * phi(i)$。

如果 $i \% primes[j] != 0$ 时，则说明 $i$ 的质因数分解中原来没有 $primes[j]$，此时 $phi(i) = i*x$，那么 $phi(i*primes[j])=i * primes[j] * \frac{primes[j] - 1}{primes[j]} * x = (primes[j] - 1) * phi(i)$ 。

核心代码如下：
```c++
oid get_euler(int n) {

    for (int i = 2; i <= n; i ++ ) {
        if (!st[i]) {
            primes[cnt ++ ] = i;
            phi[i] = i - 1;
        }
        for (int j = 0; i <= n / primes[j]; j ++ ) {
            st[i * primes[j]] = true;
            if (i % primes[j] == 0) {
                phi[i * primes[j]] = phi[i] * primes[j];
                break;
            }
            phi[i * primes[j]] = phi[i] * (primes[j] - 1);
        }
    }
}
```

### 欧拉定理
设 $a,m \in N^+$, 且 $gcd(a,m)=1$，$\phi(x)$ 为欧拉函数，有
$$
a^{\phi(m)} \equiv 1 (\text{mod} \ m) 
$$
### 欧拉降幂 
$$
a^b \equiv  
\begin{cases}  
a^{b \% \phi(m)} &\quad gcd(a,m)=1\\  
a^b &\quad b < \phi(m) \\  
a^{b \% \phi(m) + \phi(m)} &\quad b \ge \phi(m) \\  
\end{cases}  \qquad (\text{mod \ m})
$$

## 莫比乌斯反演

 ### 莫比乌斯函数
根据[[#唯一分解定理]]

若 $F(n)=\sum_{n | d} f(d)$，则 $f(n)=\sum_{n|d} \mu (\frac{d}{n})F(d)$ 


# 线性代数

## 矩阵快速幂

这里提供矩阵快速幂的模板。
```c++
struct matrix { int m[N][N]; };

matrix operator * (const matrix& a, const matrix& b) {
    matrix c;
    memset(c.m, 0, sizeof c.m);
    for (int i = 0; i < N; i ++ )
        for (int j = 0; j < N; j ++ )
            for (int k = 0; k < N; k ++ )
                c.m[i][j] = (c.m[i][j] + 1ll * a.m[i][k] * b.m[k][j] % mod) % mod;
    return c;
}

matrix pow_matrix(matrix a, int k) {
    matrix ans;
    memset(ans.m, 0, sizeof ans);
    for (int i = 0; i < N; i ++ ) ans.m[i][i] = 1;
    while (k) {
        if (k & 1) ans = ans * a;
        k >>= 1;
        a = a * a;
    }
    return ans;
}
```
这个模板是相当不错的，矩阵乘里面的 $N$, mod 可以不是常量，可以在事后输入。

### 矩阵快速幂的应用

对于 $f(n)=f(1)+f(2)+\cdots+f(n-1) + c$ 这样的递推式子，容易构造矩阵
$$
\begin{pmatrix}
f(n) & f(n-1) & \cdots & f(2) \\
\end{pmatrix} = 
\begin{pmatrix}
f(n-1) & f(n-2) & \cdots & f(1) \\
\end{pmatrix} A
$$
其中，矩阵 $A$  就是根据递推式构造的矩阵
有的时候，递推式就是根据动态规划转移式子得来，有的时候隐藏的很深，需要去发现去设计
## 高斯消元

在高斯消元的过程中，我们需要对判断最终的结果是唯一解？多解还是无解？这里有一个通用的判断方式（$n,m$关系未知，$m$ 行 $n$ 列）
```c++
	// 首先判断在进行了多次处理后 最后 row ~ m 行的最后一列是否全为 0，不是则为无解
    for (int i = row; i <= m; i ++ )
        if (a[i][n + 1]) return 0;
    // row - 1 表示秩的大小，显然秩为 n 的时候为唯一解
    if (row == n + 1) return 1;
    return 2;
```

时间复杂度 $O(nm^2)$，其中 $n,m$ 分别为行列
### 高斯消元求解线性方程组
代码如下：
```c++
/*
输出解 注意 0 的判断
for (int i = 1; i <= n; i ++ )
    printf("%.3f ", fabs(a[i][n + 1]) < eps ? 0.000 : a[i][n + 1]);
*/
// 0 无解 1 唯一解 2 无穷解
int guass() {
    
    int row, col;
    for (col = 1, row = 1; col <= n; col ++ ) {
        int t = row;
        for (int i = row + 1; i <= n; i ++ )
            if (fabs(a[i][col]) > fabs(a[t][col]))
                t = i;
        
        if (fabs(a[t][col]) < eps) continue;
        for (int i = col; i <= n + 1; i ++ ) swap(a[t][i], a[row][i]);
        for (int i = n + 1; i >= col; i -- ) a[row][i] /= a[row][col];
        
        for (int i = 1; i <= n; i ++ )
            if (i != row && fabs(a[i][col]) > eps) {
                for (int j = n + 1; j >= col; j -- ) a[i][j] -= a[row][j] * a[i][col];
            }
        
        row ++ ;
    }
    if (row <= n) {
        for (int i = row; i <= n; i ++ )
            if (fabs(a[i][n + 1]) > eps) return 0;
        return 2;
    }
    return 1;
}

```

### 高斯消元求解异或线性方程组
代码如下：
```c++
int guass() {
    
    int col, row;
    for (col = row = 1; col <= n; col ++ ) {
        int t = row;
        for (int i = row + 1; i <= n; i ++ )
            if (a[i][col] > a[t][col]) t = i;
       
        if (a[t][col] == 0) continue;
        for (int i = col; i <= n + 1; i ++ ) swap(a[t][i], a[row][i]); 
        
        for (int i = 1; i <= n; i ++ )
            if (i != row && a[i][col] == 1) {
                for (int j = n + 1; j >= col; j -- )
                    a[i][j] ^= a[row][j];
            }
        row ++ ; 
    }

    if (row <= n) {
        for (int i = row; i <= n; i ++ )
            if (a[i][n + 1] > 0) return 0;
        return 2;
    }
    return 1;
}
```

### 高斯消元求解模运算线性方程组
代码如下
```c++
// 注意这里是 模 3 的写法，如果是其他的模，需要求逆
// 以下如果是模 p 的话，则 3 改为 p
void gauss() {

    int col, row;
    for (col = row = 0; col < n; col ++ ) {
        int t = row;
        for (int i = row + 1; i < n; i ++ )
            if (a[i][col] > a[t][col]) t = i;
        if (a[t][col] == 0) continue;//print();
        for (int i = col; i <= n; i ++ ) swap(a[t][i], a[row][i]);
        // 此处需要求逆，其中 2 替换为 a[row][col]对于 p 的逆
        // 这个 if 需要去掉
        if (a[row][col] == 2) {
            for (int i = n; i >= col; i -- ) a[row][i] = (a[row][i] * 2) % 3;
        }
        for (int i = 0; i < n; i ++ )
            if (i != row && a[i][col]) {
                for (int j = n; j >= col; j -- ) 
                    a[i][j] = (a[i][j] + (3 - a[i][col]) * a[row][j]) % 3;
            }
        row ++ ;
        
    }
}
```
## 线性基

### 迭代构造线性基

时间复杂度 $O(nm)$，其中 $m$ 为 $n$ 个数里面的最大位数，在 `long long` 范围内等价于 $O(64n)$ 

代码如下：
```c++
LL base[63]; // 存储线性基
bool zero = false; // 查看是否这组数据里面能否出现 0 

void insert(LL x) {
    
    for (int i = 62; i >= 0; i -- ) {
        if (x >> i == 1) {
            if (base[i] == 0) {base[i] = x; return ;}
            else x = x ^ base[i];
        } 
    }
    zero = true;
}

LL qmax() {
    LL res = 0;
    for (int i = 62; i >= 0; i -- )
        res = max(res, res ^ base[i]);
    return res;
}
```