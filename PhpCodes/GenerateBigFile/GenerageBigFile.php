<?php
class MyFileObject extends SplFileObject
{

}



$fileName = './test.csv';
$fileMode = 'a';

$str = "";
for ($a = 0; $a < 50; $a++) {
	$str .= "abc, ccc, ddd,";
}
$str = trim($str, ',');
$str .= "\r\n";
// var_dump($str);exit;
echo date("Y-m-d H:i:s", time())."\n";
for ($i = 0; $i < 100; $i++) {
	
	$example = new MyFileObject($fileName, $fileMode);


	
	for ($j = 0; $j < 2500; $j++) {
		$example->fwrite($str);
	}
	$example->fflush();
	
}

echo date("Y-m-d H:i:s", time())."\n";