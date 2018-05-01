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
use Neos\Utility\ObjectAccess;
use Neos\Utility\PositionalArraySorter;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Sitegeist\Objects\Service\NodeService;
use Sitegeist\Objects\GraphQl\Query\ObjectHelper;

/**
 * Provides information about a (possibly empty) object node
 */
class DetailHelper
{
    /**
     * @var ObjectHelper
     */
    protected $object;

    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @param NodeType $nodeType
     * @throws \InvalidArgumentException
     */
    public function __construct(ObjectHelper $object)
    {
        $this->object = $object;
    }

    /**
     * @return ObjectHelper
     */
    public function getObject()
    {
        return $this->object;
    }

    /**
     * @return array<TabHelper>
     */
    public function getTabs()
    {
        $tabConfigurations = [];

        foreach($this->object->getNodeType()->getProperties() as $propertyConfiguration) {
            $groupName = ObjectAccess::getPropertyPath($propertyConfiguration, 'ui.sitegeist/objects/detail.group');
            if ($groupName) {
                $tabName = $this->object->getNodeType()
                    ->getConfiguration('ui.sitegeist/objects/detail.groups.' . $groupName . '.tab');

                if ($tabName && !array_key_exists($tabName, $tabConfigurations)) {
                    $tabConfigurations[$tabName] = new TabHelper($this->object, $tabName);
                }
            }
        }

        $sorter = new PositionalArraySorter($tabConfigurations);
        return $sorter->toArray();
    }
}
