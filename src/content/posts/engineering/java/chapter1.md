---
title: Java 笔记 (chapter 01)
published: 2025-01-26
description: 'Java基础系列 个人整理笔记 方便个人回忆知识点'
image: './img/java.png'
tags: [Java]
category: '工程'
draft: false 
---


# Java历史

1995 v1

Java se  $\ \ \ $   标准版

Java ee   $\ \ \ $  企业版

Java me(Micro Edition)   $\ \ \ $  小型版  $\ \ \ $ 基本不用

# Java特点

- 面向对象
- 强类型机制，异常处理，垃圾自动回收
- 跨平台
- 解释性语言(也有 jvm 中热点代码先编译再执行)

> 解释性语言 js,Java <br>
> 编译性语言 c c++ <br>

区别

- 解释性语言，编译后的代码，不能被机器直接执行，需要解释器.<br>
- 编译性语言,编译后的代码(bin)，可以直接被机器执行

# JVM & JDK & JRE 之间的关系

## JVM(Java virtual machine)

- jvm   虚拟计算机，具有指令集并使用不同的存储区域，复制执行指令，管理数据，内存，寄存器，包含在jdk当中
- 不同的平台，有不同的虚拟机
- Java虚拟机 机制屏蔽了底层运行平台的差异，实现一次编译，到处运行

## JDK(Java development kit)

- jdk Java开发工具包
- jdk = jre + Java的开发工具(Java Javac Javadoc Javap等)

## jre介绍

- jre(Java runtime environment      Java运行环境)
- jre=jvm + Java核心类库
- jre包含 jvm 和 Java 程序所需要的核心类库

## 小结

jdk= jre + Java开发工具<br>
jre = jvm+Java核心类库<br>
jdk = jre ( jvm + 核心类库 ) + Java开发工具


# Java执行流程

.java文件(源文件)------>.class文件(字节码文件)------>结果

javac编译 

Java装载到jvm执行

# Java开发细节

一个Java源文件可以有多个class类,但最多一个public类<br>
一个源文件最多一个public类，其他类不限，可以将main方法写在非public类当中,
然后指定运行非public类，这样入口方法就是非public的main方法

```java
public class HelloWorld {
    //有几个class类 编译之后就有几个.class 文件
    //可以使用Java dog单独运行dog.class或cat.class
    public static void main(String[] args) {
        System.out.println("hello world!");
    }
}
class dog {
    public static void main(String[] args) {
        System.out.println("dog");
    }
}
class cat {
    public static void main(String[] args) {
        System.out.println("cat");
    }
}
```

:::note
一个文件里面只有一个 public 类，和其他没有修饰词的类

并且这些类里面都可以有main函数，并且可以自己主动调用别的函数的main函数（类名.main）
:::

---
> 面对不断变化的新世界，我们该如何应对？

## 如何学习新技术

1. 需求

   1. 工作需要
   2. 跳槽，对方要求
   3. 技术控

2. 能否用传统技术解决？

   1. 能解决，但不完美
   2. 解决不了

时刻询问自己，新技术到底给我带来了什么优势？

3. 引出我们学习的新技术和知识点



4. 学习新技术或者知识点的基本语句和基本语法（不要考虑细节）



5. 快速入门（基本程序，crud）



6. 开始考虑研究技术的注意事项，使用细节，使用规范，如何优化

​	优化无止境，技术魅力



### 转义字符

- \t    tab
- \n    换行
- \\    一个\
- \\"    一个"
- \\'    一个'
- \r    一个回车

回车和换行的区别：回车是把当前光标放到目前的第一行

```java
System.out.println("hhhhh\rxxx"); // 输出 xxxhh
```

---
>接下来开启基础知识的导航

# Java 基础知识


## 注释

单行 //<br>
多行 /**/

## 文档注释

```java
/**

* @author lzl~
* @version 1.0
*/
```

```java
public class demo2_ChangeChar {
    /**
     * @author zbx
     * @version 1.0
     * */
    public static void main(String[] args) {
        System.out.println("demo1\tdemo\tdemo");
    }
}
```

使用`javadoc -d [filename] -xx -yy [javaFile]`,可以生成一套网页文件形式的文档说明

:::tip
注意 `[filename]` 表示一个参数，这里参数表示Java文件所在文件夹的名字

`[javaFile]` 表示 java 源文件
:::

javadoc -d d://temp -xx -yy 当前java源文件<br>
xx yy 指的是使用到的标签， 即 author version 等

**更多的一定要看 javadoc 相关文档**



## java 规范
> 部分规范
1. 类、方法的注释，要以javadoc的方式来写
2. 非javadoc的注释，往往是给代码的维护者看的，着重告诉读者为什么这么写，如何修改，注意什么问题等
3. 使用tab操作，实现缩进，默认整体向右边移动，用 shift+tab整体向左移动
4. 运算符和=习惯两边加空格
5. 源文件使用utf-8编码
6. 行宽度不要超过80字符
7. 代码编写次行风格和行尾风格(说的是花括号)


