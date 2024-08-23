<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UniteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
#[ORM\Entity(repositoryClass: UniteRepository::class)]
#[ApiResource( 
    normalizationContext: ['groups'=>['getcollection:unite']],
    denormalizationContext: ['groups'=>['post:unite']])]
#[Get(normalizationContext: ['groups'=>['get:unite']])]
#[Post()]
#[GetCollection()]
#[Patch(denormalizationContext: ['groups'=>['put:unite','post:unite']])]
#[ApiFilter(BooleanFilter::class, properties: ['isactive'])]
class Unite implements IsactiveInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:unite'])]
    private ?int $id = null;

    #[ORM\Column(length: 45, nullable: true)]
    #[Groups(['getcollection:ligneappro','get:appro','getcollection:lignecom','get:com','getcollection:unite','get:unite','post:unite','get:categorie','get:produit','post:produit','get:user'])]
    private ?string $nomunit = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['getcollection:unite','get:unite','post:unite','get:categorie','get:produit','post:produit','get:user'])]
    private ?int $limite = null;

    #[ORM\Column]
    #[Groups(['getcollection:ligneappro','get:appro','getcollection:lignecom','get:com','getcollection:unite','get:unite','post:unite','get:categorie','get:produit','post:produit','get:user'])]
    private ?int $prix = null;

    #[ORM\Column]
    #[Groups(['getcollection:ligneappro','get:appro','getcollection:lignecom','get:com','getcollection:unite','get:unite','post:unite','get:categorie','get:produit','post:produit','get:user'])]
    private ?int $quantitestock = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups(['put:unite','put:produit'])]
    private $isactive = true;

    #[ORM\ManyToOne(inversedBy: 'unites')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Produits $produits = null;

    #[ORM\OneToMany(mappedBy: 'unite', targetEntity: Lignecom::class)]
    private Collection $lignecoms;

    #[ORM\OneToMany(mappedBy: 'unite', targetEntity: Ligneappro::class)]
    private Collection $ligneappros;

    public function __construct()
    {
        $this->lignecoms = new ArrayCollection();
        $this->ligneappros = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomunit(): ?string
    {
        return $this->nomunit;
    }

    public function setNomunit(?string $nomunit): static
    {
        $this->nomunit = $nomunit;

        return $this;
    }

    public function getLimite(): ?int
    {
        return $this->limite;
    }

    public function setLimite(?int $limite): static
    {
        $this->limite = $limite;

        return $this;
    }

    public function getPrix(): ?int
    {
        return $this->prix;
    }

    public function setPrix(int $prix): static
    {
        $this->prix = $prix;

        return $this;
    }

    public function getQuantitestock(): ?int
    {
        return $this->quantitestock;
    }

    public function setQuantitestock(int $quantitestock): static
    {
        $this->quantitestock = $quantitestock;

        return $this;
    }

    public function isIsactive(): ?bool
    {
        return $this->isactive;
    }


    public function setIsactive($isactive): static
    {
        $this->isactive = $isactive;

        return $this;
    }

    public function getProduits(): ?produits
    {
        return $this->produits;
    }

    public function setProduits(?produits $produits): static
    {
        $this->produits = $produits;

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
            $lignecom->setUnite($this);
        }

        return $this;
    }

    public function removeLignecom(Lignecom $lignecom): static
    {
        if ($this->lignecoms->removeElement($lignecom)) {
            // set the owning side to null (unless already changed)
            if ($lignecom->getUnite() === $this) {
                $lignecom->setUnite(null);
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
            $ligneappro->setUnite($this);
        }

        return $this;
    }

    public function removeLigneappro(Ligneappro $ligneappro): static
    {
        if ($this->ligneappros->removeElement($ligneappro)) {
            // set the owning side to null (unless already changed)
            if ($ligneappro->getUnite() === $this) {
                $ligneappro->setUnite(null);
            }
        }

        return $this;
    }
}
