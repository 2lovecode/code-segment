<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 实现方式：md5方式
 *
 * 1. 把url通过md5转为32个字符
 * 2. 把32个字符分为4组,每组8个字符
 * 3. 8个字符共有64个bit,取后36个bit分为6组,每组6个bit
 * 4. 6个bit表示的数据范围是64,所以我们给0-9,a-z,A-Z,+-,这64个字符编号为0-63
 * 5. 找出每组对应的6个字符,我们会得到4组6个字符,随机取一个作为短地址
 *
 */
class DbStore
{
    private $recordStore = [];

    public function insert($shortUrl, $longUrl)
    {
        $this->recordStore[$shortUrl] = $longUrl;
    }

    public function find($shortUrl)
    {
        return $this->recordStore[$shortUrl] ?? '';
    }
}

class Md5Shortener
{
    private $alphanumericMap = [];

    public function __construct()
    {
        for ($i = 0; $i < 10; $i++) {
            $this->alphanumericMap[$i] = $i;
        }

        $start = ord('a') - 10;
        for ($i = 10; $i < 36; $i++) {
            $this->alphanumericMap[$i] = chr($start + $i);
        }

        $start = ord('A') - 36;
        for ($i = 36; $i < 62; $i++) {
            $this->alphanumericMap[$i] = chr($start + $i);
        }
        $this->alphanumericMap[62] = '+';
        $this->alphanumericMap[63] = '-';
    }

    public function short($url)
    {
        $md5Map = [];
        $shortUrlMap = [];

        $md5String = md5($url);

        for ($i = 0; $i < 4; $i++) {
            $md5Map[$i] = hexdec(substr($md5String, $i * 8, 8));
        }

        for ($i = 0; $i < 4; $i++) {
            $md5Map[$i] = $md5Map[$i] & 0xfffffffff;
        }

        for ($i = 0; $i < 4; $i++) {
            $shortUrlMap[$i][] = $this->alphanumericMap[($md5Map[$i] & 0xfffffffff) >> 30];
            $shortUrlMap[$i][] = $this->alphanumericMap[($md5Map[$i] & 0x3fffffff) >> 24];
            $shortUrlMap[$i][] = $this->alphanumericMap[($md5Map[$i] & 0xffffff) >> 18];
            $shortUrlMap[$i][] = $this->alphanumericMap[($md5Map[$i] & 0x3ffff) >> 12];
            $shortUrlMap[$i][] = $this->alphanumericMap[($md5Map[$i] & 0xfff) >> 6];
            $shortUrlMap[$i][] = $this->alphanumericMap[($md5Map[$i] & 0x3f)];
        }

        $rand = mt_rand(0, 3);
        $shortUrl = '';

        foreach ($shortUrlMap[$rand] as $each) {
            $shortUrl .= $each;
        }

        return $shortUrl;
    }
}

$testData = [
    'http://www.baidu.com/path/to/file',
    'http://www.google.com/path/to/file',
    'http://sogou.com/path/to/file',
    'http://csdn.net/path/to/file',
    'http://oschina.com/path/to/file',
];
echo '<pre>';
$md5Shortener = new Md5Shortener();
$dbStore = new DbStore();

foreach ($testData as $each) {
    $short = $md5Shortener->short($each);
    $dbStore->insert($short, $each);
    $shortUrlMap[] = $short;
}

foreach ($shortUrlMap as $each) {
    $url = $dbStore->find($each);
    echo $each.' : '.$url.'<br>';
}
