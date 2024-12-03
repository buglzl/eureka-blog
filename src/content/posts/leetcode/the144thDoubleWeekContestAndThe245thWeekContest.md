---
title: 第144场双周赛 && 第425场周赛第三、四题
published: 2024-11-25
description: 'leetcode周赛第三、四题系列'
image: '../images/leetcode.png'
tags: [leetcode,贪心,区间,差分,优先队列,动态规划,树形dp]
category: 'leetcode'
draft: false 
---

> 该系列只写每周周赛的第三、四题。使用语言主 JAVA, 副 c++ 。

# 144 双周赛第三题

> 题目链接：https://leetcode.cn/problems/zero-array-transformation-iii/

## 题目大意

有一个长度为 $n$ 的 `nums` 数组，然后有二维数组 `queries` ，其中 $queries[i]$=$[l_i,r_i]$

substract 操作：对于任意一个 $[l_i, r_i]$，可以选择在这个区间内每个数至多**减 1**

现需要你在 `queries` 删除最多的区间，使得依然可以在剩余的区间里面进行 substract 操作**使得 `nums` 数组最终所有值为 0**

## 数据范围

* $1\le n \le 10^5$
* $0 \le nums[i] \le 10^5$
* $1 \le queries.length \le 10^5$
* $queries[i].length == 2$
* $0 \le l_i \le r_i \lt n$

## 题解

### 差分+贪心

**时间复杂度$O(nlogn)$**

既然题目要求的是减一，那我反转一下，对一个长度为 $n$，值全为 0 的数组 `d` 利用 queries 数组进行加 1 操作，也就是 add 操作。

先考虑无解的情况，现在如果对 queries 中的每个区间的每个数都加 1，如果存在有 `d[i] < nums[i]`，则说明此时无解。

换句话说，如果最后留下的区间，然后对每个区间都利用 add 操作使得最后 `d` 数组每个数都有 $d[i] \ge nums[i]$ ，则说明留下的这组区间是满足题意的。因此，问题转化为删除最多的区间，对剩下的区间进行 add 操作，使得对一个初始值为 0 的数组最后每一个值都 $的d[i] \ge nums[i]$ 

由于这里有每个区间都加 1 的操作，自然而言要想到差分，将区间加变成一个 $O(1)$ 的操作。

接下来考虑整体怎么做？

看到这个数据范围，又是区间，可以尝试想一想贪心做法，一般来说可以尝试对区间进行排序，那么按照什么进行排序？左端点还是右端点？既然无论如果 `nums[0]` 一定会被覆盖住，不妨就就先按照左端点排序，左端点相同的情况下，自然右端点更大更好

排好序之后，从左到右遍历区间，来考虑遍历的过程中会发生什么？

1. 如果当前遍历到区间 $[l_i,r_i]$ 。也就是说当前区间的左端点是 $l_i$，也就是要保证 $d[k] \ge nums[k], k\in[0,l_i-1]$，否则应该提前返回无解的情况，因此需要使用 `cur` 来维护当前尚未满足 $d[cur] \ge nums[cur]$ 的最小值、
2. 如果 $cur == l_i$，如果此时 $d[cur] >= nums[cur]$，此时的区间并不会丢弃，而是应该放入候选集中，而且只用存右端点的值，并且候选集根据右端点从大到小选择，因此这里使用优先队列来维护候选集。
3. 如果 $cur < l_i$，说明 $d[k], k\in [cur, l_i-1]$ 只能用候选集里面的元素进行覆盖，由于  这些候选集里面左端点在区间 $[0,cur-1]$ 之间，因此可以只用对区间 $[cur, t]$ 进行 add 操作（t 是堆顶元素）
4. 这里有个小优化，往 queries 加入区间 `[n,n]`，然后对于 $cur==l_i$ 的情形，只需要将右端点加入队中即可。因为 step3 最终会在候选集中选择合适的区间。

