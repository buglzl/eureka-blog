---
title: Atcoder ABC367 F 学到新东西啦 ！！
published: 2024-08-22
description: '判断两区间集合或者多重集的方法以及区间集合的大小'
image: '../images/eureka.jpg'
tags: [Zobrist哈希, 树状数组]
category: '新发现'
draft: false 
---


# Rearrange Query

## 题目大意

给你两个长度为 $N$ 的数组，分别为 $A$ 和 $B$，有 $Q$ 个询问，每个询问有四个值，分别为 $l, r, L, R$，问 $A[l-r],B[L-R]$ 的多重集是否相等。

> 题目链接：https://atcoder.jp/contests/abc367/tasks/abc367_f

## 数据范围

* $1 \le N,Q \le 2\times10^5$
* $1 \le A_i, B_i \le N$
* $1 \le l \le r \le N$
* $1 \le L \le R \le N$

## 题解

使用 **Zobrist哈希** 判断，具体操作如下：
1. 取两个较大值 $L,MOD$
2. 给 $1$ 到 $N$ 的每个值都映射到一个 $[0, L - 1]$ 里面的数，比如 $$
3. 根据随机好的值求 $A$ 和 $B$ 的前缀值，比如 $S_A(r) = (\sum_{i=1}^r random[A[i]]) \% MOD$ 
4. 根据前缀和判断两多重集是否相等，如果值不相等为 *no-instance*，如果相等，则至少有 $1-\frac{1}{L}$的概率认为其为*yes-instance*，因此对于一个具有 $Q$ 次询问的题，通过测试的概率为有 $(1-\frac{1}{L})^Q$（可能有误）

因此，建议 $L$ 取 $2^{45}$ 或者 $10^{13}$ ，$MOD$ 取 $2^{61}-1$

**拓展**

>如果不是求多重集合，而是求集合呢？？
更简单了，那么就不是求前缀和，**而是求前缀异或**，同时也不需要 $MOD$ 了

```c++
#include <iostream>
#include <cstring>
#include <algorithm>
#include <random>

using namespace std;

random_device rd;
mt19937_64 gen(rd());

using LL = long long;


const int N = 200010;
const LL L = 1e13, MOD = (1ll << 61) - 1;

LL h[N];
LL A[N], B[N];


LL g(LL x) {
    return (x % MOD + MOD) % MOD;
}

int main() {

    // freopen("../in.txt", "r", stdin);
    // freopen("../out.txt", "w", stdout);
    int n, q; scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; i ++ ) h[i] = gen() % L;

    for (int i = 1; i <= n; i ++ ) {
        int x; scanf("%d", &x);
        A[i] = (A[i - 1] + h[x]) % MOD;
    }
    for (int i = 1; i <= n; i ++ ) {
        int x; scanf("%d", &x);
        B[i] = (B[i - 1] + h[x]) % MOD;
    }

    while (q -- ) {
        int l, r, L, R; scanf("%d%d%d%d", &l, &r, &L, &R);
        if (g(A[r] - A[l - 1]) == g(B[R] - B[L - 1])) puts("Yes");
        else puts("No");
    }
    
    return 0;
}
```

:::note
证明自行查阅资料
:::

# [SDOI2009] HH的项链

## 题目大意

给你一个长度为 $n$ 的数组 $A$，给你 $q$ 个询问。每个询问有两个整数 $l, r$，问 $A$ 数组中区间 $[l,r]$ 的集合个数

> 题目链接：https://www.luogu.org/problemnew/show/P1972

## 数据范围

* $1\le n, q \le 10^6$
* $1 \le A_i \le 10^9$
* $1 \le l,r \le n$

## 题解

### 离线+树状数组

**时间复杂度 $O(nlogn)$**

第一步，首先把所有的询问存储下来，然后根据右端点排序

第二步，记录项链中每个贝壳其左边第一个相同种类的下标

第三步，把所有贝壳的种类的贡献都放在最右边的贝壳中

第四步，处理询问，按照右端点从大到小来处理，如果此时的右端点是大于上一轮右端点，也就意味着当前右端点的后面部分已经没用了，所有需要更新。更新的原则是：1. 转移贡献，根据第二步计算的当前贝壳其左边第一个相同种类的下标贡献+1，当前贝壳贡献减一

第五步，当前询问的答案是 $query(r) - query(l - 1)$ 

**代码如下**

```c++
#include <iostream>
#include <unordered_map>
#include <algorithm>
#include <map>

#define lowbit(x) ((x) & (-x))

using namespace std;

typedef tuple<int, int, int> TIII;

const int N = 1000010;

int tr[N];
int n, q; 
TIII arr[N];
int color[N];
int res[N];
int pre[N];
map<int, int> um;

void add(int x, int val) {
    for (int i = x; i <= n; i += lowbit(i)) tr[i] += val;
}

int query(int r) {

    int res = 0;
    for (int i = r; i; i -= lowbit(i)) res += tr[i];
    return res;
}

int main() {
    
    scanf("%d", &n);
    for (int i = 1; i <= n; i ++ ) scanf("%d", &color[i]);
    
    for (int i = 1; i <= n; i ++ ) {
        if (um.count(color[i])) {
            add(um[color[i]], -1);
            pre[i] = um[color[i]];
        }
        add(i, 1);
        um[color[i]] = i;
    }
    
    scanf("%d", &q);
    for (int i = 1; i <= q; i ++ ) {
        int x, y; scanf("%d%d", &x, &y);
        arr[i] = {y, x, i};
    }

    sort(arr + 1, arr + 1 + q);
    reverse(arr + 1, arr + 1 + q);

    int last = n;
    for (int i = 1; i <= q; i ++ ) {
        auto [r, l, id] = arr[i];
        while (last > r) {
            if (pre[last]) {
                add(pre[last], 1);
            }
            add(last, -1);
            last -- ;
        }
        res[id] = query(r) - query(l - 1);
    }

    for (int i = 1; i <= q; i ++ ) printf("%d\n", res[i]);
    return 0;
}
```

:::note
hh，其实可以算左端点的贡献，按照左端点排序，应该更简洁
:::