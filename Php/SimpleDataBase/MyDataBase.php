<?php

/*
*
*	索引文件使用pack和unpack函数，将索引文件数据转为二进制和从二进制转到具体值
*
*	在当前文件夹下创建data和index文件夹，赋予它可读写权限，简单点直接赋予777权限。
*
*	$db = new MyDataBase();
*
*	$dbHandler = $db->connect('dbTest'); //数据库连接
*
*	$dbHandler->insert('key1', '1111111'); //写入数据，仅支持key-value形式
*
*	$dbHandler->find('key1'); //数据查找
*
*	$dbHandler->delete('key1');  //删除数据
*
*	$db->close();  //关闭数据连接
*
*/
define('DB_INSERT_SUCCESS', 'SUCCESS');
define('DB_INSERT_FAILED', 'FAILED');
define('DB_DELETE_SUCCESS', 'SUCCESS');
define('DB_DELETET_FAILED', 'FAILED');
define('DB_EXISTS_KEY', 'KEYEXISTS');

define('DB_BUCKET_SIZE', 262144);	//这里定义的是Hash表中链表的长度
define('DB_KEY_SIZE', 128);	//存储key值的大小
define('DB_INDEX_SIZE', DB_KEY_SIZE + 12); //定义了一个索引节点的长度，一个索引节点包括: 4字节的指向下一索引节点值 + 128字节的Key值 + 4字节的数据在数据文件的偏移值 + 4字节的数据长度值 

include './DataBaseObject.php';

class MyDataBase
{
	private $dataHandler;
	private $indexHandler;
	private $closeFlag = false;

	public function connect($databaseName)
	{
		try {
			
			$indexFile = './index/'.$databaseName.'.inx';
			$dataFile = './data/'.$databaseName.'.dat';

			$needInit = false;

			if (!file_exists($indexFile)) {
				$openModel = 'w+b';
				$needInit = true;
			} else {
				$openModel = 'r+b';
			}

			$this->indexHandler = fopen($indexFile, $openModel);

			//初始化索引文件，用0初始化。
			if ($needInit) {
				$initValue = pack('L', 0x00000000);
				for ($i = 0; $i < DB_BUCKET_SIZE; $i++) {
					fwrite($this->indexHandler, $initValue, 4);
				}
			}

			$this->dataHandler = fopen($dataFile, $openModel);
			
			$dataBase = new DataBaseObject($this->dataHandler, $this->indexHandler);

		} catch (Exception $e) {
			return NULL;
		}
		return $dataBase;
	}

	public function close()
	{
		try {
			if (!$this->closeFlag) {
				fclose($this->dataHandler);
				fclose($this->indexHandler);
				$this->closeFlag = true;
			}
		} catch (Exception $e) {
			return false;
		}
		return true;
	}
}

//下面是使用示例
$db = new MyDataBase();

$dbHandler = $db->connect('dbTest');

$dbHandler->insert('key1', '1111111');
var_dump($dbHandler->find('key1'));

$dbHandler->delete('key1');
var_dump($dbHandler->find('key1'));


$db->close();