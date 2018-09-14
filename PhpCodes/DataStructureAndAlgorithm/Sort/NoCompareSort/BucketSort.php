<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 桶排序
 *
 * 1. 计算序列最小值min, 最大值max
 * 2. 根据min, max和指定的需要构造的桶的数量n,计算每个桶的区间：range = ceil(max - min + 1)
 * 3. 遍历序列,将序列中的值分布到各个桶中: 桶标号从0开始, (value - min) / range
 * 4. 每个桶独立排序
 * 5. 将结果输出
 *
 * 例如对于序列 5, 4, 10, 30, 20, 15, 36
 *
 * 1. min = 4, max = 36
 * 2. 设桶数量为4, range = 9
 * 3. 遍历后各个桶中的分布为
 *      0 [4, 13)  => 5, 4, 10
 *      1 [13, 22) => 20, 15
 *      2 [22, 31) => 30
 *      3 [31, 40) => 36
 * 4. 各个桶排序后
 *      0 [4, 13)  => 4, 5, 10
 *      1 [13, 22) => 15, 20
 *      2 [22, 31) => 30
 *      3 [31, 40) => 36
 * 5. 输出结果
 *  4, 5, 10, 15, 20, 30, 36
 */

class BucketSort
{
    private $originalData = [];
    private $bucketNum;
    private $min;
    private $max;
    private $range;
    private $bucketMap = [];
    private $result = [];

    public function __construct($original = [], $bucketNum = 4)
    {
        $this->originalData = $original;
        $this->bucketNum = $bucketNum;
        for ($i = 0; $i < $this->bucketNum; $i++) {
            $this->bucketMap[$i] = [];
        }
    }

    public function sort()
    {
        $this->calculateMinMax();
        $this->calculateRange();
        $this->disperseDataToBucket();
        $this->sortEveryBucket();
        $this->generateResult();
        return $this->result;
    }

    protected function calculateMinMax()
    {
        $max = null;
        $min = null;

        foreach ($this->originalData as $value) {
            if (!is_null($max)) {
                if ($value > $max) {
                    $max = $value;
                }
            } else {
                $max = $value;
            }

            if (!is_null($min)) {
                if ($value < $min) {
                    $min = $value;
                }
            } else {
                $min = $value;
            }
        }

        $this->min = $min;
        $this->max = $max;
    }

    protected function calculateRange()
    {
        $this->range = ceil(($this->max - $this->min + 1)/$this->bucketNum);
    }

    protected function disperseDataToBucket()
    {
        foreach ($this->originalData as $value) {
            $index = intval(floor(($value - $this->min) / $this->range));
            $this->bucketMap[$index][] = $value;
        }
    }

    protected function sortEveryBucket()
    {
        foreach ($this->bucketMap as &$eachBucket)
        {
            sort($eachBucket);
        }
    }

    protected function generateResult()
    {
        foreach ($this->bucketMap as $eachBucket)
        {
            foreach ($eachBucket as $value) {
                array_push($this->result, $value);
            }
        }
    }
}

$testData = [5, 4, 10, 30, 20, 15, 36];
$bucketSort = new BucketSort($testData);
echo '<pre>';
var_dump($bucketSort->sort());