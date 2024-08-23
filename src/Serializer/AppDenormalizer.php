<?php
namespace App\Serializer;

use App\Entity\Appro;
use App\Entity\Commande;
use App\Entity\Produits;
use App\Entity\User;
use App\Mailer\MailerMahm;
use App\Security\Voter\AuthVoter;
use PHPUnit\TextUI\Command;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Doctrine\ORM\EntityManagerInterface;
// ...



use function PHPSTORM_META\type;

class AppDenormalizer implements DenormalizerInterface , DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;
    private Security $security;
    private const ALREADY_CALLED_DENORMALIZER='IsactiveSeriaizerDenormalizer';
    private RequestStack $requestStack;
    public function __construct(Security $security, RequestStack $requestStack, private AuthorizationCheckerInterface $authorizationChecker, private EntityManagerInterface $entityManager)
    {
        $this->security=$security;
        $this->requestStack = $requestStack;
    }
    public function denormalize(mixed $data, string $type, string $format = null, array $context = [])
    {
   
        $user=$this->security->getUser();
    
        $context[$this->getCalledKey($type)]=true; 
  
       
       

            $request = $this->requestStack->getCurrentRequest();
            $requestData = json_decode($request->getContent(), true);
            $obj=$this->denormalizer->denormalize($data,$type,$format,$context);
          if ($type=== User::class )
            {
     
                //empêche la modification des autres utilisateur par un utilisateur qui n'est pas Admin 
                if ($this->requestStack->getCurrentRequest()->getMethod() === 'POST') {

                  
                    if(in_array("ROLE_ADMIN", $obj->getRoles()))
                    {
                   

                        if($this->security->isGranted('ROLE_ADMIN'))
                        {
                            return $obj;
                        }
                        else{
                            $responseData = [
                                'message' => 'Accès non autorisé.',
                            ];
                            
                            $response = new JsonResponse($responseData, 401);
                            return $response;

                        }

                    }
                    elseif(in_array("ROLE_SELLER", $obj->getRoles()))
                    {
                       
                        if($this->security->isGranted('ROLE_ADMIN'))
                        {
                            if($obj->isIsactive())
                        {
                            $mail= new MailerMahm();
                            $content="<p>Merci de vous être inscrit sur notre plateforme de commerce. Vous avez maintenant accès à un espace de travail dédié où vous pouvez gérer tous les aspects de votre activité.</p>
                            <h2>Votre Espace de Travail</h2>
                            <p>Connectez-vous à votre espace pour :</p>
                            <ul>
                                <li>Gérer votre stock de produits</li>
                                <li>Effectuer des opérations sur le stock, y compris les entrées et les sorties</li>
                                <li>Passer des commandes et suivre leur état</li>
                                <!-- Ajoutez d'autres fonctionnalités spécifiques de votre plateforme -->
                            </ul>
                            <h2>Comment Se Connecter</h2>
                            <p>Utilisez vos identifiants pour accéder à votre espace de travail :</p>
                            <p>Nous sommes ravis de vous avoir parmi nous. Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter.</p>
                            <p>Merci et bonne gestion !</p>
                            <p>Cordialement,<br>
                            L'équipe de Dovahkin</p>";
                            if(!($mail->send($obj->getEmail(),$obj->getNom().' '.$obj->getPrenom(),'Bienvenue sur Platcom',$content )))
            
                            {
                                $responseData = [
                                    'message' => "Mail non envoyé veuillez réessayer l'opération.",
                                ];
                                
                                $response = new JsonResponse($responseData, 500);
                                return $response;
                            }
                        }
                            return $obj;
                        }
                        else{
                            $obj->setisActive(false);
                            $this->sendEmailToAdmins($obj);
                            return $obj;
    

                        }
                     
                       
                    }
                    else 
                    {

                        return $obj;

                    }
                

                }
                else
                {  
                  
              
                                if((preg_match('/^\/api\/reset/', $request->getPathInfo())))
                                {
                                    return $obj;
                                }
                               
                            
                                if ($this->authorizationChecker->isGranted(AuthVoter::CAN_EDIT_ALL,$obj))
                            {

                               if($user->getUserIdentifier()!=$obj->getUuid())
                               {


                                if (array_key_exists('isactive', $requestData))
                                {
                               
                                  
                                    /** @var User $obj */
                                        if($obj->getNbAuth()=== 0)
                                        {
                                            if($obj->isIsactive())
                                            {
                                                $mail= new MailerMahm();
                                                $content="<p>Merci de vous être inscrit sur notre plateforme de commerce. Vous avez maintenant accès à un espace de travail dédié où vous pouvez gérer tous les aspects de votre activité.</p>
                                                <h2>Votre Espace de Travail</h2>
                                                <p>Connectez-vous à votre espace pour :</p>
                                                <ul>
                                                  <li>Gérer votre stock de produits</li>
                                                  <li>Effectuer des opérations sur le stock, y compris les entrées et les sorties</li>
                                                  <li>Passer des commandes et suivre leur état</li>
                                                  <!-- Ajoutez d'autres fonctionnalités spécifiques de votre plateforme -->
                                                </ul>
                                                <h2>Comment Se Connecter</h2>
                                                <p>Utilisez vos identifiants pour accéder à votre espace de travail :</p>
                                                <p>Nous sommes ravis de vous avoir parmi nous. Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter.</p>
                                                <p>Merci et bonne gestion !</p>
                                                <p>Cordialement,<br>
                                                L'équipe de Dovahkin</p>";
                                                if(!($mail->send($obj->getEmail(),$obj->getNom().' '.$obj->getPrenom(),'Bienvenue sur Platcom',$content )))
                                
                                                {
                                                    $responseData = [
                                                        'message' => "Mail non envoyé veuillez réessayer l'opération.",
                                                    ];
                                                    
                                                    $response = new JsonResponse($responseData, 500);
                                                    return $response;
                                                }
                                            }
                                 


                                        }
                                
                                    
                                       
                                    }
                                    if (array_key_exists('roles', $requestData))
                                    
                                   
                                        {
                                            $context['groups'][]='Can_edit_all';
                                            $obj= $this->denormalizer->denormalize($data,$type,$format,$context);
                                        }
                                    
                                    
                             
                                        return $obj;
                              

                                }
                               
                                
            
                                if (array_key_exists('roles', $requestData))
                                {
                                    if($this->authorizationChecker->isGranted(AuthVoter::CAN_EDIT_ALL,$obj))
                                    {
                                        $context['groups'][]='Can_edit_all';
                                        return $this->denormalizer->denormalize($data,$type,$format,$context);
                                    

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
                                return $obj;
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


            else
            {
                if ($this->requestStack->getCurrentRequest()->getMethod() === 'POST') {
                 
                    if($this->authorizationChecker->isGranted(AuthVoter::CAN_POST,$obj))

                    {
                        
                      

                    
                        return $obj;
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
                elseif ($this->requestStack->getCurrentRequest()->getMethod() === 'PATCH')
                {
                  
                        if($this->authorizationChecker->isGranted(AuthVoter::CAN_EDIT_ALL,$obj))
                        {
                            return $obj;
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
        
        

    }

    public function supportsDenormalization(mixed $data, string $type, string $format = null  , array $context = [] )
    {
    
      
        $alreadycalled=$context[$this->getCalledKey($type)] ?? false;
        return (($type === User::class||$type ===  Produits::class || $type === Commande::class || $type === Appro::class)&&!$alreadycalled);
     }
    public function getCalledKey(string $type) 
    {
        return (self::ALREADY_CALLED_DENORMALIZER . $type);
    }
    public function sendEmailToAdmins(User $user)
    
{
    $adminUsers = $this->entityManager->getRepository(User::class)->findAdminEmail();

    if (empty($adminUsers)) {
        // Aucun administrateur trouvé
        return;
    }

    $mail = new MailerMahm();
    $emailSubject = 'Demande d\'intégration de l\'espace vendeur';

    foreach ($adminUsers as $admin) {
        $adminEmail = $admin['email'];
        $adminName = $admin['nom'];

        $content = "<p>Cher(e) $adminName,</p>
                    <p>Un nouvel utilisateur a effectué une demande d'intégration pour devenir vendeur sur la plateforme. Voici ses informations :</p>
                    <ul>
                        <li>Username: {$user->getUuid()}</li>
                        <li>Email: {$user->getEmail()}</li>
                        <!-- Ajoutez d'autres informations spécifiques de votre demande -->
                    </ul>
                    <p>Veuillez prendre les mesures nécessaires pour examiner cette demande.</p>
                    <p>Merci,</p>
                    <p>L'équipe de Dovahkin</p>";

        if (!$mail->send($adminEmail, $adminName, $emailSubject, $content)) {
            // Gérer l'échec de l'envoi de l'e-mail
            $responseData = [
                'message' => "Mail non envoyé à l'administrateur $adminEmail. Veuillez réessayer l'opération.",
            ];

            $response = new JsonResponse($responseData, 500);
            return $response;
        }


    }
}

    
}




?>