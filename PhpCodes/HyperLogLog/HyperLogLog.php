<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */
require_once './Bucket.php';

class HyperLogLog
{

    private $bucketMap = [];
    private $bucketCount = 16384;

    public function __construct($bucketCount = 16384)
    {
        $this->bucketCount = $bucketCount;

        for ($i = 0; $i < $bucketCount; $i++) {
            $this->bucketMap[$i] = new Bucket();
        }
     }

    public function add($value)
    {
        $number = crc32($value);

        $bucketOffset = (($number & 0xffff0000) >> 16) % $this->bucketCount;

        $this->getBucket($bucketOffset)->random();
    }

    public function count()
    {
        $number = 0.0;
        $notEmptyCount = 0;

        for ($i = 0; $i < $this->bucketCount; $i++) {
            $division = floatval($this->getBucket($i)->getMaxTailZeroCount());
            if ($division != 0) {
                $number += 1.0 / $division;
                $notEmptyCount++;
            }
        }

        $avg = floatval($notEmptyCount) / $number;
        return round(pow(2, $avg) * $notEmptyCount);
    }

    /**
     * @param $offset
     * @return Bucket
     */
    private function getBucket($offset)
    {
        return $this->bucketMap[$offset];
    }
}

