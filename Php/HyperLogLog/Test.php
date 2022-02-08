<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */
require_once './HyperLogLog.php';

class Test
{
    public function run()
    {
        $hyper = new HyperLogLog();

        for ($i = 0; $i < 10000000; $i++) {
            $hyper->add('Test01'.$i);
        }

        echo $hyper->count();
    }
}

$test = new Test();
$test->run();