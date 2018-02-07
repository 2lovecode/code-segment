<?php

class MergeSortTest
{
	protected function mergeArray($arrayOne, $arrayTwo)
	{
		$oneLen = count($arrayOne);
		$twoLen = count($arrayTwo);

		$tmp = [];

		$i = 0;
		$j = 0;

		while (($i < $oneLen) && ($j < $twoLen)) {
			if ($arrayOne[$i] < $arrayTwo[$j]) {
				$tmp[] = $arrayOne[$i];
				$i = $i + 1;
			} else if ($arrayOne[$i] > $arrayTwo[$j]) {
				$tmp[] = $arrayTwo[$j];
				$j = $j + 1;
			} else {
				$tmp[] = $arrayOne[$i];
				$i = $i + 1;
				$j = $j + 1;
			}
		}

		while ($i < $oneLen) {
			$tmp[] = $arrayOne[$i];
			$i = $i + 1;
		}

		while ($j < $twoLen) {
			$tmp[] = $arrayTwo[$j];
			$j = $j + 1;
		}

		return $tmp;
	}

	public function mergeSort($array)
	{
		$len = count($array);

		if ($len <= 1) {
			return $array;
		}

		$mid = (int)floor($len/2);

		$leftArray = $this->mergeSort(array_slice($array, 0, $mid));
		$rightArray = $this->mergeSort(array_slice($array, $mid));
		
		return $this->mergeArray($leftArray, $rightArray);
	}
}


echo '<pre>';

$example = [1, 3, 2, 9, 7, 11, 8, 10];

$test = new MergeSortTest();
var_dump($test->mergeSort($example));

