<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 冒泡排序
 *
 * 1. 输入序列长度为n
 * 2. 进行n - 1次处理，第一次将最大值移动到序列末尾，第二次将次大值移动到序列倒数第2位置，依次类推
 * 3. 最终得到一个升序排列的序列
 *
 *
 */

class BubbleSort
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
            for ($j = 0; $j < $this->dataLen - $i -1; $j++) {
                if ($this->resultData[$j+1] < $this->resultData[$j]) {
                    $tmp = $this->resultData[$j+1];
                    $this->resultData[$j+1] = $this->resultData[$j];
                    $this->resultData[$j] = $tmp;
                }
            }
        }
        return $this->resultData;
    }
}

$testData = [23, 45, 8, 11, 10, 31, 55, 96, 30, 22];

$bubbleSort = new BubbleSort($testData);
echo '<pre>';
var_dump($bubbleSort->sort());