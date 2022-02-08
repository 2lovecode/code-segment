<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 绑定初始数据
 */

require_once '../OContainer.php';

interface Ed
{
    public function __construct($params);
}

class Ed01 implements Ed
{
    private $params;

    public function __construct($params)
    {
        $this->params =  $params;
    }

    public function run()
    {
        echo $this->params;
    }
}

/************************** 绑定初始数据 ********************************/

$container = new OContainer();

$value = 'Hello World!';

//绑定, $符号不能丢
$container->when('Ed01')->needs('$params')->give($value);

//获取实例
$ed01 = $container->make('Ed01');

$ed01->run();