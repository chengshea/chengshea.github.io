---
title: 二叉树
permalink: other/data-structure/binary-tree/
tags:
  - 二叉树
  - 查找
  - 平衡
categories:
  - other
  - data-structure
  - binary-tree
date: 2022-09-08 20:22:46
---

## 二叉树



<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">树的结点（node）：包含一个数据元素及若干指向子树的分支；</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">孩子结点（child
node）：结点的子树的根称为该结点的孩子；</span>

<span wiz-span="data-wiz-span" style="font-size: 1.167rem;">双亲结点：B
结点是A 结点的孩子，则A结点是B 结点的双亲；</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">兄弟结点：同一双亲的孩子结点；
堂兄结点：同一层上结点；</span>

<span wiz-span="data-wiz-span" style="font-size: 1.167rem;">祖先结点:
从根到该结点的所经分支上的所有结点</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">子孙结点：以某结点为根的子树中任一结点都称为该结点的子孙</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">结点层：根结点的层定义为1；根的孩子为第二层结点，依此类推；</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">**树的深度**：树中最大的结点层</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">**结点的度**：结点子树的个数</span>

<span wiz-span="data-wiz-span" style="font-size: 1.167rem;">**树的度**：
树中最大的结点度。</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">叶子结点：也叫终端结点，是度为 0
的结点；</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">分枝结点：度不为0的结点；</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">有序树：子树有序的树，如：家族树；</span>

<span wiz-span="data-wiz-span"
style="font-size: 1.167rem;">无序树：不考虑子树的顺序；</span>

  

  

### 满二叉树

![](/pics/0c197bb5-0d99-44b0-96d1-bca6d20fe8d1.jpg)

​    <!--more-->

1.  叶子只能出现在最下一层。
2.  非叶子结点度一定是2.
3.  在同样深度的二叉树中，满二叉树的结点个数最多，叶子树最多。

  

###  完全二叉树

![](/pics/4fdd0b13-2a71-4147-ab35-6f0c806f1a59.jpg)

1.  叶子结点只能出现在最下一层（满二叉树继承而来）
2.  最下层叶子结点一定集中在左 部连续位置。
3.  倒数第二层，如有叶子节点，一定出现在右部连续位置。
4.  同样结点树的二叉树，完全二叉树的深度最小（满二叉树也是对的）。

<!--more-->

### BST

二叉查找树 ，<span style="line-height: 1.7;">树上每个结点都</span><span
style="line-height: 1.7;">满足：</span>

<span
style="line-height: 1.7;"> 其左子树上所有结点数据均小于根结点；</span>

<span
style="line-height: 1.7;">右子树所有结点数据域均大于根结点数据域。</span>

<img
src="/pics/4b4b2a7e-5c3e-4d2a-a4d1-a6664292a948.jpg"
style="vertical-align: bottom; max-width: 100%;" width="429"
height="334" />

  

  

  

### ALV

平衡二叉树，在二叉平衡查找树基础上增加了 “平衡”

 左子树和右子树的高度绝对差不超过 1

<img
src="/pics/e93154fd-ccaa-4659-8a10-c193bd41ee96.jpg"
style="vertical-align: bottom; max-width: 100%;" />

  

  

  

右旋操作

  

<img
src="/pics/6cef681e-3aa4-4323-85d8-95d608edbf80.jpg"
style="vertical-align: bottom; max-width: 100%;" />

  

  

左旋操作

  

<img
src="/pics/afbdab28-7456-4c2f-a85a-aa8696b87bb7.jpg"
style="vertical-align: bottom; max-width: 100%;" />

  

  

  

<img
src="/pics/53beb403-c902-4fd7-a5bd-57f8f5d66ff3.jpg"
style="vertical-align: bottom; max-width: 100%;" />

  

LR型

<img
src="/pics/01692aac-97e3-4957-b2a7-fad570523649.jpg"
style="vertical-align: bottom; max-width: 100%;" />

  

RL型

<img
src="/pics/4f97ee66-0338-4293-b013-caa2c75b9bb8.jpg"
style="vertical-align: bottom; max-width: 100%;" />

  

## 遍历



### 前序遍历

![](/pics/62795589-6f79-489c-b7cc-dfc4faac0c2b.jpg)

 <span
style="color:rgb(51, 51, 51);font-style:normal;font-weight:400;">先访问根结点，再先序遍历左子树，最后再先序遍历右子树即</span>根—左—右

  

  

### <span wiz-span="data-wiz-span">后序遍历</span>  

<span
wiz-span="data-wiz-span">![](/pics/08d43bf9-4544-47a8-b7bc-0bf1a3efbd6b.jpg)</span>

 <span
style="color:rgb(51, 51, 51);font-style:normal;font-weight:400;">先后序遍历左子树，然后再后序遍历右子树，最后再访问根结点即<span
wiz-span="data-wiz-span"
style="color: rgb(255, 0, 0);">左—右—根</span></span>



### 中序遍历

<span
style="color:rgb(51, 51, 51);font-style:normal;font-weight:400;"><span
wiz-span="data-wiz-span"
style="color: rgb(40, 40, 40);">![](/pics/1b91ca9f-7cc1-428c-9d06-12e3fe3d7ddf.jpg)</span></span>

<span wiz-span="data-wiz-span" style="color: rgb(165, 42, 0);">       
 <span wiz-span="data-wiz-span"
style="color: rgb(255, 0, 0);">左—根—右</span></span>

<span style="color:rgb(79, 79, 79);font-style:normal;font-weight:400;">B
 D C A E H G K F</span>

<span
style="color:rgb(51, 51, 51);font-style:normal;font-weight:400;"><span
wiz-span="data-wiz-span" style="color: rgb(255, 0, 0);">  
</span></span>

<span wiz-span="data-wiz-span"
style="color: rgb(255, 0, 0);">还原二叉树知道前序<span
wiz-span="data-wiz-span"
style="color: rgb(0, 0, 0);">（第一个）</span>或后序<span
wiz-span="data-wiz-span"
style="color: rgb(0, 0, 0);">（最后一个）</span> 确定根节点，必须知道中序才能确定左子树或右子树</span>
