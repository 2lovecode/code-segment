<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 标记绑定
 */

require_once '../OContainer.php';

interface Eg
{
    public function run();
}

class Eg01 implements Eg
{
    public function run()
    {
        echo "I am Eg01!";
    }
}

class Eg02 implements Eg
{
    public function run()
    {
        echo "I am Eg02!";
    }
}

class Eg03 implements Eg
{
    public function run()
    {
        echo "I am Eg03!";
    }
}

/************************** 标记绑定 ********************************/

$container = new OContainer();

//绑定
$container->bind('Eg01', 'Eg01');
$container->bind('Eg02', 'Eg02');
$container->bind('Eg03', 'Eg03');

$container->tag(['Eg01', 'Eg02', 'Eg03'], 'Ege');

//获取实例
$aggregator = $container->tagged('Ege');

foreach ($aggregator as $each) {
    $each->run();
}