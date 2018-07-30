<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 绑定一个单例
 */

require_once '../OContainer.php';

interface Eb
{
    public function run();
}

class Eb01 implements Eb
{
    private $sum = 0;

    public function run()
    {
        return ++$this->sum;
    }
}

/************************** 绑定一个单例示例 ********************************/

$container = new OContainer();

//绑定
$container->singleton('Eb', function (OContainerInterface $container) {
    return new Eb01();
});

//获取实例
$eb0101 = $container->make('Eb');

var_dump($eb0101->run());

$eb0102 = $container->make('Eb');
var_dump($eb0102->run());