这个贪心思路的核心思想在于尽可能地使用范围比较大的区间，同时不随便放弃任意一个区间，除非 $t \lt cur$，也就是堆顶元素小于当前处理到的 `d` 数组位置。

<!-- 另外 `d` 数组本质上是一个差分数组，所以在更新和判断的时候注意加上 `d[i - 1]`。当然，也可以用一个变量优化掉 `d` 数组 -->


**c++代码如下：**
```c++
const int N = 100010;
int d[N];
class Solution {
public:
    priority_queue<int> Q;
    void init(int n) {
        for (int i = 0; i <= n + 2; i ++ ) d[i] = 0;
    }
    void withdraw(int cur) {
        int t = Q.top(); Q.pop();
        d[cur] ++ ; d[t + 1] -- ;
    }
    int maxRemoval(vector<int>& nums, vector<vector<int>>& queries) {
        int n = nums.size();
        queries.push_back(vector<int>{n, n});
        int m = queries.size();
        init(n);

        sort(queries.begin(), queries.end(), [&](const vector<int>& a, const vector<int>& b) {
            if (a[0] == b[0]) return a[1] > b[1];
            return a[0] < b[0];
        });
        
        int cur = 1; // cur 表示当前 d[cur] 尚未 d[cur] += d[cur - 1];
        int cnt = 0; // cnt 计算需要多少数量的答案
        int q = 0;
        while (q < m) {
            auto &qe = queries[q];
            int l = qe[0], r = qe[1];
            l ++ ; r ++ ;
            while (l > cur) {
                
                while (!Q.empty() && d[cur] + d[cur - 1] < nums[cur - 1]) {
                    if (Q.top() < cur) break;
                    withdraw(cur);
                    cnt ++ ;
                }
                if (d[cur] + d[cur - 1] < nums[cur - 1]) return -1;
                d[cur] += d[cur - 1];
                cur ++ ;
            }
            // l == cur
            Q.push(r);
            q ++ ;
        }
        // 出来 q == m， cur > n
        return m - cnt - 1;
    }
};
```

**java代码如下：**
```java
class Solution {
    public int maxRemoval(int[] nums, int[][] queries) {
        int n = nums.length;
        int m = queries.length;
        List<Integer>[] list = new List[n];
        for (int i = 0; i < n; i ++ ) list[i] = new ArrayList<>();
        for (int[] q: queries) list[q[0]].add(q[1]);

        int pre = 0;
        int cnt = 0;
        int[] d = new int[n + 1];
        PriorityQueue<Integer> Q = new PriorityQueue<>(n, (a, b) ->  b - a);
        for (int i = 0; i < n; i ++ ) {
            
            for (Integer j: list[i]) Q.offer(j);
            while (!Q.isEmpty() && pre + d[i] < nums[i]) {
                if (Q.peek() < i) return -1;
                int t = Q.poll();
                d[i] ++ ; d[t + 1] -- ;
                cnt ++ ;
            }
            if (pre + d[i] < nums[i]) return -1;
            pre += d[i];
        }
        return m - cnt;
    }
}
```

:::tip
sort 那里语法一定要是 `const vector<int>& a`，弄成引用传递，不然会超时
:::

# 144 双周赛第四题

> 题目链接：https://leetcode.cn/problems/find-the-maximum-number-of-fruits-collected/description/

## 题目大意

有一个 $n\times n$ 的二维数组，数组里面每个数都有一个权值。现有三个起点，分别为 $(0,0),(0,n-1),(n-1,0)$，从这三个起点出发只走 $n - 1$ 步，并且最终要达到 $(n-1,n-1)$，在移动过程中可以累加路径上的权值，但是二维数组里面的每个数（权值）只能相加一次。问：满足题意的最大权值之和？

