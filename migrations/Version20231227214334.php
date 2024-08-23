<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231227214334 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE adresse (id INT AUTO_INCREMENT NOT NULL, ville VARCHAR(45) NOT NULL, code INT NOT NULL, isactive TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_C35F081643C3D9C3 (ville), UNIQUE INDEX UNIQ_C35F081677153098 (code), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE appro (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, etat TINYINT(1) NOT NULL, dateappro DATETIME NOT NULL, motif VARCHAR(255) DEFAULT NULL, INDEX IDX_9DBA0691A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE categorie (id INT AUTO_INCREMENT NOT NULL, categorie_parent_id INT DEFAULT NULL, nomcat VARCHAR(45) NOT NULL, isactive TINYINT(1) NOT NULL, INDEX IDX_497DD634DF25C577 (categorie_parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commande (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, vendeur_id INT NOT NULL, datecom DATETIME NOT NULL, payement SMALLINT NOT NULL, isactive TINYINT(1) NOT NULL, INDEX IDX_6EEAA67DA76ED395 (user_id), INDEX IDX_6EEAA67D858C065E (vendeur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ligneappro (id INT AUTO_INCREMENT NOT NULL, produit_id INT NOT NULL, appro_id INT NOT NULL, unite_id INT NOT NULL, quantite INT NOT NULL, INDEX IDX_DA974A08F347EFB (produit_id), INDEX IDX_DA974A08E77EEA7E (appro_id), INDEX IDX_DA974A08EC4A74AB (unite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE lignecom (id INT AUTO_INCREMENT NOT NULL, unite_id INT NOT NULL, produits_id INT NOT NULL, commande_id INT NOT NULL, quantitecom INT NOT NULL, quantite_l INT NOT NULL, isactive TINYINT(1) NOT NULL, INDEX IDX_58B48DA0EC4A74AB (unite_id), INDEX IDX_58B48DA0CD11A2CF (produits_id), INDEX IDX_58B48DA082EA2E54 (commande_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE media_object (id INT AUTO_INCREMENT NOT NULL, produits_id INT DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, INDEX IDX_14D43132CD11A2CF (produits_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE produits (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, categorie_id INT NOT NULL, nomprod VARCHAR(45) NOT NULL, description LONGTEXT DEFAULT NULL, isactive TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, INDEX IDX_BE2DDF8CA76ED395 (user_id), INDEX IDX_BE2DDF8CBCF5E72D (categorie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE refresh_tokens (id INT AUTO_INCREMENT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reset_password (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, token VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B9983CE5A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE unite (id INT AUTO_INCREMENT NOT NULL, produits_id INT NOT NULL, nomunit VARCHAR(45) DEFAULT NULL, limite INT DEFAULT NULL, prix INT NOT NULL, quantitestock INT NOT NULL, isactive TINYINT(1) NOT NULL, INDEX IDX_1D64C118CD11A2CF (produits_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, adresse_id INT NOT NULL, uuid VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, telephone VARCHAR(10) NOT NULL, nom VARCHAR(45) NOT NULL, prenom VARCHAR(45) NOT NULL, isactive TINYINT(1) NOT NULL, email VARCHAR(255) DEFAULT NULL, nb_auth INT NOT NULL, createdat DATETIME NOT NULL, sexe TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_8D93D649D17F50A6 (uuid), UNIQUE INDEX UNIQ_8D93D649450FF010 (telephone), UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), INDEX IDX_8D93D6494DE7DC5C (adresse_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE appro ADD CONSTRAINT FK_9DBA0691A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE categorie ADD CONSTRAINT FK_497DD634DF25C577 FOREIGN KEY (categorie_parent_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67D858C065E FOREIGN KEY (vendeur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE ligneappro ADD CONSTRAINT FK_DA974A08F347EFB FOREIGN KEY (produit_id) REFERENCES produits (id)');
        $this->addSql('ALTER TABLE ligneappro ADD CONSTRAINT FK_DA974A08E77EEA7E FOREIGN KEY (appro_id) REFERENCES appro (id)');
        $this->addSql('ALTER TABLE ligneappro ADD CONSTRAINT FK_DA974A08EC4A74AB FOREIGN KEY (unite_id) REFERENCES unite (id)');
        $this->addSql('ALTER TABLE lignecom ADD CONSTRAINT FK_58B48DA0EC4A74AB FOREIGN KEY (unite_id) REFERENCES unite (id)');
        $this->addSql('ALTER TABLE lignecom ADD CONSTRAINT FK_58B48DA0CD11A2CF FOREIGN KEY (produits_id) REFERENCES produits (id)');
        $this->addSql('ALTER TABLE lignecom ADD CONSTRAINT FK_58B48DA082EA2E54 FOREIGN KEY (commande_id) REFERENCES commande (id)');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132CD11A2CF FOREIGN KEY (produits_id) REFERENCES produits (id)');
        $this->addSql('ALTER TABLE produits ADD CONSTRAINT FK_BE2DDF8CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE produits ADD CONSTRAINT FK_BE2DDF8CBCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE reset_password ADD CONSTRAINT FK_B9983CE5A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE unite ADD CONSTRAINT FK_1D64C118CD11A2CF FOREIGN KEY (produits_id) REFERENCES produits (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6494DE7DC5C FOREIGN KEY (adresse_id) REFERENCES adresse (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE appro DROP FOREIGN KEY FK_9DBA0691A76ED395');
        $this->addSql('ALTER TABLE categorie DROP FOREIGN KEY FK_497DD634DF25C577');
        $this->addSql('ALTER TABLE commande DROP FOREIGN KEY FK_6EEAA67DA76ED395');
        $this->addSql('ALTER TABLE commande DROP FOREIGN KEY FK_6EEAA67D858C065E');
        $this->addSql('ALTER TABLE ligneappro DROP FOREIGN KEY FK_DA974A08F347EFB');
        $this->addSql('ALTER TABLE ligneappro DROP FOREIGN KEY FK_DA974A08E77EEA7E');
        $this->addSql('ALTER TABLE ligneappro DROP FOREIGN KEY FK_DA974A08EC4A74AB');
        $this->addSql('ALTER TABLE lignecom DROP FOREIGN KEY FK_58B48DA0EC4A74AB');
        $this->addSql('ALTER TABLE lignecom DROP FOREIGN KEY FK_58B48DA0CD11A2CF');
        $this->addSql('ALTER TABLE lignecom DROP FOREIGN KEY FK_58B48DA082EA2E54');
        $this->addSql('ALTER TABLE media_object DROP FOREIGN KEY FK_14D43132CD11A2CF');
        $this->addSql('ALTER TABLE produits DROP FOREIGN KEY FK_BE2DDF8CA76ED395');
        $this->addSql('ALTER TABLE produits DROP FOREIGN KEY FK_BE2DDF8CBCF5E72D');
        $this->addSql('ALTER TABLE reset_password DROP FOREIGN KEY FK_B9983CE5A76ED395');
        $this->addSql('ALTER TABLE unite DROP FOREIGN KEY FK_1D64C118CD11A2CF');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6494DE7DC5C');
        $this->addSql('DROP TABLE adresse');
        $this->addSql('DROP TABLE appro');
        $this->addSql('DROP TABLE categorie');
        $this->addSql('DROP TABLE commande');
        $this->addSql('DROP TABLE ligneappro');
        $this->addSql('DROP TABLE lignecom');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP TABLE produits');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE reset_password');
        $this->addSql('DROP TABLE unite');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
