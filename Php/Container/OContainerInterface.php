<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

interface OContainerInterface
{
    public function bound($abstract);

    public function alias($abstract, $alias);

    public function tag($abstracts, $tags);

    public function tagged($tag);

    public function bind($abstract, $concrete = null, $shared = false);

    public function bindIf($abstract, $concrete = null, $shared = false);

    public function singleton($abstract, $concrete = null);

    public function extend($abstract, Closure $closure);

    public function instance($abstract, $instance);

    public function when($concrete);

    public function factory($abstract);

    public function make($abstract, array $parameters = []);

    public function call($callback, array $parameters = [], $defaultMethod = null);

    public function resolved($abstract);

    public function resolving($abstract, Closure $callback = null);

    public function afterResolving($abstract, Closure $callback = null);
}