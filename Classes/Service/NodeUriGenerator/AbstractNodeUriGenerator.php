<?php
namespace Sitegeist\Objects\Service\NodeUriGenerator;

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
use Neos\Flow\Http\Request;
use Neos\Flow\Http\Uri;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Flow\Mvc\ActionRequest;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Domain\Service\NodeShortcutResolver;

/**
 * @TODO: Class comment
 */
abstract class AbstractNodeUriGenerator implements NodeUriGeneratorInterface
{
    /**
     * @Flow\Inject
     * @var NodeShortcutResolver
     */
    protected $nodeShortcutResolver;

    /**
     * @return UriBuilder
     */
    protected function getUriBuilder()
    {
        $httpRequest = Request::create(new Uri('http://neos.io'));
        $request = new ActionRequest($httpRequest);

        $uriBuilder = new UriBuilder();
        $uriBuilder->setRequest($request);

        return $uriBuilder->reset()->setFormat($request->getFormat());
    }

    protected function resolveShortcut(NodeInterface $node)
    {
        $resolvedNode = $this->nodeShortcutResolver->resolveShortcutTarget($node);

        if (is_string($resolvedNode)) {
            return $resolvedNode;
        }

        if (!$resolvedNode instanceof NodeInterface) {
            throw new \Exception(
                sprintf('Could not resolve shortcut target for node "%s"', $node->getPath()),
                1527066615
            );
        }

        return $resolvedNode;
    }
}
