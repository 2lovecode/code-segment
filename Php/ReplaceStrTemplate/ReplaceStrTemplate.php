<?php

/**
 * Class ReplaceStrTemplate
 *
 * 功能:
 *  将字符串模板中符合正则条件的占位符,替换为响应的变量值
 *
 *  在此例中,占位符是:###value###,其中value是变量名
 */
class ReplaceStrTemplate {
    public $strTemplate = <<<EOT
    Hello ###value1### , I ###value2### You
EOT;

    public $reg = '|###(.+?)###|';

    public $valueList = [
        'value1' => 'World',
        'value2' => 'Love',
    ];

    public function repalceTemplate()
    {
        $res = preg_replace_callback(
            $this->reg,
            function ($matches) {
                $value = $matches[0];
                if (isset($matches[1])) {
                    $index = $matches[1];
                    if (isset($this->valueList[$index])) {
                        $value = $this->valueList[$index];
                    }
                }
                return $value;
            },
            $this->strTemplate
        );

        return $res;
    }
}

$a = new ReplaceStrTemplate();

var_dump($a->repalceTemplate());