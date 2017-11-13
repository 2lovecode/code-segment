<?php

/**
 * Class ExcelColIncrease
 *
 * excel文件,列标识自增方法
 */
class ExcelColIncrease
{
    public function colIncrease($start = 'A', $step = 1) {
        $res = $start;
        if (is_numeric($step) && ($step >= 0) && ($step <= 26)) {
            switch (strlen($start)) {
                case 1:
                    if (($start >= 'A') && ($start <= 'Z')) {
                        $res = ord($start) + $step;
                        if ($res <= ord('Z')) {
                            $res = chr($res);
                        } else {
                            $res = 'A'.chr($res - 26);
                        }
                    }
                    break;
                case 2:
                    if (($start[1] >= 'A') && ($start[1] <= 'Z')) {
                        $prefix = $start[0];
                        $suffix = $start[1];

                        $res = ord($suffix) + $step;
                        if ($res <= ord('Z')) {
                            $res = $prefix.chr($res);
                        } else {
                            $res = chr(ord($prefix) + 1).chr($res - 26);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return $res;
    }

    public function test()
    {
        $start = 'A';
        for ($i = 0; $i < 100; $i++) {
            var_dump($start);
            $start = $this->colIncrease($start);
        }
    }
}

$example = new ExcelColIncrease();
$example->test();