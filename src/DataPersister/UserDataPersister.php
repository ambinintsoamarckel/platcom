<?php
namespace App\DataPersister;

use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Security;
use App\Entity\Appro;
use App\Entity\Commande;
use App\Entity\Produits;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\JsonResponse;
// ...

class UserDataPersister implements ProcessorInterface

{
        private UserPasswordHasherInterface $hasher;
        private SerializerInterface $serializer;
        public function __construct(private TokenStorageInterface $tokenStorage, private ProcessorInterface $persistProcessor, private ProcessorInterface $removeProcessor, private EntityManagerInterface $entityManager,UserPasswordHasherInterface $hasher,SerializerInterface $serializer,private Security $security,private RequestStack $requestStack)
        {
            $this->hasher=$hasher;
            $this->serializer=$serializer;
            
        } 
        /**
         * {@inheritDoc}
         */
        public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
        {
            $user=$this->security->getUser();
            $request = $context['request'];
            $requestData = json_decode($request->getContent(), true);

            // call your persistence layer to save $data
            if ($data instanceof User)
            {
         
                
            if ($data->isIsactive() === false) {
                    // Set all associated products to false
                    foreach ($data->getProduits() as $product) {
                        $product->setIsactive(false);
                    }
/*                     $request = new Request();
                    $response = $this->logoutSuccessHandler->onLogoutSuccess($request);
        
                    // Return the response to log the user out
                    return $response; */
                }
          
            if (array_key_exists('password', $requestData)) {
           
              
                $password = $data->getPassword();
                $data->setPassword($this->hasher->hashPassword($data, $password));
            }
                $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);  
                return $result;
            }
            
            
            if ($user) {
                // Vérifier les autorisations
                   
                        if ($this->security->isGranted("ROLE_SELLER")) {
                            if ($data instanceof Commande) {
                                // Logic for Commande POST
                                if (!array_key_exists('vendeur', $requestData)) {
                                    $vendeur = $this->entityManager->getRepository(User::class)->find($this->security->getUser()->getId());

                                    // Assurez-vous que l'utilisateur existe
                                    if (!$vendeur) {
                                        throw new \RuntimeException('Utilisateur non trouvé');
                                    }
                                    $data->setVendeur($vendeur);
                                    $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
                                    return $result;
                                }
                            }
                            if($data instanceof Appro)
                            {
                               
                            
                                foreach ($data->getLigneappros() as  $ligne) {
                                    
                                    if ($ligne->getUnite() !== null) {
                                        
                                        if ($data->isEtat()) {
                                            # code...
                                  
                                            $nouvelleQuantiteUnite = $ligne->getUnite()->getQuantitestock() + $ligne->getQuantite();
                                        }
                                        else{
                                            $nouvelleQuantiteUnite = $ligne->getUnite()->getQuantitestock() - $ligne->getQuantite();
                                        }
                                        
                                        $ligne->getUnite()->setQuantitestock($nouvelleQuantiteUnite);
                                       
                                    
                                }
                                }
                               
                            }
    
                            if (!array_key_exists('user', $requestData)) {
                                $acheteur = $this->entityManager->getRepository(User::class)->find($this->security->getUser()->getId());

                                // Assurez-vous que l'utilisateur existe
                                if (!$acheteur) {
                                    throw new \RuntimeException('Utilisateur non trouvé');
                                }
                                $data->setUser($acheteur);

                                $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
                                return $result;
                            }
    
                            // Reste du code...
                         
                        } 
                        
                        elseif ($data instanceof Produits && !array_key_exists('user', $requestData)) {
                            $acheteur = $this->entityManager->getRepository(User::class)->find($this->security->getUser()->getId());

                            // Assurez-vous que l'utilisateur existe
                            if (!$acheteur) {
                                throw new \RuntimeException('Utilisateur non trouvé');
                            }
                            $data->setUser($acheteur);

                            $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
                            return $result;
                        }
                        
                        else {
 
                            $responseData = [
                                'message' => 'Accès non autorisé.',
                            ];
    
                            $response = new JsonResponse($responseData, 401);
                            return $response;
                        }
                    }
                } 
    
   
  
        }
    

?>