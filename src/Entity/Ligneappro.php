<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\LigneapproRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;

#[ORM\Entity(repositoryClass: LigneapproRepository::class)]
#[ApiResource( 
    normalizationContext: ['groups'=>['getcollection:ligneappro']],
    denormalizationContext: ['groups'=>['post:ligneappro']])]

#[Post()]
#[GetCollection()]
#[Patch(denormalizationContext: ['groups'=>['put:ligneappro','post:ligneappro']])]

class Ligneappro
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:ligneappro'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'ligneappros')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getcollection:ligneappro','post:ligneappro','get:appro','post:appro'])]
    private ?Produits $produit = null;

    #[ORM\ManyToOne(inversedBy: 'ligneappros')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Appro $appro = null;

    #[ORM\ManyToOne(inversedBy: 'ligneappros')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getcollection:ligneappro','post:ligneappro','get:appro','post:appro'])]
    private ?Unite $unite = null;

    #[ORM\Column]
    #[Groups(['getcollection:ligneappro','post:ligneappro','get:appro','post:appro'])]
    private ?int $quantite = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProduit(): ?Produits
    {
        return $this->produit;
    }

    public function setProduit(?Produits $produit): static
    {
        $this->produit = $produit;

        return $this;
    }

    public function getAppro(): ?Appro
    {
        return $this->appro;
    }

    public function setAppro(?Appro $appro): static
    {
        $this->appro = $appro;

        return $this;
    }

    public function getUnite(): ?Unite
    {
        return $this->unite;
    }

    public function setUnite(?Unite $unite): static
    {
        $this->unite = $unite;

        return $this;
    }

    public function getQuantite(): ?int
    {
        return $this->quantite;
    }

    public function setQuantite(int $quantite): static
    {

        $this->quantite = $quantite;

        return $this;
    }
    
}