另外：
* 起点为 $(0,0)$ 只能走 $(i+1,j+1),(i+1,j),(i,j+1)$ 这三个方向
* 起点为 $(n-1,0)$ 只能走 $(i,j+1),(i-1,j+1),(i+1, j+1)$ 这三个方向
* 起点为 $(0, n-1)$ 只能走 $(i+1, j),(i+1,j+1),(i+1,j-1)$ 这三个方向

## 数据范围

`fruits` 表示二维数组

* $2 \le n = fruits.length=fruits[i].length\le 1000$
* $0 \le fruits[i][j] \le 1000$

## 题解

### 动态规划

**时间复杂度$O(n^2)$**

注意到这三个起点到 $(n-1,n-1)$ 都只能走 $n-1$ 步

* 对于 $(0,0)$，根据题意的走法，只能一直走 $(i+1,j+1)$ 方向才能恰好 $n-1$ 步到达终点
* 对于 $(n-1,0),(0,n-1)$ 事实上可以将其理解为经典题目数字三角形，甚至比数字三角形更简单，起点和终点方向此处是一致的。

对于该题，三个起点可以分别计算，起点为 $(0,0)$ 的可以提前对角线的权值累加，并且置为 0，那么同时根据题目特性，$(n-1,0),(0,n-1)$ 到达终点的全部路径，除了可能在对角线位置有交集，其余位置没有交集，因此可以独立计算。

而正好后两种情况是可以看作一个数字三角形的题来解，因此使用动态规划求解即可。


**代码如下：**
```java
class Solution {
    static final int INF = 0x3f3f3f3f;
    int[][] f, g;
    public int maxCollectedFruits(int[][] fruits) {
        int ans = 0;
        int n = fruits.length;

        for (int i = 0; i < n; i ++ ) {
            ans += fruits[i][i];
                System.out.println(fruits[i][i]);
            
            fruits[i][i] = 0;
        }
        f = new int[n][n];
        g = new int[n][n];

        for (int i = 0; i < n; i ++ ) Arrays.fill(f[i], -INF);
        f[n - 1][0] = fruits[n - 1][0];
        for (int i = 1; i < n; i ++ ) { // 列
            for (int j = 0; j < n; j ++ ) { // 行
                if (j - 1 >= 0) f[j][i] = Math.max(f[j][i], f[j - 1][i - 1] + fruits[j][i]);
                f[j][i] = Math.max(f[j][i], f[j][i - 1] + fruits[j][i]);
                if (j + 1 < n) f[j][i] = Math.max(f[j][i], f[j + 1][i - 1] + fruits[j][i]);
            }
        }
        ans += f[n - 1][n - 1];

        for (int i = 0; i < n; i ++ ) Arrays.fill(g[i], -INF);
        g[0][n - 1] = fruits[0][n - 1];
        for (int i = 1; i < n; i ++ ) { // 行
            for (int j = 0; j < n; j ++ ) { // 列
                if (j - 1 >= 0) g[i][j] = Math.max(g[i][j], g[i - 1][j - 1] + fruits[i][j]);
                g[i][j] = Math.max(g[i][j], g[i - 1][j] + fruits[i][j]);
                if (j + 1 < n) g[i][j] = Math.max(g[i][j], g[i - 1][j + 1] + fruits[i][j]);
            }
        }
        ans += g[n - 1][n - 1];
        return ans;
    }
}
```

:::note
这道题事实上可以通过旋转二维数组做到只计算一次 dp， hh~
:::

# 第 425 场周赛第三题

> 题目链接：https://leetcode.cn/problems/minimum-array-sum/description/

## 题目大意

给定一个整数数组 `nums` 和三个整数 $k^\prime$,`op1`,`op2` 
可以对 nums 执行以下操作：
* 操作1：选择一个下标 `i`，将 `nums[i]` 除以 2，并**向上取整**。可以最多执行该操作 `op1` 次，并且每个下标最多只能执行**一次**
* 操作2：选择一个下标 `i`，仅当 `nums[i]` 大于或者等于 $k^\prime$ 时，从 `nums[i]` 中减去 $k^\prime$ 。最多可以执行该操作 `op2` 次，并且每个下标最多只能执行**一次**

