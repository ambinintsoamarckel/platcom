<?php

namespace App\Controller;

use App\Mailer\MailerMahm;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ReactController extends AbstractController
{
    #[Route('/react', name: 'app_react')]
    public function index3(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/Zafy', name: 'app_katum')]
    public function index()
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/Zafy/{id}', name: 'app_latum')]
    public function index1()
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/Zafy/{id}/{di}', name: 'app_forum')]
    public function index2()
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/Zafy/{id}/{di}/{red}', name: 'app_edit')]
    public function edit()
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/lino', name: 'app_lino')]
    public function index8(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }

    #[Route('/react/lino/{id}', name: 'app_lalala')]
    public function xedni(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/lino/{id}/{di}', name: 'linoniv2')]
    public function linoniv2(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/lino/{id}/{di}/{lino}', name: 'linoniv3')]
    public function linoniv3(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/{reg}', name: 'app_register')]
    public function reactRegister(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }

    #[Route('/react/{reg}/{vendeur}', name: 'app_register_vendeur')]
    public function reactRegisterVendeur(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }


    #[Route('/react/Zafy/Me/{id}', name: 'app_me')]
    public function zafyMe(string $id): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
            'id' => $id,
        ]);
    }

    #[Route('/react/Admin', name: 'app_admin')]
    public function adminIndex(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
    #[Route('/react/Admin/{id}', name: 'app_admin2')]
    public function adminIndex2(): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }


    // ... (ajoutez d'autres routes pour Admin/Dashboard, Admin/Produits, etc.)

    #[Route('/react/Admin/Me/{id}', name: 'app_admin_me')]
    public function adminMe(string $id): Response
    {
        return $this->render('react/index.html.twig', [
            'controller_name' => 'ReactController',
            'id' => $id,
        ]);
    }
}





