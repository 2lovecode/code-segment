<?php
/**
 * 参考文献：
 * https://my.oschina.net/kiwivip/blog/133498
 * https://blog.csdn.net/jiaomeng/article/details/1495500
 * https://blog.csdn.net/hguisu/article/details/7866173
 * 文献中探讨了布隆过滤器的原理和应用场景,以及一些实际应用场景中的增强方案.
 *
 * 1.这里所写的布隆过滤,只是原理的简单示例,不能实用于实际场景,仅能够做学习参考.
 *
 * 2.我们使用int模拟一个bit, int的0对应bit 0, int的1对应bit 1.
 * 这是非常浪费空间的做法.
 * 所以说如果要应用于实际,需要考虑内存的问题,毕竟布隆过滤最大的好处就是减少内存使用量.
 *
 * 3.布隆过滤器需要多个不同的hash函数计算出多个值,把这些值对应的bitArray中的位置置为1.
 * 在此例中,我们借鉴上述文献中的做法,使用mt_srand()和mt_rand()两个函数配合的方式,模拟多个hash函数
 * 计算字符串的crc32值,把值作为随机函数的seed,取前n个随机数对应n个不同hash函数计算出的值.
 *
 * 4.同时,我们在这里是支持删除操作的.要想支持删除操作,有一种计数器的方式.也就是一个bit被命中就加一.
 * 但是一个bit只能有0和1两个值,所以需要把1个bit扩展为多个bit,使之能够计数.
 * 这样带来的问题是空间会成倍增加,经验的做法是扩展为4个bit,它能够满足大部分需求
 * 原理参考：https://my.oschina.net/kiwivip/blog/133498
 *
 * 5.因为我们是用int模拟的bit,所以在3中提到的扩展问题在我们这里不存在的,这一点需要注意些.
 *
 * 6.我们提供了两个测试,用的是同一组测试数据,测试二会出现一个错误情况.
 */


class BloomFilter
{
    private $dataAmount;

    private $bitArrayLen;

    private $hashFunctionAmount;

    private $hashValuePool = [];

    //这里使用int模拟一个bit, int的0对应bit 0, int的1对应bit 1.
    //为了支持删除操作,1bit 需要扩展为多个bit,从而能够计数
    private $bitArray = [];

    public function __construct($dataAmount, $bitArrayLen)
    {
        $this->dataAmount = $dataAmount;
        $this->bitArrayLen = $bitArrayLen;
        $this->calculateOptimumHashFunctionAmount();
        $this->initBitArray();
    }

    public function add($str)
    {
        $this->mockHashFunction($str);
        foreach ($this->hashValuePool as $value) {
            $this->bitArray[$value] = $this->bitArray[$value] + 1;
        }
    }

    public function find($str)
    {
        $existsFlag = true;

        $this->mockHashFunction($str);
        foreach ($this->hashValuePool as $value) {
            if ($this->bitArray[$value] <= 0) {
                $existsFlag = false;
            }
        }
        return $existsFlag;
    }

    public function delete($str)
    {
        $response = true;
        if ($this->find($str)) {
            foreach ($this->hashValuePool as $value) {
                $this->bitArray[$value] = $this->bitArray[$value] - 1;
            }
        } else {
            $response = false;
        }

        return $response;
    }

    private function calculateOptimumHashFunctionAmount()
    {
        $this->hashFunctionAmount = ceil(($this->bitArrayLen/$this->dataAmount) * log(2));
    }

    private function initBitArray()
    {
        $this->bitArray = array_fill(0, $this->bitArrayLen, 0);
    }


    private function getRandSeed($str)
    {
        return crc32($str);
    }

    private function mockHashFunction($str)
    {
        $this->hashValuePool = [];
        $seed = $this->getRandSeed($str);
        mt_srand($seed);
        for ($i = 0; $i < $this->hashFunctionAmount; $i++) {
            $this->hashValuePool[] = mt_rand(0, $this->bitArrayLen - 1);
        }
    }
}


class Test
{
    public function run($testData = [], $dataAmount, $bitArrayLen)
    {
        $bloomFilter = new BloomFilter($dataAmount, $bitArrayLen);
        foreach ($testData['data'] as $value) {
            $bloomFilter->add($value);
        }

        echo '<pre>';
        echo 'Original Data:<br>';
        foreach ($testData['data'] as $value) {
            echo $value.';    ';
        }

        echo '<hr>';
        echo 'Before Delete:<br>';
        foreach ($testData['exists'] as $value) {
            $res = $bloomFilter->find($value) ? 'true' : 'false';
            echo $value.' : '.$res.';    ';
        }

        echo '<hr>';
        echo 'Delete:<br>';
        foreach ($testData['delete'] as $value) {
            $res = $bloomFilter->delete($value) ? 'true' : 'false';
            echo $value.' : '.$res.';    ';
        }

        echo '<hr>';
        echo 'After Delete:<br>';
        foreach ($testData['exists'] as $value) {
            $res = $bloomFilter->find($value) ? 'true' : 'false';
            echo $value.' : '.$res.';    ';
        }
        echo '<hr>';
        echo '<hr>';
    }

}

$testData = [
    'data' => ['123', 'abc', 'aaa', 'ssssssssssss', '中国'],
    'exists' => ['aaa', '中国', 'sss', '123', '任命'],
    'delete' => ['aaa', '中国']
];

$test = new Test();
echo '测试一 :<br>';
$test->run($testData, 1000, 2000);


echo '测试二 :<br>';
//这个出现的错误率,我们在删除aaa后,通过find查找,发现仍然会存在
$test->run($testData, 5, 10);

/**
 * 结果展示：
 * 测试一 :
 *
 * Original Data:
 * 123;    abc;    aaa;    ssssssssssss;    中国;
 *
 * Before Delete:
 * aaa : true;    中国 : true;    sss : false;    123 : true;    任命 : false;
 *
 * Delete:
 * aaa : true;    中国 : true;
 *
 * After Delete:
 * aaa : false;    中国 : false;    sss : false;    123 : true;    任命 : false;
 *
 *
 *
 * 测试二 :
 *
 * Original Data:
 * 123;    abc;    aaa;    ssssssssssss;    中国;
 *
 * Before Delete:
 * aaa : true;    中国 : true;    sss : false;    123 : true;    任命 : true;
 *
 * Delete:
 * aaa : true;    中国 : true;
 *
 * After Delete:
 * aaa : true;    中国 : false;    sss : false;    123 : true;    任命 : false;
 * 
 */
