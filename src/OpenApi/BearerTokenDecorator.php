<?php

declare(strict_types=1);

namespace App\OpenApi;

use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

#[AsDecorator(decorates: 'api_platform.openapi.factory')]
class BearerTokenDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private readonly OpenApiFactoryInterface $decorated
    ) {}

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);

        $schemas = $openApi->getComponents()->getSecuritySchemes();

        $schemas['JWT'] = new \ArrayObject([
            'type' => 'http',
            'scheme' => 'bearer',
            'bearerFormat' => 'JWT'
        ]);
        $meOperation= $openApi->getPaths()->getPath('/api/me')->getGet()->withParameters([]);
        $mePathItem= $openApi->getPaths()->getPath('/api/me')->withGet($meOperation);
    
        $openApi->getPaths()->addPath('/api/me',$mePathItem);

        return $openApi;
    }
}
?>