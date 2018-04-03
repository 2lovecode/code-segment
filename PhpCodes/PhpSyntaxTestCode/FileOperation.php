<?php
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

while (($bBuffer = fgets($testB)) != false) {
	$bList = decodeLine(trim($bBuffer, "\n\r"));
	$tmpList = $bList;
	while(($aBuffer = fgets($testA)) != false) {
		$aList = decodeLine(trim($aBuffer, "\n\r"));
		if ($aList[0] == $bList[0]) {
			$strEncoding = mb_detect_encoding($aList[1], ['ASCII', 'UTF-8', 'GB2312']);
			$resStr = mb_convert_encoding($aList[1], 'UTF-8', $strEncoding);
			array_push($tmpList, $resStr."\n");
			break;
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