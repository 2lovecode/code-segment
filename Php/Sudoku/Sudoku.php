<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class Sudoku
{
    public function run()
    {
        $sudo = [];

        for ($i = 0; $i < 9; $i++) {
            for ($j = 0; $j < 9; $j++) {
                $tmp = 0;
                for ($z = 1; $z <= 9; $z++) {
                    $flag = true;
                    for ($a = 0; $a <= $i; $a++) {
                        for ($b = 0; $b <= $j; $b++) {
                            if ($a != $i && $b != $j) {
                                if ($sudo[$a][$b] == $z) {
                                    $flag = false;
                                    break 2;
                                }
                            }
                        }
                    }
                    if ($flag) {
                        break;
                    } else {
                        continue;
                    }
                }
            }
        }
    }
}