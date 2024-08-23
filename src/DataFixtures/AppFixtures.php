<?php

namespace App\DataFixtures;

use App\Entity\Adresse;
use App\Entity\Appro;
use App\Entity\Categorie;
use App\Entity\Commande;
use App\Entity\Ligneappro;
use App\Entity\Lignecom;
use App\Entity\Produits;
use App\Entity\Unite;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
class AppFixtures extends Fixture
{
    private Generator $faker;
    private array $phonePrefixes = ['034', '038', '033', '032'];

    public function __construct(private UserPasswordHasherInterface $hasher)
    {
        $this->faker =Factory::create('fr_FR');
    }
    private function generatePhoneNumber(): string
    {
        $prefix = $this->faker->randomElement($this->phonePrefixes);
        $suffix = $this->faker->numberBetween(1000000, 9999999);

        return $prefix . $suffix;
    }
    public function load(ObjectManager $manager): void
    {
        $adresse= new Adresse();
        $admin= new User();

        $adresse->setCode(301)
                ->setVille("Fianarantsoa");
        $manager->persist($adresse);
        $admin->setUuid("mahm")
        ->setEmail($this->faker->email())
        ->setTelephone($this->generatePhoneNumber())
        ->setSexe(true)
        ->setPrenom("Marckel")
        ->setPassword($this->hasher->hashPassword($admin, '123456789'))
        ->setNom("Marson")
        ->setAdresse($adresse)
        ->setRoles(['ROLE_ADMIN'])
        ->setIsactive(true)
        ->setCreatedat($this->faker->dateTimeBetween('-2Years'));
        $manager->persist($admin);

        for ($a=0; $a < 5 ; $a++) { 
            # code...
           
                    
            $vendeur=new User();
            $vendeur->setUuid($this->faker->userName())
                    ->setEmail($this->faker->email())
                    ->setTelephone($this->generatePhoneNumber())
                    ->setSexe(true)
                    ->setPrenom($this->faker->firstNameMale())
                    ->setPassword($this->hasher->hashPassword($vendeur, '123456789'))
                    ->setNom($this->faker->name())
                    ->setAdresse($adresse)
                    ->setRoles(['ROLE_SELLER'])
                    ->setIsactive(true)
                    ->setCreatedat($this->faker->dateTimeBetween('-2Years'));
                    $categorie= new Categorie();
                    $categorie->setNomcat($this->faker->word());
                $manager->persist($vendeur);
                $manager->persist($categorie);
        for ($b=0; $b < 20 ; $b++) {
            $acheteur=new User();
            $acheteur->setUuid($this->faker->userName())
                    ->setEmail($this->faker->email())
                    ->setTelephone($this->generatePhoneNumber())
                    ->setSexe(true)
                    ->setPrenom($this->faker->firstNameMale())
                    ->setPassword($this->hasher->hashPassword($acheteur, '1234566789'))
                    ->setNom($this->faker->name())
                    ->setRoles(['ROLE_BUYER'])
                    ->setAdresse($adresse)
                    ->setIsactive(true)
                    ->setCreatedat($this->faker->dateTimeBetween('-2Years'));
        
            $manager->persist($acheteur); 
            $Appro= new Appro ();
            $commande= new Commande();
            $commande->setVendeur($vendeur)
                     ->setUser($acheteur)
                     ->setDatecom($this->faker->dateTimeBetween('-2Years'));
            $Appro  ->setUser($vendeur)
                    ->setDateappro($this->faker->dateTimeBetween('-2Years'))
                    ->setMotif($this->faker->word())
                    ->setEtat(true);
                            
            for ($i=0; $i <20 ; $i++) { 

              $produits= new Produits();
              $produits->setNomprod($this->faker->word())
                       ->setDescription($this->faker->text())
                       ->setCategorie($categorie)
                       ->setUser($vendeur)
                       ->setCreatedAt($this->faker->dateTimeBetween('-2Years'));
                      
                       for ($j=0; $j <= 2; $j++) { 
                        # code...
                        $unite= new Unite();
                        $unite->setPrix($this->faker->biasedNumberBetween(1)*10000)
                              ->setNomunit($this->faker->word())
                              ->setQuantitestock(100)
                              ->setLimite(10);

                        $produits->addUnite($unite);
                        $manager->persist($unite);
                        $manager->persist($produits);
                       }
              $lignecom= new Lignecom();
              $ligneappro= new Ligneappro();
              $ligneappro   ->setProduit($produits)
                            ->setUnite($unite)
                            ->setQuantite($this->faker->biasedNumberBetween(1,15));
                            
              $lignecom->setProduits($produits)
                       ->setUnite($unite)
                       ->setQuantitecom($this->faker->biasedNumberBetween(1,15))
                       ->setQuantiteL($lignecom->getQuantitecom());
              $commande->addLignecom($lignecom);
              $Appro->addLigneappro($ligneappro);
 
              $manager->persist($lignecom);
              $manager->persist($ligneappro);
              $manager->persist($Appro);
              $manager->persist($commande);                      
                       
            }
                     
        }
           
        }


        $manager->flush();
    }
}
