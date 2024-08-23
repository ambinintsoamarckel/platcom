<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CategorieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\Controller\api\FilterCategorie;
use phpDocumentor\Reflection\Types\Boolean;
use Doctrine\Common\Collections\Criteria;
use Symfony\Bridge\Doctrine\ManagerRegistry;

#[ORM\Entity(repositoryClass: CategorieRepository::class)]
#[ApiResource( 
    normalizationContext: ['groups'=>['getcollection:categorie']],
    denormalizationContext: ['groups'=>['post:categorie']])]
#[Get(normalizationContext: ['groups'=>['get:categorie']])]
#[Post()]
#[GetCollection()]
#[Patch(denormalizationContext: ['groups'=>['put:categorie','post:categorie']])]


class Categorie implements IsactiveInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:categorie'])]
    private ?int $id = null;

    #[ORM\Column(length: 45)]
    #[Groups(['getcollection:categorie','get:categorie','post:categorie','get:produit','post:produit','get:user'])]
    private ?string $nomcat = null;

    #[ORM\Column]
    #[Groups(['put:categorie'])]
    private ?bool $isactive = true;
    
    #[ORM\ManyToOne(inversedBy: 'categories', cascade:['all'])]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['getcollection:categorie','get:categorie','post:categorie','get:produit','post:produit','get:user'])]
    private ?Categorie $categorieParent = null;
    

    #[ORM\OneToMany(mappedBy: 'categorieParent', targetEntity: Categorie::class)]
    #[Groups(['get:categorie'])]
    private Collection $categories;

    #[ORM\OneToMany(mappedBy: 'categorie', targetEntity: Produits::class)]
    #[Groups(['get:categorie'])]
    private Collection $produits;



    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->produits = new ArrayCollection();
     
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomcat(): ?string
    {
        return $this->nomcat;
    }

    public function setNomcat(string $nomcat): static
    {
        $this->nomcat = $nomcat;

        return $this;
    }

    public function isIsactive(): ?bool
    {
        return $this->isactive;
    }

    public function setIsactive(bool $isactive): static
    {
        $this->isactive = $isactive;

        return $this;
    }
    public function getCategorieParent(): ?Categorie
    {
 
        if ($this->categorieParent && $this->categorieParent->isactive) {
            return $this->categorieParent;
        }
        return null;
        
        
    }

    public function setCategorieParent(?Categorie $categorie): static
    {
        $this->categorieParent=$categorie;
        return $this;
       
    }

    /**
     * @return Collection<int, Categorie>
     */
    public function getCategories(): Collection
    {
        if($this->categories)
        {
            $criteria = Criteria::create()
            ->andWhere(Criteria::expr()->eq('isactive', true  ));
        return $this->categories->matching($criteria);
        }
        return $this->categories;
        
    }

    public function addCategory(Categorie $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
            $category->setCategorieParent($this);
        }

        return $this;
    }

    public function removeCategory(Categorie $category): static
    {
        if ($this->categories->removeElement($category)) {
            // set the owning side to null (unless already changed)
            if ($category->getCategorieParent() === $this) {
                $category->setCategorieParent(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Produits>
     */
    public function getProduits(): Collection
    {
        if($this->produits)
        {
            $criteria = Criteria::create()
        ->andWhere(Criteria::expr()->eq('isactive', true  ));
    return $this->produits->matching($criteria);
        }
        return $this->produits;
        
    }

    public function addProduit(Produits $produit): static
    {
        if (!$this->produits->contains($produit)) {
            $this->produits->add($produit);
            $produit->setCategorie($this);
        }

        return $this;
    }

    public function removeProduit(Produits $produit): static
    {
        if ($this->produits->removeElement($produit)) {
            // set the owning side to null (unless already changed)
            if ($produit->getCategorie() === $this) {
                $produit->setCategorie(null);
            }
        }

        return $this;
    }


}
