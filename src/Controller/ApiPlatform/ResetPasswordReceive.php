<?php

namespace App\Controller\ApiPlatform;

use App\Entity\ResetPassword;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;

class ResetPasswordReceive extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManagerInterface)
    {
        
    }
    #[Route('/api/resetPassword/{token}')]
    public function __invoke($token)
    { 
       
 
        $reset=$this->entityManagerInterface->getRepository(ResetPassword::class)->findOneByToken($token);
   

        if ($reset)
        {
            $now= new DateTimeImmutable();
            if($now<$reset->getCreatedAt()->modify('+ 5 minute'))
            {
                $responseData = [
                    'id' => $reset->getUser()->getId(),
                ];
                
                $response = new JsonResponse($responseData, 200);
                return $response;
            

            }
            else
            {
                $responseData = [
                    'message' => 'Token expiré.',
                ];
                
                $response = new JsonResponse($responseData, 403);
                return $response;
            }
            
        }

        else
        {
            $responseData = [
                'message' => 'Token invalide.',
            ];
            
            $response = new JsonResponse($responseData, 401);
            return $response;
        }

    }

}
?>