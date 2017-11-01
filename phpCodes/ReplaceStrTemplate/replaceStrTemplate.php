<?php
class StrExample {
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

$a = new StrExample();

var_dump($a->repalceTemplate());