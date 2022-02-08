<?php
/**
基于以下问题，写此代码：
	用php写一个函数，获取一个文本文件最后$n行内容，要求尽可能效率更高，并可以跨平台使用

我理解的可以跨平台使用，是说的文件在windows平台和linux平台的行结束符不一致问题，在代码中我们没有体现这种不同。
全部是在linux系统下的代码。
*/
header("content-type:text/html;charset=utf-8");

class GetFileLastNumRow
{
	private $filePath;

	private $fileMode = 'r';

	private $rowNum = 3;

	public function __construct(array $config)
	{
		foreach ($config as $key => $value) {
			$this->$key = $value;
		}
	}

	public function run()
	{
		try {
			$handle = fopen($this->filePath, $this->fileMode);
			fseek($handle, -1, SEEK_END);
			$contents = "";
			$rowCount = 0;
			do {
				if (($str = fgetc($handle)) == "\n") {
					$rowCount++;
				}
				$contents = $str.$contents;
                if (ftell($handle) == 1) {
                    break;
                }
				fseek($handle, -2, SEEK_CUR);
			} while ($rowCount < $this->rowNum);
			var_export(trim($contents, "\n"));
			fclose($handle);
		} catch(\Exception $e) {
			var_export($e->getMessage());
		}
	}
}

class Test
{
	public function run()
	{
		$filePath = './TestData/GetFileLastNumRow/test.data';

		$getFileLastNumRow = new GetFileLastNumRow(compact('filePath'));
		$getFileLastNumRow->run();
	}
}

$test = new Test();
$test->run();
