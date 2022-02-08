<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 计数排序
 *
 *
 * 1. 获取序列中的最小值min和最大值max O(n)
 * 2. 统计min - max之间所有值在序列中的出现次数 O(n)
 * 3. 顺序输出min - max的所有值,次数为0不输出,其余次数为多少就输出多少 O(k) k为数据范围
 *
 * 例如序列为: 2, 4, 6, 9, 4, 8
 *
 * 1. min = 2, max = 9, n为6,k为8
 * 2. 统计出现次数为
 *      [2 => 1, 3 => 0, 4 => 2, 5 => 0, 6 => 1, 7 => 0, 8 => 1, 9 => 1]
 * 3. 输出结果为
 *     2, 4, 4, 6, 8, 9
 *
 * 很明显,计数排序的复杂度为O(n) + O(k),也就是和数据量和数据范围有关.
 * 若n和k相近,则可认为是O(n)
 * 同时,因为要统计出现次数,如果数据范围过大而数据又很稀疏,造成的空间浪费比较大
 */

class CountSort
{
    private $originalData = [];
    private $rangeMap = [];
    private $resultData = [];

    public function __construct($original = [])
    {
        $this->originalData = $original;
    }

    public function sort()
    {
        list($min, $max) = $this->calculateDataRange();
        $this->statisticNumberOfOccurrence($min, $max);
        $this->resultData = $this->generateResult();
        return $this->resultData;
    }

    protected function calculateDataRange()
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

        return [$min, $max];
    }

    protected function statisticNumberOfOccurrence($min, $max)
    {
        for ($i = $min; $i <= $max; $i++) {
            $this->rangeMap[$i] = 0;
        }

        foreach ($this->originalData as $value) {
            $this->rangeMap[$value]++;
        }
    }

    protected function generateResult()
    {
        $result = [];

        foreach ($this->rangeMap as $key => $value) {
            if ($value != 0) {
                for ($i = 0; $i < $value; $i++) {
                    array_push($result, $key);
                }
            }
        }
        return $result;
    }
}

$testData = [2, 3, 4, 3, 10, 30, 20, 15, 10, 12, 33];

$countSort = new CountSort($testData);
echo '<pre>';
var_dump($countSort->sort());