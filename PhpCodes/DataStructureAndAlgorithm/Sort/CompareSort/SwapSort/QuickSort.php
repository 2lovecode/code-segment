<?php

/*
*
*
*	关注枢纽元的选取，简单的方式是取第一个，其次是随机选择，最优是使用三数中值法
*
*
*
*
*
*
*/

class Test
{

	public function quickSort($originalData)
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

		$leftData = $this->quickSort($leftData);
		$rightData = $this->quickSort($rightData);

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

$test = new Test();
$abc = [7, 3, 10, 5, 1, 8];
echo '<pre>';
var_dump($test->quickSort($abc));
