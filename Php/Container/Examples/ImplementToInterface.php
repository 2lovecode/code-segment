<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 绑定实现到接口
 */

require_once '../OContainer.php';

interface Ee
{
    public function run();
}

class Ee01 implements Ee
{
    public function run()
    {
        echo "I am Ee01!";
    }
}

class O
{
    private $e;

    public function __construct(Ee $e)
    {
        $this->e = $e;
    }

    public function run()
    {
        $this->e->run();
    }
}

/************************** 绑定实现到接口 ********************************/

$container = new OContainer();

//绑定
$container->bind('Ee', 'Ee01');

//获取实例
$o = $container->make('O');
$o->run();
