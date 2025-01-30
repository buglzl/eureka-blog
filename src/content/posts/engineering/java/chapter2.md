---
title: Java 笔记 (chapter 02)
published: 2025-01-30
description: 'Java基础系列 个人整理笔记 方便个人回忆知识点'
image: './img/java.png'
tags: [Java]
category: '工程'
draft: false 
---

> 接 chapter 1 的 Java 基础知识

# Java 基础知识

## 运算符

- 运算符介绍
- 算术运算符<br>
  +(正) -(负) +(加) -(减) *(乘)<br>
  /(除) %(取余)<br>
  ++(自增) --(自减) +(字符串拼接)<br>
- 关系运算符 (比较运算符)<br>
  == $\ \ $ != $\ \ $ < $\ \ $ > $\ \ $ <= $\ \ $ >= $\ \ $ instanceof <br>
- 逻辑运算符<br>
  && || & | !(取反) ^<br> 短路与（&&），短路或（||），取反（！）；逻辑与（&），逻辑或（|），^（逻辑异或）

- 赋值运算符<br>
  = $\ \ $ +=  $\ \ $ -= $\ \ $ *= $\ \ $  /= $\ \ $ %= <br>
- 位运算符<br>
  | $\ \ $ &  $\ \ $ >> $\ \ $ << $\ \ $ >>> $\ \ $<br>
- 三元运算符<br>
  a>b?a:b<br>
- 运算符优先级

**取模本质:a % b = a - a / b * b**

``` java
//结果的正负值与被除数一致
System.out.println(10 % 3); // 1
System.out.println(-10 % 3); // -1
System.out.println(10 % -3); // 1
System.out.println(-10 % -3); // -1

System.out.println(-10.5 % 3); // -1.5
//a%b=a-a/b*b
//如果a为小数,a%b=a-(int)a/b*b;
```

**关于自增自减的细节**

```java
// 规则就是使用临时变量
int i = 1;
i = i ++ ; // (1) tmp = i; (2)i = i + 1; (3) i = tmp;
System.out.println(i); // 1 

int i = 1;
i = ++i; // (1)i = i + 1; (2) tmp = i; (3) i = tmp;
System.out.println(i); // 2
```



逻辑运算和位运算<br>
& $\ \ $ &&<br>
| $\ \ $ ||<br>
除了以上作用以外,&& 和||也被称之为短路,<br>
(条件1)&&(条件2) 只要条件1为false,则结果为false,条件2判断式不再执行<br>
(条件1)||(条件2) 只要条件1为true,则结果为true,条件2判断式不再执行<br>

```java
a=1
if((1>2)&&(a++>2))
{
    pass;
}
sout(a);
//a=1
=============================
a=1
if((1<2)||(a++>2))
{   
    pass;
}
sout(a);
//a=1

```


(条件1)&(条件2) 无论条件1结果为T/F,条件2判断式都会执行<br>
(条件1)|(条件2) 无论条件1结果为T/F,条件2判断式都会执行<br>

```java
a=1
if((1>2)&(a++>2))
{
    pass;
}
sout(a);
//a=2
=============================
a=1
if((1<2)|(a++>2))
{   
    pass;
}
sout(a);
//a=3
```

赋值运算符 = 

- 顺序从左往右
- 左侧为变量,右侧可以是变量,表达式,常量值 a=b;a=10-3*2;a=20;
- a+=3;等价于a=a+3
- 复合赋值运算会经行类型转换

```java
byte b=2;
b+=3;
//等价于 b=(byte)b+3;
//如果写b=b+3会报错;
```

三元运算符
a > b ? a : b

## 运算符优先级

- 无顺序 . () {} ; ,
- R-->L ++ -- ~ !(data type)
- L-->R * / %
- L-->R + -
- L-->R << >> >>> 位移
- L-->R < > >= <= instanceof
- L-->R == !=
- L-->R &
- L-->R ^
- L-->R |
- L-->R &&
- L-->R ||
- L-->R a>b?a:b
- R-->L = *= /= %=
- 无顺序 += -= <<= >>=
- 无顺序 >>>= &= ^= |= 