两种操作可以应用于同一下标，但每种操作最多只能应用一次。

返回在执行任意次数的操作后，`nums` 中所有元素的最小可能 **和**

## 数据范围
* $1\le nums.length \le 100$
* $0 \le nums[i] \le 10^5$
* $0 \le $k^\prime$ \le 10^5$
* $0 \le op1,op2 \le nums.length$

## 题解

### 动态规划

**时间复杂度$O(n\cdot op1 \cdot op2)$**

这道题读完题之后，再看数据范围，就感觉可能是动态规划，猜出状态为 $f(i,j,k)$ 表示在数组 $nums[1-i]$ 中最多进行 $j$ 次操作1 和最多进行 $k$ 次操作 2 的所有最小可能和‘

因此，最终答案就是 $f(n, op1, op2)$ ，$n$ 是数组的长度

现在开始进行集合划分，也就是递推关系式的思考。

首先初始化 $f$，也就是说 $f(i,j,k)$ 等于前 $i$ 个元素的和，其中 $f(0,j,k)=0$


考虑特殊情况，如果 $op2=0$，那么就按照 $nums[i]$ 这个数进行集合划分，分为需不需要在 $nums[i]$ 上进行操作 1，因此 $f(i, j, 0) = min\{f(i, j,0), f(i-1,j,0), f(i-1,j-1,0)-nums[i]/2\}$ 

如果 $op1=0$，同样也是按照 $nums[i]$ 这个数进行集合划分，分为需不需要在 $nums[i]$ 上进行操作 2，当然也需要满足题目的限制条件:
$$
f(i,0,j) = min\{f(i,0,j), f(i-1,0,j), f(i-1,0,j-1)-k^\prime\} \ , nums[i] \ge k^\prime
$$

一般情况下，也就是 $op1>0,op2>0$，同样也是按照 $nums[i]$ 进行集合划分，此时可以同时对 $nums[i]$ 进行操作 1 和 操作 2（如果满足条件的话）。 首先考虑单独进行操作 1 和操作2，然后再进行操作 1 和操作 2 的组合。如果 $nums[i] \ge 2k^\prime-1$，那么一定是先应用操作 1 再应用操作 2，如果 $k^\prime\le nums[i] \lt 2k^\prime-1$，则必须先应用操作 2 再应用操作 1。因此，递推式如下
$$
f(i,j,k)=
min
\begin{cases}
f(i,j,k) , \\
f(i, j-1,k) - nums[i]/2, \\
f(i, j,k-1) - k^\prime,  \ \ if \ nums[i] \ge k^\prime\\
f(i,i-1,j-1) - nums[i]/2-k^\prime, \ \ if \ nums[i] \ge 2*k^\prime-1 \\
f(i,i-1,j-1)-k-(nums[i]-k)/2, \ \ if \  k^\prime\le nums[i] \lt 2k^\prime-1
\end{cases}
$$

