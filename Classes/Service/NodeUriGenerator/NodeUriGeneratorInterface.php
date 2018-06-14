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

use Neos\ContentRepository\Domain\Model\NodeInterface;

/**
 * @TODO: Class comment
 */
interface NodeUriGeneratorInterface
{
    /**
     * @TODO: Method comment
     *
     * @param NodeInterface $node
     * @param array $options
     * @return string
     */
    public function generate(NodeInterface $node, array $options = []);
}
