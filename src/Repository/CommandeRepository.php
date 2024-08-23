<?php

namespace App\Repository;

use App\Entity\Commande;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Query\ResultSetMapping;
/**
 * @extends ServiceEntityRepository<Commande>
 *
 * @method Commande|null find($id, $lockMode = null, $lockVersion = null)
 * @method Commande|null findOneBy(array $criteria, array $orderBy = null)
 * @method Commande[]    findAll()
 * @method Commande[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommandeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Commande::class);
    }

//    /**
//     * @return Commande[] Returns an array of Commande objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Commande
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
// CommandeRepository.php

    /**
     * Retourne le nombre d'articles vendus par un utilisateur.
     *
     * @param int $userId L'ID de l'utilisateur.
     *
     * @return int
     */
    public function countArticlesVendusParUser($userId)
    {
        $entityManager = $this->getEntityManager();

        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('totalArticles', 'totalArticles');

        $query = $entityManager->createNativeQuery('
            SELECT SUM(l.quantitecom) as totalArticles
            FROM commande c
            JOIN lignecom l ON c.id = l.commande_id
            WHERE c.vendeur_id = :userId
            AND l.isactive = true
            AND c.isactive = true
        ', $rsm);

        $query->setParameter('userId', $userId);

        return $query->getSingleScalarResult();
    }
     /**
     * Retourne les recettes pour chaque commande.
     *
     * @return array
     */
    public function recettesParCommande()
    {
        $entityManager = $this->getEntityManager();

        $query = $entityManager->createQuery('
            SELECT c.id, SUM(l.quantitecom * u.prix) as recette
            FROM App\Entity\Commande c
            JOIN c.lignecoms l
            JOIN l.unite u
            GROUP BY c.id
        ');

        return $query->getResult();
    }
     /**
     * Retourne les recettes pour chaque mois.
     *
     * @return array
     */
    public function recettesParMois($userId)
{
    $entityManager = $this->getEntityManager();

    $rsm = new ResultSetMapping();
    $rsm->addScalarResult('recette', 'recette');
    $rsm->addScalarResult('mois', 'mois');

    $query = $entityManager->createNativeQuery('
        SELECT MONTH(c.datecom) as mois, SUM(l.quantitecom * u.prix) as recette
        FROM lignecom l
        JOIN commande c ON l.commande_id = c.id
        JOIN unite u ON l.unite_id = u.id
        WHERE c.vendeur_id = :userId
            AND l.isactive = true
            AND c.isactive = true
            AND YEAR(c.datecom) = YEAR(CURRENT_DATE()) -- Ajout de cette condition
        GROUP BY mois
        order BY mois
    ', $rsm);

    $query->setParameter('userId', $userId);
    return $query->getScalarResult();
}

     /**
     * Retourne les recettes pour chaque année.
     *
     * @return array
     */
    public function recettesParAnnee($userId)
    {
        $entityManager = $this->getEntityManager();
        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('recette', 'recette');
        $rsm->addScalarResult('mois', 'mois');

        $query = $entityManager->createNativeQuery('
        SELECT YEAR(c.datecom) as annee, SUM(l.quantitecom * u.prix) as recette
            FROM lignecom l ,commande c , unite u 
            WHERE l.commande_id  =  c.id 
            AND l.unite_id = u.id
            AND c.vendeur_id = :userId
            AND l.isactive = true
            AND c.isactive = true
            GROUP BY annee

 
        ', $rsm);

        $query->setParameter('userId', $userId);
        return $query->getScalarResult();
    }
    public function totalprofits($userId)
    {
        $entityManager = $this->getEntityManager();
        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('recette', 'recette');


        $query = $entityManager->createNativeQuery('
        SELECT SUM(l.quantitecom * u.prix) as recette
            FROM lignecom l ,commande c , unite u 
            WHERE l.commande_id  =  c.id 
            AND l.unite_id = u.id
            AND c.vendeur_id = :userId
            AND l.isactive = true
            AND c.isactive = true
 

 
        ', $rsm);

        $query->setParameter('userId', $userId);
        return $query->getScalarResult();
    }
    public function acheteursEtQuantites($vendeurId)
    {
        return $this->createQueryBuilder('c')
            ->select('u.uuid as userId, SUM(l.quantiteL) as quantiteTotale')
            ->join('c.lignecoms', 'l')
            ->join('c.user', 'u')
            ->where('l.isactive = true')
            ->andWhere('c.vendeur = :vendeurId')
            ->andWhere('c.isactive = true')
            ->groupBy('userId')
            ->setParameter('vendeurId', $vendeurId)
            ->getQuery()
            ->getResult();
    }
    
public function nombreTotalAcheteurs($vendeurId)
{
    $qb = $this->createQueryBuilder('c');

    $result = $qb
        ->select('COUNT(DISTINCT u.id) as nombreAcheteurs')
        ->join('c.user', 'u')
        ->where('c.vendeur = :vendeurId')
        ->andWhere('c.isactive = true')
        ->setParameter('vendeurId', $vendeurId)
        ->getQuery()
        ->getSingleScalarResult();

    return $result;
}
public function nombredecommande($vendeurId)
{
    $qb = $this->createQueryBuilder('c');

    $result = $qb
        ->select('COUNT(c) ')
        ->where('c.vendeur = :vendeurId')
        ->andWhere('c.isactive = true')
        ->setParameter('vendeurId', $vendeurId)
        ->getQuery()
        ->getSingleScalarResult();

    return $result;
}



}