**java代码如下**
```java
class Solution {
    final int INF = 0x3f3f3f3f;
    int[][][] f;
    public int minArraySum(int[] nums, int kt, int op1, int op2) {

        int n = nums.length;
        f = new int[n + 1][op1 + 1][op2 + 1];

        int t = 0;
        for (int i = 0; i < n; i ++ ) {
            t += nums[i];
            for (int x = 0; x <= op1; x ++ )
                for (int y = 0; y <= op2; y ++ )
                    f[i + 1][x][y] = t;
        }
        for (int i = 1; i <= n; i ++ ) {
            int v = nums[i - 1];
            for (int j = 1; j <= op1; j ++ )
                f[i][j][0] = Math.min(f[i][j][0], Math.min(f[i - 1][j][0], f[i - 1][j - 1][0] - v / 2) + v);
            for (int k = 1; k <= op2; k ++ ) {
                f[i][0][k] = Math.min(f[i][0][k], f[i-1][0][k] + v);
                if (v >= kt) f[i][0][k] = Math.min(f[i][0][k], f[i - 1][0][k - 1] - kt + v);
            }
            for (int j = 1; j <= op1; j ++ )
                for (int k = 1; k <= op2; k ++ ) {
                    f[i][j][k] = Math.min(f[i][j][k], Math.min(f[i - 1][j][k], f[i - 1][j - 1][k] - v / 2) + v);
                    if (v >= kt) f[i][j][k] = Math.min(f[i][j][k], f[i - 1][j][k - 1] - kt + v);
                    if (v >= 2 * kt - 1) f[i][j][k] = Math.min(f[i][j][k], f[i - 1][j - 1][k - 1] - v / 2 - kt + v);
                    if (v >= kt && v < 2 * kt - 1) f[i][j][k] = Math.min(f[i][j][k], f[i - 1][j - 1][k - 1] - kt - (v - kt) / 2 + v);
                }
            
        }
        return f[n][op1][op2];
    }
}
```

# 第 425 场周赛第四题

> 题目链接：https://leetcode.cn/problems/maximize-sum-of-weights-after-edge-removals/description/

## 题目大意

给定一棵 $n$ 个结点的无向树，结点编号是 $0$~$n-1$ ，给定一个数组 edges，其中 $edges[i]=[u_i, v_i, w_i]$，代表结点 $u_i,v_i$ 之间有一条边。

现在需要你移除零条边或者多条边，使得
* 每个结点与至多 $k$ 个其他结点有边直接相连，其中 $k$ 是给定的输入
* 剩余边的权重之和的最大化

求剩余边的权重的 **最大** 可能和

## 数据范围
* $2 \le n \le 10^5$
* $1 \le k \le n - 1$
* $edges.length = n-1$
* $edges[i] = 3$
* $0 \le edges[i][0] \le n - 1$
* $0 \le edges[i][1] \le n - 1$
* $1 \le edges[i][2] \le 10^6$
* 保证`edges`形成一棵有效的树

## 题解

### 树形 dp, 贪心

**时间复杂度$O(nlogn)$**

题目有说这是一棵无根树，一般情况下会从一个结点开始，让其作为根节点，这里以 0 为根节点。

然后树上的问题很容易找到子问题，我们仔细思考，对于一个以 $r$ 为根结点的树，如果该结点满足题目条件，那么与 $r$ 相关的边肯定不会删除，那么就只需要考虑其孩子结点即可，而以孩子结点为根的子树不影响 $r$ 为根的树，因此，可以考虑使用树形dp来求解。

以 $f(i,0/1)$ 表示以 $i$ 结点为根的子树并且其唯一入度边的状态为 $0/1$（0表示不删除，1表示删除）的最大价值。因此答案为 $f(0,0)$，根节点为 0，根节点没有入度边，因此表示不删除即可。

如果根节点的入度边删除，那么表示其出度边最多只能有 $k-1$ 条。

因此，无非是需要保留的边减少了，这里我们忽略这些细节，就考虑以 $r$ 为根，并且出度边至多只能保留 $k$ 条的最大价值，$f(r,0),f(r,1)$ 的求法是一样的。

首先递归求出 $f(r_1, 0),f(r_2,0),\cdots,f(r_x,0)$, 以及 $f(r_1,1),f(r_2,1),\cdots,f(r_x,1)$

首先，如果 $f(r_y,0) \le f(r_y,1)$ ，换句话说删了 $(r,r_y)$ 这条边比不删好，那何乐而不为，直接删掉，也就是说此时累加 $f(r_y,1)$ 即可

因此，接下来只需要考虑 $f(r_y,0) \gt f(r_y,1)$ 的情况，看下面的 note 便可求解。

