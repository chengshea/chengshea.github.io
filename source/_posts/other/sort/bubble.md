---
title: 冒泡排序
permalink: other/sort/bubble/
tags:
  - 冒泡排序
  - bubble
categories:
  - other
  - sort
  - bubble
date: 2022-09-08 20:35:48
---

## 冒泡

两个相邻位置比较,如果前面的元素比后面的元素大就换位置.每比较一次,最后一次就不用再参与比较了.相邻元素两两比较，大的往后放，第一次完毕，最大值出现在了最大索引处


![](/pics/20180829175559005.gif)  

  <!--more-->

java

```java
int[] array = {3,1,6,2,5,4};

public  void bubbleSort(int[] a) {

    int temp = 0;
    int n = a.length;

    //外层循环控制排序趟数，n个数排序，只用进行n-1趟
    for(int i = 0; i < n-1; i++) {
        boolean flag = false;
   //内层循环控制每一趟排序多少次，从第1位开始比较直到最后一个尚未归位的数
      for(int j = 0; j < n-i-1; j++) {
          //比较大小并交换
          if (a[j] < a[j+1]) {
            temp = a[j];
            a[j] = a[j+1];
            a[j+1] = temp;
              flag = true;
          }
      }
        //-- 当前趟 没有发生交换,那下一趟可以不用比较了!
        if(!flag){
            break;
        }

    }
   }
```



go

```go
 slice := []int{50,16,10,8,6}

func popSort(a []int){
	for i:=1;i<len(a);i++{
		index := 0
		sorted := true
		for j:=0;j<len(a)-i;j++{
			if a[j] > a[j+1]{  //冒泡排序是属于稳定排序，这里不能是>=,否则会变成不稳定
				a[j],a[j+1]=a[j+1],a[j]
				index = j   //如果尾部的已经是排好序了，我们可以跳掉尾部已经排好的那几次循环
				sorted = false
			}
		}
		i = len(a)-index-1
		if sorted {
			break
		}
	}
	fmt.Println(a)

```

