# code-segment
聚集一些平时写的或搜集的一些有用的或有意思的代码片段.

#### 安装
- PHP安装
    - composer.json文件的require中添加 "2lovecode/code-segment" : "dev-master"
    - 执行composer update
    - Php文件夹中的部分类您可以在自己的项目中通过自动加载使用,其它语言片段文件仅供查看参考.
    
- 暂不支持其它语言包管理器的安装,您可以直接git clone git@github.com:2lovecode/code-segment.git 直接下载.

- Go语言(Go) **<font color=red>已迁移至 [graffito](https://github.com/2lovecode/graffito)</font>**

- C语言(C)  **<font color=red>已迁移至 [graffito-c](https://github.com/2lovecode/graffito-c)</font>**


#### 目录：
- [x] [Php](Php):
  - [x] [AttributesChangeLog](Php/AttributesChangeLog):记录参数的一个类,该类实例化的对象可以持有一个参数池,所有出现在这个参数池中的参数都可以跟踪其值的变化.
  
  - [x] [BloomFilter](Php/BloomFilter):布隆过滤器
  
  - [x] [Container](Php/Container):依赖注入容器(DI)的实现(copy from laravel)
  
  - [x] [DataStructureAndAlgorithm](Php/DataStructureAndAlgorithm):数据结构和算法
    - [x] [BPlusTree](Php/DataStructureAndAlgorithm/BPlusTree) : B+树
    
    - [x] [BTree](Php/DataStructureAndAlgorithm/BTree) : B树
    
    - [x] [Hash](Php/DataStructureAndAlgorithm/Hash) : Hash表实现
    
    - [x] [Heap](Php/DataStructureAndAlgorithm/Heap) : 堆实现
        - [x] [MaxHeap](Php/DataStructureAndAlgorithm/Heap/MaxHeap.php) : 最大堆
        - [x] [MinHeap](Php/DataStructureAndAlgorithm/Heap/MinHeap.php) : 最小堆
    
    - [x] [PageRank](Php/DataStructureAndAlgorithm/PageRank) : 网页排名-简单PageRank实现
    
    - [x] [RedBlackTree](Php/DataStructureAndAlgorithm/RedBlackTree) : 红黑树实现
        - [x] [RedBlackTree](Php/DataStructureAndAlgorithm/RedBlackTree/RedBlackTree.php) : 红黑树实现
        
    - [x] [SkipList](Php/DataStructureAndAlgorithm/SkipList) : 跳跃表实现
        - [x] [SkipList](Php/DataStructureAndAlgorithm/SkipList/SkipList.php) : 跳跃表实现
        
    - [x] [Sort](Php/DataStructureAndAlgorithm/Sort) : 排序算法
        - [x] [CompareSort](Php/DataStructureAndAlgorithm/Sort/CompareSort) : 比较类排序
            - [x] [InsertSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/InsertSort) : 插入类排序
                - [x] [InsertSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/InsertSort/InsertSort.php) : 插入排序
                - [x] [ShellSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/InsertSort/ShellSort.php) : 希尔排序
            - [x] [MergeSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/MergeSort) : 归并类排序
                - [x] [MergeSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/MergeSort/MergeSort.php) : 归并排序
            - [x] [SelectSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/SelectSort) : 选择类排序
                - [x] [HeapSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/SelectSort/HeapSort.php) : 堆排序
                - [x] [SimpleSelectSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/SelectSort/SimpleSelectSort.php) : 简单选择排序
            - [x] [SwapSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/SwapSort) : 交换类排序
                - [x] [BubbleSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/SwapSort/BubbleSort.php) : 冒泡排序
                - [x] [QuickSort](Php/DataStructureAndAlgorithm/Sort/CompareSort/SwapSort/QuickSort.php) : 快速排序     
        - [x] [NoCompareSort](Php/DataStructureAndAlgorithm/Sort/NoCompareSort) : 非比较类排序
            - [x] [BucketSort](Php/DataStructureAndAlgorithm/Sort/NoCompareSort/BucketSort.php) : 桶排序
            - [x] [CountSort](Php/DataStructureAndAlgorithm/Sort/NoCompareSort/CountSort.php) : 计数排序
            - [x] [RadixSort](Php/DataStructureAndAlgorithm/Sort/NoCompareSort/RadixSort.php) : 基数排序 
  
  - [x] [DesignPatterns](Php/DesignPatterns):一些设计模式的示例
    - [x] [Adapter](Php/DesignPatterns/Adapter) : 适配器模式
    - [x] [Command](Php/DesignPatterns/Command) : 命令模式
    - [x] [Composite](Php/DesignPatterns/Composite) : 组合模式
    - [x] [Decorator](Php/DesignPatterns/Decorator) : 装饰者模式
    - [x] [Facade](Php/DesignPatterns/Facade) : 门面模式
    - [x] [Factory](Php/DesignPatterns/Factory) : 工厂模式
    - [x] [Iterator](Php/DesignPatterns/Iterator) : 迭代器模式
    - [x] [Observer](Php/DesignPatterns/Observer) : 观察者模式
    - [x] [Pipeline](Php/DesignPatterns/Pipeline) : 管道模式
    - [x] [Proxy](Php/DesignPatterns/Proxy) : 代理模式
    - [x] [Singleton](Php/DesignPatterns/Singleton) : 单例模式
    - [x] [State](Php/DesignPatterns/State) : 状态模式
    - [x] [Strategy](Php/DesignPatterns/Strategy) : 策略模式
    - [x] [TemplateMethod](Php/DesignPatterns/TemplateMethod) : 模板方法模式
  
  - [x] [FileOperation](Php/FileOperation):php操作目录和文件的一些示例
    - [x] [DirTranverse](Php/FileOperation/DirTranverse) : 非递归方式实现目录数量统计
    - [x] [ExcelColIncrease](Php/FileOperation/ExcelColIncrease) : excel列标识自增方法
    - [x] [GenerateBigFile](Php/FileOperation/GenerateBigFile) : 大文件生成
  
  - [x] [FilterSensitiveWord](Php/FilterSensitiveWord):敏感词过滤实现
    - [x] [FilterSensitiveWord](Php/FilterSensitiveWord/FilterSensitiveWord.php) : 简单的基于DFA算法的敏感词过滤第一版 [博客地址](https://blog.csdn.net/aikiller/article/details/78797864)
    - [x] [FilterSensitiveWord_2](Php/FilterSensitiveWord/FilterSensitiveWord_2.php) : 简单的基于DFA算法的敏感词过滤第二版 [博客地址](https://blog.csdn.net/AIkiller/article/details/80287594)
  
  - [x] [HyperLogLog](Php/HyperLogLog) : 模拟redis的HyperLogLog数据结构
  
  - [ ] [InterestingQuestion](Php/InterestingQuestion) : 一些有趣的需要使用数据结构和算法解决的问题[NEW][UNITTEST]
    - [ ] [Stack](Php/InterestingQuestion/Stack) : 栈相关
        - [x] [StackWithGetMin](Php/InterestingQuestion/Stack/StackWithGetMin) : 可以以O(1)获取最小值的栈实现
  
  - [x] [LaravelTest](Php/LaravelTest) : 依据Laravel框架中一些机制的实现原理,写的一些实现demo
    - [x] [MiddleWare](/Php/LaravelTest/MiddleWare) : 依据MiddleWare的实现原理,实现的一个简单demo
  
  - [x] [PhpSyntaxTestCode](Php/PhpSyntaxTestCode):一些php的语法的测试示例
    - [x] [TestData](Php/PhpSyntaxTestCode/TestData) : 测试数据
    - [x] [ThrowableTest](Php/PhpSyntaxTestCode/ThrowableTest) : Throwable类测试
    - [x] [ArrayReduce](Php/PhpSyntaxTestCode/ArrayReduce.php) : array_reduce函数测试
    - [x] [CloneSyntax](Php/PhpSyntaxTestCode/CloneSyntax.php) : clone语法测试
    - [x] [FileOperation](Php/PhpSyntaxTestCode/FileOperation.php) : 文件操作测试
    - [x] [GetFileLastNumRow](Php/PhpSyntaxTestCode/GetFileLastNumRow.php) : 或取文件最后一行代码测试
  
  - [x] [SimpleContainer](Php/SimpleContainer):DI容器简单实现
  
  - [x] [SimpleDataBase](Php/SimpleDataBase):php实现的一个简单的key-value数据库
  
  - [x] [SimpleRandom](Php/SimpleRandom) : 简单的页面随机抽取实现
  
  - [ ] [Tests](Php/Tests) : 单元测试代码
  
  - [x] [TransformDataPieces](Php/TransformDataPieces):将crontab的配置,例如： * * * * *,分解为散列的时间片段,实现定时功能
  
  - [x] [UrlShortener](Php/UrlShortener) : url短链接生成策略
    - [x] [AutoIncreaseShortener](Php/UrlShortener/AutoIncreaseShortener.php) : 自增序列法
    - [x] [Md5Shortener](Php/UrlShortener/Md5Shortener.php) : 摘要法
    
  - [x] [UsefulTools](Php/UsefulTools):一些有趣的工具
- [x] [Awk](Awk) : awk语言
  - [x] [Calendar](Awk/Calendar) : 日历实现
  - [x] [InterActiveStrReplace](Awk/InterActiveStrReplace) : 实时接收输入并输出
  - [x] [PersonInfo](Awk/PersonInfo) : 简单数据库实现,以个人信息为模型
- [x] [C](C) : ~~c语言~~  **已迁移至** :triangular_flag_on_post:  [**graffito-c**](https://github.com/2lovecode/graffito-c)
  - [x] [Calculator](C/Calculator) : 计算器实现
  - [x] [DataStructureAndAlgorithm](C/DataStructureAndAlgorithm) : 数据结构和算法
    - [x] [dict_order](C/DataStructureAndAlgorithm/dict_order) : 字典序问题
    - [x] [queue](C/DataStructureAndAlgorithm/queue) : 队列实现
    - [x] [skip_list](C/DataStructureAndAlgorithm/skip_list) : 跳跃表实现【参考redis实现】
    - [x] [stack](C/DataStructureAndAlgorithm/stack) : 栈实现
  - [x] [GetLineOperation](C/GetLineOperation) : 读取标准输入
  - [x] [PatQuestionBank](C/PatQuestionBank) : PAT能力考试真题题库解答 https://www.patest.cn/practice
   - [ ] [AdvancedLevel](C/PatQuestionBank/AdvancedLevel) : 甲级真题
   - [ ] [BasicLevel](C/PatQuestionBank/BasicLevel) : 乙级真题
   - [ ] [TopLevel](C/PatQuestionBank/TopLevel) : 顶级真题
  - [x] [RedisSourceCodeDemo](C/RedisSourceCodeDemo) : 仿照redis(v5)源码写的一些帮助理解的demo
    - [x] [SDS](C/RedisSourceCodeDemo/Sds) : 简单动态字符串SDS的简单实现
  - [x] [SwapValue](C/SwapValue) : 值交换
- [x] [Go](Go) : ~~Go语言~~ **已迁移至** :triangular_flag_on_post:  [**graffito**](https://github.com/2lovecode/graffito)
  - [x] [Timer](Go/Timer) : 基于redis zset list 实现的定时器.
- [x] [JavaScript](JavaScript) : JavaScript
  - [x] [TencentMapApi](JavaScript/TencentMapApi) : 腾讯地图api示例
  - [x] [Tools](JavaScript/Tools) : 一些自己写的实用工具集合[序列化 反序列化 手机IMEI生成器]
- [x] [Shell](Shell) : Shell脚本
  - [x] [AutoConfigLnmpWebSite](Shell/AutoConfigLnmpWebSite) : 自动配置lnmp环境站点
- [ ] [ResourceCollection](ResourceCollection) : 一些资料资源的集合(我是图书馆,只管收藏,从不看...)


#### README 使用
 - 最外层展示所有层的目录树状结构,描述较简略
 - 各层目录下,只展示当前层包含的目录,描述较详细 
 
 **********
 **********
#### 收集的一些项目资源地址

###### Golang
   - [Go-Questions深入学习golang必备](https://github.com/golang-design/Go-Questions)
   - [awesome-go](https://github.com/avelino/awesome-go)
   - [go多版本管理器：g ](https://github.com/voidint/g)（刚入手，正在体验）
   - [golang入门指南](https://github.com/unknwon/the-way-to-go_ZH_CN)
   - [煎鱼的gin使用示例：go-gin-example](https://github.com/eddycjy/go-gin-example)
   - [go优秀项目集合：go-awesome](https://github.com/shockerli/go-awesome)
   - [go开源项目集合：golang-open-source-projects](https://github.com/hackstoic/golang-open-source-projects)
   - [uber依赖注入包：dig](https://github.com/uber-go/dig)
   - [微服务框架：kit](https://github.com/go-kit/kit)
   - [bilibili的go微服务框架工具：kratos](https://github.com/go-kratos/kratos)
   - [测试包：goconvey](https://github.com/smartystreets/goconvey)
   - [json编解码包：go-simplejson](https://github.com/bitly/go-simplejson)
   - [代码安全检测包：gosec](https://github.com/securego/gosec)
   - [uber依赖注入包：dig](https://github.com/uber-go/dig)
   - [依赖注入库：inject](https://github.com/codegangsta/inject)
   - [各算法实现：TheAlgorithms](https://github.com/TheAlgorithms/Go)
   - [go每日一库：go-daily-lib](https://github.com/darjun/go-daily-lib)
   - [内网穿透代理服务器：nps](https://github.com/ehang-io/nps)
   - [内网穿透代理服务器：clash](https://github.com/Dreamacro/clash)
   - [frp：内网穿透代理服务器](https://github.com/fatedier/frp)
   - [minio：开源的轻量级对象存储服务](https://github.com/minio/minio)
   - [minio中文文档](https://docs.min.io/cn/)
   - [filebrowser：浏览器上访问你的服务器资源 filebrowser](https://github.com/filebrowser/filebrowser)
   - [golang-design-pattern：golang设计模式](https://github.com/senghoo/golang-design-pattern)
   - [istio：微服务管理工具](https://github.com/istio/istio)
   - [golang 建站指导手册](https://github.com/astaxie/build-web-application-with-golang)
   - [sqlparser：解析sql的demo](https://github.com/marianogappa/sqlparser)
   - [gengine：规则引擎](https://github.com/bilibili/gengine)
   - [goreplay：流量复制工具](https://github.com/buger/goreplay)
   - [b-tree](https://github.com/google/btree)
   - [b+tree](https://github.com/timtadh/fs2)
   - [golang-awesome](https://github.com/xiaobaiTech/golangFamily)
   - [conc-Go优雅并发处理工具包](https://github.com/sourcegraph/conc)
###### Rust
   - [rustdesk：类似TeamVeiwer的远程桌面工具，提供免费中继服务器，也可自己搭建](https://github.com/rustdesk/rustdesk)
###### C
   - [一款消息队列产品：beanstalkd](https://github.com/beanstalkd/beanstalkd)
###### Rust
   - [lapce - 开源IDE](https://github.com/lapce/lapce)
###### Python
   - [路径规划算法：PathPlanning](https://github.com/zhm-real/PathPlanning)
   - [各语言的帮助文档快速查询：cheat.sh](https://github.com/chubin/cheat.sh)
   - [DailyCodingProblem](https://github.com/vineetjohn/daily-coding-problem)
   - [airflow 任务调度系统，优雅处理调度依赖问题](https://github.com/apache/airflow)
###### PHP
   - [yii2干货集：awesome-yii2](https://github.com/forecho/awesome-yii2)
   - [php面试：interview](https://github.com/wanglelecc/interview)
   - [docker开发环境yml文件：laradock](https://github.com/laradock/laradock)
###### Java
   - [mysql增量binlog订阅&消费组件：canal](https://github.com/alibaba/canal)
###### Javascript
   - [js实现各个算法：javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)
   - [vue+el实现的后台管理项目：vue2-manage](https://github.com/bailicangdu/vue2-manage)
   - [vue+el实现的后台管理项目：vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
   - [pc客户端开发框架：electron](https://github.com/electron/electron)
   - [electron开发的优秀项目：awesome-electron](https://github.com/sindresorhus/awesome-electron)
   - [electron集成vue：electron-vue](https://github.com/SimulatedGREG/electron-vue)
   - [算法可视化：algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer)
   - [图片裁剪js库](https://github.com/fengyuanchen/cropperjs)
   - [markdown编辑器：marktext](https://github.com/marktext/marktext)
   - [游戏引擎:Babylon](https://github.com/BabylonJS/Babylon.js)
   - [JSON编辑器](https://github.com/josdejong/jsoneditor)
   - [服务监控工具](https://github.com/louislam/uptime-kuma)
   - [umami: 类似google analytics的数据采集及分析工具，实现追踪页面来源，线索归因等](https://github.com/mikecao/umami)
   - [excalidraw:手写风格画图工具](https://github.com/excalidraw/excalidraw)
   
###### 编辑器or方便的工具和插件
   - [让你只用键盘就能操作浏览器的神奇插件：vimium](https://github.com/philc/vimium)
   - [一款管理本地hosts文件的客户端工具：SwitchHosts](https://github.com/oldj/SwitchHosts)
   - [一键配置vim编辑器：spf13-vim](https://github.com/spf13/spf13-vim)
   - [一款强大免费且开源的画流程图的软件：drawio](https://github.com/jgraph/drawio-desktop)
   - [api请求客户端代理工具：hoppscotch](https://github.com/hoppscotch/hoppscotch)
   - [美化你的shell客户端：ohmyzsh](https://github.com/ohmyzsh/ohmyzsh)
   - [docker知识备忘：docker-cheat-sheet](https://github.com/wsargent/docker-cheat-sheet)
   - [终端docker管理软件：lazydocker](https://github.com/jesseduffield/lazydocker)
###### 图像&视频处理
   - [实时视频插帧算法：arXiv2020-RIFE](https://github.com/hzwer/arXiv2020-RIFE)
   - [计算机图形入门:graphics-workshop](https://github.com/ekzhang/graphics-workshop)
   
###### 机器学习&人工智能&大数据
   - [机器学习入门学习](https://github.com/microsoft/ML-For-Beginners)
   - [ai学习指南：AiLearning](https://github.com/apachecn/AiLearning)
   - [机器学习框架：tensorflow](https://github.com/tensorflow/tensorflow)
   - [tensorflow学习教程：TensorFlow-Course](https://github.com/instillai/TensorFlow-Course)
   - [30天学会tensorflow：eat_tensorflow2_in_30_days](https://github.com/lyhue1991/eat_tensorflow2_in_30_days)
   - [pytorch项目集合：Awesome-pytorch-list](https://github.com/bharathgs/Awesome-pytorch-list)
   - [自然语言处理方面的最新进展：NLP-progress](https://github.com/sebastianruder/NLP-progress)
   - [行人识别](https://github.com/michuanhaohao/ReID_tutorial_slides)

###### 操作系统
   - [简单的xv6操作系统：xv6-public](https://github.com/mit-pdos/xv6-public)
   - [xv6中文文档：xv6-chinese](https://github.com/ranxian/xv6-chinese)
   - [xv6中文文档：xv6-book-chinese](https://github.com/deyuhua/xv6-book-chinese)
   - [Rust实现os](https://github.com/rcore-os/rCore)
###### 学习教程
   - [计算机速成课：Crash-Course-Computer-Science-Chinese](https://github.com/1c7/Crash-Course-Computer-Science-Chinese)
   - [web开发者路线图：developer-roadmap](https://github.com/kamranahmedse/developer-roadmap)
   - [面试与算法心得：The-Art-Of-Programming-By-July](https://github.com/julycoding/The-Art-Of-Programming-By-July)
   - [CS面试路线图：CS-Interview-Knowledge-Map](https://github.com/InterviewMap/CS-Interview-Knowledge-Map)
   - [CS面试知识：coding-interview-university](https://github.com/jwasham/coding-interview-university)
   - [ai学习教程：ai-edu](https://github.com/microsoft/ai-edu)
   - [各大学课程资源：A-to-Z-Resources-for-Students](https://github.com/dipakkr/A-to-Z-Resources-for-Students)
   - [计算机科学课程：computer-science](https://github.com/ossu/computer-science)
   - [优秀的中文项目：GitHub-Chinese-Top-Charts](https://github.com/kon9chunkit/GitHub-Chinese-Top-Charts)
   - [编程类书籍：free-programming-books-zh_CN](https://github.com/justjavac/free-programming-books-zh_CN)
   - [面试大全](https://github.com/0voice/interview_internal_reference)
   - [算法](https://github.com/labuladong/fucking-algorithm)

###### 树莓派
   - [树莓派论坛](https://shumeipai.nxez.com/)
   - [控制各种硬件的Python库](https://github.com/adafruit)
   - [点亮LCD](https://xingxiang.me/blog/843) [LCD库](https://github.com/lifanxi/rpimenu)
   - [另一个LCD库，可以适配点亮LCD](https://github.com/adafruit/Adafruit_Python_CharLCD)
   
###### 其他
   - [awesome-graphql](https://github.com/chentsulin/awesome-graphql)
   - [IoT入门学习](https://github.com/microsoft/IoT-For-Beginners)
   - [硬件](https://github.com/flipperdevices/flipperzero-firmware)
   - [从零创建游戏引擎](https://github.com/ThisisGame/cpp-game-engine-book)