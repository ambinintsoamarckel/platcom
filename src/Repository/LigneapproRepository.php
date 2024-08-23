<?php

namespace App\Repository;

use App\Entity\Ligneappro;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Ligneappro>
 *
 * @method Ligneappro|null find($id, $lockMode = null, $lockVersion = null)
 * @method Ligneappro|null findOneBy(array $criteria, array $orderBy = null)
 * @method Ligneappro[]    findAll()
 * @method Ligneappro[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LigneapproRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ligneappro::class);
    }

//    /**
//     * @return Ligneappro[] Returns an array of Ligneappro objects
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

//    public function findOneBySomeField($value): ?Ligneappro
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
