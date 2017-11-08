<?php

/**
 * Class StdExample
 *
 * 把类的新属性映射为属性params的键,静态变量$logs记录参数变化情况
 */
class StdExample
{
    public $params = [];
    /**
     * @var array
     *
     * 记录参数更改的文件,行数和值
     */
    static public $logs = [];


    public function __set($name, $value)
    {
        echo 'abc><';
        $flag = $this->hasFunc($value);
        //因为有闭包函数时,debug_backtrace使用用内存过多,所以不处理这种值
        if (!$flag) {
            $file = __FILE__;
            $line = __LINE__;

            $i = 0;
            $backtrace = debug_backtrace(false, 3);
            while (isset($backtrace[$i]['file']) && ($backtrace[$i]['file'] == __FILE__)) {
                $i++;
            }
            if (isset($backtrace[$i]['file'])) {
                $file = $backtrace[$i]['file'];
                $line = $backtrace[$i]['line'];
            }
            self::$logs[$name][] = [
                'value' => $this->transObject($value),
                'file' => $file,
                'line' => $line,
            ];
        }
        $this->params[$name] = $value;
    }

    public function __get($name)
    {
        if (isset($this->params[$name])) {
            return $this->params[$name];
        }
    }

    public function __isset($name)
    {
        return isset($this->params[$name]);
    }

    public function __unset($name)
    {
        if (isset($this->params[$name])) {
            unset($this->params[$name]);
        }
    }

    /**
     * Name: hasFunc
     * Desc: 判断是否有闭包函数
     * @param
     * @param $value
     * @return bool
     */
    public function hasFunc($value)
    {
        try {
            if (is_object($value)) {
                if (get_class($value) === 'Closure') {
                    return true;
                }
            } else if (is_array($value)) {
                foreach ($value as $v) {
                    return $this->hasFunc($v);
                }
            }
        } catch (Exception $e) {
            return false;
        }
        return false;
    }

    /**
     * Name: transObject
     * Desc: 把对象转换为json
     * @param
     * @param $value
     * @return bool|null|string
     */
    public function transObject($value)
    {
        $result = null;
        try {
            if (is_object($value)) {
                $result = json_encode($value);
            } else if (is_array($value)) {
                foreach ($value as $key => $v) {
                    $result[$key] = $this->transObject($v);
                }
            } else {
                $result = $value;
            }
        } catch (Exception $e) {
            return false;
        }
        return $result;
    }
}


$example = new StdExample();

$example->value1 = 'aaa';


$example->value1 = 'bbb';

echo '<pre>';
var_dump($example->value1);
var_dump($example::$logs);
