<?php
namespace Sitegeist\Objects\GraphQl\Query;

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
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\Domain\Model\PropertyConfiguration;
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;

class PropertyConfigurationQuery extends ObjectType
{
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'PropertyConfiguration',
            'description' => 'An property configuration',
            'fields' => [
                'name' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The name of the property',
                    'resolve' => function (PropertyConfiguration $propertyConfiguration) {
                        return $propertyConfiguration->getName();
                    }
                ],
                'label' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The label of the property',
                    'resolve' => function (PropertyConfiguration $propertyConfiguration) {
                        return $propertyConfiguration->getLabel();
                    }
                ],
                'editable' => [
                    'type' => Type::nonNull(Type::boolean()),
                    'description' => 'true, if the property is editable in detail view',
                    'resolve' => function (PropertyConfiguration $propertyConfiguration) {
                        return $propertyConfiguration->getEditable();
                    }
                ],
                'editor' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The editor for the property',
                    'resolve' => function (PropertyConfiguration $propertyConfiguration) {
                        return $propertyConfiguration->getEditor();
                    }
                ],
                'editorOptions' => [
                    'type' => JsonScalar::type(),
                    'description' => 'The editor options for the property',
                    'resolve' => function (PropertyConfiguration $propertyConfiguration) {
                        return $propertyConfiguration->getEditorOptions();
                    }
                ],
                'value' => [
                    'type' => JsonScalar::type(),
                    'description' => 'The value of the property',
                    'resolve' => function (PropertyConfiguration $propertyConfiguration) {
                        return $propertyConfiguration->getValue();
                    }
                ]
            ]
        ]);
    }
}
