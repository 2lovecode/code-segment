<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 希尔排序
 *
 * 1. 计算初始增量,一般开始的增量是序列长度/2
 * 2. 按增量分组
 * 3. 分组内排序
 * 4. 增量减小,增量每次减小到之前增量的1/2,重复1.2步骤,直至增量为一
 *
 *
 * 例如序列: 10, 3, 6, 9, 4
 * 1. 序列长度是5,所以初始增量是5/2 = 2
 * 2. 按增量为2分组
 *  1 => 10, 6, 4
 *  2 => 3, 9
 * 3. 分组内排序
 *  1 => 4, 6, 10
 *  2 => 3, 9
 *  序列变为： 4, 3, 6, 9, 10
 *
 * 4.增量减小到 2/2 = 1
 *  按增量为1分组：
 *  1 => 4, 3, 6, 9, 10
 *  分组内排序：
 *  1 => 3, 4, 6, 9, 10
 *  因增量已为1,所以得到排序序列: 3, 4, 6, 9, 10
 *
 *
 */

class ShellSort
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
        $step = $this->dataLen / 2;
        while ($step >= 1) {
            for ($i = 0; $i < $step; $i++) {
                for ($j = $i; $j < $this->dataLen; $j += $step) {
                    for ($z = $j; $z >= $step; $z -= $step) {
                        if ($this->resultData[$z] < $this->resultData[$z - $step]) {
                            $tmp = $this->resultData[$z - $step];
                            $this->resultData[$z - $step] = $this->resultData[$z];
                            $this->resultData[$z] = $tmp;
                        } else {
                            break;
                        }
                    }
                }
            }
            $step /= 2;
        }

        return $this->resultData;
    }
}

$testData = [111, 34, 10, 22, 99, 89, 123, 44, 79];

$shellSort = new ShellSort($testData);
echo '<pre>';
var_dump($shellSort->sort());