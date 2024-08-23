<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AdresseRepository;
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

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\Common\Collections\Criteria;


#[ORM\Entity(repositoryClass: AdresseRepository::class)]
#[ApiResource( 
    normalizationContext: ['groups'=>['getcollection:adr']],
    denormalizationContext: ['groups'=>['post:adr']])]
#[Get(normalizationContext: ['groups'=>['get:adr','getcollection:user']])]
#[Post()]
#[GetCollection(paginationEnabled: false)]
#[Patch(denormalizationContext: ['groups'=>['put:adr','post:adr']])]
#[ApiFilter(BooleanFilter::class, properties: ['isactive'])]
#[ApiFilter(SearchFilter::class, properties: ['ville'=>'partial','code'=>'partial'])]
class Adresse implements IsactiveInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:adr'])]
    private ?int $id = null;

    #[ORM\Column(length: 45, unique: true)]
    #[Groups(['getcollection:adr','get:adr','post:adr','get:categorie','get:user','post:user','user:user'])]
    private ?string $ville = null;

    #[ORM\Column(length: 45, unique: true)]
    #[Groups(['getcollection:adr','get:adr','post:adr','get:user','post:user','user:user'])]
    private ?int $code = null;


    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups(['put:adr'])]
    private $isactive = true;

    #[ORM\OneToMany(mappedBy: 'adresse', targetEntity: User::class)]
    #[Groups(['get:adr'])]
    private Collection $users;




    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    public function getCode(): ?int
    {
        return $this->code;
    }

    public function setCode(?int $code): static
    {
        $this->code = $code;

        return $this;
    }


    public function getIsactive()
    {
        return $this->isactive;
    }

    public function setIsactive($isactive): static
    {
        $this->isactive = $isactive;

        return $this;
    }

    public function isIsactive(): ?bool
    {
        return $this->isactive;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        if($this->users)
        {
            $criteria = Criteria::create()
            ->andWhere(Criteria::expr()->eq('isactive', true  ));
        return $this->users->matching($criteria);
        }
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setAdresse($this);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getAdresse() === $this) {
                $user->setAdresse(null);
            }
        }

        return $this;
    }



}
