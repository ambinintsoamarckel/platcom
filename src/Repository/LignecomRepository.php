<?php

namespace App\Repository;

use App\Entity\Lignecom;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Lignecom>
 *
 * @method Lignecom|null find($id, $lockMode = null, $lockVersion = null)
 * @method Lignecom|null findOneBy(array $criteria, array $orderBy = null)
 * @method Lignecom[]    findAll()
 * @method Lignecom[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LignecomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Lignecom::class);
    }

//    /**
//     * @return Lignecom[] Returns an array of Lignecom objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('l.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Lignecom
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
