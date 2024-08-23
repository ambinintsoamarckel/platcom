<?php
namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Appro;
use App\Entity\Commande;
use App\Entity\IsactiveInterface;
use Symfony\Component\Security\Core\Security;
use App\Entity\Offer;
use App\Entity\Produits;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use ReflectionClass;
use Symfony\Component\HttpFoundation\Request;



class IsactiveExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private Security $security;
    public function __construct(Security $security)
    {
        $this->security=$security;
    }
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void

    {


        $this->addwhere($queryBuilder,$resourceClass,$context);
 
    }
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, Operation $operation = null, array $context = []): void
    {

        $this->addwhere($queryBuilder,$resourceClass,$context);
    }
    public function addwhere(QueryBuilder $queryBuilder, string $resourceClass ,array $context = [])
    {

        if(!$this->security->isGranted('ROLE_ADMIN'))
        {
            $reflection=new \ReflectionClass($resourceClass);
            if ($reflection->implementsInterface(IsactiveInterface::class)) {
               $alias=$queryBuilder->getRootAliases()[0];
           
   
               $queryBuilder
               ->andWhere("$alias.isactive = :active")
               ->setParameter('active', true);
   
           }
        
            if ( Appro::class===$resourceClass ) {
                $user=$this->security->getUser()->getId();
                $alias=$queryBuilder->getRootAliases()[0];
                if($user)
                {
                    $queryBuilder
                ->andWhere("$alias.user = :current_user")
                ->setParameter('current_user',$user );
                }else
                {
                    $queryBuilder
                ->andWhere("$alias.user = :current_user")
                ->setParameter('current_user',NULL );
    
                }
                
    
    
            }
            elseif ( Produits::class===$resourceClass ) {
                $user=$this->security->getUser();
                $alias=$queryBuilder->getRootAliases()[0];
                if($user)
                {
                    $queryBuilder
                ->andWhere("$alias.user = :current_user")
                ->setParameter('current_user',$user->getId() );
                }
                
    
    
            }
    
            elseif ( Commande::class===$resourceClass) {
                # code...
                $user=$this->security->getUser()->getId();
                $alias=$queryBuilder->getRootAliases()[0];
                if($user)
                {
                    $request = $this->getRequestFromContext($context);
                    if ($request instanceof Request) {
                        $pathInfo = $request->getPathInfo();
                      
    
                
                        if (preg_match('/^\/api\/commandes(\/\d)*$/', $pathInfo)) {
    
                            $queryBuilder
                            ->andWhere("$alias.user = :current_user")
                            ->setParameter('current_user',$user );
                        }
                        elseif (preg_match('/^\/api\/commandes_recu(\/\d)*$/', $pathInfo)) {
                           
    
                            $queryBuilder
                            ->andWhere("$alias.vendeur = :current_user")
                            ->setParameter('current_user',$user );
                        }
                }
    
                }
    
    
            
        }
        }
        else
        {
            if ($resourceClass!=User::class)
            {
                $reflection=new \ReflectionClass($resourceClass);
                if ($reflection->implementsInterface(IsactiveInterface::class)) {
                   $alias=$queryBuilder->getRootAliases()[0];
               
       
                   $queryBuilder
                   ->andWhere("$alias.isactive = :active")
                   ->setParameter('active', true);
       
               }
            

            }
            else{
                
                $request = $this->getRequestFromContext($context);
                if ($request instanceof Request) {
                $pathInfo = $request->getPathInfo();
                if (preg_match('/^\/api\/users$/', $pathInfo)) {
                    
                $alias=$queryBuilder->getRootAliases()[0];
               $user=$this->security->getUser();
       
                $queryBuilder
                
                ->andWhere("$alias.id != :currentUserId")
                ->setParameter('currentUserId', $user->getId());
                }
            }
            }
        }
}
private function getRequestFromContext(array $context): ?Request
{
    return $context['request'] ?? null;
}

}

?>