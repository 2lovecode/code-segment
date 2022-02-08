<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 *
 * 简单绑定示例
 */

require_once '../OContainer.php';

class E
{
    public function run()
    {
        echo "I am E;";
    }
}

interface Ea
{
    public function __construct(E $e);
}

class Ea01 implements Ea
{
    /**
     * @var E
     */
    private $e;

    public function __construct(E $e)
    {
        $this->e = $e;
    }

    public function run()
    {
        $this->e->run();
    }
}

/************************** 简单绑定示例 ********************************/

$container = new OContainer();

//绑定
$container->bind('Ea', function (OContainerInterface $container) {
    return new Ea01($container->make('E'));
});

//获取实例
$ea01 = $container->make('Ea');

$ea01->run();
