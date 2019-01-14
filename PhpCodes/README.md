#### 注 1)：关于示例
    1. 根据建议,在之后的代码中,示例代码所在文件和类的定义文件会分开,但它们会在同一目录下.
    2. 后缀为Example的文件名才是示例,请注意!
    3. 以MyStack.php和以MyStackExample.php为例,前者是类的定义文件,后者是前者类的使用示例.
    4. 之后使用新的组织形式的代码,在当前README文件中会有 [NEW] 标识
    5. 之前的代码,运行示例,直接执行该文件.现在需要执行后缀为Example的文件
       
#### 注 2):关于单元测试
    1. 在之后的代码中,我们会考虑加入单元测试,如有需要请阅读下面事项.
    2. 请在根目录,也就是PhpCodes目录的上一级目录执行composer install命令安装依赖库.
    3. 执行单元测试请在当前目录即PhpCodes目录下执行 php vendor/bin/phpunit命令
    4. 单元测试代码放到Tests文件夹中
    5. 同样,有单元测试的,我们会在当前的README文件中打上 [UNITTEST]标识
    
#### 目录

- [AttributesChangeLog](AttributesChangeLog) : 记录参数的一个类,该类实例化的对象可以持有一个参数池,所有出现在这个参数池中的参数都可以跟踪其值的变化.

- [BloomFilter](BloomFilter) : 布隆过滤器

- [Container](Container) : 依赖注入容器(DI)的实现(copy from laravel)

- [DataStructureAndAlgorithm](DataStructureAndAlgorithm) : 数据结构和算法

- [DesignPatterns](DesignPatterns) : 一些设计模式的示例

- [FileOperation](FileOperation) : php操作目录和文件的一些示例

- [FilterSensitiveWord](FilterSensitiveWord) : 敏感词过滤实现

- [HyperLogLog](HyperLogLog) : 模拟redis的HyperLogLog数据结构

- [InterestingQuestion](InterestingQuestion) : 一些有趣的需要使用数据结构和算法解决的问题[NEW][UNITTEST]

- [LaravelTest](LaravelTest) : 仿照Laravel框架中一些机制写的测试代码

- [PhpSyntaxTestCode](PhpSyntaxTestCode) : 一些php的语法的测试示例

- [SimpleContainer](SimpleContainer) : DI容器简单实现

- [SimpleDataBase](SimpleDataBase) : php实现的一个简单的key-value数据库

- [Tests](Tests) : 单元测试代码

- [TransformDataPieces](TransformDataPieces) : 将crontab的配置,例如： * * * * *,分解为散列的时间片段,实现定时功能

- [UsefulTools](UsefulTools) : 一些有趣的工具