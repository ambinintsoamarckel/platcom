<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Entity\Produits;
use App\Entity\Commande;
use App\Entity\Appro;
use App\Entity\User;
use Symfony\Component\Security\Core\Security;

class AuthVoter extends Voter
{
    public const CAN_EDIT = 'CAN_EDIT';
    public const CAN_EDIT_ALL = 'CAN_EDIT_ALL';
    public const CAN_VIEW = 'CAN_VIEW';
    public const CAN_POST = 'CAN_POST';


    public function __construct(private Security $security)
    {
        
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
     
      
        return in_array($attribute, [self::CAN_EDIT, self::CAN_VIEW, self::CAN_EDIT_ALL, self::CAN_POST])
            && ($subject instanceof User||$subject instanceof  Produits || $subject instanceof Commande || $subject instanceof Appro);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {

        $user = $token->getUser();
     
        // if the user is anonymous, do not grant access
        if (!$user instanceof User) {
            return false;
        }

        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case self::CAN_EDIT:
                if ($subject instanceof User)
                {
                    return $subject->getId()===$user->getId()|| $this->security->isGranted('ROLE_ADMIN');

                }
         
                else return false;

                break;
            case self::CAN_EDIT_ALL:
                if ($subject instanceof User)
                {
                    return $this->security->isGranted('ROLE_ADMIN');

                }
                elseif ($subject instanceof Commande)
                {
                    return $subject->getVendeur()->getId()===$user->getId()||$subject->getUser()->getId()===$user->getId()|| $this->security->isGranted('ROLE_ADMIN');

                }

                else
                {
                    return $subject->getUser()->getId()===$user->getId()|| $this->security->isGranted('ROLE_ADMIN');

                }

                break;

            case self::CAN_VIEW:
                if ($subject instanceof User)
                {
                    return $this->security->isGranted('ROLE_ADMIN')|| $subject->getId()===$user->getId();

                }
                elseif ($subject instanceof Commande)
                {
                    return $subject->getVendeur()->getId()===$user->getId()||$subject->getUser()->getId()===$user->getId()|| $this->security->isGranted('ROLE_ADMIN');

                }
                else
                {
                    return $subject->getUser()->getId()===$user->getId()|| $this->security->isGranted('ROLE_ADMIN');

                }

                break;
            case self::CAN_POST:
            
                if ($subject instanceof User)
                {
                    return $this->security->isGranted('ROLE_ADMIN');

                }
                elseif ($subject instanceof Commande)
                {
                     return $this->security->isGranted('ROLE_USER')|| $this->security->isGranted('ROLE_ADMIN');

                }
                else
                {
               
                    return $this->security->isGranted('ROLE_SELLER')|| $this->security->isGranted('ROLE_ADMIN');

                }

                break;
        }

        return false;
    }
}