单目乘除为关系，逻辑三目后赋值<br>
1点,括号2单目3算术4位移5比较6逻辑7三元8赋值

## 标识符

* 大小英文字母，数字下划线和$
* 数字不能开头
* 不能包含关键字和保留字
* 严格区别大小写

保留字：byValue, cast, future, generic, inner, operator, outer, rest, var, goto, const

### 标识符命名规范

1. 包名：多单词组成时所有字母都小写：aaa.bbb.ccc // com.lzl.spring
2. 类名、接口名：多单词组成时，所有单词的首字母大写：XxxYyyZzz【大驼峰】
3. 变量名、方法名：多单词组成时，第一个首字母小写，第二个单词开始每个单词首字母大写
4. 常量名：所有字母大写。多单词时每个单词用下划线链接：XXX_YYY_ZZZ


- 包名 aaa.bbb.ccc<br>
  com.zbx.stu
- 类名,接口名 XxxYyyZxx<br>
  TankShotGame
- 变量名,方法名 xxxYyyZzz<br>
  peopleName
- 常量名 XXX_YYY_ZZZ<br>
  COLUMN_LONG 列长度<br>
  ROW_LONG 行长度

## 进制表示

- 二进制 0b 0B<br>
  0b1010 $\rightarrow$ 10
- 八进制 0<br>
  011 $\rightarrow$ 9
- 十进制<br>
  10 $\rightarrow$ 10
- 十六进制 0x 0X<br>
  0x11 $\rightarrow$ 17

### 位运算

- ~2 按位取反
- 2&3 按位与
- 2|3 按位或

- \>> 算术右移:符号位不变,低位溢出,符号位补溢出的高位
- \<< 算术左移:符号位不变,低位补0
- \>>> 逻辑右移,也叫无符号右移:低位溢出,高位补0
- \<<< 没有这个

### 原码反码补码

在java当中 **随机一个整数默认int,随机一个小数默认double**<br>

- 最高位是符号位 0 正数,1负数<br>
- 正数: 原码反码补码保持一致
- 负数: 反码 符号位不变 其他取反
- 负数: 补码=反码+1;  
- 0: 反码,补码都是0
- java没有unsigned 没有无符号数
- 计算机运算时,**以补码方式运算**
- **人类看结果,为原码**

00000000 00000000 00000000 00000010 +2<br>
10000000 00000000 00000000 00000101 -3<br>

:::note
随堂小测<br>
```java
int i = 66;
System.out.println(++i + i); // 134
double num = 3d; // 正确，3d 表示 double 类型的 3
```
:::

## 控制结构

1. 顺序
2. 分支(if else switch)
3. 循环(for,while,do while)
4. break
5. continue
6. return

### 程序流程控制

1. 顺序控制
2. 分支控制
3. 循环控制

#### 顺序控制
正常的从上往下的程序流程

#### 分支控制

if-else

``` java
if(条件表达式){
    代码块;
}
else if{
    代码块;
}
......
else{
    代码块;
}
```

多分支最后 可以没有else

##### 嵌套分支结构

嵌套分支结构,在一个分支结构当中嵌套了另一个完整的分支结构.<br>
规范:不要超过3层,可读性不好

```java
if(){
    if(){
        //if else
    }else{
        //if else
    }
}else{
    //if else
}
```

switch-case

```java
switch(表达式){
    case 常量1:   //当...,执行语句
        语句块1:
        break;    //退出switch
    case 常量2:
        语句块2: 
        break;  
    case 常量3:
        语句块3:
        break;
        
        ......    
    case 常量n:
        语句块n: 
        break;
    default:
        default语句块;
        break;  
  
}
```

switch注意事项

