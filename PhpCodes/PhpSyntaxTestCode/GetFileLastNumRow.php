<?php
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
