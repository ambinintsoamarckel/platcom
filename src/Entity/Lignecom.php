<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\LignecomRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use Symfony\Component\HttpFoundation\JsonResponse;
#[ORM\Entity(repositoryClass: LignecomRepository::class)]
#[ApiResource( 
    normalizationContext: ['groups'=>['getcollection:lignecom']],
    denormalizationContext: ['groups'=>['post:lignecom']])]

#[Post()]
#[GetCollection()]
#[Patch(denormalizationContext: ['groups'=>['put:lignecom','post:lignecom']])]
#[ApiFilter(BooleanFilter::class, properties: ['isactive'])]
class Lignecom implements IsactiveInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:lignecom'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'lignecoms')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getcollection:lignecom','post:lignecom','get:com','post:com'])]
    private ?Unite $unite = null;

    #[ORM\ManyToOne(inversedBy: 'lignecoms')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getcollection:lignecom','post:lignecom','get:com','post:com'])]
    private ?Produits $produits = null;

    #[ORM\Column]
    #[Groups(['getcollection:lignecom','get:com','post:lignecom','post:com'])]
    private ?int $quantitecom = null;

    #[ORM\Column]
    #[Groups(['getcollection:lignecom','get:com','post:lignecom','post:com'])]
    private ?int $quantiteL = null;


    #[ORM\ManyToOne(inversedBy: 'lignecoms')]
    #[ORM\JoinColumn(nullable: false)]
  
    private ?Commande $commande = null;



    #[ORM\Column]
    #[Groups(['put:lignecom'])]
    private ?bool $isactive = true;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUnite(): ?unite
    {
        return $this->unite;
    }

    public function setUnite(?unite $unite): static
    {
        $this->unite = $unite;
   

        return $this;
    }


    public function getProduits(): ?Produits
    {
        return $this->produits;
    }

    public function setProduits(?Produits $produits): static
    {
  
        $this->produits = $produits;


        return $this;
    }

    public function getCommande(): ?commande
    {
        return $this->commande;
    }

    public function setCommande(?commande $commande): static
    {
        $this->commande = $commande;


        return $this;
    }


    public function getQuantitecom(): ?int
    {
        return $this->quantitecom;
    }

    public function setQuantitecom(int $quantitecom): static
    {
        $this->quantitecom = $quantitecom;

        return $this;
    }

    public function getQuantiteL(): ?int
    {
        
        return $this->quantiteL;
    }

    public function setQuantiteL(int $quantiteL): static
    {
            // Mettez à jour la quantité dans l'entité Unite en conséquence

    $ancienneQuantiteL = $this->quantiteL ?? 0;
 
    $difference = $quantiteL - $ancienneQuantiteL;
  

    if ($this->unite !== null) {
        if ($this->unite->getQuantitestock() >= $difference) {
           
            $nouvelleQuantiteUnite = $this->unite->getQuantitestock() - $difference;
            $this->unite->setQuantitestock($nouvelleQuantiteUnite);
        }
        else {
            $responseData = [
                'message' => 'Accès non autorisé.',
            ];
            
            $response = new JsonResponse($responseData, 401);
            return $response;
        }
       
   

    }

    // Mettez à jour la quantité livrée dans l'entité Lignecom
    $this->quantiteL = $quantiteL;

    return $this;

    }

    public function isIsactive(): ?bool
    {
        return $this->isactive;
    }

    public function setIsactive(bool $isactive): static
    {
      
       
    if (  $this->unite !== null) {
        if ($this->isIsactive()&&!$isactive) {
            $nouvelleQuantiteUnite = $this->unite->getQuantitestock() + $this->quantiteL;
            $this->unite->setQuantitestock($nouvelleQuantiteUnite);
    
        }
        elseif (!($this->isIsactive())&&$isactive) 
        {
            $nouvelleQuantiteUnite = $this->unite->getQuantitestock() - $this->quantiteL;
            $this->unite->setQuantitestock($nouvelleQuantiteUnite);
 
        }
        
          }

    $this->isactive = $isactive;

    return $this;
        $this->isactive = $isactive;

        return $this;
    }

}






