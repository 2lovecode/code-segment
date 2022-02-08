<?php

/**
 *
 * 快速排序：
 *	关注枢纽元的选取，简单的方式是取第一个，其次是随机选择，最优是使用三数中值法
 *
 * 1. 如果序列长度为1,直接返回序列
 * 2. 使用三数中值法获取中间元素[比较序列的开头,结尾和中间元素,取三个值中的中间值]
 * 3. 将小于中间元素的数放到左序列,将大于中间元素的数放到右序列
 * 4. 对左序列和右序列递归应用1,2,3步骤
 *
 */

class QuickSort
{
    private $originalData = [];
    private $resultData = [];


    public function __construct($original = [])
    {
        $this->originalData = $original;
    }

    public function sort()
	{
	    $this->resultData = $this->quick($this->originalData);
	    return $this->resultData;
	}

	protected function quick($originalData)
    {
        $lenght = count($originalData);

        if ($lenght <= 1) {
            return $originalData;
        }


        $pivot = $this->threeMiddleValue($originalData, 0, $lenght - 1);

        $leftData = [];
        $rightData = [];

        for($i = 0; $i < $lenght; $i++) {
            if ($originalData[$i] < $pivot) {
                $leftData[] = $originalData[$i];
            } else if ($originalData[$i] > $pivot){
                $rightData[] = $originalData[$i];
            }
        }

        $leftData = $this->quick($leftData);
        $rightData = $this->quick($rightData);

        return array_merge($leftData, [$pivot], $rightData);
    }

	public function threeMiddleValue($arr, $left, $right)
	{
		$result = null;

		$middle = floor(($left + $right)/2);

		if ($arr[$left] > $arr[$right]) {
			if ($arr[$left] < $arr[$middle]) {
				$result = $arr[$left];
			} else if ($arr[$right] > $arr[$middle]) {
				$result = $arr[$right];
			} else {
				$result = $arr[$middle];
			}
		} else {
			if ($arr[$right] < $arr[$middle]) {
				$result = $arr[$right];
			} else if ($arr[$left] > $arr[$middle]) {
				$result = $arr[$left];
			} else {
				$result = $arr[$middle];
			}
		}

		return $result;
	}
}

$testData = [7, 3, 10, 5, 1, 8];
$quickSort = new QuickSort($testData);
echo '<pre>';
var_dump($quickSort->sort());
