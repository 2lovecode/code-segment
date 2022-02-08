<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class Bucket
{
    private $maxTailZeroCount = 0;

    private function calculateTailZeroCount($number)
    {
        $tailZeroCount = 0;

        for ($i = 0; $i < 32; $i++) {
            if (($number >> $i << $i) !== $number) {
                $tailZeroCount = $i - 1;
                break;
            }
        }

        return $tailZeroCount;
    }

    public function random()
    {
        $max = pow(2, 32) - 1;

        $value = mt_rand(0, $max);

        $tailZeroCount = $this->calculateTailZeroCount($value);

        if ($tailZeroCount > $this->maxTailZeroCount) {
            $this->maxTailZeroCount = $tailZeroCount;
        }
    }

    public function getMaxTailZeroCount()
    {
        return $this->maxTailZeroCount;
    }
}