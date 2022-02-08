<?php

/*
*
*	使用的hash函数是hashFunc，先使用md5转为32位，
*	再将得到的32位字符串的前8位使用Times33求得hash值。
*
*/
class DataBaseObject
{
	private $dataHandler;
	private $indexHandler;

	public function __construct($dataHandler, $indexHandler)
	{
		$this->dataHandler = $dataHandler;
		$this->indexHandler = $indexHandler;
	}

	public function insert($key, $data)
	{
		$offset = $this->hashFunc($key) % DB_BUCKET_SIZE * 4;
		$indexOffset = fstat($this->indexHandler);//获取下一个可用的磁盘地址的偏移量
		$indexOffset = intval($indexOffset['size']);

		$dataOffset = fstat($this->dataHandler);
		$dataOffset = intval($dataOffset['size']);

		$keyLen = strlen($key);

		if ($keyLen > DB_KEY_SIZE) {
			return DB_INSERT_FAILED;
		}

		$dataBlock = pack('L', 0x00000000);//指向的下一个节点是0
		$dataBlock .= $key;
		$space = DB_KEY_SIZE - $keyLen;
		for($i = 0; $i < $space; $i++) {
			$dataBlock .= pack('C', 0x00);//长度不够，用0补齐。
		}

		$dataBlock .= pack('L', $dataOffset);//新数据在数据文件中的偏移量
		$dataBlock .= pack('L', strlen($data));//新数据长度

		fseek($this->indexHandler, $offset, SEEK_SET);
		$position = unpack('L', fread($this->indexHandler, 4));
		$position = $position[1];

		if ($position == 0) {//如果该散列值从未出现过，直接作为头节点
			fseek($this->indexHandler, $offset, SEEK_SET);
			fwrite($this->indexHandler, pack('L', $indexOffset), 4);//头节点指向当前节点
			fseek($this->indexHandler, 0, SEEK_END);
			fwrite($this->indexHandler, $dataBlock, DB_INDEX_SIZE);//写入当前索引节点
			fseek($this->dataHandler, 0, SEEK_END);
			fwrite($this->dataHandler, $data, strlen($data));//将新数据写入数据文件
			return DB_INSERT_SUCCESS;
		}

		$foundFlag = false;

		while ($position) {
			fseek($this->indexHandler, $position, SEEK_SET);
			$tmpBlock = fread($this->indexHandler, DB_INDEX_SIZE);//获取当前索引节点的值
			$currentKey = substr($tmpBlock, 4, DB_KEY_SIZE);
			if (!strncmp($key, $currentKey, strlen($key))) {//因为索引文件是二进制值，使用strncmp函数比较是否相等。
				$dataOff = unpack('L', substr($tmpBlock, DB_KEY_SIZE + 4, 4));//当前索引指向的数据在数据文件中的偏移量
				$dataOff = $dataOff[1];
				$dataLe = unpack('L', substr($tmpBlock, DB_KEY_SIZE + 8, 4));//当前索引指向的数据长度
				$dataLe = $dataLe[1];
				$foundFlag = true;
				break;
			}
			$prev = $position;
			$position = unpack('L', substr($tmpBlock, 0, 4));
			$position = $position[1];
		}

		if ($foundFlag) {
			return DB_EXISTS_KEY;
		}

		fseek($this->indexHandler, $prev, SEEK_SET);
		fwrite($this->indexHandler, pack('L', $indexOffset), 4);//上一个节点指向当前节点
		fseek($this->indexHandler, 0, SEEK_END);
		fwrite($this->indexHandler, $dataBlock, DB_INDEX_SIZE);//写入当前索引节点
		fseek($this->dataHandler, 0, SEEK_END);
		fwrite($this->dataHandler, $data, strlen($data));//将新数据写入数据文件
		return DB_INSERT_SUCCESS;
	}

	public function find($key)
	{	
		$offset = $this->hashFunc($key) % DB_BUCKET_SIZE * 4;
		fseek($this->indexHandler, $offset, SEEK_SET);
		$position = unpack('L', fread($this->indexHandler, 4));
		$position = $position[1];

		$foundFlag = false;
		while ($position) {
			fseek($this->indexHandler, $position, SEEK_SET);
			$indexBlock = fread($this->indexHandler, DB_INDEX_SIZE);
			$currentKey = substr($indexBlock, 4, DB_KEY_SIZE);
			if (!strncmp($currentKey, $key, strlen($key))) {
				$dataOffset = unpack('L', substr($indexBlock, DB_KEY_SIZE + 4, 4));
				$dataOffset = $dataOffset[1];

				$dataLen = unpack('L', substr($indexBlock, DB_KEY_SIZE + 8, 4));
				$dataLen = $dataLen[1];

				$foundFlag = true;
				break;
			}

			$position = unpack('L', substr($indexBlock, 0, 4));
			$position = $position[1];
		}

		if ($foundFlag) {
			fseek($this->dataHandler, $dataOffset, SEEK_SET);
			$data = fread($this->dataHandler, $dataLen);
			return $data;
		} else {
			return NULL;
		}


	}

	public function delete($key)
	{
		$offset = $this->hashFunc($key) % DB_BUCKET_SIZE * 4;
		fseek($this->indexHandler, $offset, SEEK_SET);
		$head = unpack('L', fread($this->indexHandler, 4));
		$head = $head[1];

		$current = $head;
		$prev = 0;

		$foundFlag = false;

		while ($current) {
			fseek($this->indexHandler, $current, SEEK_SET);
			$dataBlock = fread($this->indexHandler, DB_INDEX_SIZE);

			$currentKey = substr($dataBlock, 4, DB_KEY_SIZE);

			$next = unpack('L', substr($dataBlock, 0, 4));
			$next = $next[1];

			if (!strncmp($key, $currentKey, strlen($key))) {
				$foundFlag = true;
				break;
			}

			$prev = $current;
			$current = $next;
		}

		if (!$foundFlag) {
			return DB_DELETET_FAILED;
		}

		if ($prev == 0) {
			fseek($this->indexHandler, $offset, SEEK_SET);
		} else {
			fseek($this->indexHandler, $prev, SEEK_SET);
		}
		fwrite($this->indexHandler, pack('L', $next), 4);//把上一个索引指向下一个索引的指针指向要删除的索引指向的下一个索引，从而完成删除操作，并未直接删除索引和数据文件中的值

		return DB_DELETE_SUCCESS;
	}

	protected function hashFunc($str)
	{
		$str = substr(md5($str), 0, 8);
		$hashValue = 0;

		for ($i = 0; $i < 8; $i++) {
			$hashValue += 33 * $hashValue + ord($str[$i]);
		}

		return $hashValue & 0x7FFFFFFF;
	}
}