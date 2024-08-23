<?php

namespace App\Controller\ApiPlatform;


use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class ActiveSeller extends AbstractController
{
    public function __construct(private Security $security)
    {
        
    }

    public function __invoke(UserRepository $userRepository)
    {
        if ($this->security->isGranted('ROLE_ADMIN'))
        {
            return ($userRepository->findActiveSellers());
        }
        else
        {

            $responseData = [
                'message' => 'Accès non autorisé.',
            ];
            
            $response = new JsonResponse($responseData, 401);
            return $response;
        }
        
    }
}
?>