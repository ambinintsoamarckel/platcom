<?php
namespace App\Controller\ApiPlatform;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;


class MeController extends AbstractController
{
      public function __construct(private Security $security)
    {
        
    }
    
    #[Route(path: '/api/me', name: 'api_me', methods: ['GET'])]
    public function __invoke()
    {
        $user = $this->security->getUser();

        
      
        if ($user) {
                $userData = [
                    'id' => $user->getId(),
                    'username' => $user->getUserIdentifier(),
                    'email' => $user->getEmail(),
                    'role' => $user->getRoles(),
                    // Ajoutez d'autres propriétés que vous souhaitez inclure
                ];
                
                return new JsonResponse($userData);
            } else {
                return new JsonResponse(['message' => 'Utilisateur non connecté'], 401);
            }
        
    }
}
?>