## dos 命令

```bash
tree [dir]
cls # 清屏
exit # 退出
md
rd
echo
type
del
copy
move
```

:::tip
[dir] 表示文件目录
:::

## 变量

变量是程序的基本组成单位

类型  名称  值<br>
int a=1;

不同的类型占用不同的空间大小 8bit=1byte

变量表示内存中的一个存储区域

变量=变量名+值+数据类型

#### +号的使用

1. 加号左右两边都是数值时，做加法运算
2. 加号左右两边有一方是字符串时，做拼接运算

```java
public class demo3_var3 {
    public static void main(String[] args) {

        int a = 50;
        int b = 20;
        String s = "hello";

        System.out.println(a + b);
        System.out.println(a + s);
    }
}
```
> 结果<br>
70<br>
50hello


### 数据类型

1,基本数据类型<br>
2,引用数据类型

基本数据类型包括 

1数值型,2字符型,3bool型<br>
1.1 byte[1],short[2],int[4],long[8]<br>
1.2 float[4],double[8] 浮点数 = 符号位 + 指数位 + 尾数位<br>
2.1 char[2]<br>
3.1 boolean[1]<br>

引用数据类型包括 1class类,2interface接口,3[]数组

浮点默认double，要float后面需要加 f

### 整型细节

```java
int n = 1L; // 错误，不能long类型赋值给 int 类型
```

### 浮点细节

浮点默认double，要float后面需要加 f

```java
float num = 1.1; // 错误，得 1.1f
```

浮点数表示：0.512, .512,  512.0f （十进制数形式）5.12e2（科学计数法）

推荐有限使用 double，精度更高

浮点数陷阱，进行判断时要小心

```java
double a = 2.7;
double b = 8.1 / 3; // b != 2.7
```

### Java API文档

https://www.matools.com/api/java8

### char 细节

```java
char c = 97; // 字符类型可以直接存放一个数字
```

编码：Unicode（固定两个字节）, ASCII（一个字节）, utf-8（字母1字节，汉字3字节）, GBK（字母1字节，汉字2字节）, gb2312(gb2312<gbk), big5 (繁体中文，台湾，香港)

:::important
接下来这块非常重要，基本数据类型转换和强制类型转换的规则相当重要
:::

### 基本数据类型转换

**在java当中 随机一个整数默认int,随机一个小数默认double**<br>
精度小的类型可以自动转换为精度大的类型<br>
char-->int-->long-->float-->double<br>
byte-->short-->int-->long-->float-->double<br>

- 有多种数据类型混合运算时,系统将自动将所有数据转换为容量最大的数据类型,再计算
- 当将精度大的数据赋值给精度小的数据类型时,会报错,反之会自动转换
- (byte,short)和char之间不会相互自动转换 
- byte,short,char 三者之间可以计算,在计算时首先转换为int类型
- boolean不参与转换
- 自动提升原则:表达式的结果自动提升为操作数当中最大的类型

```java
byte b = 10;
char c = b; // 错误，原因 byte 不能自动转成 char
int n = 1;
b = n; // 错误，变量赋值会根据变量类型进行判断
short s = 1;
short s2 = s + b; // 错误，byte, short,char 运算 -> int
byte b1 = 11;
byte b2 = b1 + b; // 错误，全部是某种类型也会变成 int 类型
boolean pass = true;
int num100 = pass; // 错误，boolean 不参与类型的自动转换
byte b4 = 1; 
short s3 = 100;
int num200 = 1;
double num300 = 1.1;
double num500 = b4 + s3 + num200 + num300 // double 类型
```



### 强制类型转换

会造成丢失精度和溢出问题

```java
int n1 = (int) 1.9;
System.out.println("n1 = " + n1);

//溢出
byte b = (byte) 2000;
System.out.println("b = " + b);

结果
n1 = 1
b = -48
```

- 数据类型从大到小需要强制转换
- 强转符合只针对最近的操作数有效,小括号可提高优先级
- char可以保存int的常量值,但不能保存int的变量值,需要强转
- byte和short类型在运算时,当作int类型处理

```java
short s = 12; // ok
s = s - 9; // error  int -> short
byte b = 10; // ok
b = b + 11; // error int->byte
b = (byte)(b + 11); // ok
char c = 'a'; // ok
int i = 16; // ok
float d = .314F; // ok
double result = c + i + d; // ok float -> double
short t = s + b; // error int -> short
```



### 基本数据类型和String类型的转换

- 基本数据类型转String <br>
  基本数据类型+ ""
- String类型转基本数据类型<br>
  调用parseXXX方法

:::tip
事实上还有更多
:::


> 第一章暂时讲到这，这章重点只有变量类型这块