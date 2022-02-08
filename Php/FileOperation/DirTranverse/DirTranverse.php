<?php
/*
*
* 非递归方式实现目录数量统计
*
*
*
*
*/
$dir = '/home';

function sumDir($dir)
{
	$queue = [$dir];
	$sum = 0;
	while ($current = each($queue)) {
		// echo 'aaa---';
		$currentDir = $current['value'];
		// var_dump($currentDir);
		if (is_dir($currentDir)) {
			// echo 'bb';
			$handle = opendir($currentDir);
			while ($file = readdir($handle)) {
				// echo $file.'<br>';
				if ($file == '.' || $file == '..') {
					continue;
				}

				if (is_dir($currentDir.'/'.$file)) {
					$sum++;
					// echo $sum;
					$queue[] = $currentDir.'/'.$file;
				}
			}
			closedir($handle);
		}
	}

	return $sum;
}

var_dump(sumDir($dir));