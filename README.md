# code-segment
聚集一些平时写的或搜集的一些有用的或有意思的代码片段.

#### 目录：
- [x] [AwkCodes](AwkCodes) : awk语言
  - [x] [Calendar](AwkCodes/Calendar) : 日历实现
  - [x] [InterActiveStrReplace](AwkCodes/InterActiveStrReplace) : 实时接收输入并输出
  - [x] [PersonInfo](AwkCodes/PersonInfo) : 简单数据库实现,以个人信息为模型
- [x] [CCodes](CCodes) : c语言
  - [x] [GetLineOperation](CCodes/GetLineOperation) : 读取标准输入
  - [x] [PatQuestionBank](CCodes/PatQuestionBank) : PAT能力考试真题题库解答 https://www.patest.cn/practice
  - [x] [SwapValue](CCodes/SwapValue) : 值交换
- [x] [GoCodes](GoCodes) : Go语言
  - [x] [Timer](GoCodes/Timer) : 基于redis zset list 实现的定时器.
- [x] [JavaScriptCodes](JavaScriptCodes) : JavaScript
  - [x] [TencentMapApi](JavaScriptCodes/TencentMapApi) : 腾讯地图api示例
- [x] [PhpCodes](PhpCodes):
  - [x] [AttributesChangeLog](PhpCodes/AttributesChangeLog):记录参数的一个类,该类实例化的对象可以持有一个参数池,所有出现在这个参数池中的参数都可以跟踪其值的变化.
  
  - [x] [BloomFilter](PhpCodes/BloomFilter):布隆过滤器
  
  - [x] [Container](PhpCodes/Container):依赖注入容器(DI)的实现(copy from laravel)
  
  - [x] [DataStructureAndAlgorithm](PhpCodes/DataStructureAndAlgorithm):数据结构和算法
    - [x] [BTree](PhpCodes/DataStructureAndAlgorithm/BTree) : B树
    
    - [ ] [BTreePlus](PhpCodes/DataStructureAndAlgorithm/BTreePlus) : B+树
    
    - [x] [Hash](PhpCodes/DataStructureAndAlgorithm/Hash) : Hash表实现
  
    - [x] [PageRank](PhpCodes/DataStructureAndAlgorithm/PageRank) : 网页排名-简单PageRank实现
  
    - [x] [Sort](PhpCodes/DataStructureAndAlgorithm/Sort) : 排序算法
        - [x] [HeapSort](PhpCodes/DataStructureAndAlgorithm/Sort/HeapSort.php) : 堆排序
        - [x] [InsertSort](PhpCodes/DataStructureAndAlgorithm/Sort/InsertSort.php) : 插入排序
        - [x] [MergeSort](PhpCodes/DataStructureAndAlgorithm/Sort/MergeSort.php) : 归并排序
        - [x] [QuickSort](PhpCodes/DataStructureAndAlgorithm/Sort/QuickSort.php) : 快速排序
        - [x] [RadixSort](PhpCodes/DataStructureAndAlgorithm/Sort/RadixSort.php) : 基数排序 
  
  - [x] [DesignPatterns](PhpCodes/DesignPatterns):一些设计模式的示例
    - [x] [Adapter](PhpCodes/DesignPatterns/Adapter) : 适配器模式
    - [x] [Command](PhpCodes/DesignPatterns/Command) : 命令模式
    - [x] [Composite](PhpCodes/DesignPatterns/Composite) : 组合模式
    - [x] [Decorator](PhpCodes/DesignPatterns/Decorator) : 装饰者模式
    - [x] [Facade](PhpCodes/DesignPatterns/Facade) : 门面模式
    - [x] [Factory](PhpCodes/DesignPatterns/Factory) : 工厂模式
    - [x] [Iterator](PhpCodes/DesignPatterns/Iterator) : 迭代器模式
    - [x] [Observer](PhpCodes/DesignPatterns/Observer) : 观察者模式
    - [x] [Pipeline](PhpCodes/DesignPatterns/Pipeline) : 管道模式
    - [x] [Proxy](PhpCodes/DesignPatterns/Proxy) : 代理模式
    - [x] [Singleton](PhpCodes/DesignPatterns/Singleton) : 单例模式
    - [x] [State](PhpCodes/DesignPatterns/State) : 状态模式
    - [x] [Strategy](PhpCodes/DesignPatterns/Strategy) : 策略模式
    - [x] [TemplateMethod](PhpCodes/DesignPatterns/TemplateMethod) : 模板方法模式
  
  - [x] [FileOperation](PhpCodes/FileOperation):php操作目录和文件的一些示例
    - [x] [DirTranverse](PhpCodes/FileOperation/DirTranverse) : 非递归方式实现目录数量统计
    - [x] [ExcelColIncrease](PhpCodes/FileOperation/ExcelColIncrease) : excel列标识自增方法
    - [x] [GenerateBigFile](PhpCodes/FileOperation/GenerateBigFile) : 大文件生成
  
  - [x] [FilterSensitiveWord](PhpCodes/FilterSensitiveWord):敏感词过滤实现
    - [x] [FilterSensitiveWord](PhpCodes/FilterSensitiveWord/FilterSensitiveWord.php) : 简单的基于DFA算法的敏感词过滤第一版 [博客地址](https://blog.csdn.net/aikiller/article/details/78797864)
    - [x] [FilterSensitiveWord_2](PhpCodes/FilterSensitiveWord/FilterSensitiveWord_2.php) : 简单的基于DFA算法的敏感词过滤第二版 [博客地址](https://blog.csdn.net/AIkiller/article/details/80287594)
  
  - [x] [HyperLogLog](PhpCodes/HyperLogLog) : 模拟redis的HyperLogLog数据结构
  
  - [x] [LaravelTest](PhpCodes/LaravelTest) : 依据Laravel框架中一些机制的实现原理,写的一些实现demo
    - [x] [MiddleWare](/PhpCodes/LaravelTest/MiddleWare) : 依据MiddleWare的实现原理,实现的一个简单demo
  
  - [x] [PhpSyntaxTestCode](PhpCodes/PhpSyntaxTestCode):一些php的语法的测试示例
    - [x] [TestData](PhpCodes/PhpSyntaxTestCode/TestData) : 测试数据
    - [x] [ThrowableTest](PhpCodes/PhpSyntaxTestCode/ThrowableTest) : Throwable类测试
    - [x] [ArrayReduce](PhpCodes/PhpSyntaxTestCode/ArrayReduce.php) : array_reduce函数测试
    - [x] [CloneSyntax](PhpCodes/PhpSyntaxTestCode/CloneSyntax.php) : clone语法测试
    - [x] [FileOperation](PhpCodes/PhpSyntaxTestCode/FileOperation.php) : 文件操作测试
    - [x] [GetFileLastNumRow](PhpCodes/PhpSyntaxTestCode/GetFileLastNumRow.php) : 或取文件最后一行代码测试
  
  - [x] [SimpleContainer](PhpCodes/SimpleContainer):DI容器简单实现
  
  - [x] [SimpleDataBase](PhpCodes/SimpleDataBase):php实现的一个简单的key-value数据库
  
  - [x] [TransformDataPieces](PhpCodes/TransformDataPieces):将crontab的配置,例如： * * * * *,分解为散列的时间片段,实现定时功能
  
  - [x] [UsefulTools](PhpCodes/UsefulTools):一些有趣的工具
- [ ] [PythonCodes](PythonCodes) : Python
- [x] [ShellCodes](ShellCodes) : Shell脚本
  - [x] [AutoConfigLnmpWebSite](ShellCodes/AutoConfigLnmpWebSite) : 自动配置lnmp环境站点
  
#### README 使用
 - 最外层展示所有层的目录树状结构,描述较简略
 - 各层目录下,只展示当前层包含的目录,描述较详细

