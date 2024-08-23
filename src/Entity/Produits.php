<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProduitsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiFilter;
use App\DataPersister\UserDataPersister;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\Common\Collections\Criteria;
use ApiPlatform\Metadata\ApiProperty;
use DateTime;

#[ORM\Entity(repositoryClass: ProduitsRepository::class)]
#[ApiResource( types: ['https://schema.org/ProductCollection'],
    normalizationContext: ['groups'=>['get:produit']],
    denormalizationContext: ['groups'=>['post:produit']])]
#[Get(uriTemplate:'/produits/{id}',normalizationContext: ['groups'=>['get:produit']])]
#[Post(uriTemplate:'/produits_post',openapiContext:['security' => [['JWT'=> []]]],processor: UserDataPersister::class)]
#[GetCollection(uriTemplate:'/produits', paginationItemsPerPage:10, normalizationContext: ['groups'=>['get:produit','getcollection:user']])]
#[GetCollection(uriTemplate:'/produits_no_pagination',  paginationEnabled:false)]
#[Patch(uriTemplate:'/produits_post/{id}',denormalizationContext: ['groups'=>['put:produit','post:produit']],openapiContext:['security' => [['JWT'=> []]]])]
#[ApiFilter(SearchFilter::class, properties:['user'=>'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['createdAt' => 'DESC'])]
class Produits implements IsactiveInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:ligneappro','get:appro','getcollection:produit','get:categorie','get:user','getcollection:lignecom','get:com'])]
    private ?int $id = null;

    #[ORM\Column(length: 45)]
    #[Groups(['getcollection:ligneappro','get:appro','getcollection:produit','get:produit','post:produit','get:categorie','get:user','getcollection:lignecom','get:com'])]
    private ?string $nomprod = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['getcollection:produit','get:produit','post:produit','get:categorie','get:user'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['put:produit'])]
    private ?bool $isactive = true;



    #[ORM\OneToMany(mappedBy: 'produits', targetEntity: Unite::class, cascade:['all'])]
    #[Groups(['getcollection:produit','get:produit','post:produit','get:categorie','get:user'])]
    private Collection $unites;

    #[ORM\ManyToOne(inversedBy:"produits")]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getcollection:produit','get:produit','post:produit','get:categorie'])]
  
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'produits', targetEntity: Lignecom::class)]
    private Collection $lignecoms;

    #[ORM\OneToMany(mappedBy: 'produit', targetEntity: Ligneappro::class)]
    private Collection $ligneappros;

    #[ORM\ManyToOne(inversedBy: 'produits',cascade: ['all'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getcollection:produit','get:produit','post:produit','get:user'])]
    private ?Categorie $categorie = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['getcollection:produit','get:produit','post:produit','get:user'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\OneToMany(mappedBy: 'produits', targetEntity: MediaObject::class)]
    #[Groups(['getcollection:produit','get:produit','post:produit','get:categorie'])]
    private Collection $photos;

    public function __construct()
    {
        $this->unites = new ArrayCollection();
        $this->photos = new ArrayCollection();
        $this->lignecoms = new ArrayCollection();
        $this->ligneappros = new ArrayCollection();
        $this->createdAt =new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomprod(): ?string
    {
        return $this->nomprod;
    }

    public function setNomprod(string $nomprod): static
    {
        $this->nomprod = $nomprod;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

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
        foreach ($this->unites as $key => $unit) {
            # code...
            $unit->setIsactive(false);
           }
/*            foreach ($this->photos as $key => $phot) {
            # code...
            $phot->setIsactive(false);
           }    */
        
       }


        $this->isactive = $isactive;

        return $this;
    }


    /**
     * @return Collection<int, Unite>
     */
    public function getUnites(): Collection
    {
        if($this->unites)
        {
            $criteria = Criteria::create()
            ->andWhere(Criteria::expr()->eq('isactive', true  ));
        return $this->unites->matching($criteria);
        }
        return $this->unites;
        
    }

    public function addUnite(Unite $unite): static
    {
        if (!$this->unites->contains($unite)) {
            $this->unites->add($unite);
            $unite->setProduits($this);
        }

        return $this;
    }

    public function removeUnite(Unite $unite): static
    {
        if ($this->unites->removeElement($unite)) {
            // set the owning side to null (unless already changed)
            if ($unite->getProduits() === $this) {
                $unite->setProduits(null);
            }
        }

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
        return $this->lignecoms;
    }

    public function addLignecom(Lignecom $lignecom): static
    {
        if (!$this->lignecoms->contains($lignecom)) {
            $this->lignecoms->add($lignecom);
            $lignecom->setProduits($this);
        }

        return $this;
    }

    public function removeLignecom(Lignecom $lignecom): static
    {
        if ($this->lignecoms->removeElement($lignecom)) {
            // set the owning side to null (unless already changed)
            if ($lignecom->getProduits() === $this) {
                $lignecom->setProduits(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Ligneappro>
     */
    public function getLigneappros(): Collection
    {
        return $this->ligneappros;
    }

    public function addLigneappro(Ligneappro $ligneappro): static
    {
        if (!$this->ligneappros->contains($ligneappro)) {
            $this->ligneappros->add($ligneappro);
            $ligneappro->setProduit($this);
        }

        return $this;
    }

    public function removeLigneappro(Ligneappro $ligneappro): static
    {
        if ($this->ligneappros->removeElement($ligneappro)) {
            // set the owning side to null (unless already changed)
            if ($ligneappro->getProduit() === $this) {
                $ligneappro->setProduit(null);
            }
        }

        return $this;
    }

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection<int, MediaObject>
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(MediaObject $photo): static
    {
        if (!$this->photos->contains($photo)) {
            $this->photos->add($photo);
            $photo->setProduits($this);
        }

        return $this;
    }

    public function removePhoto(MediaObject $photo): static
    {
        if ($this->photos->removeElement($photo)) {
            // set the owning side to null (unless already changed)
            if ($photo->getProduits() === $this) {
                $photo->setProduits(null);
            }
        }

        return $this;
    }
}
