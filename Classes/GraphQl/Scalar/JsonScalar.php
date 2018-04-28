<?php
namespace Sitegeist\Objects\GraphQl\Scalar;

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

use Neos\Flow\Annotations as Flow;
use GraphQL\Language\AST\Node as AstNode;
use GraphQL\Language\AST\StringValue;
use GraphQL\Type\Definition\ScalarType;

/**
 * Scalar for JSON objects with unpredictable structures
 */
class JsonScalar extends ScalarType
{
    /**
     * @var JsonScalar
     */
    protected static $instance = null;

    /**
     * @var string
     */
    public $name = 'JSON';

    /**
     * @var string
     */
    public $description = 'JSON object with unpredictable structure';

    /**
     * Expose singleton instance
     *
     * @return JsonScalar
     */
    public static function type() : JsonScalar
    {
        if (static::$instance === null) {
            static::$instance = new JsonScalar();
        }

        return static::$instance;
    }

    /**
     * @param mixed $value
     * @return array|null
     */
    public function serialize($value)
    {
        if (!is_array($value)) {
            return null;
        }

        return $value;
    }

    /**
     * @param string|array $value
     * @return array|null
     */
    public function parseValue($value)
    {
        if (is_string($value)) {
            $value = json_decode($value, true);
        }

        if (is_array($value)) {
            return $value;
        }

        return null;
    }

    /**
     * @param AstNode $valueAST
     * @return array
     */
    public function parseLiteral($valueAST)
    {
        if (!$valueAST instanceof StringValue) {
            return null;
        }

        return $this->parseValue($valueAST->value);
    }
}
