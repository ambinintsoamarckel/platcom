<?php

namespace App\EventSubscriber;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class JWTSubscriber implements EventSubscriberInterface
{
    public function onLexikJwtAuthenticationOnJwtCreated(JWTCreatedEvent $event): void
    {
        $data = $event->getData();
        $user = $event->getUser();

        if ($user instanceof User) {
            // Vérifiez si l'utilisateur est actif
            if (!$user->isIsactive()) {
                throw new UnauthorizedHttpException(401,'Votre compte est désactivé.');
    
            }

            $data['email'] = $user->getEmail();
            $data['uuid'] = $user->getUserIdentifier();
            $nbauth=($user->getNbAuth())+1;
            $user->setNbAuth($nbauth);
        }

        $event->setData($data);
    }


    public static function getSubscribedEvents(): array
    {
        return [
            'lexik_jwt_authentication.on_jwt_created' => 'onLexikJwtAuthenticationOnJwtCreated',
        ];
    }
}
