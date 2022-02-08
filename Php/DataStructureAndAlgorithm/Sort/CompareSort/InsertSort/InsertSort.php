<?php

/**
 * Class InsertSort
 *
 * 插入排序
 *
 * 遍历序列,将当前值插入到之前排序好的序列的合适位置.
 *
 */
class InsertSort
{
    private $originalData = [];
    private $resultData = [];
    private $dataLen;

    public function __construct($original = [])
    {
        $this->originalData = $original;
        $this->resultData = $original;
        $this->dataLen = count($original);
    }

    public function sort()
    {
        for ($i = 0; $i < $this->dataLen; $i++) {
            for ($j = $i; $j > 0; $j--) {
                if ($this->resultData[$j-1] > $this->resultData[$j]) {
                    $tmp = $this->resultData[$j-1];
                    $this->resultData[$j-1] = $this->resultData[$j];
                    $this->resultData[$j] = $tmp;
                } else {
                    break;
                }
            }
        }
        return $this->resultData;
    }
}

$testData = [155, 19, 88, 12, 40, 29, 1, 23];

$insertSort = new InsertSort($testData);
echo '<pre>';
var_dump($insertSort->sort());