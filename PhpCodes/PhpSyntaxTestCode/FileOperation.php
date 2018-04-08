<?php
/**
基于下面的问题写的代码：

	有两个文本文件 A.txt B.txt
	A.txt 3000万行，userid唯一，userid和username以空格分隔，如下所示：
	userid	username
	1		yi
	2		er
	3		san
	...		...
	B.txt 3000万行，userid唯一，userid和realname以空格分隔，如下所示：
	userid	realname
	1		一
	2		二
	3		三
	...		...
	请写一段代码，将B.txt中userid对应的username在A.txt里找出来，填充到B.txt的第三列，并给出时间复杂度。


我们默认两个文件的行数据是一一对应的，即A的第n行数据对应B的第n行数据，这样我们的程序的时间复杂度是O(n)。
*/
header("content-type:text/html;charset=utf-8");

function decodeLine(string $lineData, string $delimiter = null)
{
	if (is_null($delimiter)) {
		$delimiter = ' ';
	}
	return explode($delimiter, $lineData);
}

function encodeLine(array $dataList, string $delimiter = null)
{
	if (is_null($delimiter)) {
		$delimiter = ' ';
	}
	return implode($delimiter, $dataList);
}


$testA = fopen('./TestData/FileOperation/testA.txt', 'r');

$testB = fopen('./TestData/FileOperation/testB.txt', 'r+');

$tmpFile = tmpfile();
//
while (($bBuffer = fgets($testB)) != false) {
	$bList = decodeLine(trim($bBuffer, "\n\r"));
	$tmpList = $bList;
	if (($aBuffer = fgets($testA)) != false) {
		$aList = decodeLine(trim($aBuffer, "\n\r"));
		if ($aList[0] == $bList[0]) {
			$strEncoding = mb_detect_encoding($aList[1], ['ASCII', 'UTF-8', 'GB2312']);
			$resStr = mb_convert_encoding($aList[1], 'UTF-8', $strEncoding);
			array_push($tmpList, $resStr."\n");
		}
	}
	fwrite($tmpFile, encodeLine($tmpList));
}

rewind($tmpFile);
rewind($testB);

while (!feof($tmpFile)) {
  	$tmpBuffer = fread($tmpFile, 1024);
	fwrite($testB, $tmpBuffer);
}


fclose($tmpFile);
fclose($testA);
fclose($testB);