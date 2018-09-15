<?php

/**
 * Class InsertSort
 *
 * 插入排序
 *
 *
 */
class InsertSort
{
    private $originalData = [];
    private $resultData = [];
    private $dataLen;

    public function __construct($original = [])
    {
        $this->originalData = $original;
        $this->resultData = $original;
        $this->dataLen = count($original);
    }

    public function sort()
    {
    }
}