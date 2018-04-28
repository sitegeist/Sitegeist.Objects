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
 * Represents PHP \DateTime objects
 */
class DateTimeScalar extends ScalarType
{
    /**
     * @var DateTimeScalar
     */
    protected static $instance = null;

    /**
     * @var string
     */
    public $name = 'DateTime';

    /**
     * @var string
     */
    public $description = 'PHP \\DateTime object';

    /**
     * Expose singleton instance
     *
     * @return DateTimeScalar
     */
    public static function type() : DateTimeScalar
    {
        if (static::$instance === null) {
            static::$instance = new DateTimeScalar();
        }

        return static::$instance;
    }

    /**
     * @param \DateTimeInterface $value
     * @return string
     */
    public function serialize($value)
    {
        if (!$value instanceof \DateTimeInterface) {
            return null;
        }

        return $value->format(DATE_ISO8601);
    }

    /**
     * @param string $value
     * @return \DateTimeImmutable|null
     */
    public function parseValue($value)
    {
        if (!is_string($value)) {
            return null;
        }

        if ($dateTime = \DateTimeImmutable::createFromFormat(DATE_ISO8601, $value)) {
            return $dateTime;
        }

        return null;
    }
    /**
     * @param AstNode $valueAST
     * @return \DateTimeImmutable|null
     */
    public function parseLiteral($valueAST)
    {
        if (!$valueAST instanceof StringValue) {
            return null;
        }

        return $this->parseValue($valueAST->value);
    }
}
