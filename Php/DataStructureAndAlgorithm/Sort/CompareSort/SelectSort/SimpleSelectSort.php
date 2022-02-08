<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 简单选择排序
 * 1. 遍历剩余待排序序列,找出最值.
 * 2. 将最值和待排序序列的第一个元素交换.
 */

class SimpleSelectSort
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
        for ($i = 0; $i < $this->dataLen - 1; $i++) {
            $tmp = $this->resultData[$i];
            $tmpKey = $i;
            for ($j = $i; $j < $this->dataLen; $j++) {
                if ($tmp > $this->resultData[$j]) {
                    $tmp = $this->resultData[$j];
                    $tmpKey = $j;
                }
            }

            if ($tmpKey != $i) {
                $this->resultData[$tmpKey] = $this->resultData[$i];
                $this->resultData[$i] = $tmp;
            }
        }
        return $this->resultData;
    }
}

$testData = [12, 55, 99, 22, 33, 25, 11, 44, 78];

$simpleSelectSort = new SimpleSelectSort($testData);
echo '<pre>';
var_dump($simpleSelectSort->sort());