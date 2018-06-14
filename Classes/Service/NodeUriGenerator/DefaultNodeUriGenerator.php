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
use Neos\ContentRepository\Domain\Model\NodeInterface;

class DefaultNodeUriGenerator extends AbstractNodeUriGenerator
{
    /**
     * @see: NodeUriGeneratorInterface
     * @param NodeInterface $node
     * @param array $options
     * @return string
     */
    public function generate(NodeInterface $node, array $options = [])
    {
        if (array_key_exists('resolveShortcuts', $options) && $options['resolveShortcuts'] === true) {
            $resolvedNode = $this->resolveShortcut($node);
        } else {
            $resolvedNode = $node;
        }

        if (is_string($resolvedNode)) {
            return $resolvedNode;
        }

        return $this->getUriBuilder()->uriFor('show', array('node' => $resolvedNode), 'Frontend\Node', 'Neos.Neos');
    }
}