1. 表达式数据类型应该和case之后的常量类型一致，或者是可以自动转换可以相互比较的类型
2. siwtch(表达式)中表达式的返回值必须是(byte,short,int,char,enum(枚举),String)
3. case子句的值必须是常量
4. default子句是可选的，没有匹配的case时，执行default
5. break语句用来执行完一个case分支后，使程序跳出switch，如果没有break，则会顺序执行到switch结尾（这个时候是不会走case，直接走对应的语句块），除非遇到一个break
   default和break的三种特殊情况

```java
1
switch (i) {     
    default:     
         System.out.println("默认");    
    case 1:     
         System.out.println("1");     
    case 2:     
         System.out.println("2");   
    case 3:     
         System.out.println("3");     
} 
当给定义i=1时，输出的结果为： 结果为 1,2,3 
当给定义i=2时，输出的结果为： 结果为 2,3
当给定义i=3时，输出的结果为： 结果为 3
当给定义i=4时，输出的结果为： 结果为 默认，1,2,3

当i匹配到的时候它会走到匹配的位置，而且还会继续运行之后的代码，直到最后位置，当匹配不到是，他会都输出一遍
=========================================
2
switch (i) {        
    case 1:     
         System.out.println("1");   
    default:     
         System.out.println("默认");   
    case 2:     
         System.out.println("2");   
    case 3:     
         System.out.println("3");     
} 
当给定义i=1时，输出的结果为： 结果为 1,默认,2,3 
当给定义i=2时，输出的结果为： 结果为 2,3
当给定义i=3时，输出的结果为： 结果为 3
当给定义i=4时，输出的结果为： 结果为  默认,2,3

当i匹配到的时候它会走到匹配的位置，而且还会继续运行之后的代码，直到最后位置，当匹配不到是，他会从default起到以下都输出一遍
===========================================
3
switch (i) {        
    case 1:     
         System.out.println("1");     
    case 2:     
         System.out.println("2");   
    case 3:     
         System.out.println("3");   
    default:     
         System.out.println("默认");   
} 
当给定义i=1时，输出的结果为： 结果为 1，2,3，默认 
当给定义i=2时，输出的结果为： 结果为 2,3，默认 
当给定义i=3时，输出的结果为： 结果为 3，默认
当给定义i=4时，输出的结果为： 结果为  默认

当i匹配到的时候它会走到匹配的位置，而且还会继续运行之后的代码，直到最后位置，当匹配不到是，他只会输出default下的语句
```

#### 循环控制

for循环

- 循环条件是返回一个boolean值的表达式 i<=10
- for(初始化;循环条件;变量迭代)当中的初始化和变量迭代可以写到其他地方

```java
int i=0;
for( ;i<=10; ){
    sout("hello");
    i++;
}
```

- 初始化值可以是多个，但类型要求一样，之间用”,“分隔开,变量迭代也一样

```java
for(int i=0,j=1;i<=10;i++,j+=2){

}
```

- for循环顺序

```java 
for({1};{2};{3})
{
    {4};
}
执行顺序为1,2,4,3;
```

- for i++ ++i

i++ ++i 效果一样<br>
**++i数据多的时候比i++更快,因为i++,需要临时变量**

while循环

```java
初始化变量;
while(循环条件){
    循环体;
    变量迭代;
}
```

do while循环

```java 
初始化变量;
do{
    循环体;
    变量迭代;
};
while(循环条件)
```

### break 
跳出循环

- 使用标签时，可以指定跳出那一层循环
- label1:是标签，可以随意指定，修改
- break label2:跳出label2层，可以指定
- **尽量不使用标签**
- break之后没有标签，默认跳出最近的一层

```java
//break 可以使用标签，指定终止那一层
label1:
for (int i = 1; i <= 5; i++) {
    label2:
    for (int j = 1; j <= 3; j++) {
        System.out.println(i + " " + j);
        if (i == 2) {
            // break label1;
            break label2;
        }
    }
}
```

### continue 
跳出当前循环，再进行循环,进行下一次的循环判断

- continue也可以使用标签，和break用法一致 
- continue没有标签，跳过最近的循环
- continue 的标签也尽量少使用

### return

- 跳出方法，返回值
- 用在main时，退出程序





