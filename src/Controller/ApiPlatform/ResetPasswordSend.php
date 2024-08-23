<?php

namespace App\Controller\ApiPlatform;

use App\Entity\ResetPassword;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Entity\User;
use App\Mailer\MailerMahm;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;

class ResetPasswordSend extends AbstractController
{
    public function __construct(private RequestStack $requestStack, private EntityManagerInterface $entityManagerInterface)
    {
        
    }

    public function __invoke()
    { 
        $request = $this->requestStack->getCurrentRequest();
        $requestData = json_decode($request->getContent(), true);
        if (array_key_exists('email', $requestData))
        {
            $user=$this->entityManagerInterface->getRepository(User::class)->findOneByEmail(  $requestData['email']);
            if ($user && $user->Isisactive())
            {
                $resetpassword = new ResetPassword();
                $resetpassword->setUser($user)
                              ->setCreatedAt(new DateTimeImmutable())
                              ->setToken(uniqid());

                $mail=new MailerMahm();
                $lien="127.0.0.1:9000/react/resetPassword/".$resetpassword->getToken();
                $content = "<p>Bonjour " . $user->getNom() . " " . $user->getPrenom() . ",</p>
                <p>Vous avez demandé la réinitialisation de votre mot de passe sur notre plateforme de commerce.</p>
                <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous:</p>
                <a href='https://127.0.0.1:9000/react/reset/".$resetpassword->getToken()."'>Rénitialisation</a>
                <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message.</p>
                <p>Merci et bonne gestion !</p>
                <p>Cordialement,<br>L'équipe de Dovahkin</p>";
    
                if(!($mail->send($user->getEmail(),$user->getNom().' '.$user->getPrenom(),'Rénitialisation de mot de passe',$content )))

                {
                    $responseData = [
                        'message' => "Mail non envoyé veuillez réessayer l'opération.",
                    ];
                    
                    $response = new JsonResponse($responseData, 500);
                    return $response;
                }
                else {
                    $this->entityManagerInterface->persist($resetpassword);
                    $this->entityManagerInterface->flush();

                    $responseData = [
                        'message' => "Succes.",
                    ];
                    
                    $response = new JsonResponse($responseData, 200);
                    return $response;
                }
            }
             
            
            else
            {
                $responseData = [
                    'message' => 'User not Found.',
                ];
                
                $response = new JsonResponse($responseData, 404);
                return $response;
            }
   
          
        }

        else
        {
      
            $responseData = [
                'message' => 'Syntax Error.',
            ];
            
            $response = new JsonResponse($responseData, 400);
            return $response;
        }

    }

}
?>