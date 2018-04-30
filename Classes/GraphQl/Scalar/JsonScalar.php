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
use GraphQL\Language\AST\BooleanValueNode;
use GraphQL\Language\AST\FloatValueNode;
use GraphQL\Language\AST\IntValueNode;
use GraphQL\Language\AST\ListValueNode;
use GraphQL\Language\AST\ObjectValueNode;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Type\Definition\CompositeType;

/**
 * Scalar for JSON objects with unpredictable structures
 */
class JsonScalar extends ScalarType implements CompositeType
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
     * @return mixed
     */
    public function serialize($value)
    {
        return $value;
    }

    /**
     * @param mixed $value
     * @return mixed
     */
    public function parseValue($value)
    {
        return $value;
    }

    /**
     * @param AstNode $valueAstNode
     * @return array
     */
    public function parseLiteral($valueAstNode)
    {
        switch ($valueAstNode) {
            case ($valueAstNode instanceof StringValueNode):
            case ($valueAstNode instanceof BooleanValueNode):
                return $valueAstNode->value;

            case ($valueAstNode instanceof IntValueNode):
                return intval($valueAstNode->value);

            case ($valueAstNode instanceof FloatValueNode):
                return floatval($valueAstNode->value);

            case ($valueAstNode instanceof ObjectValueNode): {
                $value = [];
                foreach ($valueAstNode->fields as $field) {
                    $value[$field->name->value] = $this->parseLiteral($field->value);
                }

                return $value;
            }

            case ($valueAstNode instanceof ListValueNode):
                return array_map([$this, 'parseLiteral'], $valueAstNode->values);

            default:
                return null;
        }
    }
}
