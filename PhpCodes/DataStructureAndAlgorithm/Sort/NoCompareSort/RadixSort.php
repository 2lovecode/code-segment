<?php

/**
 * Class RadixSort
 *
 * 基数排序法
 */
class RadixSort
{
    public $originalData = [];

    public $result = [];

    public function __construct(array $originalData = [])
    {
        $this->originalData = $originalData;
    }

    public function sort()
    {
        $maxLen = $this->calculateMaxDigits();

        $tmpData = $this->originalData;
        $bucketData = [];


        for($times = 0; $times < $maxLen; $times++) {
            $t = pow(10, $times);
            foreach ($tmpData as $value) {
                $tmp = $value/$t;
                $flag = $tmp%10;
                $bucketData[$flag][] = $value;
            }
            $tmpData = [];

            ksort($bucketData);
            foreach ($bucketData as $value) {
                foreach ($value as $v) {
                    array_push($tmpData, $v);
                }
            }
            $bucketData = [];
        }

        $this->result = $tmpData;
        return $this->result;
    }

    public function calculateMaxDigits()
    {
        $maxLen = 0;
        foreach ($this->originalData as $key => $value) {
            $now = strlen($value);
            if ($now > $maxLen) {
                $maxLen = $now;
            }
        }

        return $maxLen;
    }
}

$example = new RadixSort([20, 67, 123, 111, 2, 34, 1, 78, 0, 33, 11, 15, 83]);
echo '<pre>';
var_dump($example->sort());