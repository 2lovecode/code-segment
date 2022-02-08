<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class SimpleContainer
{
    private $defines = [];
    private $instances = [];

    public function set($abstract, $concrete)
    {
        $this->defines[$abstract] = $concrete;
    }

    public function get($abstract)
    {
        if (isset($this->instances[$abstract])) {
            return $this->instances[$abstract];
        }

        $object = null;
        if (isset($this->defines[$abstract])) {
            $concrete = $this->defines[$abstract];
            $object =  $this->build($concrete);
        } else {
            $object =  $this->build($abstract);
        }

        $this->instances[$abstract] = $object;

        return $object;
    }

    private function build($concrete)
    {
        $reflector = new ReflectionClass($concrete);

        //如果不能实例化,抛出异常
        if (!$reflector->isInstantiable()) {
            throw new Exception('class ['.$concrete.'] can not be instantiated!');
        }

        //获取构造函数方法反射对象
        $constructor = $reflector->getConstructor();

        //类不存在构造函数,直接实例化
        if (is_null($constructor)) {
            return new $concrete;
        }

        //给每个签名参数赋值,如果参数是对象则实例化,如果有默认值则赋给默认值
        foreach ($constructor->getParameters() as $param) {
            if ($param->isDefaultValueAvailable()) {
                $dependencies[] = $param->getDefaultValue();
            } else {
                $dependClass = $param->getClass();
                $isClass = !is_null($dependClass) ? true : false;
                $dependencies[] = $isClass ? $this->get($dependClass->getName()) : null;
            }
        }
        //实例化对象
        return $reflector->newInstanceArgs($dependencies);
    }
}