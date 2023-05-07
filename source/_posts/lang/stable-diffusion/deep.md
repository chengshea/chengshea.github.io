---
title: Stable diffusion概念
permalink: lang/stable-diffusion/deep/
tags:
  - Stable
  - diffusion
  - text2img
  - picture
categories:
  - lang
  - python
  - deep
date: 2023-04-02 11:20:04
---

## stable-diffusion-webui

[stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

只记录关键步骤

### 跳过下载检查

~/stable-diffusion-webui/launch.py

```
skip_install = True
```



使用代理下载7个github的库https://ghproxy.com/

https://github.com/Stability-AI/stablediffusion/archive/refs/heads/main.zip

```

https://github.com/salesforce/BLIP
https://github.com/sczhou/CodeFormer
https://github.com/crowsonkb/k-diffusion
https://github.com/Stability-AI/stablediffusion
https://github.com/CompVis/taming-transformers

#/stable-diffusion-webui/venv/lib/python3.9/site-packages/
https://github.com/TencentARC/GFPGAN
https://github.com/openai/CLIP
https://github.com/mlfoundations/open_clip
```

<!--more-->

### [pip源](/lang/python/pip#pip-source)下载

https://pypi.org/project/xformers/

```
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
source  ~/stable-diffusion-webui/venv/bin/activate
pip  install facexlib

xformers
lpips
.
.
.
```



### 目录

#### repositories

~/stable-diffusion-webui/modules/paths.py

```
$ tree -L 1 ~/stable-diffusion-webui/repositories
/home/cs/stable-diffusion-webui/repositories
├── BLIP
├── CodeFormer
├── k-diffusion
├── stable-diffusion-stability-ai
└── taming-transformers

5 directories, 0 files

```



##### CodeFormer

仓库代码https://github.com/sczhou/CodeFormer/releases/tag/v0.1.0

～/stable-diffusion-webui/modules/codeformer_model.py

```
#CodeFormer版本v0.1.0
send_model_to（）
```

CodeFormer 预训练模型下载到～/stable-diffusion-webui/repositories/CodeFormer/weights

```
$ tree ~/stable-diffusion-webui/repositories/CodeFormer/weights -L 2
/home/cs/stable-diffusion-webui/repositories/CodeFormer/weights
├── CodeFormer
│   └── codeformer.pth
├── dlib
│   ├── mmod_human_face_detector-4cb19393.dat
│   └── shape_predictor_5_face_landmarks-c4b1e980.dat
├── facelib
│   ├── detection_Resnet50_Final.pth
│   └── parsing_parsenet.pth
└── README.md

3 directories, 6 files

```



##### ESRGAN 放大

https://github.com/xinntao/Real-ESRGAN/blob/master/README_CN.md

1. realesrgan-x4plus（默认）
2. reaesrnet-x4plus
3. realesrgan-x4plus-anime（针对动漫插画图像优化，有更小的体积）
4. realesr-animevideov3 (针对动漫视频)

 ~/stable-diffusion-webui/modules/realesrgan_model.py



##### clip

Downloading: "https://storage.googleapis.com/sfr-vision-language-research/BLIP/models/model_base_caption_capfilt_large.pth" to /home/cs/stable-diffusion-webui/models/BLIP/model_base_caption_capfilt_large.pth



https://storage.googleapis.com/sfr-vision-language-research/BLIP/models/model_large_caption.pth

ViT-L-14

https://huggingface.co/laion/CoCa-ViT-L-14-laion2B-s13B-b90k/tree/main

wget ‐‐continue





### 启动参数

16XX启动（图片分辨率最大方图为576×576）：--medvram --precision full --no-half --always-batch-cond-uncond --deepdanbooru --xformers

2G启动：--lowvram --always-batch-cond-uncond --deepdanbooru --xformers

4G启动（图片分辨率最大方图为576×576）：--medvram --always-batch-cond-uncond --deepdanbooru --xformers

6G启动（最大方图分辨率自行测试）：--medvram --always-batch-cond-uncond --deepdanbooru --xformers

8G及以上：--always-batch-cond-uncond --deepdanbooru --xformers

CPU启动（控制台不动可能需要回车）：--use-cpu all --no-half --skip-torch-cuda-test --deepdanbooru

>deepdanbooru：这是一个用来给二次元图跑训练时提取信息的插件，需要额外安装，如果用了别人的pt训练包，一定要加上这个参数，不然效果天差地别，因为别人大概率是用了这个插件进行训练的
>
>always-batch-cond-uncond：不清楚，不过推测应该是自动整理显存碎片的
>
>xformers：优化显存占用情况的插件，需要额外安装，不支持CPU，不启用这个参数就要把4G及16XX中的medvram改为lowvram
>
>precision full和no-half：完全精度和非半精度，也就是使用32位浮点运算而不是使用16位浮点运算，开启这两个参数会让显存占用增加，但图的质量会更好，但是cpu和16XX显卡必须开启，不然黑图或者
>
>





### 文生图（`text2img`）

| 参数            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| Prompt          | 提示词（正向）                                               |
| Negative prompt | 消极的提示词（反向）                                         |
| Width & Height  | 要生成的图片尺寸。尺寸越大，越耗性能，耗时越久。             |
| CFG scale       | AI 对描述参数（Prompt）的倾向程度。值越小生成的图片越偏离你的描述，但越符合逻辑；值越大则生成的图片越符合你的描述，但可能不符合逻辑。 |
| Sampling method | 采样方法。有很多种，但只是采样算法上有差别，没有好坏之分，选用适合的即可。 |
| Sampling steps  | 采样步长。太小的话采样的随机性会很高，太大的话采样的效率会很低，拒绝概率高(可以理解为没有采样到,采样的结果被舍弃了)。 |
| Seed            | 随机数种子。生成每张图片时的随机种子，这个种子是用来作为确定扩散初始状态的基础。不懂的话，用随机的即可。 |





Sampling Steps 你可以理解让AI推演多少步，一般来说超过17基本就能看了，步数越多，画面中的细节就越多，但需要的时间也就越久，一般20~30是一个比较稳妥的设定。这个数不会改变画面内容，只会让内容更加精细，比如20的项链就是一个心形钻石，而50的项链还是同样的心形钻石，只是钻石上会有更加复杂的线条

Sampling method 你可以理解成AI推演的算法，一般Euler a，Euler ，DDIM，都是不错的，任选一个就行。

图片分辨率 这个就是拼显卡显存的，自己调吧，低于512X512可能画面就不会有太多细节了，越大的分辨率AI能发挥的地方就越多。

下边是3个扩展选项，一般不需要勾选。
Restore faces：勾选后可以生成更真实的脸，第一次勾选使用时，需要先下载几个G的运行库。
Tiling：让图片可以平铺（类似瓷砖，生成的图案左右上下都可以无缝衔接上自己）
Highres. fix：超分辨率，让AI用更高的分辨率填充内容，但生成的最终尺寸还是你上边设定的尺寸。

生成几次，每次多少张
Batch count：是一次运行几次
Batch size： 是同时生成多少张
比如：Batch count设置为4,用时N分钟*4，生成4张图；Batch count设置为4,用时N分钟，生成4张图，但是同时需要的显存也是4倍。512X512大概需要3.75GB显存，4倍就是15GB显存了。

CFG Scale AI有多参考你的Prompt与Negative prompt
开得越高，AI越严格按照你的设定走，但也会有越少的创意
开的越低，AI就越放飞自我，随心所欲的画。
一般7左右就行。

Seed 随机数种子，AI作画从原理上其实就是用一个随机的噪声图，反推回图像。但因为计算机里也没有真随机嘛，所以实际上，AI作画的起始噪声，是可以量化为一个种子数的。

Generate 开始干活按钮，这个就不用说了吧，点了AI就开始干活了。

Stable Diffusion checkpoint 在最左上角，是选择模型的



### 汉化

[下载本 git 仓库](https://codeload.github.com/dtlnor/stable-diffusion-webui-localization-zh_CN/zip/refs/heads/main)为 zip 档案，解压，并把文件夹放置在 webui 根目录下的 `extensions` 文件夹中



https://github.com/dtlnor/stable-diffusion-webui-localization-zh_CN#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8



##



````
模型：ChilloutMix（基于Stable Diffusion 1.5）

关键词：<lora:koreanDollLikeness_v10:0.3>,<lora:taiwanDollLikeness_v10:0.2>(8k, RAW photo, best quality, masterpiece:1.2), (realistic, photo-realistic:1.37), ultra-detailed, 1 girl,cute, solo,beautiful detailed sky,detailed cafe,night,sitting,dating,(nose blush),(smile:1.1),(closed mouth) medium breasts,beautiful detailed eyes,(collared shirt:1.1), bowtie,pleated skirt,(short hair:1.2),floating hair

参数：Steps: 40, Sampler: DPM++ 2M Karras, CFG scale: 7, Seed: 3131560428, Size: 768x1024（不同的图片参数有些许差异）
````

![](/home/cs/oss/hexo/themes/spfk/source/pics/2023-04-02_15-26.png)







```
例如配置如下：

<lora:koreanDollLikeness_v10:0.5> <lora:lora-hanfugirl-v1-5:0.5>,hanfu,medium breasts, glasses,

Negative prompt: ng_deepnegative_v1_75t,EasyNegative, paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans,extra fingers,fewer fingers,disabled body,DeepNegative,tatoo

Size: 512x960, Seed: 872093151, Model: chilloutmix_NiPrunedFp32Fix, Steps: 26, Sampler: DPM++ 2M Karras, CFG scale: 10.5, Model hash: fc2511737a
```

![](/home/cs/oss/hexo/themes/spfk/source/pics/2023-04-02_15-28.png)
