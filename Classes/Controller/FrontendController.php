<?php
namespace Sitegeist\Objects\Controller;

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
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Neos\Controller\Exception\NodeNotFoundException;
use Neos\Neos\View\FusionView;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Flowpack\ElasticSearch\ContentRepositoryAdaptor\Eel\ElasticSearchQueryBuilder;

class FrontendController extends ActionController
{
    /**
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contextFactory;

    /**
     * @Flow\Inject
     * @var ElasticSearchQueryBuilder
     */
    protected $queryBuilder;

    /**
     * @var string
     */
    protected $defaultViewObjectName = FusionView::class;

    /**
     * @var FusionView
     */
    protected $view;

    /**
     * @Flow\InjectConfiguration(path="rootNodeName")
     * @var string
     */
    protected $rootNodeName;

    /**
     * Shows the specified node and takes visibility and access restrictions into
     * account.
     *
     * @param string $storeName
     * @param string $uriPathSegment
     * @param array $contextProperties
     * @param string $fusionPath
     * @return string View output for the specified node
     * @Flow\SkipCsrfProtection We need to skip CSRF protection here because this action could be called with unsafe requests from widgets or plugins that are rendered on the node - For those the CSRF token is validated on the sub-request, so it is safe to be skipped here
     * @Flow\IgnoreValidation("node")
     * @throws NodeNotFoundException
     */
    public function showAction($storeName, $uriPathSegment, array $contextProperties, $fusionPath)
    {
        $contentContext = $this->contextFactory->create($contextProperties);
        $rootNode = $contentContext->getRootNode()->getNode($this->rootNodeName);
        $storeNode = $rootNode->getNode($storeName);

        if (!$storeNode) {
            throw new NodeNotFoundException(sprintf('Store "%s" could not be found.', $storeName));
        }

        $query = $this->queryBuilder->query($storeNode)
            ->nodeType('Sitegeist.Objects:Object')
            ->exactMatch('__parentNode', $storeNode->getIdentifier())
            ->exactMatch('uriPathSegment', $uriPathSegment)
            ->limit(1);

        $objectNode = null;
        foreach($query->execute() as $retreivedObjectNode) {
            $objectNode = $retreivedObjectNode;
            break;
        }

        if (!$objectNode) {
            throw new NodeNotFoundException(sprintf('Could not find Object at "%s".', $uriPathSegment));
        }

        $this->view->setFusionPath($fusionPath);
        $this->view->assign('value', $objectNode);
    }
}
