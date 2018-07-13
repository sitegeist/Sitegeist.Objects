<?php
namespace Sitegeist\Objects;

use Neos\Flow\Core\Bootstrap;
use Neos\Flow\Package\Package as BasePackage;
use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\ContentRepository\Domain\Service\PublishingService;
use Flowpack\ElasticSearch\ContentRepositoryAdaptor\Indexer\NodeIndexer;

class Package extends BasePackage
{
    /**
     * @param Bootstrap $bootstrap The current bootstrap
     * @return void
     */
    public function boot(Bootstrap $bootstrap)
    {
        $dispatcher = $bootstrap->getSignalSlotDispatcher();

        $indexNode = function (NodeInterface $node) use ($bootstrap) {
            $nodeIndexer = $bootstrap->getObjectManager()->get(NodeIndexer::class);
            $nodeIndexer->indexNode($node);
        };

        $dispatcher->connect(Node::class, 'nodeAdded', $indexNode);
        $dispatcher->connect(Node::class, 'nodeUpdated', $indexNode);
        $dispatcher->connect(PublishingService::class, 'nodePublished', $indexNode);
        $dispatcher->connect(PublishingService::class, 'nodeDiscarded', $indexNode);
    }
}
