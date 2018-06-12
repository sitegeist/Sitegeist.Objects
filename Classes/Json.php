<?php
namespace Sitegeist\Objects;

/*
 * Copyright notice
 *
 * (c) 2018 Wilhelm Behncke <behncke@sitegeist.de>
 * All rights reserved
 *
 * This file is part of the Sitegeist/Objects project under GPL-3.0.
 *
 * For the full copyright and license information, please read the
 * LICENSE.md file that was distributed with this source code.
 */

use Neos\Utility\ObjectAccess;

class Json implements \JsonSerializable
{
    /**
     * @var array
     */
    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function get($path)
    {
        return ObjectAccess::getPropertyPath($this->data, $path);
    }

    public function jsonSerialize()
    {
        return $this->data;
    }
}
