<?php

namespace App\Controller\ApiPlatform;
use App\Entity\Commande;
use App\Repository\CommandeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Routing\Annotation\Route;

class RecetteParCom extends AbstractController
{
    public function __construct(private Security $security)
    {
        
    }

    public function __invoke(Commande $data , CommandeRepository $commandeRepository)
    {
        return ($commandeRepository->recettesParCommande($data->getId()));
    }
}
?>