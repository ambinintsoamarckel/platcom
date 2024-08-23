<?php
namespace App\Entity;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\ApproRepository;
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
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use App\DataPersister\UserDataPersister;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use DateTime;

#[ORM\Entity(repositoryClass: ApproRepository::class)]
#[ApiResource( 
    normalizationContext: ['groups'=>['get:appro']],
    denormalizationContext: ['groups'=>['post:appro']],   
openapiContext:['security' => [['JWT'=> []]]])]
#[Get(normalizationContext: ['groups'=>['get:appro']])]
#[Post(processor: UserDataPersister::class)]
#[GetCollection(paginationItemsPerPage: 10)]
#[Patch(denormalizationContext: ['groups'=>['put:appro','post:appro']])]
#[ApiFilter(SearchFilter::class, properties:['user'=>'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['dateappro' => 'DESC'])]


class Appro
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:appro','get:user'])]
    private ?int $id = null;
    #[ORM\Column]
    #[Groups(['getcollection:appro','get:appro','post:appro','get:user'])]
    private ?bool $etat = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['getcollection:appro','get:appro','post:appro','get:user'])]
    private ?\DateTimeInterface $dateappro = null;

    #[ORM\ManyToOne(inversedBy: 'appros', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getcollection:appro','at:user','post:appro'])]
    private ?User $user = null;

   



    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['getcollection:appro','get:appro','post:appro','get:user'])]
    private ?string $motif = null;
    #[ORM\OneToMany(mappedBy: 'appro', targetEntity: Ligneappro::class, cascade: ['all'])]
    #[Groups(['get:appro','post:appro'])]
    private Collection $ligneappros;

    public function __construct()
    {
        $this->ligneappros = new ArrayCollection();
        $this->dateappro= new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateappro(): ?\DateTimeInterface
    {
        return $this->dateappro;
    }

    public function setDateappro(\DateTimeInterface $dateappro): static
    {
        $this->dateappro = $dateappro;

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
     * @return Collection<int, Ligneappro>
     */
    public function getLigneappros(): Collection
    {
        return $this->ligneappros;
    }

    public function addLigneappro(Ligneappro $ligneappro): static
    {
        if (!$this->ligneappros->contains($ligneappro)) {
            if (/* $ligneappro->getProduit()->getUser()===$this->user */true) {
                # code...
                $this->ligneappros->add($ligneappro);
                $ligneappro->setAppro($this);
            }
           /*  else
            {
                $responseData = [
                    'message' => 'Accès non autorisé.',
                ];
                
                $response = new JsonResponse($responseData, 401);
                return $response;
            } */

        }

        return $this;
    }

    public function removeLigneappro(Ligneappro $ligneappro): static
    {
        if ($this->ligneappros->removeElement($ligneappro)) {
            // set the owning side to null (unless already changed)
            if ($ligneappro->getAppro() === $this) {
                $ligneappro->setAppro(null);
            }
        }

        return $this;
    }

    public function isEtat(): ?bool
    {
        return $this->etat;
    }

    public function setEtat(bool $etat): static
    {
        $this->etat = $etat;

        return $this;
    }

    public function getMotif(): ?string
    {
        return $this->motif;
    }

    public function setMotif(?string $motif): static
    {
        $this->motif = $motif;

        return $this;
    }
}
