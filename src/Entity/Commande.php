<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Odm\Filter\SearchFilter as FilterSearchFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\CommandeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;
use App\DataPersister\UserDataPersister;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use App\Controller\ApiPlatform\ArticleVendu;
use App\Controller\ApiPlatform\RecetteParAnnee;
use App\Controller\ApiPlatform\RecetteParCom;
use App\Controller\ApiPlatform\RecetteParMois;
use ApiPlatform\Metadata\ApiProperty;
use App\Controller\ApiPlatform\CountArticleBuyer;
use App\Controller\ApiPlatform\CountBuyer;
use App\Controller\ApiPlatform\CountCommande;
use App\Controller\ApiPlatform\TotalProfits;
use DateTime;
use Doctrine\Common\Collections\Criteria;

#[ORM\Entity(repositoryClass: CommandeRepository::class)]
#[ApiResource( 
    normalizationContext: ['groups'=>['get:com','getcollection:user']],
    denormalizationContext: ['groups'=>['post:com']],
    openapiContext:['security' => [['JWT'=> []]]])]
#[Get(normalizationContext: ['groups'=>['get:com']])]
#[Get(normalizationContext: ['groups'=>['get:com','getcollection:user','user']],uriTemplate:'/commandes_recu/{id}')]
#[Get(name: 'recetteParcom' , uriTemplate: 'commandes/{id}/recetteParcom', controller: RecetteParCom::class)]
#[Get(name: 'recetteParmois' , uriTemplate: 'commandes/{id}/recetteParmois', controller: RecetteParMois::class)]
#[Get(name: 'recetteParannee' , uriTemplate: 'commandes/{id}/recetteParannee', controller: RecetteParAnnee::class)]
#[Get(name: 'articleVendu' , uriTemplate: 'commandes/{id}/articleVendu', controller: ArticleVendu::class)]
#[Get(name: 'clients' , uriTemplate: 'commandes/{id}/clients', controller: CountBuyer::class)]
#[Get(name: 'countCommande' , uriTemplate: 'commandes/{id}/countcommande', controller: CountCommande::class)]
#[Get(name: 'TotalProfits' , uriTemplate: 'commandes/{id}/totalProfits', controller: TotalProfits::class)]
#[Get(name: 'clientschart' , uriTemplate: 'commandes/{id}/clientschart', controller: CountArticleBuyer::class)]
#[Post(processor: UserDataPersister::class)]
#[GetCollection(
    normalizationContext: ['groups'=>['get:com','getcollection:user','vendeur']],
paginationItemsPerPage: 10)]
#[GetCollection(uriTemplate:'/commandes_recu', normalizationContext: ['groups'=>['get:com','getcollection:user','user']],
paginationItemsPerPage: 10)]

#[Patch(denormalizationContext: ['groups'=>['put:com','post:com']])]
#[Patch(denormalizationContext: ['groups'=>['put:com','post:com']],uriTemplate:'/commandes_recu/{id}')]
#[ApiFilter(SearchFilter::class, properties:['vendeur'=>'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['datecom' => 'DESC'])]


class Commande implements IsactiveInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:com','get:user'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['getcollection:com','get:com','post:com','get:user'])]
    private ?\DateTimeInterface $datecom = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['getcollection:com','get:com','post:com','get:user'])]
    private ?int $payement = 0;

    #[ORM\Column]
    #[Groups(['put:com'])]
    private ?bool $isactive = true;

    #[ORM\ManyToOne(inversedBy: 'commandes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['user','at:user','post:com'])]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'commande', targetEntity: Lignecom::class, cascade: ['all'])]
    #[Groups(['getcollection:com','get:com','post:com'])]
    private Collection $lignecoms;

    #[ORM\ManyToOne(inversedBy: 'commanderecu')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['vendeur','post:com','get:user'])]
    private ?User $vendeur = null;

    public function __construct()
    {
        $this->lignecoms = new ArrayCollection();
        $this->datecom = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDatecom(): ?\DateTimeInterface
    {
        return $this->datecom;
    }

    public function setDatecom(\DateTimeInterface $datecom): static
    {
        $this->datecom = $datecom;

        return $this;
    }

    public function getPayement(): ?int
    {
        return $this->payement;
    }

    public function setPayement(int $payement): static
    {
        $this->payement = $payement;

        return $this;
    }

    public function isIsactive(): ?bool
    {
        return $this->isactive;
    }

    public function setIsactive(bool $isactive): static
    {
       if($this->isIsactive()&&!$isactive)
       {
        foreach ($this->lignecoms as $key => $coms) {
            # code...
            $coms->setIsactive(false);
           }
            $this->isactive = $isactive;
    
            return $this;           
       }

       $this->isactive = $isactive;

       return $this;

    }

    public function getUser(): ?User
    {
        if ($this->user && $this->user->isIsactive()) {
            return $this->user;
        }
        
        return null;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, Lignecom>
     */
    public function getLignecoms(): Collection
    {
        if($this->lignecoms)
        {
            $criteria = Criteria::create()
            ->andWhere(Criteria::expr()->eq('isactive', true  ));
        return $this->lignecoms->matching($criteria);
        }
        return $this->lignecoms;
    }

    public function addLignecom(Lignecom $lignecom): static
    {
        if (!$this->lignecoms->contains($lignecom)) {
            $this->lignecoms->add($lignecom);
            $lignecom->setCommande($this);
        }

        return $this;
    }

    public function removeLignecom(Lignecom $lignecom): static
    {
        if ($this->lignecoms->removeElement($lignecom)) {
            // set the owning side to null (unless already changed)
            if ($lignecom->getCommande() === $this) {
                $lignecom->setCommande(null);
            }
        }

        return $this;
    }
    

    public function getVendeur(): ?User
    {
        if ($this->vendeur && $this->vendeur->isIsactive()) {
            return $this->vendeur;
        }
        
        return null;
    }

    public function setVendeur(?User $vendeur): static
    {
        $this->vendeur = $vendeur;

        return $this;
    }
}
