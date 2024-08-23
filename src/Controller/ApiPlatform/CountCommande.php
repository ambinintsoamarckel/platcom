<?php

namespace App\Controller\ApiPlatform;
use App\Entity\Commande;
use App\Repository\CommandeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class CountCommande extends AbstractController
{
    public function __construct(private Security $security)
    {
        
    }

    public function __invoke(Commande $data , CommandeRepository $commandeRepository,$id)
    {
        if ($this->security->isGranted('ROLE_ADMIN')) {
            # code...
            return ($commandeRepository->nombredecommande($id));

        }
        elseif ($this->security->isGranted('ROLE_SELLER'))
        {
            return ($commandeRepository->nombredecommande($this->security->getUser()->getId()));
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