<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Controller\ApiPlatform\ActiveSeller;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;
use App\DataPersister\UserDataPersister;
use DateTimeImmutable;
use App\Controller\ApiPlatform\GetUser;
use App\Controller\ApiPlatform\ResetPasswordSend;
use Doctrine\Common\Collections\Criteria;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(normalizationContext: ['groups'=>['getcollection:user','getcollection:adr']])]
#[Get(normalizationContext: ['groups'=>['user:user']],openapiContext:['security' => [['JWT'=> []]]])]
#[Get(normalizationContext: ['groups'=>['get:user']], name: 'me', routeName: 'api_me',read: false,
openapiContext:['security' => [['JWT'=> []]]])]
#[Post(openapiContext:['security' => [['JWT'=> []]]], uriTemplate:'/user',processor: UserDataPersister::class,denormalizationContext: ['groups'=>['post:user','post:roles']])]
#[Post(uriTemplate:'/resetPassword',controller: ResetPasswordSend::class ,denormalizationContext: ['groups'=>['post:user','post:roles']])]
#[GetCollection(
openapiContext:['security' => [['JWT'=> []]]],
paginationItemsPerPage: 10)]
#[GetCollection(
    uriTemplate:'/ActiveSeller',
    controller:ActiveSeller::class,
    openapiContext:['security' => [['JWT'=> []]]],
    paginationEnabled:false)
    ]
#[Patch(denormalizationContext: ['groups'=>['password']],processor: UserDataPersister::class,uriTemplate:"/reset/{id}")]
#[Patch(denormalizationContext: ['groups'=>['put:user','post:user']],
openapiContext:['security' => [['JWT'=> []]]],processor: UserDataPersister::class)]
#[ApiFilter(SearchFilter::class, properties: ['uuid'=>'partial','telephone'=>'partial','email'=>'partial','adresse'=>'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['createdat' => 'DESC'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface , JWTUserInterface , IsactiveInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getcollection:user','get:categorie','at:user','user:user'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['getcollection:user','get:user','post:user','get:categorie','at:user','user:user'])]
    private ?string $uuid = null;

    #[ORM\Column]
    #[Groups(['getcollection:user','Can_edit_all','post:roles','user:user'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['Can_view','post:user','password'])]
    private ?string $password = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Commande::class)]
    private Collection $commandes;
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Appro::class)]
    private Collection $appros;
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Produits::class)]
    private Collection $produits;



    #[ORM\Column(length: 10, unique: true)]
    #[Groups(['getcollection:user','get:user','post:user','user:user'])]
    private ?string $telephone = null;
    #[ORM\Column(length: 45)]
    #[Groups(['getcollection:user','get:user','post:user','user:user'])]
    private ?string $nom = null;

    #[ORM\Column(length: 45)]
    #[Groups(['getcollection:user','get:user','post:user','user:user'])]
    private ?string $prenom = null;

    #[ORM\Column]
    #[Groups(['put:user','Can_view','user:user'])]
    private ?bool $isactive = true;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    #[Groups(['getcollection:user','get:user','post:user','user:user'])]
    private ?string $email = null;
    #[ORM\OneToMany(mappedBy: 'vendeur', targetEntity: Commande::class)]
    private Collection $commanderecu;

    #[ORM\Column]
    #[Groups(['Can_view'])]
    private ?int $nbAuth = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdat = null;


    #[ORM\Column]
    #[Groups(['getcollection:user','get:user','post:user','user:user'])]
    private ?bool $sexe = true;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getcollection:user','get:user','post:user','user:user'])]
    private ?Adresse $adresse = null;

    public function __construct()
    {
        $this->commandes = new ArrayCollection();
        $this->appros = new ArrayCollection();
        $this->produits = new ArrayCollection();
        $this->commanderecu = new ArrayCollection();
        $this->createdat= new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    } 

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }
    public function setId(?int $id): self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->uuid;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Commande>
     */
    public function getCommandes(): Collection
    {
        return $this->commandes;
    }

    public function addCommande(Commande $commande): static
    {
        if (!$this->commandes->contains($commande)) {
            $this->commandes->add($commande);
            $commande->setUser($this);
        }

        return $this;
    }

    public function removeCommande(Commande $commande): static
    {
        if ($this->commandes->removeElement($commande)) {
            // set the owning side to null (unless already changed)
            if ($commande->getUser() === $this) {
                $commande->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Appro>
     */
    public function getAppros(): Collection
    {
        return $this->appros;
    }

    public function addAppro(Appro $appro): static
    {
        if (!$this->appros->contains($appro)) {
            $this->appros->add($appro);
            $appro->setUser($this);
        }

        return $this;
    }

    public function removeAppro(Appro $appro): static
    {
        if ($this->appros->removeElement($appro)) {
            // set the owning side to null (unless already changed)
            if ($appro->getUser() === $this) {
                $appro->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Produits>
     */
    public function getProduits(): Collection
    {
        return $this->produits;
    }

    public function addProduit(Produits $produit): static
    {
        if (!$this->produits->contains($produit)) {
            $this->produits->add($produit);
            $produit->setUser($this);
        }

        return $this;
    }

    public function removeProduit(Produits $produit): static
    {
        if ($this->produits->removeElement($produit)) {
            // set the owning side to null (unless already changed)
            if ($produit->getUser() === $this) {
                $produit->setUser(null);
            }
        }

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return Collection<int, Commande>
     */
    public function getCommanderecu(): Collection
    {
        return $this->commanderecu;
    }

    public function addCommanderecu(Commande $commanderecu): static
    {
        if (!$this->commanderecu->contains($commanderecu)) {
            $this->commanderecu->add($commanderecu);
            $commanderecu->setVendeur($this);
        }

        return $this;
    }

    public function removeCommanderecu(Commande $commanderecu): static
    {
        if ($this->commanderecu->removeElement($commanderecu)) {
            // set the owning side to null (unless already changed)
            if ($commanderecu->getVendeur() === $this) {
                $commanderecu->setVendeur(null);
            }
        }

        return $this;
    }
    public static function createFromPayload( $id, array $payload)
    {
        $user=new User();
        $user->setId($id);
        $user->setUuid($payload['uuid']);
        $user->setRoles($payload['roles']);
        $user->setEmail($payload['email']); 
        return $user;
    }

    public function getCreatedat(): ?\DateTimeInterface
    {
        return $this->createdat;
    }

    public function setCreatedat(\DateTimeInterface $createdat): static
    {
        $this->createdat = $createdat;

        return $this;
    }


    public function getNbAuth(): ?int
    {
        return $this->nbAuth;
    }

    public function setNbAuth(int $nbAuth): static
    {
        $this->nbAuth = $nbAuth;

        return $this;
    }

    public function isSexe(): ?bool
    {
        return $this->sexe;
    }

    public function setSexe(bool $sexe): static
    {
        $this->sexe = $sexe;

        return $this;
    }

    public function setAdresse(?Adresse $adresse): static
    {
        if($adresse->isIsactive())
        {
            $this->adresse = $adresse;

        }
    
        return $this;
    }

    public function getAdresse(): ?Adresse
    {
        if ($this->adresse && $this->adresse->isIsactive())
        {
            return $this->adresse;
        }
        return null;
        
    }
}
