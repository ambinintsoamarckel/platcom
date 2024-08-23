<?php
namespace App\Serializer;

use ApiPlatform\OpenApi\Serializer\NormalizeOperationNameTrait;
use App\Entity\User;
use App\Security\Voter\AuthVoter;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;

class AppNormalizer implements NormalizerInterface , NormalizerAwareInterface
{
    use NormalizerAwareTrait;


    private const ALREADY_CALLED_NORMALIZER='IsactiveSeriaizerNormalizer';
    public function __construct(private AuthorizationCheckerInterface $authorizationChecker)
    {
        
    }
    public function normalize(mixed $object, string $format = null, array $context = [])
    {
        $context[$this->getCalledKey()]=true;
        if($this->authorizationChecker->isGranted(AuthVoter::CAN_VIEW,$object))
        {
        $context['groups'][]='Can_view';
       
        
        } 
        return $this->normalizer->normalize($object,$format,$context);

    }


    public function supportsNormalization(mixed $data, string $format = null  , array $context = [] )
    {
    
      
        $alreadycalled=$context[$this->getCalledKey()] ?? false;
        return (($data instanceof User)&&!$alreadycalled);
     }
    public function getCalledKey() 
    {
        return (self::ALREADY_CALLED_NORMALIZER);
    }

}
?>