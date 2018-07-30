<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 扩展绑定
 */

require_once '../OContainer.php';

interface Eh
{
    public function run();
}

class EhBase implements Eh
{
    public function run()
    {
        echo "<----Base---->";
    }
}

class EhBaseDecorator extends EhBase
{
    private $base;

    public function __construct(Eh $base)
    {
        $this->base = $base;
    }

    public function getBase()
    {
        return $this->base;
    }
}
class RedEhBase extends EhBaseDecorator
{
    public function run()
    {
        echo "<----Red---->";
        $this->getBase()->run();
    }
}

class BigEhBase extends EhBaseDecorator
{
    public function run()
    {
        echo "<----Big---->";
        $this->getBase()->run();
    }
}

/************************** 扩展绑定示例 ********************************/

$container = new OContainer();

$ehBase = $container->make('EhBase');
$ehBase->run();

echo '<hr>';
//绑定
$container->extend('EhBase', function ($ehBase) {
    return new BigEhBase(new RedEhBase($ehBase));
});

//获取实例
$bigRedEhBase = $container->make('EhBase');
$bigRedEhBase->run();