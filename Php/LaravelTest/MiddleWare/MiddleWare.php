<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 *
 * 根据Laravel框架的实现原理,写的一个简单的实现demo.
 *
 * 关键在于PipeLine类的then方法:
 *      其中最关键的是array_reduce($array, $callback, $init)函数,
 *      此函数会对array中的每个值应用$callback函数处理,$init则为初始值.
 *
 *      在示例中,$array是中间件列表,$callback是callback返回的匿名函数,$init是init返回的匿名函数.
 *
 *      callback会找到当前值指向类的handle方法,把handle方法封装到一个匿名函数并返回,
 *      下一个值指向类的handle方法会获取上一个返回的匿名函数,并调用.
 *
 *      不过这个调用堆栈和处理过程是相反的,所以在then方法中会使用array_reverse方法倒置中间件列表,这样会形成一个调用堆栈.
 *      并且init返回的匿名函数也会在最后被调用,我们把处理请求的逻辑放到init方法中,就会达到先顺序调用中间件,最后处理请求的目的.
 *
 *      //经过处理后的调用堆栈类似下面的示例
 *      $init = function () {
 *          var_dump('init');
 *          return true;
 *      };
 *
 *      $m3 = function () use ($init) {
 *          var_dump('m3');
 *          return $init();
 *      };
 *
 *      $m2 = function () use ($m3) {
 *          var_dump('m2');
 *          return $m3();
 *      };
 *
 *      $m1 = function () use ($m2) {
 *          var_dump('m1');
 *          return $m2();
 *      };
 *
 *      $m1();
 */

abstract class MiddleWare
{
    abstract public function handle($request, $next);
}

class MiddleWareOne extends MiddleWare
{
    public function handle($request, $next)
    {
        var_dump('Handle:中间件---1');
        return $next($request);
    }

    public function process($request, $next)
    {
        var_dump('Process:中间件---1');
        return $next($request);
    }
}

class MiddleWareTwo extends MiddleWare
{
    public function handle($request, $next)
    {
        var_dump('Handle:中间件---2');
        return $next($request);
    }

    public function process($request, $next)
    {
        var_dump('Process:中间件---2');
        return $next($request);
    }
}

class MiddleWareThree extends MiddleWare
{
    public function handle($request, $next)
    {
        var_dump('Handle:中间件---3');
        return $next($request);
    }

    public function process($request, $next)
    {
        var_dump('Process:中间件---3');
        return $next($request);
    }
}

class PipeLine
{
    private $request = null;
    private $pipes = [];
    private $method = 'handle';

    public function send($request)
    {
        $this->request = $request;
        return $this;
    }

    public function through($pipes)
    {
        $this->pipes = $pipes;

        return $this;
    }

    public function via($method)
    {
        $this->method = $method;
        return $this;
    }

    public function then(Closure $closure)
    {
        $pipeline = array_reduce(
            array_reverse($this->pipes), $this->callback(), $this->init($closure)
        );

        return $pipeline($this->request);
    }

    public function callback()
    {
        return function ($stack, $pipe) {
            return function ($request) use ($stack, $pipe) {
                $object = new $pipe();
                return $object->{$this->method}($request, $stack);
            };
        };
    }

    public function init(Closure $closure)
    {
        return function ($request) use ($closure) {
            return $closure($request);
        };
    }
}

class Request
{
    public function run()
    {
        var_dump('处理请求...');
        return true;
    }
}

class Kernel
{
    public $middleware = [
        'MiddleWareOne',
        'MiddleWareTwo',
        'MiddleWareThree'
    ];

    public function run()
    {
        $request = new Request();

        return (new PipeLine())
            ->send($request)
            ->through($this->middleware)
            ->then($this->routeDispatch());
    }

    public function run1()
    {
        $request = new Request();

        return (new PipeLine())
            ->send($request)
            ->through($this->middleware)
            ->via('process')
            ->then($this->routeDispatch());
    }

    public function routeDispatch()
    {
        return function (Request $request) {
            return $request->run();
        };
    }
}

$kernel = new Kernel();

echo '<pre>';
$kernel->run();

echo '<hr>';
$kernel->run1();

echo '<hr>';
$init = function () {
    var_dump('init');
    return true;
};

$m3 = function () use ($init) {
    var_dump('m3');
    return $init();
};

$m2 = function () use ($m3) {
    var_dump('m2');
    return $m3();
};

$m1 = function () use ($m2) {
    var_dump('m1');
    return $m2();
};

$m1();