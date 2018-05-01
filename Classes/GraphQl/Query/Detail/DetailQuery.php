<?php
namespace Sitegeist\Objects\GraphQl\Query\Detail;

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
use Neos\ContentRepository\Domain\Model\NodeInterface;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\GraphQl\Query\Detail\DetailHelper;
use Sitegeist\Objects\GraphQl\Query\ObjectQuery;

class DetailQuery extends ObjectType
{
    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'Detail',
            'description' => 'Detailed information about an object',
            'fields' => [
                'object' => [
                    'type' => $typeResolver->get(ObjectQuery::class),
                    'description' => 'The id of the object node or null if empty'
                ],
                'tabs' => [
                    'type' => Type::listOf($typeResolver->get(TabQuery::class)),
                    'description' => 'The tab configuration of the object node'
                ]
            ],
            'resolveField'  => function(DetailHelper $objectDetail, $arguments, $context, ResolveInfo $info) {
                return $objectDetail->{'get' . ucfirst($info->fieldName)}($arguments);
            }
        ]);
    }
}
