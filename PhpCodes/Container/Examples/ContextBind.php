<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 上下文绑定
 */

require_once '../OContainer.php';

interface Ef
{
    public function run();
}

class Ef01 implements Ef
{
    public function run()
    {
        echo "I am Ef01!";
    }
}

class Ef02 implements Ef
{
    public function run()
    {
        echo "I am Ef02!";
    }
}

interface Of
{
    public function __construct(Ef $e);

    public function run();
}

class Of01
{
    private $e;

    public function __construct(Ef $e)
    {
        $this->e = $e;
    }

    public function run()
    {
        echo $this->e->run();
    }
}

class Of02
{
    private $e;

    public function __construct(Ef $e)
    {
        $this->e = $e;
    }

    public function run()
    {
        echo $this->e->run();
    }
}

/************************** 上下文绑定 ********************************/

$container = new OContainer();

//绑定
$container->when('Of01')->needs('Ef')->give('Ef01');
$container->when('Of02')->needs('Ef')->give('Ef02');

//获取实例
$of01 = $container->make('Of01');
$of02 = $container->make('Of02');

$of01->run();
$of02->run();