:::note
这里我抽象出一个问题：
给你一个长度为 $n$ 的两个数组，分别为 $A,B$，其中 $A[i] \gt B[i]$，
现在让你至多选 $k$ 个 $A$ 数组里面的数（注意，选了 $A[i]$ 就不能选 $B[i]$)，然后其余选 $B$ 数组里面的数，怎么选累和最大？
答：因为这里 $A[i] \gt B[i]$，因此最多选 $k$ 个，那就是选 $k$，除非 $n \lt k$。
假设选了 $k$ 个，分别为 $A[1],\cdots,A[k]$，其余选的 $B[k+1],\cdots,B[n]$ 。如果此时从选择的 $k$ 个中挑出 $A[x]$，从其余部分挑出 $B[y]$ ，将其交换到不同集合中去，我们看看累和的变化：
$$
\Delta=A[1]+\cdots+A[k]+B[k]+\cdots+B[n]- \\ (A[1]+\cdots+A[y]+\cdots+A[k]+B[k+1]+\cdots+B[x]+\cdots+B[n]) = \\
A[x] - A[y] + B[y] - B[x]
$$
如果要使得无论怎么交换 $\Delta$ 的值都是减少的，也就是说当 $\Delta\gt 0$ 时，也就是 $A[x]-B[x] \gt A[y] - B[y]$ 时，一定是最优解。
因此，如果我们按照 $A[x]-B[x]$ 进行排序，只需要选前 $k$ 个数为 A，后面的为 B, 则一定累和最大。
:::

**JAVA代码如下**
```java
class Solution {
    int[] h, e, ne, w;
    long[][] f;
    int idx = 0;
    class Node implements Comparable<Node> {
        long x, y; // x 是包含的 y 是不包含的
        @Override
        public int compareTo(Node o) {
            if (x - y == o.x - o.y) return 0;
            return x - y - (o.x - o.y) > 0 ? -1 : 1;
        }
    }

    void add(int a, int b, int c) {
        e[idx] = b;
        w[idx] = c;
        ne[idx] = h[a];
        h[a] = idx ++ ;
    }
    void init(int n) {
        h = new int[n];
        e = new int[n << 1];
        ne = new int[n << 1];
        w = new int[n << 1];
        Arrays.fill(h, -1);
        f = new long[n][2];
        for (int i = 0; i < n; i ++ ) f[i][0] = f[i][1] = -1;
    }
    long dp(int u, int fa, int isIn, int k) {
       if (f[u][isIn] != -1) return f[u][isIn];
        int cnt = 0;
        for (int i = h[u]; i != -1; i = ne[i]) {
            int v = e[i];
            if (v == fa) continue;
            f[v][0] = dp(v, u, 0, k);
            f[v][1] = dp(v, u, 1, k);
           // System.out.println(u + " " + v + " " + w[i]);

            cnt ++ ;
        }
        Node[] tmp = new Node[cnt]; // 必须是局部变量
        for (int i = h[u], j = 0; i != -1; i = ne[i]) {
            int v = e[i];
            if (v == fa) continue;
            tmp[j] = new Node();
            tmp[j].y = f[v][0];
            tmp[j].x = f[v][1] + w[i];
            j ++ ;
        }
        Arrays.sort(tmp, 0, cnt);
        long ans = 0;
        for (int i = 0; i < cnt; i ++ )
            if (i < k - isIn && tmp[i].x > tmp[i].y) ans += tmp[i].x;
            else ans += tmp[i].y;
        return f[u][isIn] = ans;
    }
    public long maximizeSumOfWeights(int[][] edges, int k) {
        int n = edges.length; 
        init(n + 1);
        for (int[] e: edges) {
            add(e[0], e[1], e[2]);
            add(e[1], e[0], e[2]);
        }
        return dp(0, -1, 0, k);
    }
}
```

:::tip
这几道题中，按照这四道题的顺序，第一、四题是比较苦难的，首先第一个涉及到了贪心，可能不好想，第二个细节比较多。

另外第三题还有一个贪心解，这里暂时不做探究。
:::


