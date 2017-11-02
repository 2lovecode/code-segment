<?php

class TransformDataPieces
{
    /**
     * @var array
     * linux crontab 中的各项配置
     *
     * 星号(*):代表所有可能的值,
     *          例如:month字段如果是星号,则表示在满足其它字段的制约条件后每月都执行该命令操作.
     * 逗号(,):可以用逗号隔开的值指定一个列表范围
     *          例如:"1,2,5,7,8,9"
     * 中杠(-):可以用整数之间的中杠表示一个整数范围
     *          例如:"2-6"表示"2,3,4,5,6"
     * 正斜线(/):可以用正斜线指定时间的间隔频率
     *          例如:"0-23/2"表示每两小时执行一次
     *          同时正斜线可以和星号一起使用,
     *          例如:*\/10,如果用在minute字段,表示每十分钟执行一次
     */
    public $crontab = ['*/2', '*', '*', '*', '*'];

    /**
     * Name: transfer
     * Desc:
     *      把linux的crontab中用于定时的配置转换为相应的时间散列值
     *      这段代码来源于俄罗斯大熊弟的代码:https://github.com/DenisOgr/yii2-cronjobs
     * @param
     * @param array $parameters
     * @return array
     */
    public function transfer(array $parameters)
    {
        $dimensions = array(
            array(0,59), //Minutes
            array(0,23), //Hours
            array(1,31), //Days
            array(1,12), //Months
            array(0,6),  //Weekdays
        );
        foreach ($parameters AS $n => &$repeat) {
            list($repeat, $every) = explode('/', $repeat, 2) + array(false, 1);
            if ($repeat === '*') {
                $repeat = range($dimensions[$n][0], $dimensions[$n][1]);
            } else {
                $repeatPiece = array();
                foreach (explode(',', $repeat) as $piece) {
                    $piece = explode('-', $piece, 2);
                    if (count($piece) === 2) {
                        $repeatPiece = array_merge($repeatPiece, range($piece[0], $piece[1]));
                    } else {
                        $repeatPiece[] = $piece[0];
                    }
                }
                $repeat = $repeatPiece;
            }
            if ($every > 1) foreach ($repeat AS $key => $piece){
                if ($piece%$every !== 0) unset($repeat[$key]);
            }
        }
        return $parameters;
    }

    /**
     * Name: getCurrentTime
     * Desc:
     *      date函数各个参数的解释,参考下面链接
     *          http://php.net/manual/zh/function.date.php
     *
     *      i:有前导零的分钟数
     *      G:小时,24小时格式,没有前导零
     *      j:月份中的第几天,没有前导零
     *      n:数字表示的月份,没有前导零
     *      w:星期中的第几天,数字表示,0-6
     *
     * @param
     * @return array
     */
    public function getCurrentTime()
    {
        $now = explode(' ', date('i G j n w', time()));
        return $now;
    }

    /**
     * Name: judge
     * Desc: 判断当前时间是否到达配置的定时时间
     * @param
     * @return bool
     */
    public function judge()
    {
        $flag = true;
        $timePieces = $this->transfer($this->crontab);
        $currentTime = $this->getCurrentTime();

        foreach ($currentTime as $key => $value) {
            if (!in_array($value, $timePieces[$key])) {
                $flag = false;
            }
        }

        return $flag;
    }
}
$example = new TransformDataPieces();

if ($example->judge()) {
    echo "<h2>Time is up</h2>";
} else {
    echo "<h2>Time is not over</h2>";
}


