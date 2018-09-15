<?php

/**
 * Class RadixSort
 *
 * 基数排序法(最低位优先)
 *
 * 1. 计算序列中所有数的最大位数
 * 2. 有0-9,共10个桶.使用序列中各个数的个位数作为标识，将数字依次分散到对应的桶中
 * 3. 桶之间按从0-9顺序，桶内部按由先到后的顺序，遍历取出所有数，生成新序列
 * 4. 增加位数，重复应用2，3步骤，直至到达最大位数，此时3步骤生成的序列即为排序序列
 *
 * 例如序列：22 11 3 23 45 12
 * 1.最大位数是2
 * 2.先根据个位数，将各个数分散到桶中
 *      0 =>
 *      1 => 11
 *      2 => 22, 12
 *      3 => 3, 23
 *      4 =>
 *      5 => 45
 *      6 =>
 *      7 =>
 *      8 =>
 *      9 =>
 * 3.新序列为： 11, 22, 12, 3, 23, 45
 *
 * 4.再根据十位数
 * 应用2步骤
 *      0 => 3
 *      1 => 11, 12
 *      2 => 22, 23
 *      3 =>
 *      4 => 45
 *      5 =>
 *      6 =>
 *      7 =>
 *      8 =>
 *      9 =>
 * 得到新序列：3, 11, 12, 22, 23, 45
 * 因为已到达最大位数，所以新序列即为排序序列
 */
class RadixSort
{
    private $originalData = [];
    private $bucketMap = [];
    private $bucketLen = 10;
    private $maxLen;

    public $resultData = [];

    public function __construct(array $originalData = [])
    {
        $this->originalData = $originalData;
        $this->resultData = $originalData;
    }

    public function sort()
    {
        $this->calculateMaxDigits();

        for($times = 0; $times < $this->maxLen; $times++) {
            $this->initBucketMap();
            $this->disperseToBucketMap($times);
            $this->readDataFromBucketMap();
        }

        return $this->resultData;
    }

    protected function calculateMaxDigits()
    {
        $maxLen = 0;
        foreach ($this->originalData as $key => $value) {
            $now = strlen($value);
            if ($now > $maxLen) {
                $maxLen = $now;
            }
        }

        $this->maxLen = $maxLen;
    }

    protected function disperseToBucketMap($whichDigit = 1)
    {
        $t = pow(10, $whichDigit);

        foreach ($this->resultData as $value) {
            $tmp = $value / $t;
            $flag = $tmp % 10;
            $this->bucketMap[$flag][] = $value;
        }
    }

    protected function initBucketMap()
    {
        for ($i = 0; $i < $this->bucketLen; $i++) {
            $this->bucketMap[$i] = [];
        }
    }

    protected function readDataFromBucketMap()
    {
        $this->resultData = [];

        for ($i = 0; $i < $this->bucketLen; $i++) {
            foreach ($this->bucketMap[$i] as $v) {
                array_push($this->resultData, $v);
            }
        }
    }
}

$example = new RadixSort([20, 67, 123, 111, 2, 34, 1, 78, 0, 33, 11, 15, 83]);
echo '<pre>';
var_dump($example->sort());